'use server'

import { getUser } from '../(auth)/actions/getUser'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
//import { cartCreatePaymentIntent } from './actions/cartCreatePaymentIntent'
//import { getCustomerCart } from '@/components/products/actions/getCustomerCart'
//import CartModel from '@/components/products/CartModel'

export default async function CartPage() {
  const payload = await getPayload({ config: configPromise })

  //get the user
  const user = await getUser()
  //const user = await getMeUser()
  if (!user) {
    redirect('/login')
  }

  await payload.find({
    collection: 'carts',
    where: { user: { equals: user.id } },
  })
  //const initialCart = cart.docs[0] || null
  /**
 *   if (paymentIntentResult.message === 'CART_IS_EMPTY') {
    return (
      <div className="flex justify-center items-center h-full my-28 px-10 md:px-8 lg:px-16 xl:px-32 2xl:px-64 rounded-lg z-20 bg-brands">
        <h1 className="py-8">Your cart is empty</h1>
      </div>
    )
  }
 */
  /*const paymentIntentResult = await cartCreatePaymentIntent(user)
 

  const { clientSecret } = paymentIntentResult
  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center h-full my-28 px-10 md:px-8 lg:px-16 xl:px-32 2xl:px-64 rounded-lg z-20 bg-brands">
        Page not found
      </div>
    )
  }
*/
  return <div className="pt-40"></div>
}
