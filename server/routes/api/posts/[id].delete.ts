import { defineEventHandler, createError } from 'h3'
import { readFileSync, writeFileSync, existsSync } from 'fs'
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

function writePostsData(data: PostsData): void {
  writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required',
    })
  }

  const data = readPostsData()
  const postIndex = data.posts.findIndex((p) => p.id === id)

  if (postIndex === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: `Post with id "${id}" not found`,
    })
  }

  data.posts.splice(postIndex, 1)
  writePostsData(data)

  return { success: true }
})
