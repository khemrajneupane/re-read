//import { cn } from '@/utilities/ui'
import React from 'react'
import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 lg:gap-8 w-full px-2 py-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32">
      {posts?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return (
            <div key={index} className="pt-4">
              <Card
                className="h-full"
                doc={result}
                relationTo="posts"
                showCategories
                bookauthor={result.bookauthor || ''}
              />
            </div>
          )
        }
        return null
      })}
    </div>
  )
}
