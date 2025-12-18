import Section from './Section'
import { Link } from 'react-router-dom'
import { getAllPosts } from '../journal/postsIndex'

function JournalSection() {
  const posts = getAllPosts().slice(0, 3) // show latest 3
  return (
    <Section id="journal" title="Journal">
      <p className="section-intro">
        Long-form thoughts on games, engineering, anime, and my chess journey.
      </p>

      <div className="journal-grid">
        {posts.map((post) => (
          <article key={post.slug} className="journal-card">
            {post.cover ? (
              <img className="journal-cover" src={post.cover} alt={post.title} loading="lazy" />
            ) : null}
            <p className="journal-tag">{post.tag}</p>

            <p className="journal-date">
              {new Date(post.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>

            <h3>{post.title}</h3>
            <p className="journal-teaser">{post.summary}</p>

            <Link className="btn secondary journal-btn" to={`/journal/${post.slug}`}>
              Read
            </Link>
          </article>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <Link className="btn secondary" to="/journal">
          View all posts
        </Link>
      </div>
    </Section>
  )
}

export default JournalSection
