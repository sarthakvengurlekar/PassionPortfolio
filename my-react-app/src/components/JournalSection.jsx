import Section from './Section'

const posts = [
  {
    title: 'Why I Keep Coming Back to Pong',
    tag: 'Game Dev',
    teaser:
      'Notes from rebuilding simple games to understand physics, input handling, and game loops from scratch.',
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
        journey. One day this will be a full blog — for now, it&apos;s a
        glimpse into the things I care about.
      </p>

      <div className="journal-grid">
        {posts.map((post) => (
          <article key={post.title} className="journal-card">
            <p className="journal-tag">{post.tag}</p>
            <h3>{post.title}</h3>
            <p className="journal-teaser">{post.teaser}</p>
            <button className="btn secondary journal-btn">
              Read soon
            </button>
          </article>
        ))}
      </div>
    </Section>
  )
}

export default JournalSection
