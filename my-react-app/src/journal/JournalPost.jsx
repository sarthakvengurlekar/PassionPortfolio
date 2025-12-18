import { useParams, Link } from 'react-router-dom'
import { marked } from 'marked'
import { useEffect, useState } from 'react'

const mdModules = import.meta.glob('/src/journal/posts/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
})

// tiny frontmatter parser for:
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

export default function JournalPost() {
    const { slug } = useParams()
    const [html, setHtml] = useState('')
    const [meta, setMeta] = useState(null)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        setMeta(null)
        setHtml('')
        setNotFound(false)

        const safeSlug = decodeURIComponent(slug || '').trim()
        const key = `/src/journal/posts/${safeSlug}.md`
        const raw = mdModules[key]

        if (!raw) {
            setNotFound(true)
            return
        }

        const { data, content } = parseFrontmatter(raw)
        setMeta(data)
        setHtml(marked.parse(content))
    }, [slug])

    if (notFound) {
        return (
            <section className="section">
                <h2>Post not found</h2>
                <p>That link doesn’t exist yet.</p>
                <Link className="btn secondary" to="/journal">Back to Journal</Link>
            </section>
        )
    }

    if (!meta) {
        return (
            <section className="section">
                <p>Loading…</p>
            </section>
        )
    }

    return (
        <section className="section">
            <p className="journal-tag">{meta.tag || 'Journal'}</p>
            <h2 style={{ marginBottom: '0.3rem' }}>{meta.title}</h2>
            <p style={{ opacity: 0.7, marginBottom: '1.8rem' }}>{meta.date}</p>
            {meta.cover ? (
                <img
                    className="journal-post-cover"
                    src={meta.cover}
                    alt={meta.title}
                    loading="lazy"
                />
            ) : null}


            <article className="journal-post" dangerouslySetInnerHTML={{ __html: html }} />

            <div style={{ marginTop: '2rem' }}>
                <Link className="btn secondary" to="/journal">Back to Journal</Link>
            </div>
        </section>
    )
}
