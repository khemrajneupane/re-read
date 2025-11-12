'use client'

import { useState, useEffect } from 'react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import type { Page } from '@/payload-types'
import { useHeaderTheme } from '@/providers/HeaderTheme'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

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
    <div
      className="relative -mt-[4rem] flex items-center justify-center text-white min-h-[80vh] overflow-hidden"
      data-theme="dark"
    >
      {/* Hero content */}
      <div className="container mb-8 z-10 flex items-center justify-center">
        <div>
          {richText && (
            <RichText
              className="absolute left-8 md:left-32 top-24 max-w-[36.5rem] text-xl text-brands-50 bg-black/5"
              data={richText}
              enableGutter={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {links.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Background images (carousel) */}
      <div className="absolute inset-0">
        {media.map((m, i) => (
          <div
            key={typeof m === 'object' && 'id' in m ? m.id : i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Media fill imgClassName="object-cover" priority={i === 0} resource={m} />
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
