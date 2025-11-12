'use client'

import { toast } from 'sonner'
import CartItems from './cartItems'
import { Cart } from '@/payload-types'
import { getStripe } from '@/lib/stripe'
import { LucideBan } from 'lucide-react'
import { Stripe } from '@stripe/stripe-js'
import { useEffect, useState } from 'react'
import CartPaymentForm from './cartPaymentForm'
import { useCartStore } from '@/lib/useCartStore'
import { Elements } from '@stripe/react-stripe-js'
import { usePathname, useSearchParams } from 'next/navigation'

interface CartClientProps {
  initialCart: Cart | null
}
type ShippingAddress = {
  name: string
  phone: string
  address: {
    line1: string
    postal_code: string
    city: string
    country: string
  }
}
export default function CartClient({ initialCart }: CartClientProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isSuccess, setIsSuccess] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    phone: '',
    address: { line1: '', postal_code: '', city: '', country: '' },
  })
  const { cart, fetchCart, setCart } = useCartStore()
  const totalPrice = cart?.items?.reduce((sum, item) => sum + item.price, 0)
  useEffect(() => {
    const isPurchaseSuccessPage = pathname === '/purchase-success'
    const hasSuccessStatus = searchParams.get('status') === 'succeeded'
    const hasPaymentIntent = searchParams.has('payment_intent')

    setIsSuccess(isPurchaseSuccessPage && hasSuccessStatus && hasPaymentIntent)
  }, [pathname, searchParams])

  useEffect(() => {
    if (!isSuccess) return

    const interval = setInterval(() => {
      fetchCart()
    }, 2000)

    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 30000) // Stop polling after 10 seconds

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [clientSecret, fetchCart, isSuccess, cart?.items?.length])

  // Hydrating Zustand with initialCart on first mount
  useEffect(() => {
    if (initialCart) {
      setCart(initialCart)
    } else {
      fetchCart()
    }
    setHydrated(true)
  }, [initialCart, setCart, fetchCart])

  // Loading Stripe instance once on mount
  useEffect(() => {
    const loadStripeInstance = async () => {
      const stripe = await getStripe()
      setStripeInstance(stripe as Stripe | null)
    }
    loadStripeInstance()
  }, [totalPrice])

  const [isCreatingIntent, setIsCreatingIntent] = useState(false)

  const handleShippingDetailsChange = (details: ShippingAddress) => {
    const detailsObject = {
      name: details.name,
      phone: details.phone,
      address: {
        line1: details.address.line1,
        postal_code: details.address.postal_code,
        city: details.address.city,
        country: details.address.country,
      },
    }
    setShippingDetails(detailsObject)
  }

  useEffect(() => {
    if (!hydrated || isCreatingIntent || !totalPrice) return

    const createOrUpdatePaymentIntent = async () => {
      setIsCreatingIntent(true)
      try {
        const res = await fetch('/api/cart/stripe/payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ totalPayment: totalPrice, shippingAddress: shippingDetails }),
        })

        const data = await res.json()

        if (!res.ok) {
          toast.warning(data.error, {
            icon: <LucideBan className="text-brands-500 w-5 h-5" />,
          })
          return
        }

        // Always needs to update clientSecret, even if it was already set
        setClientSecret(data.clientSecret)
      } catch (err) {
        toast.warning('PaymentIntent fetch error', {
          icon: <LucideBan className="text-brands-500 w-5 h-5" />,
        })
      } finally {
        setIsCreatingIntent(false)
      }
    }

    createOrUpdatePaymentIntent()
  }, [hydrated, totalPrice])

  if (!hydrated)
    return (
      <div className="flex items-center justify-start h-[350px] w-[400px]">
        <h1 className="z-40 text-3xl">Loading</h1>
        <div className="pointer-events-none absolute bottom-6 md:bottom-0 left-0 right-0 h-1/2 md:h-full bg-gradient-to-b from-brands-500  md:to-brands-100 to-brands-50" />
      </div>
    )

  return (
    <div className="relative flex flex-col md:flex-row gap-6 w-full h-full">
      <div className="w-full md:w-1/2">
        <CartItems />
      </div>
      <div className="w-full md:w-1/2 bg-brands-50 p-4 rounded-lg shadow">
        {stripeInstance && clientSecret ? (
          <Elements stripe={stripeInstance} options={{ clientSecret }}>
            <CartPaymentForm onShippingDetailsChange={handleShippingDetailsChange} />
          </Elements>
        ) : (
          <div className="flex items-center justify-start h-[350px] w-[400px]">
            <h1 className="z-40 text-3xl">Loading</h1>
            <div className="pointer-events-none absolute bottom-6 md:bottom-0 left-0 right-0 h-1/2 md:h-full bg-gradient-to-b from-brands-500  md:to-brands-100 to-brands-50" />
          </div>
        )}
      </div>
    </div>
  )
}
