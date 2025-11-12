'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getUser } from './getUser'

export async function orderCreate(paymentIntentId: string) {
  const payload = await getPayload({ config: configPromise })

  const user = await getUser()

  if (!user?.id) {
    console.error('No valid user found in orderCreate')
    throw new Error('User not found')
  }

  // ✅ Fetch user's cart
  const carts = await payload.find({
    collection: 'carts',
    where: { user: { equals: user.id } },
  })

  if (carts.totalDocs === 0) {
    throw new Error('No cart found for user')
  }

  const cart = carts.docs[0]

  if (!cart?.items || cart.items.length === 0) {
    throw new Error('Cart is empty')
  }

  // ✅ Calculate total price
  const totalPrice = cart.items.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity
  }, 0)

  // ✅ Create the order with multiple products
  try {
    const order = await payload.create({
      collection: 'orders',
      data: {
        paymentIntent: paymentIntentId,
        buyerEmail: user.email,
        paid: false,
        products: cart.items.map((item) => ({
          post: item.post,
          price: item.price,
          quantity: item.quantity,
          title: item.title,
        })),
        totalPrice,
      },
    })

    return order
  } catch (err) {
    console.error('Failed to create order:', err)
    throw err
  }
}
