interface CartItem {
  title: string
  discountedPrice: number
}

const CART_KEY = 'cart'

// Load cart returns an array of CartItems
export const loadCart = (): CartItem[] => {
  try {
    const cart = localStorage.getItem(CART_KEY)
    return cart ? JSON.parse(cart) : []
  } catch {
    return []
  }
}

export const saveCart = (cart: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export const addToCart = (cartitem: CartItem) => {
  const cart = loadCart()

  // Convert Post to CartItem format
  const cartItem: CartItem = {
    title: cartitem.title,
    discountedPrice: cartitem.discountedPrice || 0, // Fallback if discountedPrice is missing
  }

  if (!cart.some((item) => item?.title === cartitem.title)) {
    cart.push(cartItem)
    saveCart(cart)
  }
}

export const clearCart = () => {
  localStorage.removeItem(CART_KEY)
}
