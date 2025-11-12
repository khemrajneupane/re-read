import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'
import { getUser } from '../actions/getUser'
//import { LogoutButton } from './components/LogoutButton'

const Template: React.FC<{ children: ReactNode }> = async ({ children }) => {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }

  return <>{children}</>
}

export default Template
