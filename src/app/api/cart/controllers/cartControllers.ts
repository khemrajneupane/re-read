import { deleteCartItem } from '@/app/(frontend)/cart/actions/deleteCustomerCart'
import { NextRequest, NextResponse } from 'next/server'

export const deleteCartController = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  //const { params } = ctx
  const itemId = params.id

  try {
    const updatedCart = await deleteCartItem(itemId)
    return NextResponse.json(updatedCart, { status: 200 })
  } catch (error) {
    console.error('deleteCartController error:', error)
    return NextResponse.json({ error: 'Failed to delete cart item' }, { status: 500 })
  }
}
