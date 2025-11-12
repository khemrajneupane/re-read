import clsx from 'clsx'
import React from 'react'
import type { Post } from '@/payload-types'
import { Card } from '../../components/Card'
import RichText from '@/components/RichText'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: SerializedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props
  return (
    <div className={clsx(className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 lg:gap-8 w-full px-2 py-2 ">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return (
            <Card
              key={index}
              doc={doc}
              relationTo="posts"
              showCategories
              bookauthor={doc.bookauthor}
            />
          )
        })}
      </div>
    </div>
  )
}
