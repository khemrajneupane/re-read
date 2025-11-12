'use client'

import { PartyPopper } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PurchaseSuccessPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000) // simulate loading for 1 second
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Spinner />
  }

  return <PurchaseSuccess />
}

function PurchaseSuccess() {
  const params = useSearchParams()
  const status = params.get('redirect_status')
  const paymentIntentId = params.get('payment_intent')
  return (
    <div className="mt-20 max-w-xl mx-auto py-12 flex flex-col texts-center justify-center w-full min-h-[calc(100vh-20rem)] p-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32 rounded-xl z-20 bg-brands-50">
      <PartyPopper className="w-16 h-16 text-brands-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-4 dark:text-black">Thank you for your purchase!</h1>
      <p className="mb-2 dark:text-black">
        Your payment was <strong>{status}</strong>.
      </p>
      {paymentIntentId && (
        <p className="text-sm text-gray-600">Payment Intent ID: {paymentIntentId}</p>
      )}
      <Link href="/posts" className="mt-6 inline-block text-blue-600 underline">
        Continue browsing posts
      </Link>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <svg
        className="animate-spin h-12 w-12 text-teal-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </div>
  )
}
