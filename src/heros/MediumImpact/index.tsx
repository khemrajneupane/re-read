'use client'

import React, { useEffect, useState } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const [current, setCurrent] = useState(0)
  // Auto play logic
  useEffect(() => {
    if (!Array.isArray(media) || media.length === 0) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % media.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [media])

  // Guard clause AFTER hooks
  if (!Array.isArray(media) || media.length === 0) {
    return null
  }
  return (
    <div className="">
      <div className="container mb-8">
        {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}

        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex gap-4">
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <div className="container">
        {media.map((m, i) => (
          <div
            key={typeof m === 'object' && 'id' in m ? m.id : i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Media fill imgClassName="object-cover" priority={i === 0} resource={m} />
            {typeof m === 'object' && 'caption' in m && m.caption && (
              <div className="mt-3">
                <RichText data={m.caption} enableGutter={false} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Carousel controls (dots) */}
      <div className="absolute bottom-6 flex gap-2 z-20">
        {media.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === current ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
