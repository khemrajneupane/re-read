import type { Metadata } from 'next'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import PageClient from './page.client'
import { BookOpen } from 'lucide-react'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug

  //let page: RequiredDataFromCollectionSlug<'pages'> | null

  const page = await queryPageBySlug({
    slug,
  })

  // Remove this code once your website is seeded
  /*  if (!page && slug === 'home') {
    page = homeStatic
  }
*/
  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="relative pt-10 md:pt-28">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <div className="relative hidden md:block">
        {/* <div className="relative"> */}
        <RenderHero {...hero} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white" />
      </div>
      <div className="relative mt-14">
        <div className=" w-full text-center mb-8 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-brands-100 to-brands-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
          <div className="p-4 flex  gap-4 justify-center items-center">
            <div className="flex flex-col items-baseline">
              <h1 className="text-left text-4xl md:text-5xl font-bold text-brands-300 mb-4 tracking-tight uppercase">
                Books you might be interested in
              </h1>
              <div className="flex w-full items-center gap-2">
                <BookOpen className="h-12 w-12 text-brands-500 opacity-70" />
                <div className=" w-1/3 h-4 bg-gradient-to-r from-brands-50 via-pastel-brands-300 to-yellow-brands-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <RenderBlocks blocks={layout} />
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
