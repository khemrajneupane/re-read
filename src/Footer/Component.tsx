import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import type { Footer } from '@/payload-types'
import { FooterClientComponent } from './FooterClientComponent'
import { Loader } from 'lucide-react'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  if (!footerData) {
    return <Loader className="animate-spin" />
  }
  return <FooterClientComponent {...footerData} />
}
