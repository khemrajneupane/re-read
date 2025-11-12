import React from 'react'

export const FormContainer = ({
  children,
  heading,
}: {
  children: React.ReactNode
  heading: string
}) => {
  return (
    <div className="w-full max-w-md bg-brands-100 rounded-2xl shadow-lg overflow-hidden h-auto pt-20">
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-500 underline underline-offset-8 decoration-4 decoration-brands-500">
          {heading}
        </h1>
      </div>
      <div className="p-8 space-y-6">{children}</div>
    </div>
  )
}
