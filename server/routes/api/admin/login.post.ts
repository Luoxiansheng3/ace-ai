import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body || {}

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and password are required',
    })
  }

  if (username !== 'admin' || password !== 'Ace2026!') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid username or password',
    })
  }

  return {
    token: 'admin-token-secret',
    user: {
      username: 'admin',
    },
  }
})
