import { defineEventHandler, createError } from 'h3'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const dataPath = join(process.cwd(), 'server/data/posts.json')

interface Post {
  id: string
  title: string
  summary: string
  body: string
  coverImage: string
  category: string
  tags: string[]
  slug: string
  status: string
  publishTime: string
  readTime: number
  createdAt: string
}

interface PostsData {
  posts: Post[]
}

function readPostsData(): PostsData {
  if (!existsSync(dataPath)) {
    return { posts: [] }
  }
  const raw = readFileSync(dataPath, 'utf-8')
  return JSON.parse(raw)
}

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post slug is required',
    })
  }

  const data = readPostsData()
  const post = data.posts.find((p) => p.slug === slug && p.status === 'published')

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: `Published post with slug "${slug}" not found`,
    })
  }

  return post
})
