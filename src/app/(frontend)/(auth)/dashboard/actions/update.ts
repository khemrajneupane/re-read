'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getUser } from '../../actions/getUser'
import type { Customer, TierProps } from '@/payload-types'

interface UpdateParams {
  email: string
  firstName: string
  lastName?: string
  options: TierProps | undefined
}

export interface UpdateResponse {
  success: boolean
  error?: string
}

export async function update({
  email,
  firstName,
  lastName,
  options,
}: UpdateParams): Promise<UpdateResponse> {
  const payload = await getPayload({ config })
  const user = (await getUser()) as Customer

  try {
    await payload.update({
      collection: 'customers',
      id: user.id,
      data: {
        email,
        firstName,
        lastName,
        tier: options,
      },
    })
  } catch (e) {
    return { success: false, error: `An error occurred: ${e}` }
  }
  return { success: true }
}
