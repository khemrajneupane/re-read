'use client'

import Link from 'next/link'
//import Image from 'next/image'
import { ShoppingBasketIcon } from 'lucide-react'

export default function CartEmptyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8.5rem)] px-4 mb-8 text-center">
      <ShoppingBasketIcon
        width={200}
        height={200}
        className="text-red-600 dark:text-red-400 mb-6 animate-pulse"
      />
      <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-gray-800 dark:text-gray-100">
        Your Cart is Empty
      </h1>
      <p className="mb-8 max-w-md text-gray-600 dark:text-gray-300">
        Looks like you haven&apos;t added anything to your cart yet. Start exploring and find
        something you love!
      </p>
      <Link
        href="/"
        className="rounded-lg bg-gradient-to-r from-brands-500 to-brands-400 text-white dark:from-brands-600 dark:to-brands-500 py-3 px-6 font-semibold shadow-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brands-500 transition-all"
      >
        Continue Shopping
      </Link>
    </div>
  )
}
