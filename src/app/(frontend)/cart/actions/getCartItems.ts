'use server'

import { getUser } from '@/app/(frontend)/actions/getUser'
import { Cart } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getCartItems() {
  const user = await getUser()
  const payload = await getPayload({ config: configPromise })

  try {
    /* if (!user?.id) {
      throw new Error('You are not logged in')
    }*/
    const results = await payload.find({
      collection: 'carts',
      where: {
        'items.buyerEmail': {
          equals: user?.email,
        },
      },
    })

    // Processing the results
    const cart = results.docs && results.docs.length > 0 ? (results.docs[0] as Cart) : null
    return cart
  } catch (error) {
    console.error('Error finding collection:', error)
  }
}
