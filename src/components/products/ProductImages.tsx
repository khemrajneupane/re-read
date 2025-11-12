'use client'

import { Media, Post } from '@/payload-types'
import Image from 'next/image'
import { useState } from 'react'

export const ProductImages: React.FC<{ post: Post }> = ({ post }) => {
  const { heroImage, meta } = post
  const image = `${process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_FULL_URL}/${(meta?.image as Media)?.url || ''}`

  const [index, setIndex] = useState(0)

  const items = Array.isArray(heroImage) ? heroImage : []

  const current = items[index]

  return (
    <div className="rounded-2xl border-b-8 border-t-brands-500 border-t-8 border-b-brands-500">
      {/* Main display */}
      <div
        className={`${current && typeof current === 'object' && current.url && current.mimeType?.startsWith('image/') ? 'h-[500px] max-h-[calc(500px)]' : ''}  max-w-[100vw]`}
      >
        {current && typeof current === 'object' && current.url ? (
          current.mimeType?.startsWith('image/') ? (
            <Image
              src={current.url as string}
              alt={current.alt || ''}
              height={100}
              width={100}
              className="relative w-full h-full rounded-xl"
            />
          ) : current.mimeType?.startsWith('video/') ? (
            <video
              src={current.url as string}
              controls
              width={100}
              height={100}
              className="relative rounded-xl max-h-[500px] w-full"
            />
          ) : null
        ) : (
          <Image
            src={image}
            alt=""
            height={100}
            width={100}
            className="relative w-full h-full rounded-xl"
          />
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex relative h-full gap-1 justify-center mt-1">
        <div className="absolute z-0 pointer-events-none inset-0 rounded-lg bg-gradient-to-tr from-brands-500 via-brands-100 to-brands-50 opacity-10" />
        {items.map((item, i) =>
          item && typeof item === 'object' && item.url ? (
            <div
              className={`relative max-h-[calc(150px)] max-w-[calc(200px)] cursor-pointer ${
                i === index ? 'border-brands-500' : 'border-transparent'
              }`}
              key={item.id ?? i}
              onClick={() => setIndex(i)}
            >
              {item.mimeType?.startsWith('image/') ? (
                <Image
                  src={item.url as string}
                  alt={item.alt || ''}
                  width={150}
                  height={100}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : item.mimeType?.startsWith('video/') ? (
                <video
                  src={item.url as string}
                  width={150}
                  height={100}
                  className="w-full h-full rounded-md object-cover"
                />
              ) : null}
            </div>
          ) : null,
        )}
      </div>
    </div>
  )
}

export default ProductImages
