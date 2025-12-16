// src/components/ProjectsSection.jsx
import Section from './Section'
import { Link } from 'react-router-dom'


function ProjectsSection() {
  return (
    <Section id="projects" title="Projects">
      <p>
        This section will host my passion projects — online chess tools, Pong,
        Tetris, and other games.
      </p>

      <div className="project-grid">

        <Link to="/pong" className="project-card">
          <h3>Pong Clone</h3>
          <p>
            A browser game built with React and canvas — angled bounces,
            power-ups, and just enough chaos.
          </p>
        </Link>

        <Link to="/visualizer/sorting" className="project-card">
          <h3>Algorithm Visualizer</h3>
          <p>
            A canvas-based visual playground for sorting algorithms — step mode, stats, and custom inputs.
          </p>
        </Link>

        <div className="project-card">
          <h3>Chess Playground (Coming Soon)</h3>
          <p>
            Interactive tools to analyze games, practice openings, and play
            mini-puzzles.
          </p>
        </div>

      </div>
    </Section>
  )
}

export default ProjectsSection
