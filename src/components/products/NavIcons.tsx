'use client'

import { CMSLink } from '../Link'
import CartModel from './CartModel'
import { BookOpen, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useClickOutside } from '@/hooks/useClickOutside'
import { getUser } from '@/app/(frontend)/actions/getUser'
import type { Customer, Header as HeaderType } from '@/payload-types'
import { LogoutButton } from '@/app/(frontend)/(auth)/components/LogoutButton'

interface HamburgerDropdownInterface {
  data: HeaderType
  mode?: 'hamburger_dropdown' | 'hamburger_normal'
}
const NavIcons: React.FC<HamburgerDropdownInterface> = ({ data, mode = 'hamburger_normal' }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [currentUser, setCorrentUser] = useState<Customer | null>()
  const divRef = useClickOutside<HTMLDivElement>(() => setIsProfileOpen(false))

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await getUser()

      if (user) {
        setCorrentUser(user)
      }
    }
    getCurrentUser()
  }, [isProfileOpen])

  const handleProfile = (event: React.MouseEvent<HTMLImageElement>) => {
    setIsProfileOpen((prev) => !prev)
  }

  return (
    <div
      ref={divRef}
      className="relative w-52 flex flex-row justify-center items-center gap-4 xl:gap-6"
    >
      {currentUser ? (
        <div
          className="cursor-pointer flex gap-0.5 p-0.5 items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-brands-500  to-brands-500  font-semibold"
          onClick={handleProfile}
        >
          {`${currentUser?.username?.charAt(0).toUpperCase()}.${currentUser?.username?.slice(-1).toUpperCase()}`}
        </div>
      ) : (
        <div className="cursor-pointer" onClick={handleProfile}>
          <BookOpen />
        </div>
      )}

      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}
            onClick={handleProfile}
            className="absolute flex flex-col items-center justify-center z-20 py-1 px-1 bg-brands-500 rounded-lg top-10 md:top-12 left-12 md:-left-28 overflow-y-auto shadow-lg p-4 rounded-l-xl w-full sm:w-64 md:w-80 lg:w-96 xl:w-[28rem] 2xl:w-[30rem]"
          >
            <CMSLink
              label="Profile"
              url="/dashboard"
              appearance="profile"
              className=" text-sm py-2"
            />

            {currentUser?.id && (
              <div className={`hover:bg-brands-900/50 text-sm py-2 rounded-lg`}>
                <LogoutButton />
              </div>
            )}

            {!currentUser?.id && (
              <CMSLink
                label="Login"
                url="/login"
                appearance="ghost"
                className="z-40 hover:bg-brands-950 hover:text-white text-sm"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {mode === 'hamburger_normal' && <CartModel />}
    </div>
  )
}

export default NavIcons
