'use client'

//import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Search, BookOpen, XCircle } from 'lucide-react'
const SearchBar = () => {
  const router = useRouter()
  const [keyword, setKeyword] = useState<any>('')
  const [isUserTyping, setIsUserTyping] = useState(false)
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    //const formData = new FormData(e.currentTarget)
    //const name = formData.get('name') as string
  }

  useEffect(() => {
    if (isUserTyping) {
      // Only redirect after user interaction
      if (keyword) {
        router.push(`/search?q=${keyword}`)
      } else {
        router.push(`/search`)
      }
    }
  }, [keyword, router, isUserTyping])

  const handleChange = (e: React.InputHTMLAttributes<HTMLInputElement>) => {
    // Can I remove this?
    setIsUserTyping(true)
  }
  return (
    <form
      className="w-full flex items-center gap-3 bg-white dark:bg-brands-100 shadow-inner p-4  dark:border-gray-600 rounded-lg px-2 py-1  transition focus-within:ring-2 focus-within:ring-brands-500"
      onSubmit={handleSearch}
    >
      {/* <BookOpen className="text-brands-500 w-15 h-15" /> */}
      <input
        type="text"
        placeholder="Search books by title, author, contents or ISBN"
        className="flex-1 bg-transparent outline-none placeholder-gray-500 dark:placeholder-gray-500 dark:text-gray-500"
        value={keyword}
        onChange={(e) => {
          handleChange(e)
          setKeyword(e.target.value)
        }}
      />
      <div className=" bg-brands-500 rounded-xl px-6 py-2 flex items-center justify-center">
        {keyword && (
          <button
            type="button"
            onClick={() => setKeyword('')}
            className="text-white hover:text-red-700 transition p-1"
          >
            <XCircle className="w-3 h-3" />
          </button>
        )}
        <button
          type="submit"
          className="hover:bg-brands-300 text-white rounded-full ring-1 ring-white p-1  transition"
        >
          <Search className="w-3 h-3" />
        </button>
      </div>
    </form>
  )
}

export default SearchBar
