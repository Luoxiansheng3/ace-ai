import { defineEventHandler, readBody, createError } from 'h3'
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

/**
 * Calculate estimated reading time based on content.
 * - Chinese characters: ~500 chars per minute
 * - English words: ~200 words per minute
 */
function calculateReadTime(body: string): number {
  if (!body) return 1

  // Count Chinese characters
  const chineseChars = (body.match(/[\u4e00-\u9fff]/g) || []).length
  const chineseMinutes = chineseChars / 500

  // Count English words (sequences of Latin letters/numbers)
  const englishWords = (
    body.match(/[a-zA-Z0-9]+/g) || []
  ).length
  const englishMinutes = englishWords / 200

  const totalMinutes = Math.ceil(chineseMinutes + englishMinutes)
  return Math.max(1, totalMinutes)
}

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required',
    })
  }

  const body = await readBody(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body is required',
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

  const existingPost = data.posts[postIndex]

  // Merge only the provided fields (do not overwrite with undefined)
  const updatableFields = [
    'title',
    'summary',
    'body',
    'coverImage',
    'category',
    'tags',
    'slug',
    'status',
    'publishTime',
  ] as const

  for (const field of updatableFields) {
    if (body[field] !== undefined) {
      ;(existingPost as any)[field] = body[field]
    }
  }

  // Recalculate readTime if body content changed
  if (body.body !== undefined) {
    existingPost.readTime = calculateReadTime(body.body)
  }

  // If status changed to published and no publishTime is set, set it to today
  if (body.status === 'published' && !existingPost.publishTime) {
    existingPost.publishTime = new Date().toISOString().split('T')[0]
  }

  data.posts[postIndex] = existingPost
  writePostsData(data)

  return existingPost
})
