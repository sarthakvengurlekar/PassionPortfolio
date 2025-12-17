import { Link } from 'react-router-dom'
import { getAllPosts } from './postsIndex'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '' // if invalid/missing
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function Journal() {
  const posts = getAllPosts() // already newest first

  return (
    <section className="section">
      <h2>Journal</h2>
      <p className="section-intro">
        Build logs, learning notes, and random thoughts.
      </p>

      <div className="journal-grid">
        {posts.map((post) => (
          <article key={post.slug} className="journal-card">
            <p className="journal-tag">{post.tag}</p>

            {post.date ? (
              <p className="journal-date">{formatDate(post.date)}</p>
            ) : null}

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
