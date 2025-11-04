import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

// GET wallet balance and transactions
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    const includeTransactions = searchParams.get('includeTransactions') === 'true'

    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.userId },
      include: includeTransactions
        ? {
            user: {
              select: {
                transactions: {
                  orderBy: {
                    createdAt: 'desc',
                  },
                  take: 20,
                },
              },
            },
          }
        : undefined,
    })

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy ví' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: wallet,
    })
  } catch (error) {
    if ((error as Error).message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Bạn cần đăng nhập' },
        { status: 401 }
      )
    }

    console.error('Get wallet error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
}

const depositSchema = z.object({
  amount: z.number().min(10000, 'Số tiền nạp tối thiểu là 10,000 VND'),
})

// POST deposit money (for demo purposes, in production this would integrate with payment gateway)
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const validatedData = depositSchema.parse(body)

    // In a real application, you would:
    // 1. Create a payment request with a payment gateway
    // 2. Return the payment URL for user to complete payment
    // 3. Handle webhook from payment gateway to confirm payment
    // 4. Then update wallet balance

    // For demo purposes, we'll directly add to wallet
    const result = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.update({
        where: { userId: user.userId },
        data: {
          balance: {
            increment: validatedData.amount,
          },
        },
      })

      const transaction = await tx.transaction.create({
        data: {
          userId: user.userId,
          type: 'DEPOSIT',
          amount: validatedData.amount,
          status: 'COMPLETED',
          description: 'Nạp tiền vào ví',
        },
      })

      return { wallet, transaction }
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Nạp tiền thành công',
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

    console.error('Deposit error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
}
