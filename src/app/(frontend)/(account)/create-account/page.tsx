import React from 'react'
import { redirect } from 'next/navigation'
import CreateForm from './components/CreateForm'
//import { getMeUser } from '@/utilities/getMeUser'
import { getUser } from '../../actions/getUser'

export default async function Page(): Promise<React.ReactElement> {
  const user = await getUser()
  if (user) {
    redirect('/dashboard')
  }
  return (
    <div className={`flex flex-col items-center justify-center h-auto pt-20`}>
      <CreateForm />
    </div>
  )
}
