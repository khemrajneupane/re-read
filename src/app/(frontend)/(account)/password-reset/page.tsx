import React from 'react'
import { getUser } from '../../(auth)/actions/getUser'
import { redirect } from 'next/navigation'
import ResetPageComponent from './components/ResetPageComponent'

export default async function Page() {
  const user = await getUser()
  if (user) {
    redirect('/dashboard')
  }

  return <ResetPageComponent />
}
