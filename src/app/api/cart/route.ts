import { getCartItems } from '@/app/(frontend)/cart/actions/getCartItems'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cart = await getCartItems()

    return NextResponse.json(cart ?? { items: [] })
  } catch (error) {
    console.error('Error in GET /api/cart:', error)

    return NextResponse.json({ error: 'Failed to fetch cart data' }, { status: 500 })
  }
}
