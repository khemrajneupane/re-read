'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { useCartStore } from '@/lib/useCartStore'
import * as Tooltip from '@radix-ui/react-tooltip'
import { RootState } from '@/app/(frontend)/store'
import { useDispatch, useSelector } from 'react-redux'
import { LucideBan, LucideXCircle } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { resetCartClicked, setCartClicked } from '@/app/(frontend)/store/slices/cartClickSlice'

interface CartItem {
  title: string
  discountedPrice: number
  stock: number
  bookId: string
}

const Add = ({ stock, bookId }: CartItem) => {
  const [quantity, setQuantity] = useState(0)
  const [alreadyAdded, setAlreadyAdded] = useState(false)
  const [toggle, setToggle] = useState(false)
  const clicked = useSelector((state: RootState) => state.cartClick.clicked)
  const { hasItem, addItem, fetchCart, cart } = useCartStore()
  const dispatch = useDispatch()

  function useStopPropagation() {
    const ref = useRef<HTMLButtonElement>(null)
    useEffect(() => {
      fetchCart()
    }, [clicked])

    useEffect(() => {
      const button = ref.current
      if (!button) return

      const stop = (e: MouseEvent) => e.stopPropagation()
      button.addEventListener('mousedown', stop)
      button.addEventListener('mouseup', stop)

      return () => {
        button.removeEventListener('mousedown', stop)
        button.removeEventListener('mouseup', stop)
      }
    }, [])

    return ref
  }

  useEffect(() => {
    const checkCart = async () => {
      if (!cart) {
        await fetchCart()
      }
      if (hasItem(bookId)) {
        setAlreadyAdded(true)
      } else {
        setAlreadyAdded(false)
      }
    }
    checkCart()
  }, [bookId, toggle, clicked])

  const handleAddToCart = async (bookId: string) => {
    dispatch(setCartClicked())
    const error = await addItem(bookId)

    if (error) {
      if (error === 'OUT_OF_STOCK') {
        toast.info('Item is out of stock!', {
          icon: <LucideXCircle className="text-brands-500 w-5 h-5" />,
        })
      } else if (error === 'ALREADY_IN_CART') {
        toast.info('It is already in cart, please refresh page!', {
          icon: <LucideXCircle className="text-brands-500 w-5 h-5" />,
        })
      } else if (error === 'USER_NOT_LOGGED_IN') {
        toast.warning('Please login!', {
          icon: <LucideBan className="text-brands-500 w-5 h-5" />,
        })
      }
    }

    setTimeout(() => {
      dispatch(resetCartClicked())
    }, 100)
  }

  const stopPropRef = useStopPropagation()

  const handleQuantity = (type: 'i' | 'd') => {
    setQuantity((prev) => {
      if (type === 'd') {
        return prev > 0 ? prev - 1 : 0
      }
      if (type === 'i') {
        return prev < stock ? prev + 1 : stock
      }
      return prev
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div className="py-2 px-4 rounded-xl flex items-center justify-between w-32 text-center text-sm ring-1 ring-slate-400 text-slate-900 bg-slate-300 hover:bg-slate-400 hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none">
              <button className="cursor-pointer text-xl" onClick={() => handleQuantity('d')}>
                -
              </button>
              {quantity}
              <button className="cursor-pointer text-xl" onClick={() => handleQuantity('i')}>
                +
              </button>
            </div>
            <div className="text-xs">
              {stock < 1 ? (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              ) : (
                <>
                  Only{' '}
                  <span className="text-orange-500">
                    {stock} {stock > 1 ? 'books' : 'book'}
                  </span>{' '}
                  left! <br /> {"Don't miss it"}
                </>
              )}
            </div>
          </div>

          <div className={`flex justify-between text-sm py-3`}>
            {alreadyAdded && cart ? (
              <Link href="/checkout-cart">
                <button
                  className={`rounded-xl py-3 px-6 ring-brands-300 bg-gradient-to-r from-brands-600 to-brands-700 text-white font-bold hover:from-brands-800 hover:to-brands-900 transition-colors shadow-lg`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setToggle(!toggle)
                    if (stock < 1) return // preventing adding if out of stock
                    if (bookId) handleAddToCart(bookId)
                  }}
                  ref={stopPropRef}
                  disabled={stock < 1}
                >
                  Checkout
                </button>
              </Link>
            ) : (
              <Tooltip.Provider delayDuration={200}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <span className="inline-block">
                      <button
                        className="rounded-xl py-3 px-6 ring-brands-300 bg-gradient-to-r from-brands-600 to-brands-700 text-white font-bold hover:from-brands-800 hover:to-brands-900 transition-colors shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          setToggle(!toggle)
                          if (stock < 1) return
                          if (bookId) handleAddToCart(bookId)
                        }}
                        ref={stopPropRef}
                        disabled={stock < 1}
                      >
                        Add To Cart
                      </button>
                    </span>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      sideOffset={5}
                      className="p-2 rounded text-xs bg-black text-white dark:bg-white dark:text-black shadow-md z-50"
                    >
                      {stock < 1 ? 'Out of Stock!!' : 'Add to Cart'}
                      <Tooltip.Arrow className="fill-black dark:fill-white" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Add
