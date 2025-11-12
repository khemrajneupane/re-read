'use client'

import { useState } from 'react'
import { Customer } from '@/payload-types'
import { UploadBooksForm } from './uploadBooksForm'

export function HamburgerMenu({
  categories,
}: {
  user: Customer
  categories: { id: string; title: string }[]
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  return (
    <div className="fixed right-0 top-26">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="p-4 focus:outline-none z-30"
      >
        <div className="w-6 flex flex-col gap-1">
          <span
            className={`h-0.5 w-full bg-brands-600 transition-all ${isDrawerOpen ? 'rotate-45 translate-y-1.5' : ''}`}
          ></span>
          <span
            className={`h-0.5 w-full bg-brands-600 transition-all ${isDrawerOpen ? 'opacity-0' : 'opacity-100'}`}
          ></span>
          <span
            className={`h-0.5 w-full bg-brands-600 transition-all ${isDrawerOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
          ></span>
        </div>
      </button>

      {/* Drawer */}
      <div
        className={`fixed right-0 top-44 bg-white dark:bg-brands-200 shadow-lg transition-all duration-300 ease-in-out transform z-20 ${
          isDrawerOpen ? 'translate-x-0 w-64' : 'translate-x-full w-0'
        }`}
      >
        <div className="p-4 space-y-4">
          <button
            onClick={() => setShowUploadForm(true)}
            className="w-full px-4 py-2 bg-brands-200 dark:bg-brands-700 rounded hover:bg-brands-300 dark:hover:bg-brands-600 transition-colors"
          >
            Upload Books
          </button>
          {/* Add more buttons here as needed */}
          <button className="w-full px-4 py-2 bg-brands-200 dark:bg-brands-700 rounded hover:bg-brands-300 dark:hover:bg-brands-600 transition-colors">
            Future Action
          </button>
        </div>
      </div>

      {/* Full-page Upload Form Overlay */}
      {showUploadForm && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-brands-900 bg-opacity-90"></div>

          {/* Form Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <UploadBooksForm onClose={() => setShowUploadForm(false)} categories={categories} />
          </div>
        </div>
      )}
    </div>
  )
}
