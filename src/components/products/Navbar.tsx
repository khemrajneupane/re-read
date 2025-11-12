'use client'

import Menu from './Menu'
import Link from 'next/link'
import NavIcons from './NavIcons'
import SearchBar from './SearchBar'
import { BookOpen } from 'lucide-react'
import { CMSLink } from '@/components/Link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import type { Header as HeaderType } from '@/payload-types'

const Navbar: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 5) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <div
      className={`fixed flex flex-col gap-2 w-full h-auto py-4 z-50 
      transition-all duration-1000 ease-in-out 
      ${scrolled ? 'opacity-100 translate-y-0  shadow-lg backdrop-blur-md' : ''}`}
    >
      {/* Main header bar */}
      <div
        className="relative w-full  px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32 rounded-lg z-20"
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div className="flex items-center justify-between gap-8 h-full">
          <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
            <Link href="/" className="flex items-center gap-3">
              <BookOpen className="text-brands-500 w-15 h-15" />
              <div className="text-2xl tracking-wide whitespace-nowrap">re-Read</div>
            </Link>
            <div className="hidden xl:flex gap-4">
              {navItems.map(({ link }, i) => (
                <CMSLink key={i} {...link} appearance="ghost" className="text-lg" />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <CMSLink url={'/search'} className="hidden md:block cursor-pointer w-full">
              <SearchBar />
            </CMSLink>
            <div>
              <NavIcons data={data} mode="hamburger_normal" />
            </div>
            <div className="md:hidden">
              <Menu data={data} />
            </div>
          </div>
        </div>
      </div>
      {pathname !== '/login' && (
        <div className="absolute w-full h-full top-16 left-0 md:hidden">
          <SearchBar />
        </div>
      )}
      {/* Gradient overlay */}
      <div
        className={`pointer-events-none absolute bottom-0 md:bottom-0 left-0 right-0 h-full 
        transition-all duration-1000 ease-in-out
        ${
          scrolled
            ? 'opacity-100 translate-y-0 bg-gradient-to-b from-brands-500 md:to-brands-100 to-brands-50 shadow-lg backdrop-blur-md'
            : 'opacity-0 -translate-y-5'
        }`}
      />
    </div>
  )
}

export default Navbar
