// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config: configPromise })

  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    // Prevent duplicate subscriptions
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
    })

    if (existing.totalDocs > 0) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 })
    }

    await payload.create({
      collection: 'subscribers',
      data: { email },
    })

    return NextResponse.json({ message: 'Subscribed successfully' })
  } catch (err) {
    console.error('Subscription error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
