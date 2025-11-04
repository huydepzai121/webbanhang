import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

// GET user's cart
export async function GET() {
  try {
    const user = await requireAuth()

    const cart = await prisma.cart.findUnique({
      where: { userId: user.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy giỏ hàng' },
        { status: 404 }
      )
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price
      return sum + price * item.quantity
    }, 0)

    return NextResponse.json({
      success: true,
      data: {
        ...cart,
        subtotal,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    })
  } catch (error) {
    if ((error as Error).message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Bạn cần đăng nhập' },
        { status: 401 }
      )
    }

    console.error('Get cart error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
}

const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID không được để trống'),
  quantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
})

// POST add item to cart
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const validatedData = addToCartSchema.parse(body)

    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      )
    }

    if (!product.active) {
      return NextResponse.json(
        { success: false, error: 'Sản phẩm không còn được bán' },
        { status: 400 }
      )
    }

    if (product.stock < validatedData.quantity) {
      return NextResponse.json(
        { success: false, error: 'Sản phẩm không đủ số lượng trong kho' },
        { status: 400 }
      )
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: user.userId },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.userId },
      })
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: validatedData.productId,
        },
      },
    })

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + validatedData.quantity

      if (product.stock < newQuantity) {
        return NextResponse.json(
          { success: false, error: 'Sản phẩm không đủ số lượng trong kho' },
          { status: 400 }
        )
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      })
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: validatedData.productId,
          quantity: validatedData.quantity,
        },
      })
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedCart,
      message: 'Đã thêm sản phẩm vào giỏ hàng',
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

    console.error('Add to cart error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
}

// DELETE clear cart
export async function DELETE() {
  try {
    const user = await requireAuth()

    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: user.userId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Đã xóa tất cả sản phẩm khỏi giỏ hàng',
    })
  } catch (error) {
    if ((error as Error).message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Bạn cần đăng nhập' },
        { status: 401 }
      )
    }

    console.error('Clear cart error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
}
