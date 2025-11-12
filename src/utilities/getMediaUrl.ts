import { getClientSideURL } from './getURL'
/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''
  // Normalize cache tag (encode to avoid : or spaces breaking the URL)
  const cacheParam = cacheTag ? `?v=${encodeURIComponent(cacheTag)}` : ''

  // If already absolute URL, just return as-is (append cacheTag only for non-Cloudflare)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return `${url}${cacheParam}`
  }

  // ✅ Use Cloudflare if available (NEXT_PUBLIC so it exists both server + client)
  const cfBucket = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_FULL_URL
  if (cfBucket && process.env.NODE_ENV === 'production') {
    // Safer: keep path after `/media/file/` instead of just filename
    const path = url.replace(/^\/?api\/media\/file\//, '')
    const cfUrl = `${cfBucket}/${path}`
    return cfUrl // ⚡️ no cache param needed for R2
  }

  // ✅ Fallback to API domain (vercel / localhost), cache param is useful here
  const baseUrl = getClientSideURL()
  return `${baseUrl}${url}${cacheParam}`
}
