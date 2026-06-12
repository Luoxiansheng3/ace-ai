import { defineEventHandler, getQuery } from 'h3'
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
  const query = getQuery(event)
  const { status, search, category } = query

  const data = readPostsData()
  let posts = data.posts

  // Filter by status
  if (status && status !== 'all') {
    posts = posts.filter((p) => p.status === status)
  }

  // Filter by search keyword (match title, summary, body, tags)
  if (search) {
    const keyword = String(search).toLowerCase()
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        p.summary.toLowerCase().includes(keyword) ||
        p.body.toLowerCase().includes(keyword) ||
        p.tags.some((t) => t.toLowerCase().includes(keyword))
    )
  }

  // Filter by category
  if (category) {
    posts = posts.filter((p) => p.category === category)
  }

  // Sort by createdAt descending (newest first)
  posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return {
    posts,
    total: posts.length,
  }
})
