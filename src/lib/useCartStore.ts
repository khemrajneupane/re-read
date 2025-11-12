import { create } from 'zustand'
import { Cart } from '@/payload-types'

type CartState = {
  cart: Cart | null
  loading: boolean
  error: string | undefined | null
  //addItem: (postId: string) => Promise<void>
  addItem: (postId: string) => Promise<string | null> // changed from void to string | null

  fetchCart: () => Promise<void>
  /*addItem: (item: {
    postId: string
    quantity: number
    price: number
    title?: string
  }) => Promise<void>*/

  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>
  deleteItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  hasItem: (postId: string) => boolean // ✅ new function
  setCart: (cart: Cart | null) => void // ✅ newly added
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  loading: false,
  error: null,
  setCart: (cart) => set({ cart }),
  // ✅ Check if item exists by postId
  hasItem: (postId: string) => {
    const { cart } = get()
    if (!cart?.items) return false

    return cart.items.some((item) => {
      if (typeof item.post === 'string') {
        return item.post === postId
      } else if (item.post && typeof item.post === 'object') {
        return item.post.id === postId
      }
      return false
    })
  },
  // Fetch cart
  fetchCart: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/cart')
      if (!res.ok) throw new Error('Failed to fetch cart')
      const data = await res.json()
      set({ cart: data })
    } catch (error) {
      console.error('Fetch cart error:', error)
      set({ error: (error as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  // Add item to cart
  addItem: async (postId: string) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })

      const data = await res.json()

      if (data.error === 'USER_NOT_LOGGED_IN') {
        //window.location.href = '/login' // redirect from client
        return 'USER_NOT_LOGGED_IN'
      }

      if (!res.ok) {
        console.warn('API returned error in addItem:', data.error)
        set({ error: data.error || 'Failed to add item' })
        return data.error || 'Failed to add item'
      }

      set({ cart: data, error: null })
      return null // indicates success
    } catch (err: any) {
      console.error('addItem unexpected error:', err)
      set({ error: 'Something went wrong while adding to cart' })
      return 'Something went wrong while adding to cart'
    } finally {
      set({ loading: false })
    }
  },
  // Update item quantity
  updateItemQuantity: async (itemId, quantity) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/cart/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity }),
      })
      if (!res.ok) throw new Error('Failed to update item quantity')
      const data = await res.json()
      set({ cart: data })
    } catch (error) {
      console.error('Update item quantity error:', error)
      set({ error: (error as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  // Delete item from cart
  deleteItem: async (itemId) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete cart item')
      const data = await res.json()
      set({ cart: data })
    } catch (error) {
      console.error('Delete item error:', error)
      set({ error: (error as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  // Clear entire cart
  clearCart: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/cart/clear', {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to clear cart')
      const data = await res.json()
      set({ cart: data })
    } catch (error) {
      console.error('Clear cart error:', error)
      set({ error: (error as Error).message })
    } finally {
      set({ loading: false })
    }
  },
}))
