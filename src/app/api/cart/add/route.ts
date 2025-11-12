// src/app/api/cart/add/route.ts

import { NextResponse } from 'next/server'
import { addToCart } from '@/app/(frontend)/cart/actions/addToCart'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { postId } = body

    if (!postId) {
      return NextResponse.json({ success: false, error: 'No postId provided' }, { status: 400 })
    }

    const cart = await addToCart(postId)

    if ('success' in cart && cart.success === false) {
      // Handle specific errors from addToCart
      return NextResponse.json(cart, { status: 400 })
    }

    return NextResponse.json(cart)
  } catch (err) {
    console.error('POST /api/cart/add error:', err)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
