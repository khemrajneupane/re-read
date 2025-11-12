'use client'
//import Image from 'next/image'
//import Link from 'next/link'
import type { Header as HeaderType } from '@/payload-types'
import React, { useState } from 'react'
import { CMSLink } from '../Link'
//import NavIcons from './NavIcons'
import { useClickOutside } from '@/hooks/useClickOutside'
import { MenuIcon } from 'lucide-react'

const Menu: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [isHamburgerClicked, setIsHamburgerClicked] = useState(false)
  const divRef = useClickOutside<HTMLDivElement>(() => setIsHamburgerClicked(false))
  return (
    <div ref={divRef} onClick={() => setIsHamburgerClicked((prev) => !prev)}>
      <MenuIcon />
      {isHamburgerClicked && (
        <div className="absolute bg-brands-50 left-0 top-20 w-full h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-8  z-10">
          <div className="flex items-center gap-4">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  key={i}
                  {...link}
                  appearance="default"
                  className="bg-brands-500 hover:bg-brands-300 text-white hover:text-black"
                />
              )
            })}
          </div>
          <div onClick={() => setIsHamburgerClicked(false)}></div>
        </div>
      )}
    </div>
  )
}

export default Menu
