'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import type { Footer } from '@/payload-types'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import Image from 'next/image'
import { toast } from 'sonner'
import { BookOpen, LucideBan } from 'lucide-react'

export function FooterClientComponent(data: Footer) {
  const navItems = data?.navItems || []
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const submitSubscribe = async () => {
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        //setMessage(data.message || 'Subscribed!')
        setEmail('')
        toast.message(data.message, {
          icon: <LucideBan className="text-brands-500 w-5 h-5" />,
        })
      } else {
        setStatus('error')
        toast.message(data.error, {
          icon: <LucideBan className="text-brands-500 w-5 h-5" />,
        })
        //setMessage(data.error || 'Something went wrong')
      }
    } catch (e) {
      setStatus('error')
      //setMessage('Subscription failed')
    }
  }
  return (
    <footer className="relative bg-brands-500 py-4 rounded-t-lg mt-6 flex flex-col gap-6">
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-1/4 md:h-full bg-gradient-to-t from-brands-500 to-brands-50" />
      {/* TOP SECTION */}
      <div className=" md:dark:text-slate-500 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-11 w-full px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32 z-20">
        {/* LEFT */}
        <div className=" flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <BookOpen className="text-brands-500 w-15 h-15" />
            <Link href="/">
              <div className="text-2xl font-semibold tracking-wide whitespace-nowrap">re-Read</div>
            </Link>
          </div>
          <p>Perintötie 4E, 01520 Vantaa, Finland</p>
          <span className="font-semibold">khemrjneupane@gmail.com</span>
          <span className="font-semibold">+358 444 344 333</span>
          <div className="flex gap-4 mt-2">
            {['facebook', 'instagram', 'youtube', 'pinterest', 'x'].map((platform) => (
              <Image
                key={platform}
                src={`/static/${platform}.png`}
                alt={platform}
                width={30}
                height={30}
                className="cursor-pointer bg-white rounded-full p-1 hover:bg-gray-200 transition"
              />
            ))}
          </div>
        </div>

        {/* CENTER - COMPANY, SHOP, HELP */}
        <div className="hidden lg:flex col-span-2 justify-between">
          {/* COMPANY */}
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-lg font-medium">COMPANY</h2>
            <div className="flex flex-col">
              {navItems.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  appearance={'ghost'}
                  className="text-base hover:text-white hover:bg-black"
                />
              ))}
            </div>
          </div>

          {/* SHOP */}
          <div className="flex flex-col items-center  gap-4">
            <h2 className="text-lg font-medium">SHOP NOW</h2>
            <div className="flex flex-col items-center ">
              <CMSLink
                label="New Arrivals"
                url="/posts"
                appearance="ghost"
                className="text-base hover:text-white hover:bg-black"
              />
            </div>
          </div>

          {/* HELP */}
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-lg font-medium">HELP</h2>
            <div className="flex flex-col items-center ">
              <CMSLink
                label="Customer Service"
                url="/customer-service"
                appearance="ghost"
                className="text-base hover:text-white hover:bg-black"
              />
              <CMSLink
                label="My Account"
                url="/dashboard"
                appearance="ghost"
                className="text-base hover:text-white hover:bg-black"
              />
              <CMSLink
                label="Legal & Privacy"
                url="/privacy-policy"
                appearance="ghost"
                className="text-base hover:text-white hover:bg-black"
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-medium">SUBSCRIBE</h2>
          <p>Be the first to get the latest news about trends, promotions, and more!</p>
          <div className="w-full flex overflow-hidden gap-1 rounded-md transition focus-within:ring-2 focus-within:ring-brands-600">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 w-1/2 flex-1 bg-brands-50 outline-none placeholder-gray-500 dark:placeholder-gray-500 dark:text-gray-500"
            />
            <button
              onClick={submitSubscribe}
              className="dark:text-slate-300 px-1 bg-brands-600 font-semibold text-base hover:text-white hover:bg-black rounded-lg"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          <span className="font-semibold mt-2">Secure Payments</span>
          <div className="flex flex-wrap gap-4">
            {['discover', 'skrill', 'paypal', 'mastercard', 'visa'].map((card) => (
              <Image key={card} src={`/static/${card}.png`} alt={card} width={40} height={24} />
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="dark:text-slate-400 z-20 border-t px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="">© 2025 re-Read</div>
        <div className="flex flex-col md:flex-row gap-4 text-center">
          <div>
            <span className="mr-2">Language:</span>
            <span className="font-medium">Finland | English</span>
          </div>
          <div>
            <span className="mr-2">Currency:</span>
            <span className="font-medium">€ EUR</span>
          </div>
        </div>
        <ThemeSelector />
      </div>
    </footer>
  )
}
