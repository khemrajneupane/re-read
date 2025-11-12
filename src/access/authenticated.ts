import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  //return Boolean(user?.role?.includes('admin')) //restrice access to admin users only.
  return Boolean(user)
}
