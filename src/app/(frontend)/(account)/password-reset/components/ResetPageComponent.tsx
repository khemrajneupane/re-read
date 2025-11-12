'use client'
import React from 'react'
import { redirect, useSearchParams } from 'next/navigation'
import ResetForm from './resetPasswordForm'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'

export default function ResetPageComponent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const token = searchParams.get('token')
  if (!token) {
    redirect(`/login?message=${encodeURIComponent('No reset token found')}`)
  } else {
    toast.success('An email has been sent to you with instructions to reset your password!!', {
      icon: <CheckCircle />,
      position: 'top-right',
      closeButton: true,
      richColors: true,
    })
  }

  return (
    <div className={`h-[100vh] w-full mx-auto sm:max-w-sm`}>
      <div className={`flex justify-center mt-8`}>
        {message && (
          <p
            className={`w-auto inline-block mx-auto bg-emerald-100 p-4  text-emerald-950 border-emerald-950 border rounded-md`}
          >
            {message}
          </p>
        )}
      </div>
      <ResetForm token={token} />
    </div>
  )
}
