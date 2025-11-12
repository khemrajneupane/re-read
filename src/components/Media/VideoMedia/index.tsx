'use client'

import { cn } from '@/utilities/ui'
import React, { useRef } from 'react'
import type { Props as MediaProps } from '../types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = ({ onClick, resource, videoClassName }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  //  const [showFallback, setShowFallback] = useState(false)
  /*
  useEffect(() => {
    const { current: video } = videoRef
    if (!video) return

    const handleSuspend = () => {
      setShowFallback(true)
      console.warn('Video was suspended, rendering fallback image.')
    }

    video.addEventListener('suspend', handleSuspend)

    return () => {
      video.removeEventListener('suspend', handleSuspend)
    }
  }, [])
*/
  if (!resource || typeof resource !== 'object') return null

  const { filename, url } = resource
  /*
  if (showFallback) {
    return (
      <img
        src={`${thumbnailURL}`}
        alt={alt || 'Video fallback'}
        className={`h-full w-full`}
        onClick={onClick}
      />
    )
  }
*/
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      controls={false}
      ref={videoRef}
      onClick={onClick}
      className={`${cn(videoClassName)} h-full w-full`}
    >
      <source src={getMediaUrl(url ?? `/media/${filename}`)} />
      Your browser does not support the video tag.
    </video>
  )
}
