import Section from './Section'
import { Link } from 'react-router-dom'

const posts = [
  {
    title: 'My First Journal Post',
    tag: 'Game Dev',
    teaser: 'Dummy post to make sure the Journal section works end-to-end.',
    slug: 'first-post',
  },
  {
    title: 'Backend Engineer in a Retro Arcade World',
    tag: 'Tech / Backend',
    teaser:
      'Thoughts on mixing Spring Boot, Kubernetes, and cloud with a love for small pixel-perfect side projects.',
  },
  {
    title: 'Chess, Tilt, and Learning the Hard Way',
    tag: 'Chess',
    teaser:
      'My journey trying to get better at chess while juggling work, side projects, and life.',
  },
]

function JournalSection() {
  return (
    <Section id="journal" title="Journal">
      <p className="section-intro">
        Long-form thoughts on games, engineering, anime, and my chess
        journey.
      </p>

      <div className="journal-grid">
        {posts.map((post) => (
          <article key={post.title} className="journal-card">
            <p className="journal-tag">{post.tag}</p>
            <h3>{post.title}</h3>
            <p className="journal-teaser">{post.teaser}</p>

            {post.slug ? (
              <Link className="btn secondary journal-btn" to={`/journal/${post.slug}`}>
                Read
              </Link>
            ) : (
              <button className="btn secondary journal-btn" disabled>
                Read soon
              </button>
            )}
          </article>
        ))}
      </div>
    </Section>
  )
}

export default JournalSection
