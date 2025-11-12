'use client'

import { toast } from 'sonner'
import { LucideBan } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { FormEvent, useState } from 'react'
import { setCartClicked } from '../../store/slices/cartClickSlice'
import { cartCreateOrder } from '../../cart/actions/cartCreateOrder'
import { AddressElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

interface CartPaymentFormProps {
  onShippingDetailsChange: (details: {
    name: string
    phone: string
    address: {
      line1: string
      postal_code: string
      city: string
      country: string
    }
  }) => void
}
export default function CartPaymentForm({ onShippingDetailsChange }: CartPaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState<boolean>()
  const dispatch = useDispatch()
  const [isComplete, setIsComplete] = useState(false)
  const handleAddressChange = (event: any) => {
    if (event.complete) {
      setIsComplete(true)
      const { name, phone, address } = event.value
      onShippingDetailsChange({
        name,
        phone,
        address: {
          line1: address.line1,
          postal_code: address.postal_code,
          city: address.city,
          country: address.country,
        },
      })
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    if (isComplete) {
      e.preventDefault()
      if (!stripe || !elements) return

      setIsProcessing(true)
      await cartCreateOrder()
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/purchase-success`, // Required for Klarna
        },
      })

      if (error) {
        toast.error(error.message || 'Something went wrong', {
          icon: <LucideBan className="text-brands-500 w-5 h-5" />,
        })
        setIsProcessing(false)
        return
      }
      if (paymentIntent?.status === 'succeeded') {
        dispatch(setCartClicked())
        setTimeout(() => {
          setIsProcessing(true)
        }, 3000)
      }
      setIsProcessing(false)
    } else return
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <h2 className="text-lg font-semibold dark:text-black">Shipping Information</h2>
      <AddressElement
        options={{
          mode: 'shipping',
          allowedCountries: ['FI', 'SE', 'NO', 'DK'],
          defaultValues: {
            name: '',
            phone: '',
            address: {
              line1: '',
              postal_code: '',
              city: '',
              country: 'FI',
            },
          },
        }}
        onChange={handleAddressChange}
      />
      <h2 className="text-lg font-semibold dark:text-black">Payment Method</h2>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}
