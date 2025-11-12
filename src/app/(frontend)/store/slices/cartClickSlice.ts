import { createSlice } from '@reduxjs/toolkit'

type CartClickState = {
  clicked: boolean
  isCartNull: boolean
  viewCartOnly: boolean
}

const initialState: CartClickState = {
  clicked: false,
  isCartNull: false,
  viewCartOnly: false,
}

const cartClickSlice = createSlice({
  name: 'cartClick',
  initialState,
  reducers: {
    setCartClicked: (state) => {
      state.clicked = true
    },
    resetCartClicked: (state) => {
      state.clicked = false
    },
    cartIsNull: (state) => {
      state.isCartNull = true
    },
    resetCartIsNull: (state) => {
      state.isCartNull = false
    },
    viewCartOnlyNoPaymentForm: (state) => {
      state.viewCartOnly = true
    },
    resetViewCartOnlyNoPaymentForm: (state) => {
      state.viewCartOnly = false
    },
  },
})

export const {
  setCartClicked,
  resetCartClicked,
  cartIsNull,
  resetCartIsNull,
  viewCartOnlyNoPaymentForm,
  resetViewCartOnlyNoPaymentForm,
} = cartClickSlice.actions
export default cartClickSlice.reducer
