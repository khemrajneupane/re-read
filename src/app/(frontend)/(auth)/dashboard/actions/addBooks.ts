'use server'

import { getPayload } from 'payload'
import { Post } from '@/payload-types'
import configPromise from '@payload-config'
import { getUser } from '@/app/(frontend)/actions/getUser'

type PostInput = Pick<
  Post,
  | 'termsAgreed'
  | 'title'
  | 'bookauthor'
  | 'isbn'
  | 'price'
  | 'stock'
  | 'originalPrice'
  | 'categories'
  | 'heroImage'
  | 'content'
>

export async function addBooks(posts: PostInput[]) {
  const payload = await getPayload({ config: configPromise })
  const user = await getUser()

  if (!user?.id) {
    return { success: false, error: 'USER_NOT_LOGGED_IN' }
  }

  const sellerId = user.id
  const createdOrUpdated: Post[] = []

  try {
    for (const post of posts) {
      // 🔍 Check for duplicates from the same seller
      const existing = await payload.find({
        collection: 'posts',
        where: {
          and: [
            { title: { equals: post.title } },
            { bookauthor: { equals: post.bookauthor } },
            post.isbn ? { isbn: { equals: post.isbn } } : {},
            { seller: { equals: sellerId } },
          ],
        },
        limit: 1,
        depth: 0,
        user,
      })

      if (existing.docs.length > 0 && existing.docs[0]) {
        // ✅ Update existing post
        const updated = (await payload.update({
          collection: 'posts',
          id: existing.docs[0].id,
          data: {
            ...post,
            seller: sellerId,
          },
          user,
        })) as Post

        createdOrUpdated.push(updated)
      } else {
        // 🆕 Create new post
        const created = (await payload.create({
          collection: 'posts',
          data: {
            ...post,
            seller: sellerId,
          },
          user,
        })) as Post

        createdOrUpdated.push(created)
      }
    }

    return { success: true, posts: createdOrUpdated }
  } catch (err) {
    console.error('Failed to add posts:', err)
    return { success: false, error: 'FAILED_TO_ADD_POSTS' }
  }
}
