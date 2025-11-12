import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getAllCategories() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    limit: 100, // adjust if needed
    sort: 'title', // if you want alphabetical
  })

  return categories.docs // returns array of category objects
}
