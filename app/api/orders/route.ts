import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import { generateOrderNumber } from '@/lib/utils'

// GET user's orders
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.order.count({ where: { userId: user.userId } }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        items: orders,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    if ((error as Error).message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Bạn cần đăng nhập' },
        { status: 401 }
      )
    }

    console.error('Get orders error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
}

const checkoutSchema = z.object({
  paymentMethod: z.enum(['WALLET', 'CARD', 'COD'], {
    errorMap: () => ({ message: 'Phương thức thanh toán không hợp lệ' }),
  }),
  shippingAddress: z.string().min(10, 'Địa chỉ giao hàng phải có ít nhất 10 ký tự'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  notes: z.string().optional(),
})

// POST create order (checkout)
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const validatedData = checkoutSchema.parse(body)

    // Get user's cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId: user.userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Giỏ hàng trống' },
        { status: 400 }
      )
    }

    // Calculate total and check stock
    let totalAmount = 0
    for (const item of cart.items) {
      if (!item.product.active) {
        return NextResponse.json(
          { success: false, error: `Sản phẩm ${item.product.name} không còn được bán` },
          { status: 400 }
        )
      }

      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Sản phẩm ${item.product.name} không đủ số lượng trong kho` },
          { status: 400 }
        )
      }

      const price = item.product.salePrice || item.product.price
      totalAmount += price * item.quantity
    }

    // Check wallet balance if payment method is WALLET
    if (validatedData.paymentMethod === 'WALLET') {
      const wallet = await prisma.wallet.findUnique({
        where: { userId: user.userId },
      })

      if (!wallet || wallet.balance < totalAmount) {
        return NextResponse.json(
          { success: false, error: 'Số dư ví không đủ' },
          { status: 400 }
        )
      }
    }

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: user.userId,
          orderNumber: generateOrderNumber(),
          status: 'PENDING',
          paymentMethod: validatedData.paymentMethod,
          totalAmount,
          shippingAddress: validatedData.shippingAddress,
          phone: validatedData.phone,
          notes: validatedData.notes,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.salePrice || item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      // Update product stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      // If payment method is WALLET, deduct balance and create transaction
      if (validatedData.paymentMethod === 'WALLET') {
        await tx.wallet.update({
          where: { userId: user.userId },
          data: {
            balance: {
              decrement: totalAmount,
            },
          },
        })

        await tx.transaction.create({
          data: {
            userId: user.userId,
            type: 'PURCHASE',
            amount: totalAmount,
            status: 'COMPLETED',
            description: `Thanh toán đơn hàng ${newOrder.orderNumber}`,
            orderId: newOrder.id,
          },
        })

        // Update order status to PROCESSING
        await tx.order.update({
          where: { id: newOrder.id },
          data: { status: 'PROCESSING' },
        })
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      })

      return newOrder
    })

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Đặt hàng thành công',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    if ((error as Error).message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Bạn cần đăng nhập' },
        { status: 401 }
      )
    }

    console.error('Create order error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
}
