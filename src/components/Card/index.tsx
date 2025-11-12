'use client'

import {
  LucideBan,
  LucideCheckCircle,
  LucideShoppingCart,
  LucideXCircle,
  PlusCircleIcon,
  Tag,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { motion } from 'framer-motion'
import { Media } from '@/components/Media'
import { useCartStore } from '@/lib/useCartStore'
import { RootState } from '@/app/(frontend)/store'
import * as Tooltip from '@radix-ui/react-tooltip'
import type { Customer, Post } from '@/payload-types'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '@/app/(frontend)/actions/getUser'
import useClickableCard from '@/utilities/useClickableCard'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline'
import { resetCartClicked, setCartClicked } from '@/app/(frontend)/store/slices/cartClickSlice'

export type CardPostData = Pick<
  Post,
  | 'slug'
  | 'categories'
  | 'meta'
  | 'title'
  | 'bookauthor'
  | 'id'
  | 'price'
  | 'originalPrice'
  | 'relatedPosts'
  | 'stock'
>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
  bookauthor: string
  relatedPosts?: (string | Post)[] | null
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title, bookauthor, price, originalPrice, id } = doc || {}
  const { description, image: metaImage } = meta || {}
  const { addItem, hasItem, fetchCart, cart } = useCartStore()
  const clicked = useSelector((state: RootState) => state.cartClick.clicked)
  const [alreadyAdded, setAlreadyAdded] = useState(false)
  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = `/${relationTo}/${slug}`

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }
  const [loggedInUserEmail, setLoggedInUserEmail] = useState<string | undefined>()

  useEffect(() => {
    const getLoggedUser = async () => {
      const user = (await getUser()) as Customer
      if (user) {
        setLoggedInUserEmail(user.email)
      }
    }
    getLoggedUser()
  }, [])
  function useStopPropagation() {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const stop = (e: MouseEvent) => e.stopPropagation()

      const button = buttonRef.current
      const div = divRef.current

      if (button) {
        button.addEventListener('mousedown', stop)
        button.addEventListener('mouseup', stop)
      }

      if (div) {
        div.addEventListener('mousedown', stop)
        div.addEventListener('mouseup', stop)
      }

      // Cleanup
      return () => {
        if (button) {
          button.removeEventListener('mousedown', stop)
          button.removeEventListener('mouseup', stop)
        }
        if (div) {
          div.removeEventListener('mousedown', stop)
          div.removeEventListener('mouseup', stop)
        }
      }
    }, [])

    return { buttonRef, divRef }
  }
  const { buttonRef, divRef } = useStopPropagation()
  const dispatch = useDispatch()

  useEffect(() => {
    const checkCart = async () => {
      if (!cart) {
        await fetchCart()
      }
      if (id) {
        if (hasItem(id)) {
          setAlreadyAdded(true)
        } else {
          setAlreadyAdded(false)
        }
      }
    }
    checkCart()
  }, [clicked, id])

  const handleAddToCart = async (bookId: string) => {
    dispatch(setCartClicked())
    const error = await addItem(bookId)

    if (error) {
      if (error === 'OUT_OF_STOCK') {
        toast.info('Item is out of stock!', {
          icon: <LucideXCircle className="text-brands-600 w-5 h-5" />,
        })
      } else if (error === 'ALREADY_IN_CART') {
        alert('Item already in cart!')
      } else if (error === 'USER_NOT_LOGGED_IN') {
        toast.warning('Please login!', {
          icon: <LucideBan className="text-brands-600 w-5 h-5" />,
        })
      }
    }

    setTimeout(() => {
      dispatch(resetCartClicked())
    }, 1000)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (alreadyAdded) {
      toast.warning(<div className="text-brands-700">This item is already in your cart.</div>, {
        icon: <LucideCheckCircle className="text-brands-700 w-5 h-5" />,
      })
    } else if (id) {
      handleAddToCart(id)
    }
  }

  const LOCAL_KEY = 'favorites'

  const [isFavorited, setIsFavorited] = useState(false)

  const toggleFavorite = () => {
    try {
      if (!id || !loggedInUserEmail) {
        toast.warning(<div className="text-brands-700">Please login first.</div>, {
          icon: <LucideBan className="text-brands-700 w-5 h-5" />,
        })
        return
      }

      const stored = localStorage.getItem(LOCAL_KEY)
      const favorites: Record<string, string[]> = stored ? JSON.parse(stored) : {}

      const userFavorites = favorites[loggedInUserEmail] || []

      let updatedFavorites
      if (userFavorites.includes(id)) {
        updatedFavorites = {
          ...favorites,
          [loggedInUserEmail]: userFavorites.filter((itemId) => itemId !== id),
        }
        setIsFavorited(false)
      } else {
        updatedFavorites = {
          ...favorites,
          [loggedInUserEmail]: [...userFavorites, id],
        }
        setIsFavorited(true)
      }

      localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedFavorites))
    } catch (err) {
      console.error('Error updating favorites in localStorage', err)
    }
  }

  useEffect(() => {
    try {
      if (!id || !loggedInUserEmail) return

      const stored = localStorage.getItem(LOCAL_KEY)
      if (stored) {
        const favorites: Record<string, string[]> = JSON.parse(stored)
        const userFavorites = favorites[loggedInUserEmail] || []
        setIsFavorited(userFavorites.includes(id))
      }
    } catch (err) {
      console.error('Error reading favorites from localStorage', err)
    }
  }, [id, loggedInUserEmail])

  return (
    <motion.div
      className="group relative flex flex-col h-full hover:cursor-pointer ring-1 ring-brands-900 dark:ring-brands-200 rounded-xl bg-gradient-to-t from-brands-400/80 shadow-lg backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <article className={cn('p-2 flex flex-col z-50 h-full', className)} ref={card.ref}>
        <div className="group relative flex items-center justify-center overflow-hidden h-full">
          {!metaImage && <div className="">No image</div>}
          {metaImage && typeof metaImage !== 'string' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 2 }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              className="flex  w-full overflow-hidden rounded-xl"
            >
              <Link href={href} ref={link.ref} className=" flex h-full w-full">
                <Media resource={metaImage} className="w-full h-full object-cover " />
              </Link>
            </motion.div>
          )}
          {
            <div className="z-40 py-1 text-sm text-brands-50 dark:text-white text-bolder absolute inset-0 flex items-end justify-between gap-1 ">
              <div
                className={`p-1 font-extralight line-through bg-brands-500/50 dark:bg-brands-300/50 rounded-2xl `}
              >{`${originalPrice}€`}</div>
              <div
                className={`p-1 bg-brands-600/50  dark:bg-brands-400/50 rounded-2xl `}
              >{`${price}€`}</div>
            </div>
          }
        </div>
        <div className="flex flex-col pt-1 w-full">
          {showCategories && hasCategories && (
            <div className="py-1 px-1  text-xs ring-1 ring-brands-200">
              {categories?.map((category, index) => {
                if (typeof category === 'object') {
                  const { title: titleFromCategory } = category
                  const categoryTitle = titleFromCategory || 'Untitled category'
                  return (
                    <Fragment key={index}>
                      <div className="flex gap-1 flex-wrap justify-between">
                        <div className="uppercase flex gap-1 justify-start items-start">
                          <Tag className="w-6 h-6 text-brands-50 dark:text-brands-100/50" />{' '}
                          <h1> {`${categoryTitle}:`}</h1>
                        </div>

                        <span className="flex flex-wrap text-brands-700 dark:text-white">{`${titleToUse}`}</span>
                      </div>
                    </Fragment>
                  )
                }
                return null
              })}
            </div>
          )}
          <div>
            {description && (
              <div className="mt-2 text-xs md:hidden max-h-min items-end ring-1 ring-brands-200">
                {description && (
                  <p
                    className="px-1 py-2
                    [text-shadow:_1px_1px_1px_theme(colors.black/50)] 
                    font-thin text-sm"
                  >
                    {truncateText(sanitizedDescription || '', 500)}
                  </p>
                )}
              </div>
            )}
            {description && (
              <div className="text-xs absolute hidden md:group-hover:flex top-0 left-0 ">
                {description && (
                  <p className="backdrop-blur-lg text-white dark:text-white px-3 py-3 rounded-xl [text-shadow:_1px_1px_2px_theme(colors.black/80),_0px_0px_4px_theme(colors.brands.900/40)] ">
                    {sanitizedDescription || ''}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
      {titleToUse && (
        <div className="flex px-1 py-1 ml-2 mr-2 md:flex-row  justify-between items-center ring-1 ring-brands-200">
          <Link href={href} ref={link.ref} className="uppercase text-xs w-full">
            {`${bookauthor && bookauthor}`}
          </Link>

          <Tooltip.Provider>
            <div className=" text-slate-500 text-sm">
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="flex"
                    ref={buttonRef}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleFavorite()
                    }}
                  >
                    {isFavorited ? (
                      <HeartSolid className="w-6 h-6 text-red-900" />
                    ) : (
                      <HeartOutline className="w-6 h-6 text-brands-50 dark:text-brands-100/50 hover:text-brands-900" />
                    )}
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    sideOffset={5}
                    className="p-2 rounded  text-xs bg-black text-white dark:bg-white dark:text-black shadow-md z-50"
                  >
                    {isFavorited ? 'Added as favourite' : 'Add to fabourite'}
                    <Tooltip.Arrow className="dark:fill-white" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </div>
          </Tooltip.Provider>
        </div>
      )}
      <Tooltip.Provider>
        <div
          ref={divRef}
          className="flex px-2 py-2 flex-wrap md:flex-row justify-between items-center"
        >
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                ref={buttonRef}
                onClick={handleClick}
                className={`flex justify-center items-center whitespace-nowrap px-2 py-1 rounded-lg ring-1 ring-brands-200 font-medium shadow-lg
            ${alreadyAdded ? 'bg-brands-100/50' : 'bg-brands-500/50 hover:bg-brands-700/50'} text-sm`}
              >
                {alreadyAdded ? (
                  <LucideCheckCircle className="w-5 h-5" />
                ) : (
                  <LucideShoppingCart className="w-5 h-5" />
                )}
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                sideOffset={5}
                className="p-2 rounded  text-xs bg-black text-white dark:bg-white dark:text-black shadow-md z-50"
              >
                {alreadyAdded ? 'You have already added' : 'Add to cart'}
                <Tooltip.Arrow className="dark:fill-white" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                ref={buttonRef}
                onClick={handleClick}
                className={`flex justify-center items-center px-2 py-1 rounded-lg ring-1 ring-brands-200 font-medium shadow-lg
            ${alreadyAdded ? 'bg-brands-100/50' : 'bg-brands-500/50 hover:bg-brands-700/50'} text-sm`}
              >
                {alreadyAdded && 'Added'}
                {!alreadyAdded && <PlusCircleIcon className="w-5 h-5" />}
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                sideOffset={5}
                className="p-2 rounded text-xs bg-black text-white dark:bg-white dark:text-black shadow-md z-50"
              >
                {alreadyAdded ? 'You have already added' : 'Add to cart'}
                <Tooltip.Arrow className="dark:fill-white" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>
      </Tooltip.Provider>
    </motion.div>
  )
}
