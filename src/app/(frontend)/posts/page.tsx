import React from 'react'
import { getPayload } from 'payload'
export const dynamic = 'force-static'
import PageClient from './page.client'
import type { Metadata } from 'next/types'
import configPromise from '@payload-config'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { CollectionArchive } from '@/components/CollectionArchive'

export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      bookauthor: true,
      slug: true,
      categories: true,
      meta: true,
      price: true,
      originalPrice: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="mb-16">
        <div className="prose dark:prose-invert w-full px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32">
          <h1>Checkout Books</h1>
        </div>
      </div>
      <div className="mb-8 w-full px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>
      <CollectionArchive posts={posts.docs} />
      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Buy and Sell Used-Books`,
  }
}
