import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const cardTopupSchema = z.object({
  cardType: z.enum(['VIETTEL', 'VINAPHONE', 'MOBIFONE'], {
    errorMap: () => ({ message: 'Loại thẻ không hợp lệ' }),
  }),
  cardSerial: z.string().min(10, 'Số serial không hợp lệ'),
  cardCode: z.string().min(10, 'Mã thẻ không hợp lệ'),
})

// Card values mapping (for demo purposes)
const CARD_VALUES: Record<string, number> = {
  '10000': 10000,
  '20000': 20000,
  '30000': 30000,
  '50000': 50000,
  '100000': 100000,
  '200000': 200000,
  '300000': 300000,
  '500000': 500000,
  '1000000': 1000000,
}

// POST topup with phone card
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const validatedData = cardTopupSchema.parse(body)

    // In a real application, you would:
    // 1. Call card verification API (e.g., thesieure.com, doithe247.com)
    // 2. Verify card is valid and get card value
    // 3. Calculate the actual amount credited (usually 70-90% of card value due to fees)
    // 4. Update wallet if card is valid

    // For demo purposes, we'll simulate card verification
    // Let's assume the card code length determines the value for demo
    let cardValue = 0
    const codeLength = validatedData.cardCode.length

    if (codeLength === 13) cardValue = 10000
    else if (codeLength === 14) cardValue = 50000
    else if (codeLength === 15) cardValue = 100000
    else {
      return NextResponse.json(
        { success: false, error: 'Thẻ không hợp lệ hoặc đã được sử dụng' },
        { status: 400 }
      )
    }

    // Apply fee (e.g., 20% fee, user receives 80% of card value)
    const feePercentage = 0.2
    const actualAmount = cardValue * (1 - feePercentage)

    // Create transaction and update wallet
    const result = await prisma.$transaction(async (tx) => {
      // Check if card was already used
      const existingTransaction = await tx.transaction.findFirst({
        where: {
          cardSerial: validatedData.cardSerial,
          cardCode: validatedData.cardCode,
          type: 'CARD_TOPUP',
        },
      })

      if (existingTransaction) {
        throw new Error('Thẻ đã được sử dụng')
      }

      const wallet = await tx.wallet.update({
        where: { userId: user.userId },
        data: {
          balance: {
            increment: actualAmount,
          },
        },
      })

      const transaction = await tx.transaction.create({
        data: {
          userId: user.userId,
          type: 'CARD_TOPUP',
          amount: actualAmount,
          status: 'COMPLETED',
          description: `Nạp thẻ ${validatedData.cardType} ${cardValue.toLocaleString('vi-VN')} VND`,
          cardType: validatedData.cardType,
          cardSerial: validatedData.cardSerial,
          cardCode: validatedData.cardCode,
        },
      })

      return { wallet, transaction, cardValue, actualAmount }
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: `Nạp thẻ thành công. Mệnh giá: ${result.cardValue.toLocaleString('vi-VN')} VND. Nhận được: ${result.actualAmount.toLocaleString('vi-VN')} VND (phí ${feePercentage * 100}%)`,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    if ((error as Error).message === 'Thẻ đã được sử dụng') {
      return NextResponse.json(
        { success: false, error: 'Thẻ đã được sử dụng' },
        { status: 400 }
      )
    }

    if ((error as Error).message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Bạn cần đăng nhập' },
        { status: 401 }
      )
    }

    console.error('Card topup error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
}
