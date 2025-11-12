// app/cart/page.tsx
import { redirect } from 'next/navigation'
import { getUser } from '../(auth)/actions/getUser'
import CartClient from './components/cartClient'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
export default async function CheckoutCartPage() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }

  const payload = await getPayload({ config: configPromise })

  const carts = await payload.find({
    collection: 'carts',
    where: { user: { equals: user.id } },
  })

  const cart = carts.totalDocs > 0 ? carts.docs[0] : null

  return (
    <div className=" mx-auto px-4 pt-20">
      <CartClient initialCart={cart ?? null} />
    </div>
  )
}
