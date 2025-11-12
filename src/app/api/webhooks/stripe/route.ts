//tell nextjs not to auto parse the body
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import Stripe from 'stripe'
import configPromise from '@payload-config'
const stripe = new Stripe(process.env.STRIPE_SK || '', {})
/*export const config = {
  api: {
    bodyParser: false,
  },
}*/
export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }
  let event: Stripe.Event

  try {
    const rawBody = await request.text()
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err}` }, { status: 400 })
  }
  const payload = await getPayload({ config: configPromise })
  switch (event.type) {
    case 'payment_intent.succeeded':
      {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const userId = paymentIntent.metadata.userId
        console.log('paymentIntent event data', paymentIntent)
        const customerEmail = paymentIntent.receipt_email || paymentIntent.metadata.email
        const shipping = paymentIntent.shipping // comes from Klarna sometimes

        if (customerEmail && shipping) {
          // Get your Payload instance
          const payload = await getPayload({ config: configPromise })

          // Find the Customer in Payload
          const customer = await payload.find({
            collection: 'customers',
            where: { email: { equals: customerEmail } },
          })

          if (customer.totalDocs > 0 && customer.docs[0]) {
            const existingCustomer = customer.docs[0]

            // Update the customer with address
            await payload.update({
              collection: 'customers',
              id: existingCustomer.id,
              data: {
                address: {
                  name: shipping.name,
                  line1: shipping?.address?.line1,
                  city: shipping?.address?.city,
                  postal_code: shipping?.address?.postal_code,
                  country: shipping?.address?.country,
                  phone: shipping?.phone,
                },
              },
            })
          }
        }

        if (!userId) {
          console.error('No userId in paymentIntent metadata.')
          break
        }

        const carts = await payload.find({
          collection: 'carts',
          where: { user: { equals: userId } },
        })

        if (carts.totalDocs === 0) {
          console.error('No cart found for user in webhook')
          break
        }

        const cart = carts.docs[0]
        const items = cart?.items ?? []

        if (items.length === 0) {
          console.error('Cart has no items in webhook')
          break
        }

        const purchasedItems: typeof items = []
        for (const item of items) {
          const postId =
            typeof item.post === 'object' && item.post !== null ? item.post.id : item.post

          if (!postId) {
            console.error('Invalid postId in cart item')
            continue
          }

          const post = await payload.findByID({
            collection: 'posts',
            id: postId,
          })

          const currentStock = post.stock ?? 1
          const purchasedQty = item.quantity ?? 1
          const newStock = currentStock - purchasedQty

          await payload.update({
            collection: 'posts',
            id: postId,
            data: {
              stock: newStock < 0 ? 0 : newStock,
            },
          })

          purchasedItems.push({
            post: postId,
            price: item.price,
            quantity: purchasedQty,
            title: item.title,
            id: item.id,
          })
        }

        // ✅ Mark order as paid
        try {
          const orders = await payload.find({
            collection: 'orders',
            where: {
              paymentIntent: {
                equals: paymentIntent.id,
              },
            },
          })

          if (orders.totalDocs > 0 && orders.docs[0]) {
            await payload.update({
              collection: 'orders',
              //id: orders.docs[0].id,
              where: {
                paymentIntent: {
                  equals: paymentIntent.id,
                },
              },
              data: {
                paid: true,
                status: 'paid',
              },
            })
          } else {
            console.warn(
              `⚠️ No order found yet for PaymentIntent ${paymentIntent.id}. It might not have been created yet.`,
            )
          }
        } catch (err) {
          console.error('Error updating orders', err)
        }

        if (cart?.id) {
          await payload.delete({
            collection: 'carts',
            id: cart?.id,
          })
        }
      }
      break

    //if the payment fails then implement deleting the order collection
    case 'payment_intent.canceled':
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      try {
        await payload.delete({
          collection: 'orders',
          where: {
            paymentIntent: {
              equals: paymentIntent.id,
            },
          },
        })
      } catch (err) {
        console.error('Error deleting orders', err)
      }
    }
    default:
      console.log(`Unhandled event type': ${event.type}`)
  }
  return NextResponse.json({ received: true })
}
