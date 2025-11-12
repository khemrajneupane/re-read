'use client'

import { useRouter } from 'next/navigation'
import type { Customer } from '@/payload-types'
import React, { ReactElement, useState } from 'react'
import { Input } from '@/components/CustomerForm/Input'
import { update, UpdateResponse } from '../actions/update'
import SubmitButton from '@/components/CustomerForm/SubmitButton'
import { FormContainer } from '@/components/CustomerForm/FormContainer'

export default function UpdateForm({
  user,
  tiers,
}: {
  user: Customer
  tiers: Customer['tier'][]
}): ReactElement {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    const email = formData.get('email') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const options = formData.get('tier') as Customer['tier']

    const result: UpdateResponse = await update({ email, lastName, firstName, options })

    setIsLoading(false)

    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'An error occurred.')
    }
  }

  return (
    <FormContainer heading={'Your Account'}>
      <div className={`flex gap-8 min-h-full flex-col justify-center items-center`}>
        <div>
          <form className={`flex flex-col gap-4`} onSubmit={handleSubmit}>
            <div className={`flex flex-row flex-1/2 gap-2`}>
              <Input
                label={'First Name'}
                name={'firstName'}
                type={'text'}
                defaultValue={user.firstName || ``}
              />
              <Input
                label={'Last Name'}
                name={'lastName'}
                type={'text'}
                defaultValue={user.lastName || ``}
              />
            </div>
            <Input label={'Email'} name={'email'} type={'email'} defaultValue={user.email} />
            <fieldset className="flex flex-wrap gap-4 justify-around items-center my-8">
              <legend className="text-emerald-950/80">Your tier:</legend>
              {tiers.map((tier, index) => (
                <div key={index} className="text-emerald-950/80">
                  <input
                    id={tier!}
                    name="tier"
                    type="radio"
                    value={tier!}
                    defaultChecked={tier === user.tier}
                  />
                  <label className="ms-2" htmlFor={tier!}>
                    {tier}
                  </label>
                </div>
              ))}
            </fieldset>

            {error && <div className={`text-red-400`}>{error}</div>}
            <SubmitButton loading={isLoading} text={`Update account`} />
          </form>
        </div>
      </div>
    </FormContainer>
  )
}
