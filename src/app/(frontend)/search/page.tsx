import React from 'react'
import { getPayload } from 'payload'
import PageClient from './page.client'
import { Post } from '@/payload-types'
import { BookOpen } from 'lucide-react'
import type { Metadata } from 'next/types'
import configPromise from '@payload-config'
import { CollectionArchive } from '@/components/CollectionArchive'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      bookauthor: true,
    },
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'categories.title': {
                  like: query,
                },
              },
              {
                'meta.bookauthor': {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })
  return (
    <div className="relative pt-24 w-full">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <div className="absolute -inset-2 bg-gradient-to-r from-brands-100 to-brands-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>

          <div className="p-4 flex justify-center gap-4 items-center">
            <div className="">
              <h1 className="text-4xl md:text-5xl font-bold text-brands-300 mb-4 tracking-tight ">
                Showing Books
              </h1>
              <div className="absolute w-24 h-1 bg-gradient-to-r from-brands-500 to-brands-600 rounded-full"></div>
            </div>
            <BookOpen className="bottom-10 right-0 h-12 w-12 text-brands-500 opacity-70" />
          </div>
          {/* <div className="hidden md:block max-w-[50rem] mx-auto">
            <SearchBar />
          </div> */}
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as Post[]} />
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Search`,
  }
}
