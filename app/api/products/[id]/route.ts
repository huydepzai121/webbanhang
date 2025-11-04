import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

// GET single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
}

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  salePrice: z.number().min(0).optional(),
  stock: z.number().min(0).optional(),
  categoryId: z.string().optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
})

// PUT update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const body = await request.json()
    const validatedData = updateProductSchema.parse(body)

    const updateData: any = { ...validatedData }
    if (validatedData.name) {
      updateData.slug = slugify(validatedData.name)
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Cập nhật sản phẩm thành công',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    if ((error as Error).message.includes('Forbidden') || (error as Error).message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Bạn không có quyền thực hiện thao tác này' },
        { status: 403 }
      )
    }

    console.error('Update product error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
}

// DELETE product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Xóa sản phẩm thành công',
    })
  } catch (error) {
    if ((error as Error).message.includes('Forbidden') || (error as Error).message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Bạn không có quyền thực hiện thao tác này' },
        { status: 403 }
      )
    }

    console.error('Delete product error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
}
