'use client'

import { useState } from 'react'
import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
export interface PostFormState {
  termsAgreed: 'true' | 'false'
  title: string
  bookauthor: string
  isbn: string
  price: number
  stock: number
  originalPrice: number
  categories: string[] // store category IDs
  heroImage: { id: string }[]
  meta: {
    title: string
    description: string
    image: string
  }
  content: any
}
export interface UploadBooksFormProps {
  categories: { id: string; title: string }[] // from Payload
  onClose?: () => void
}
export function UploadBooksForm({ categories, onClose }: UploadBooksFormProps) {
  const [formState, setFormState] = useState<PostFormState>({
    termsAgreed: 'false',
    title: '',
    bookauthor: '',
    isbn: '',
    price: 0,
    stock: 1,
    originalPrice: 0,
    categories: [],
    heroImage: [],
    meta: { title: '', description: '', image: '' },
    content: {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: '',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
      },
    },
  })
  console.log('mycategories', formState)
  const [front, setFront] = useState<File | null>(null)
  const [back, setBack] = useState<File | null>(null)
  const [middle, setMiddle] = useState<File | null>(null)
  const [uploaded, setUploaded] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [bookUploading, setBookUploading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const router = useRouter()
  const handleCheckChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setIsChecked(checked)
    setFormState((prev) => ({ ...prev, termsAgreed: checked ? 'true' : 'false' }))
  }

  const handleChange = (field: keyof PostFormState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleContentTextChange = (text: string) => {
    const title = text.slice(0, 59).trim()
    const desc = text.slice(0, 149).trim()
    setFormState((prev) => ({
      ...prev,
      meta: { ...prev.meta, description: desc, title },
      content: {
        root: {
          ...prev.content.root,
          children: [
            {
              ...prev.content.root.children[0],
              children: [{ ...prev.content.root.children[0].children[0], text }],
            },
          ],
        },
      },
    }))
  }
  const files = [front, back, middle].filter(Boolean) as File[]

  const handleBulkUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)

    try {
      const uploadedIds: { id: string }[] = [] //commenting to use default media ids for now.
      /* const uploadedIds = [
        { id: '687a0664361bcbf2078bd7c8' },
        { id: '687a1b7dd90977ffdb03644b' },
        { id: '689077788927f17c4d963604' },
      ]*/ // ids hard-coded for testing
      //commenting to use default media ids for now.

      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/media`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        })

        if (!res.ok) {
          console.error('Failed to upload file', await res.text())
          continue
        }
        const data = await res.json()
        uploadedIds.push({ id: data.doc.id })
      }

      setFormState((prev) => ({
        ...prev,
        heroImage: uploadedIds,
        meta: { ...prev.meta, image: uploadedIds[0]?.id ?? '' },
      }))
      setUploaded(true)
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Failed to upload files. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }
  console.log('formstate', formState)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookUploading(true)
    // Validate at least one image is uploaded
    if (formState.heroImage.length === 0) {
      alert('Please upload at least one image')
      return
    }

    const payload = { posts: [formState] }

    try {
      const response = await fetch('/api/add-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        alert('Book uploaded successfully!')
        router.push('/')
      } else {
        console.error('Failed to upload book:', data)
        alert(`Failed to upload book: ${data.created?.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error('Error uploading book:', err)
      alert('An error occurred while uploading the book.')
    } finally {
      setBookUploading(false)
    }
  }

  return (
    <div className="w-full h-[calc(100vh-200px)] md:h-[calc(100vh-170px)] bg-white dark:bg-brands-800 rounded-lg shadow-xl overflow-auto">
      <div className="bg-brands-500 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Upload Books</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-brands-200 focus:outline-none"
          aria-label="Close form"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-3 bg-brands-500/80">
        <div className="md:flex w-full justify-between gap-3">
          <div className="w-full flex flex-col gap-1">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Title*</label>
                <input
                  type="text"
                  placeholder="Book title"
                  value={formState.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-2 border rounded dark:text-black"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Author*</label>
                <input
                  type="text"
                  placeholder="Author name"
                  value={formState.bookauthor}
                  onChange={(e) => handleChange('bookauthor', e.target.value)}
                  className="w-full px-3 py-2 border rounded dark:text-black"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">ISBN</label>
                <input
                  type="text"
                  placeholder="ISBN number"
                  value={formState.isbn}
                  onChange={(e) => handleChange('isbn', e.target.value)}
                  className="w-full px-3 py-2 border rounded dark:text-black"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Original price*</label>
                <input
                  type="number"
                  placeholder="My purchase price"
                  value={formState.originalPrice || ''}
                  onChange={(e) => handleChange('originalPrice', Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded dark:text-black"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Selling price*</label>
                <input
                  type="number"
                  placeholder="My selling price"
                  value={formState.price || ''}
                  onChange={(e) => handleChange('price', Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded dark:text-black"
                  required
                />
              </div>
            </div>

            <div className="">
              <label className="block mb-1 text-sm font-medium">Categories</label>

              <Select.Root
                onValueChange={(value) => {
                  setFormState((prev) => {
                    const alreadySelected = prev.categories.includes(value)
                    return {
                      ...prev,
                      categories: alreadySelected
                        ? prev.categories.filter((id) => id !== value) // remove if already selected
                        : [...prev.categories, value], // add new
                    }
                  })
                }}
              >
                <Select.Trigger
                  className="uppercase  inline-flex items-center justify-between w-full px-3 py-2 border rounded dark:text-black bg-white"
                  aria-label="Categories"
                >
                  <Select.Value placeholder="Select categories" className="mb-5  truncate">
                    {formState.categories.length > 0
                      ? categories
                          .filter((c) => formState.categories.includes(c.id))
                          .map((c) => c.title)
                          .join(', ')
                      : 'Select categories'}
                  </Select.Value>
                  <Select.Icon>
                    <ChevronDown className=" w-4 h-4" />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content className="w-full text-brands-500 bg-white border rounded-md shadow-md">
                    <Select.ScrollUpButton className="flex items-center justify-center h-6">
                      <ChevronUp className=" w-4 h-4" />
                    </Select.ScrollUpButton>

                    <Select.Viewport className=" uppercase p-2 max-h-60 overflow-auto">
                      {categories.map((cat) => (
                        <Select.Item
                          key={cat.id}
                          value={cat.id}
                          className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-blue-100 focus:bg-blue-100"
                        >
                          <div className="w-4 h-4 border rounded flex items-center justify-center">
                            {formState.categories.includes(cat.id) && (
                              <Check className="w-3 h-3 text-brands-600" />
                            )}
                          </div>
                          <Select.ItemText>{cat.title}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>

                    <Select.ScrollDownButton className="flex items-center justify-center h-6">
                      <ChevronDown className="w-4 h-4" />
                    </Select.ScrollDownButton>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="space-y-4  pt-4">
              <h3 className="font-medium">Book Images</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-sm">Front Picture*</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setFront(e.target.files?.[0] ?? null)}
                    className="w-full text-sm dark:text-black"
                    required
                  />

                  {front && (
                    <div className="mt-2 flex items-center gap-2">
                      <Image
                        src={URL.createObjectURL(front)}
                        alt="Front Preview"
                        width={56}
                        height={56}
                        className="object-cover rounded-sm border"
                      />
                      <p className="text-xs truncate">{front.name}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm">Back Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBack(e.target.files?.[0] ?? null)}
                    className="w-full text-sm dark:text-black"
                  />
                  {back && (
                    <div className="mt-2 flex items-center gap-2">
                      <Image
                        src={URL.createObjectURL(back)}
                        alt="Front Preview"
                        width={56}
                        height={56}
                        className="object-cover rounded border"
                      />
                      <p className="text-xs truncate">{back.name}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm">Inside Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMiddle(e.target.files?.[0] ?? null)}
                    className="w-full text-sm dark:text-black"
                  />
                  {middle && (
                    <div className="mt-2 flex items-center gap-2">
                      <Image
                        src={URL.createObjectURL(middle)}
                        alt="Front Preview"
                        width={56}
                        height={56}
                        className="object-cover rounded border"
                      />
                      <p className="text-xs truncate">{middle.name}</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                disabled={files.length < 3 || uploaded || isUploading}
                onClick={handleBulkUpload}
                className={`px-4 py-2 rounded transition-colors ${
                  files.length === 3 && !uploaded && !isUploading
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-brands-300 text-brands-500 cursor-not-allowed pointer-events-none'
                }`}
              >
                {!uploaded ? (isUploading ? 'Uploading...' : 'Upload All ') : 'Upload Finished'}
              </button>
            </div>
          </div>
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium">Book Description*</label>
            <textarea
              placeholder="Detailed description of the book..."
              value={formState.content.root.children[0].children[0].text}
              onChange={(e) => handleContentTextChange(e.target.value)}
              className="w-full px-3 py-2 border rounded dark:text-black"
              required
              rows={5}
            />
          </div>
        </div>
        <div className="flex justify-between flex-col md:flex-row">
          <div className="flex items-center space-x-2">
            <input
              id="terms"
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckChange}
              className="h-5 w-5 rounded border-brands-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm ">
              I have read and agreed to the terms and conditions
            </label>
          </div>
          <div className="flex justify-between md:justify-end space-x-3 pt-6">
            <button
              type="submit"
              className={`px-4 py-2 bg-brands-600 text-white rounded hover:bg-brands-700 transition-colors disabled:opacity-50
                ${
                  !bookUploading && isChecked
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-brands-300 text-brands-500 cursor-not-allowed pointer-events-none'
                }`}
              disabled={
                isUploading ||
                !isChecked ||
                !formState.title ||
                !formState.bookauthor ||
                !formState.price ||
                !front
              }
            >
              {isUploading ? 'Processing...' : 'Upload Book'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-brands-200 dark:bg-brands-700 rounded hover:bg-brands-300 dark:hover:bg-brands-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
