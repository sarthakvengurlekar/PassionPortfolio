import { Link } from 'react-router-dom'

const posts = [
  {
    slug: 'first-post',
    title: 'My First Journal Post',
    date: '2025-01-01',
    summary: 'Dummy post to confirm the journal system works end-to-end.',
  },
]

export default function Journal() {
  return (
    <section className="section">
      <h2>Journal</h2>
      <p className="section-intro">
        Build logs, learning notes, and random thoughts.
      </p>

      <div className="journal-grid">
        {posts.map((post) => (
          <article key={post.slug} className="journal-card">
            <p className="journal-tag">Journal</p>
            <h3>{post.title}</h3>
            <p className="journal-teaser">{post.summary}</p>
            <Link className="btn secondary journal-btn" to={`/journal/${post.slug}`}>
              Read
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
