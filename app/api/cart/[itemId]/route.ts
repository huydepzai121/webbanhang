import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const updateCartItemSchema = z.object({
  quantity: z.number().min(0, 'Số lượng phải lớn hơn hoặc bằng 0'),
})

// PUT update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await requireAuth()
    const { itemId } = await params
    const body = await request.json()
    const validatedData = updateCartItemSchema.parse(body)

    // Get cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy sản phẩm trong giỏ hàng' },
        { status: 404 }
      )
    }

    // Check ownership
    if (cartItem.cart.userId !== user.userId) {
      return NextResponse.json(
        { success: false, error: 'Bạn không có quyền thực hiện thao tác này' },
        { status: 403 }
      )
    }

    // If quantity is 0, delete the item
    if (validatedData.quantity === 0) {
      await prisma.cartItem.delete({
        where: { id: itemId },
      })

      return NextResponse.json({
        success: true,
        message: 'Đã xóa sản phẩm khỏi giỏ hàng',
      })
    }

    // Check stock
    if (cartItem.product.stock < validatedData.quantity) {
      return NextResponse.json(
        { success: false, error: 'Sản phẩm không đủ số lượng trong kho' },
        { status: 400 }
      )
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: validatedData.quantity },
      include: {
        product: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: 'Đã cập nhật giỏ hàng',
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

    console.error('Update cart item error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
}

// DELETE remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await requireAuth()
    const { itemId } = await params

    // Get cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy sản phẩm trong giỏ hàng' },
        { status: 404 }
      )
    }

    // Check ownership
    if (cartItem.cart.userId !== user.userId) {
      return NextResponse.json(
        { success: false, error: 'Bạn không có quyền thực hiện thao tác này' },
        { status: 403 }
      )
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({
      success: true,
      message: 'Đã xóa sản phẩm khỏi giỏ hàng',
    })
  } catch (error) {
    if ((error as Error).message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Bạn cần đăng nhập' },
        { status: 401 }
      )
    }

    console.error('Delete cart item error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
}
