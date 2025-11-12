'use client'

import React from 'react'
//import { useSearchParams } from 'next/navigation'
import LoginForm from './LoginForm'

export default function LoginPage() {
  //const searchParams = useSearchParams()
  //const message = searchParams.get('message')

  return (
    <div className="w-full mx-auto sm:max-w-sm">
      <div className="flex justify-center"></div>
      <LoginForm />
    </div>
  )
}
