'use client'

import { logout } from '../actions/logout'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useHeaderTheme } from '@/providers/HeaderTheme'

export const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  async function handleLogout() {
    setIsLoading(true)
    setError(null)

    const result = await logout()

    setIsLoading(false)

    if (result.success) {
      router.push('/login')
    } else {
      setError(result.error || 'Logout failed')
    }
  }

  return (
    <>
      {error && <p className="text-red-400">{error}</p>}
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={'cursor-pointer rounded-lg  text-sm'}
      >
        {isLoading ? (
          'Logging out...'
        ) : (
          <div
            className="flex items-center px-4  hover:text-brands-50"
            {...(theme ? { 'data-theme': theme } : {})}
          >
            <p>Logout</p>
          </div>
        )}
      </button>
    </>
  )
}
