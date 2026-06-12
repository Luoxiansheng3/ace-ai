import { marked } from 'marked'
import hljs from 'highlight.js'

// Configure marked with highlight.js for code syntax highlighting
marked.setOptions({
  highlight: function (code: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return code
  },
  breaks: true,
  gfm: true,
} as any)

export function useMarkdown() {
  /**
   * Render a Markdown string to HTML.
   */
  function renderMarkdown(md: string): string {
    if (!md) return ''
    const result = marked.parse(md)
    // marked.parse can return string | Promise<string>; we handle sync usage
    return typeof result === 'string' ? result : ''
  }

  /**
   * Calculate estimated reading time in minutes.
   * Chinese characters counted at 500/min, English words at 200/min.
   */
  function calculateReadTime(text: string): number {
    if (!text) return 1
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length
    const englishWords = text
      .replace(/[\u4e00-\u9fff]/g, '')
      .split(/\s+/)
      .filter(Boolean).length
    return Math.max(1, Math.ceil(chineseChars / 500 + englishWords / 200))
  }

  /**
   * Generate a URL-safe slug from a title.
   * Handles Chinese titles by stripping CJK and falling back to a timestamp.
   */
  function generateSlug(title: string): string {
    if (!title) return `post-${Date.now()}`

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[\s]+/g, '-')
      .replace(/[^\w\u4e00-\u9fff-]/g, '')
      .replace(/[\u4e00-\u9fff]+/g, () => {
        // Strip CJK characters; for a production app consider a pinyin library
        return ''
      })
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    return slug || `post-${Date.now()}`
  }

  /**
   * Simple HTML-to-Markdown conversion for common elements.
   */
  function htmlToMarkdown(html: string): string {
    if (!html) return ''

    let md = html
      // Headings
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n')
      // Bold
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      // Italic
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      // Links
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      // Images (with alt)
      .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
      // Images (without alt)
      .replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)')
      // Blockquotes
      .replace(
        /<blockquote[^>]*>(.*?)<\/blockquote>/gis,
        (_m, c) => '> ' + c.replace(/<[^>]*>/g, '') + '\n',
      )
      // Inline code
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      // Code blocks
      .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n')
      // List items
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      // Line breaks
      .replace(/<br\s*\/?>/gi, '\n')
      // Paragraphs
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      // Strip remaining HTML tags
      .replace(/<[^>]+>/g, '')
      // Collapse excessive newlines
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    return md
  }

  return {
    renderMarkdown,
    calculateReadTime,
    generateSlug,
    htmlToMarkdown,
  }
}
