// app/api/add-books/route.ts
import { addBooks } from '@/app/(frontend)/(auth)/dashboard/actions/addBooks'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Forward the Payload req.user (auth handled by Payload middleware)
    // If using Payload + Next Auth, you might need to map session -> req.user
    const created = await addBooks(body.posts)

    return NextResponse.json({ success: true, created })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
