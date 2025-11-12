'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

interface ForgotPasswordParams {
  email: string
}

export interface ForgotPasswordResponse {
  success: boolean
  error?: string
}

export async function resetPassword({
  email,
}: ForgotPasswordParams): Promise<ForgotPasswordResponse> {
  //const payload = await getPayload({ config })
  const payload = await getPayload({ config: configPromise })

  try {
    await payload.forgotPassword({
      collection: 'customers',
      data: {
        email,
      },
    })
  } catch (e) {
    return { success: false, error: `An error occurred: ${e}` }
  }
  return { success: true }
}
