import React, { cache } from 'react'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Add from '@/components/products/Add'
import type { Post } from '@/payload-types'
import configPromise from '@payload-config'
import RichText from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import ProductImages from '@/components/products/ProductImages'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { Book, BookOpen } from 'lucide-react'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/posts/' + slug
  const post = await queryPostBySlug({ slug })
  const bookId = post?.id

  if (!post) return <PayloadRedirects url={url} />

  const { bookauthor, title, meta, price, originalPrice, stock } = post
  return (
    <div className="mt-40  px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32 ">
      <div className="relative flex flex-col lg:flex-row gap-16">
        {/* IMG */}
        <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
          <ProductImages post={post} />
        </div>
        {/* TEXTS */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-4xl font-medium"> {`${title}. ${bookauthor}`}</h1>
          <p className="text-gray-500">{meta?.description}</p>
          <div className="h-[2px] bg-gray-100" />
          <div className="flex items-center gap-4">
            {originalPrice && (
              <h3 className="text-xl text-gray-500 line-through">€{originalPrice}</h3>
            )}
            {price && <h2 className="font-medium text-2xl">€{price}</h2>}
          </div>
          <div className="h-[2px] bg-gray-100" />
          {/* <CustomizeProduct /> */}
          <Add
            title={title}
            discountedPrice={price ?? 0}
            stock={stock ?? 0}
            bookId={bookId ?? ''}
          />
          <div className="h-[2px] bg-gray-100" />
          <div className="text-sm">
            <h4 className="font-medium mb-4">Title</h4>
            <p>{meta?.title}</p>
          </div>
          <div className="text-sm">
            <RichText className="max-w-[78rem] mx-auto" data={post.content} enableGutter={false} />
          </div>
        </div>
      </div>

      <div className="relative mt-14 pt-14 flex flex-col items-center justify-center w-full">
        <div className=" w-full text-center mb-8 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-brands-100 to-brands-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
          <div className="p-4 flex justify-center gap-4 items-center">
            <div className="">
              <h1 className="text-4xl md:text-5xl font-bold text-brands-300 mb-4 tracking-tight ">
                Related Books
              </h1>
              <div className="absolute w-24 h-1 bg-gradient-to-r from-brands-500 to-brands-600 rounded-full"></div>
            </div>
            <BookOpen className="bottom-10 right-0 h-12 w-12 text-brands-500 opacity-70" />
          </div>
        </div>

        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <RelatedPosts
            className="w-full pb-14 "
            docs={post.relatedPosts.filter((post) => typeof post === 'object')}
          />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
