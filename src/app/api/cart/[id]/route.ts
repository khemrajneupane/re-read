import { NextRequest, NextResponse } from 'next/server'
import { deleteCartController } from '../controllers/cartControllers'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await context.params
  return deleteCartController(request, { params: { id } })
}
