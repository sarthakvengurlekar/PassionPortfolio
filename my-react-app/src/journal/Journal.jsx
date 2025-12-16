import { Link } from 'react-router-dom'
import { getAllPosts } from './postsIndex'

export default function Journal() {
  const posts = getAllPosts()

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
