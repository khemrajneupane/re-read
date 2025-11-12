'use client'

import React, { ReactElement, useState } from 'react'
import { useRouter } from 'next/navigation'
import SubmitButton from '@/components/CustomerForm/SubmitButton'
import { Input } from '@/components/CustomerForm/Input'
import { login, LoginResponse } from '../../login/actions/login'
import Link from 'next/link'
import { FormContainer } from '@/components/CustomerForm/FormContainer'
import { toast } from 'sonner'
import { LucideBan, ArrowRight } from 'lucide-react'

export default function LoginForm(): ReactElement {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result: LoginResponse = await login({ email, password })

    setIsLoading(false)

    if (result.success) {
      router.push('/')
    } else {
      toast.error(result.error, {
        icon: <LucideBan className="text-red-600 w-5 h-5" />,
        position: 'top-right',
        closeButton: true,
        richColors: true,
      })
    }
  }

  return (
    <FormContainer heading="Welcome Back">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input label="Email" name="email" type="email" />
          <Input label="Password" name="password" type="password" />
        </div>

        <SubmitButton loading={isLoading} text="Continue" />

        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-emerald-950/70 hover:text-emerald-950 transition-colors flex items-center justify-center gap-1"
          >
            Forgot your password?
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-emerald-950/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-emerald-950/50">Don&apos;t have an account?</span>
          </div>
        </div>

        <Link
          href="/create-account"
          className="py-3 ring-1 px-4 ring-brands-300 bg-brands-300 text-brands-700 hover:bg-brands-500 hover:text-white font-medium transition-colors p-2 w-full rounded-md flex items-center gap-4 justify-center"
        >
          Create new account
        </Link>
      </form>
    </FormContainer>
  )
}
