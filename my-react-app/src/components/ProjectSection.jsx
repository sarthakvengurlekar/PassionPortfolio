// src/components/ProjectsSection.jsx
import Section from './Section'

function ProjectsSection() {
  return (
    <Section id="projects" title="Projects">
      <p>
        This section will host my passion projects — online chess tools, Pong,
        Tetris, and other games.
      </p>

      <div className="project-grid">
        <div className="project-card">
          <h3>Chess Playground (Coming Soon)</h3>
          <p>
            Interactive tools to analyze games, practice openings, and play
            mini-puzzles.
          </p>
        </div>
        <div className="project-card">
          <h3>Pong Clone (Coming Soon)</h3>
          <p>
            A simple browser game built with React and canvas to learn game
            loops and basic physics.
          </p>
        </div>
        <div className="project-card">
          <h3>Utility Tools (Coming Soon)</h3>
          <p>
            Small tools like timers, converters, and productivity helpers.
          </p>
        </div>
      </div>
    </Section>
  )
}

export default ProjectsSection
