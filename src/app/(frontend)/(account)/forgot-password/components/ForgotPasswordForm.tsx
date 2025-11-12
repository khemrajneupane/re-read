'use client'

import React, { ReactElement, useState } from 'react'
import { useRouter } from 'next/navigation'
import SubmitButton from '@/components/CustomerForm/SubmitButton'
import { Input } from '@/components/CustomerForm/Input'
import { ForgotPassword, ForgotPasswordResponse } from '../actions/forgotPassword'
import { FormContainer } from '@/components/CustomerForm/FormContainer'
import { toast } from 'sonner'
import { CheckCircle, LucideBan } from 'lucide-react'

export default function ForgotForm(): ReactElement {
  const [isLoading, setIsLoading] = useState(false)
  //const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setIsLoading(true)
    //setError(null)

    const formData = new FormData(event.currentTarget)

    const email = formData.get('email') as string

    setIsLoading(false)

    const result: ForgotPasswordResponse = await ForgotPassword({ email })

    if (result.success) {
      toast.success('An email has been sent to you with instructions to reset your password!', {
        icon: <CheckCircle />,
        position: 'top-right',
        closeButton: true,
        richColors: true,
      })
      router.push(
        `/login?message=${encodeURIComponent('Instructions to reset your password have been emailed to you.')}`,
      )
    } else {
      toast.error(result.error, {
        icon: <LucideBan className="text-red-600 w-5 h-5" />,
        position: 'top-right',
        closeButton: true,
        richColors: true,
      })
      //setError(result.error || 'An error occurred.')
    }
  }

  return (
    <FormContainer heading={'Forgot Password?'}>
      {/* <div className={`w-full mx-auto sm:max-w-sm`}> */}
      <form className={`flex flex-col gap-4`} onSubmit={handleSubmit}>
        <Input label={'Email'} name={'email'} type={'email'} />
        {/*error && <div className={`text-red-400`}>{error}</div>*/}
        <SubmitButton loading={isLoading} text={`Reset password`} />
      </form>
      {/* </div> */}
    </FormContainer>
  )
}
