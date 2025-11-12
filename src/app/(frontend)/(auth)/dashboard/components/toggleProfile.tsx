'use client'

import React, { useState } from 'react'
import type { Customer } from '@/payload-types'
import { LogoutButton } from '../../components/LogoutButton'
import { ResetPasswordButton } from '../../components/ResetPasswordButton'

const ToggleProfile = (user: Customer) => {
  const [showActions, setShowActions] = useState(false)

  const toggleActions = () => {
    setShowActions((prev) => !prev)
  }

  return (
    <div className="relative mt-4 w-full">
      <button
        onClick={toggleActions}
        className="bg-brands-500 hover:bg-brands-600 hover:text-white  w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
        aria-expanded={showActions}
        aria-controls="profile-actions"
      >
        <span className="text-brands-300 hover:text-brands-50">More Actions</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${showActions ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showActions && (
        <div
          id="profile-actions"
          className="absolute bottom-14 left-0 z-10 w-full mt-2 bg-brands-50  rounded-xl shadow-lg ring-2 ring-brands-500 focus:outline-none overflow-hidden transition-all duration-200"
        >
          <div className="flex flex-col  p-2 space-y-2">
            <div className="w-full text-left px-3 py-2 text-sm bg-brands-500 hover:bg-brands-600 hover:text-white text-gray-500 rounded-md transition-colors">
              <ResetPasswordButton email={user.email} />
            </div>
            <div className="w-full text-left px-3 py-2 text-sm bg-brands-500 hover:bg-brands-600 hover:text-white text-gray-500 rounded-md transition-colors">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ToggleProfile
