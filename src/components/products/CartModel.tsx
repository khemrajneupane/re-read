'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useClickOutside } from '@/hooks/useClickOutside'
import {
  resetCartClicked,
  resetViewCartOnlyNoPaymentForm,
  setCartClicked,
  viewCartOnlyNoPaymentForm,
} from '@/app/(frontend)/store/slices/cartClickSlice'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCartStore } from '@/lib/useCartStore'
import { LucideShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cart, Customer } from '@/payload-types'
import { getUser } from '@/app/(frontend)/actions/getUser'

interface CartComponentInterface {
  clientSecret?: string
  initialCart?: Cart | null
}
const CartModel = ({ clientSecret, initialCart }: CartComponentInterface) => {
  const { cart, fetchCart, deleteItem, setCart } = useCartStore()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isSuccess, setIsSuccess] = useState(false)
  const totalPrice = cart?.items?.reduce((sum, item) => sum + item.price, 0) ?? 0

  const divRef = useClickOutside<HTMLDivElement>(() => setIsCartOpen(false))
  const dispatch = useDispatch()
  const router = useRouter()
  useEffect(() => {
    if (initialCart) {
      setCart(initialCart)
    } else {
      fetchCart()
    }
  }, [initialCart, setCart, clientSecret])
  useEffect(() => {
    const isPurchaseSuccessPage = pathname === '/purchase-success'
    const isUserNotLoggedIn = pathname === '/login'
    if (isUserNotLoggedIn) {
      setCart(null)
    }
    setIsSuccess(isPurchaseSuccessPage)
  }, [pathname, searchParams])

  useEffect(() => {
    if (!isSuccess) return

    const interval = setInterval(() => {
      fetchCart()
    }, 2000)

    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 10000) // Stop polling after 10 seconds

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [isSuccess])

  const handleProfile = (event: React.MouseEvent<HTMLImageElement>) => {
    setIsCartOpen((prev) => !prev)
    if (cart && cart.items?.length === 0) {
      router.push('/cart/empty')
    }
  }

  const handleDeleteCart = async (itemId: string) => {
    try {
      dispatch(setCartClicked())

      await deleteItem(itemId) //directly awaits Zustand store function
    } catch (e) {
      console.error('handleDeleteCart error:', e)
    } finally {
      dispatch(resetCartClicked())
    }
  }

  function extractImageInfo(values: any): { imgpath?: string; alt?: string } {
    if (
      typeof values.post === 'object' &&
      values.post !== null &&
      'meta' in values.post &&
      values.post.meta &&
      'image' in values.post.meta &&
      values.post.meta.image &&
      typeof values.post.meta.image === 'object' &&
      'url' in values.post.meta.image
    ) {
      return {
        imgpath: values.post.meta.image.url,
        alt: values.post.meta.image.alt || '',
      }
    }

    return { imgpath: undefined, alt: undefined }
  }

  return (
    <div>
      <div ref={divRef}>
        <div className="relative" onClick={handleProfile}>
          <LucideShoppingCart className="w-6 h-6" />
          <div className="text-brands-100 absolute -top-3 -right-3 w-5 h-5 rounded-full text-sm flex items-center justify-center shadow-md bg-brands-900/80">
            {cart?.items?.length}
          </div>
        </div>

        <AnimatePresence>
          {totalPrice > 0 && isCartOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}
              onClick={(e) => e.stopPropagation()}
              className="fixed top-14 right-1 md:top-20 md:right-0 w-[80vw] sm:w-64 md:w-80 lg:w-96 xl:w-[28rem] 2xl:w-[30rem] overflow-y-auto z-20 bg-brands-500 border-t  shadow-lg flex flex-col gap-6 p-4 rounded-l-xl"
            >
              <div className="pointer-events-none absolute bottom-6 md:bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-brands-500  to-brands-50" />
              <div>
                <h2 className="text-xl font-bold pb-3 ">Shopping Cart</h2>

                <div className="flex flex-col gap-4 max-h-[calc(100vh-21.5rem)] overflow-y-auto scrollbar-hide p-1">
                  {cart?.items?.map((values, index) => {
                    const { imgpath, alt } = extractImageInfo(values)
                    const cleanUrl = imgpath?.split('?')[0]
                    const fileName = cleanUrl?.split('/').pop()
                    return (
                      <div key={index} className="border-b-2 border-indigo-100 z-20">
                        <div className="flex flex-col gap-8 w-full">
                          <div className="flex gap-4">
                            <div className="w-[100px] h-full relative overflow-hidden rounded-xl ring-2 ring-purple-200">
                              <Image
                                src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_FULL_URL}/${fileName}`}
                                alt={alt ? alt : `cart image ${index}`}
                                width={100}
                                height={100}
                                className="object-contain"
                              />
                            </div>

                            <div className="flex flex-col justify-between w-full">
                              <div className="">
                                <div className="flex items-center justify-between gap-8">
                                  {typeof values.post === 'object' &&
                                    values.post !== null &&
                                    'title' in values.post && (
                                      <h3 className="font-semibold">{values.post.title}</h3>
                                    )}

                                  <div className="p-1 rounded-lg ring-1 ring-brands-900 font-bold">
                                    €{values.price}
                                  </div>
                                </div>

                                <div className="text-sm font-medium">available</div>
                              </div>

                              <div className="flex justify-between text-sm">
                                <span className="font-medium  dark:text-slate-300">
                                  Qty. {values.quantity}
                                </span>
                                <span
                                  onClick={() => values?.id && handleDeleteCart(values.id)}
                                  className="p-1 rounded-lg ring-1 ring-brands-900 font-bold hover:bg-gradient-to-r from-brands-400 to-brands-700 hover:text-white transition-colors cursor-pointer"
                                >
                                  Remove
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="w-full text-sm mt-2 mb-4">
                            {typeof values.post === 'object' &&
                              values.post !== null &&
                              'meta' in values.post &&
                              // @ts-ignore
                              values.post.meta?.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between font-semibold">
                  <span className="z-40">Subtotal</span>
                  <span className="z-40 text-lg p-1 rounded-lg ring-1 ring-brands-900 font-bold">
                    €{totalPrice}
                  </span>
                </div>

                <div className="flex justify-between text-sm py-3">
                  <Link href="/checkout-cart" className="z-50">
                    <button
                      onClick={() => {
                        setIsCartOpen(false)
                        dispatch(viewCartOnlyNoPaymentForm())
                      }}
                      className="rounded-md py-3 ring-1 px-4 ring-brands-300 bg-white text-brands-700 hover:bg-brands-50 font-medium transition-colors"
                    >
                      View Cart
                    </button>
                  </Link>
                  <Link href="/checkout-cart" className="z-50">
                    <button
                      onClick={() => {
                        setIsCartOpen(false)
                        dispatch(resetViewCartOnlyNoPaymentForm())
                      }}
                      className="rounded-md py-3 px-6 ring-brands-300 bg-gradient-to-r from-brands-600 to-brands-700 text-white font-bold hover:from-brands-800 hover:to-brands-900 transition-colors shadow-lg"
                    >
                      Checkout
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CartModel
