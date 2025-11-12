/*
import { loadStripe } from '@stripe/stripe-js'
export const stripePromise = loadStripe(process.env.STRIPE_SECRET_KEY!)
*/

import { Stripe, loadStripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || '')
  }
  return stripePromise
}
