import React from 'react'
import ForgotForm from './components/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <div
      className={`w-full mx-auto sm:max-w-sm flex flex-col items-center justify-center h-auto m-auto pt-28`}
    >
      <div className={`flex justify-center`}>
        <ForgotForm />
      </div>
    </div>
  )
}
