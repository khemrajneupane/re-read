'use client'

import { toast } from 'sonner'
import React, { useState } from 'react'
import { logout } from '../actions/logout'
import { redirect } from 'next/navigation'
import { CheckCircle, Loader } from 'lucide-react'
import { resetPassword } from '../../(account)/forgot-password/actions/resetPassword'

export const ResetPasswordButton = ({ email }: { email: string }) => {
  const [isClicked, setIsClicked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handleClick = async () => {
    setIsLoading(true)
    await resetPassword({ email: email })
    setIsLoading(false)
    setIsClicked(true)
    await logout()
    toast.success('An email has been sent to you with instructions to reset your password!!', {
      icon: <CheckCircle />,
      position: 'top-right',
      closeButton: true,
      richColors: true,
    })
    redirect(`/login?message=${encodeURIComponent('Password reset request sent to your email.')}`)
  }

  return (
    <div>
      <button
        disabled={isClicked}
        className={`px-4 cursor-pointer rounded-lg  text-sm text-brands-300 hover:text-brands-50`}
        type={'button'}
        onClick={handleClick}
      >
        Reset Password
        <Loader className={`animate-spin ${isLoading ? 'inline-block' : 'hidden'}`} />
      </button>
      {isClicked && (
        <div className={`text-emerald-950/50`}>
          <p>Check your email for more instructions.</p>
        </div>
      )}
    </div>
  )
}
