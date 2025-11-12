import { configureStore } from '@reduxjs/toolkit'
import cartClickReducer from './slices/cartClickSlice'

export const store = configureStore({
  reducer: {
    cartClick: cartClickReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
