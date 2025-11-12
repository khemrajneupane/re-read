'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Post } from '@/payload-types'
import { getUser } from '../../(auth)/actions/getUser'
//import { redirect } from 'next/navigation'

export async function addToCart(postId: string) {
  const payload = await getPayload({ config: configPromise })
  const user = await getUser()

  //let post: Post | null = null
  try {
    if (!user?.id) {
      //console.error('No valid user found in addToCart')
      //throw new Error('UserNotLoggedIn')
      //redirect('/login')
      return { success: false, error: 'USER_NOT_LOGGED_IN' }
    }
    // Fetch the post
    const post = (await payload.findByID({
      collection: 'posts',
      id: postId,
      user: user,
    })) as Post

    /* if (!post) {
      throw new Error('Post not found')
    }*/
    if (!post.stock || post.stock < 1) {
      //throw new Error('Item is out of stock')
      //redirect('/')
      return { success: false, error: 'OUT_OF_STOCK' }
    }

    // Check if user already has a cart
    const carts = await payload.find({
      collection: 'carts',
      where: { user: { equals: user.id } },
    })

    let cart

    if (carts.totalDocs === 0) {
      // No cart exists, create new
      cart = await payload.create({
        collection: 'carts',
        data: {
          user: user.id,
          items: [
            {
              post: post.id,
              quantity: 1,
              price: post.price || 0,
              buyerEmail: user.email,
              title: post.title,
            },
          ],
        },
      })
    } else {
      // Cart exists, update items
      const existingCart = carts.docs[0]

      if (!existingCart || !Array.isArray(existingCart.items)) {
        throw new Error('Existing cart or cart items not found')
      }

      const itemIndex = existingCart.items.findIndex((item) => {
        // If item.post is populated as object, compare id
        if (typeof item.post === 'object' && item.post !== null) {
          return item.post.id === post.id
        }
        return item.post === post.id
      })

      if (itemIndex >= 0) {
        // Item already exists in cart, optionally increment quantity if you want:
        // existingCart.items[itemIndex].quantity += 1
        //console.warn('Product already in cart, skipping duplicate add')
        //return existingCart
        return { success: false, error: 'ALREADY_IN_CART' }
      } else {
        // Add new item
        existingCart.items.push({
          post: post.id,
          quantity: 1,
          price: post.price || 0,
          buyerEmail: user.email,
          title: post.title,
        })
      }

      cart = await payload.update({
        collection: 'carts',
        id: existingCart.id,
        data: {
          items: existingCart.items,
        },
      })
    }

    return cart
  } catch (err) {
    console.error('Failed to add to cart:', err)
    throw err
  }
}
