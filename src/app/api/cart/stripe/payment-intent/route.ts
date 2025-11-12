// app/api/stripe/payment-intent/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getUser } from '@/app/(frontend)/actions/getUser'
import { redirect } from 'next/navigation'

const stripe = new Stripe(process.env.STRIPE_SK || '', {})

export async function POST(req: Request) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
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

  const payload = await getPayload({ config: configPromise })

  const carts = await payload.find({
    collection: 'carts',
    where: { user: { equals: user.id } },
  })

  if (carts.totalDocs === 0) {
    return NextResponse.json({ error: 'No cart found' }, { status: 404 })
  }

  const cart = carts.docs[0]

  if (!cart?.items || cart.items.length === 0) {
    redirect('/cart/empty')
  }
  const { totalPayment, name, phone, line1, postal_code, city, country } = await req.json()
  // const { totalPayment } = await req.json()

  if (!totalPayment) {
    return NextResponse.json({ error: 'Missing totalPayment' }, { status: 400 })
  }
  try {
    let paymentIntent
    //const body = await req.json()

    const shippingAddress: ShippingAddress = {
      name,
      phone,
      address: {
        line1,
        postal_code,
        city,
        country,
      },
    }
    // If cart already has a paymentIntentId, update it instead of creating a new one
    if (cart.paymentIntentId) {
      paymentIntent = await stripe.paymentIntents.update(cart.paymentIntentId, {
        amount: totalPayment * 100,
      })
    } else {
      // Otherwise, create a new PaymentIntent
      paymentIntent = await stripe.paymentIntents.create({
        amount: totalPayment * 100,
        currency: 'eur',
        payment_method_types: ['klarna'],
        receipt_email: user?.email,

        payment_method_options: {
          klarna: {
            preferred_locale: 'fi-FI',
          },
        },
        shipping: shippingAddress,
        metadata: {
          userId: user.id,
          email: user.email,
        },
        //return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/purchase-success`,
      })

      // Save the new paymentIntentId to the cart in Payload
      await payload.update({
        collection: 'carts',
        id: cart.id,
        data: {
          paymentIntentId: paymentIntent.id,
        },
      })
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      totalPayment,
    })
  } catch (err) {
    console.error('❌ PaymentIntent creation/update failed', err)
    return NextResponse.json({ error: 'PaymentIntent creation/update failed' }, { status: 500 })
  }
}
