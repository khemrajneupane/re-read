import React from 'react'
import { Loader } from 'lucide-react'

export default function SubmitButton({
  loading,
  text,
}: {
  loading: boolean
  text: string
}): React.ReactElement {
  return (
    <button
      type={'submit'}
      className={`${loading ? 'cursor-not-allowed' : 'cursor-pointer'} py-3 ring-1 px-4 ring-brands-300 bg-brands-300 text-brands-700 hover:bg-brands-500 hover:text-white font-medium transition-colors p-2 w-full rounded-md flex items-center gap-4 justify-center`}
      disabled={loading}
    >
      {text} <Loader className={`animate-spin ${loading ? 'inline-block' : 'hidden'}`} />
    </button>
  )
}
