'use client'

import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/useCartStore'
import { resetCartClicked, setCartClicked } from '../../store/slices/cartClickSlice'

export default function CartItems() {
  const { cart, loading, fetchCart, deleteItem } = useCartStore()
  const router = useRouter()
  const [hydrated, setHydrated] = useState(false)

  const dispatch = useDispatch()
  useEffect(() => {
    setHydrated(true)
    fetchCart()
  }, [fetchCart])

  if (!hydrated || loading) return <h1 className="z-40 text-3xl">Loading</h1>

  if (cart && cart.items?.length === 0) {
    router.push('/cart/empty')
  }

  const totalPrice = cart?.items?.reduce((sum, item) => sum + item.price, 0) ?? 0

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id)
      dispatch(setCartClicked())
      await fetchCart()
    } catch (e) {
      console.error('Delete error', e)
    } finally {
      dispatch(resetCartClicked())
    }
  }

  const extractImageInfo = (values: any) => {
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
    <div className="p-4 bg-brands-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 dark:text-black">Cart Items</h2>
      <div className="space-y-4">
        {cart?.items?.map((item, idx) => {
          const { imgpath, alt } = extractImageInfo(item)
          const cleanUrl = imgpath?.split('?')[0]
          const fileName = cleanUrl?.split('/').pop()
          return (
            <div key={idx} className="flex gap-4 border-b pb-4">
              {imgpath && (
                <div className="w-24 h-24 relative">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_FULL_URL}/${fileName}`}
                    alt={alt || `cart item ${idx}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
              <div className="flex-1">
                {typeof item.post === 'object' && item.post !== null && 'title' in item.post && (
                  <h3 className="font-semibold dark:text-black">{item.post.title}</h3>
                )}
                <p className="w-full text-sm mt-2 mb-4 text-slate-700">
                  {typeof item.post === 'object' &&
                    item.post !== null &&
                    'meta' in item.post &&
                    // @ts-ignore
                    item.post.meta?.description}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className=" p-1 rounded-lg dark:text-red-400 font-bold">€{item.price}</span>
                  <span className="text-sm dark:text-black">Qty: {item.quantity}</span>
                  <button
                    onClick={() => item?.id && handleDelete(item.id)}
                    className="text-black ring-2 px-2 py-1 rounded hover:bg-gradient-to-r from-red-400 to-red-700 hover:text-white transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-6 text-lg font-bold dark:text-black">
        Subtotal: <span className="p-1 rounded-lg dark:text-red-400 font-bold">€{totalPrice}</span>
      </div>
    </div>
  )
}
