// src/journal/postsIndex.js

// Load all markdown posts as raw strings (bundled by Vite)
const mdModules = import.meta.glob('/src/journal/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

// Minimal frontmatter parser:
// ---
// key: value
// ---
// markdown...
function parseFrontmatter(raw) {
  const trimmed = raw.trimStart()

  if (!trimmed.startsWith('---')) {
    return { data: {}, content: raw }
  }

  const end = trimmed.indexOf('\n---', 3)
  if (end === -1) {
    return { data: {}, content: raw }
  }

  const fmBlock = trimmed.slice(3, end).trim()
  const content = trimmed.slice(end + '\n---'.length).trimStart()

  const data = {}
  for (const line of fmBlock.split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    data[key] = value
  }

  return { data, content }
}

function slugFromPath(path) {
  // "/src/journal/posts/first-post.md" -> "first-post"
  return path.split('/').pop().replace(/\.md$/, '')
}

function parseDate(dateStr) {
  // expects YYYY-MM-DD
  // fallback to epoch if missing/invalid so sort is stable
  const t = Date.parse(dateStr)
  return Number.isFinite(t) ? t : 0
}

export function getAllPosts() {
  const posts = Object.entries(mdModules).map(([path, raw]) => {
    const { data } = parseFrontmatter(raw)
    const slug = slugFromPath(path)

    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      tag: data.tag || 'Journal',
      summary: data.summary || '',
      _dateTs: parseDate(data.date || ''),
    }
  })

  // newest first
  posts.sort((a, b) => b._dateTs - a._dateTs)

  // remove internal field
  return posts.map(({ _dateTs, ...rest }) => rest)
}
