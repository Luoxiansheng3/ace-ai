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
 * Generate a URL-friendly slug from a title string.
 * - Converts to lowercase
 * - Replaces Chinese characters with their Unicode code point hex (short form)
 * - Replaces spaces and non-alphanumeric characters with hyphens
 * - Collapses consecutive hyphens and trims leading/trailing hyphens
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace Chinese characters with a short hex representation
    .replace(/[\u4e00-\u9fff]/g, (char) => {
      return char.charCodeAt(0).toString(36)
    })
    // Replace any non-alphanumeric character (except hyphens) with a hyphen
    .replace(/[^a-z0-9-]/g, '-')
    // Collapse consecutive hyphens into one
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-|-$/g, '')
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
  const body = await readBody(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body is required',
    })
  }

  if (!body.title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post title is required',
    })
  }

  const data = readPostsData()

  const now = new Date()
  const today = now.toISOString().split('T')[0]

  const newPost: Post = {
    id: 'post-' + Date.now(),
    title: body.title,
    summary: body.summary || '',
    body: body.body || '',
    coverImage: body.coverImage || '',
    category: body.category || '',
    tags: body.tags || [],
    slug: body.slug || generateSlug(body.title),
    status: body.status || 'draft',
    publishTime:
      body.publishTime ||
      (body.status === 'published' ? today : ''),
    readTime: calculateReadTime(body.body || ''),
    createdAt: now.toISOString(),
  }

  data.posts.push(newPost)
  writePostsData(data)

  return newPost
})
