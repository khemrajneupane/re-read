'use server'

import { getUser } from '@/app/(frontend)/actions/getUser'
import { Cart } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
export async function deleteCartItem(itemId: string) {
  const user = await getUser()
  const payload = await getPayload({ config: configPromise })

  try {
    // First get the current cart
    const cartResults = await payload.find({
      collection: 'carts',
      where: {
        'items.buyerEmail': {
          equals: user?.email,
        },
      },
    })

    if (!cartResults.docs.length) {
      redirect('/cart/empty')
      //throw new Error('Cart not found')
    }

    const cart = cartResults.docs[0] as Cart

    // Filter out the item to be deleted
    const updatedItems = (cart.items ?? []).filter(
      (item) => typeof item === 'object' && item.id !== itemId,
    )

    // Update the cart with the remaining items
    const updatedCart = await payload.update({
      collection: 'carts',
      id: cart.id,
      data: {
        items: updatedItems,
      },
    })

    return updatedCart
  } catch (error) {
    console.error('Error deleting cart item:', error)
    throw error
  }
}
