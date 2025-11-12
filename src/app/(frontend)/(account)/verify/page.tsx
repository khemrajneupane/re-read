import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'

export default async function VerifyPage(props: any) {
  const { searchParams } = props
  const token = searchParams?.token as string | undefined
  const payload = await getPayload({ config })

  if (!token) {
    redirect(`/login?message=${encodeURIComponent('No verification token found')}`)
  }

  const result = await payload.verifyEmail({
    collection: 'customers',
    token,
  })

  if (result) {
    redirect(`/login?message=${encodeURIComponent('Successfully verified')}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full h-[calc(100vh)] w-full mx-auto sm:max-w-sm">
      <h1>There was a problem</h1>
      <p>Please contact an administrator.</p>
    </div>
  )
}
