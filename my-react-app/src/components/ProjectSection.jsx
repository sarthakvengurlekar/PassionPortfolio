// src/components/ProjectsSection.jsx
import Section from './Section'
import { Link } from 'react-router-dom'


function ProjectsSection() {
  return (
    <Section id="projects" title="Projects">
      <p>
        This section will host my passion projects: Online chess tools, Pong,
        Tetris, and other games.
      </p>

      <div className="project-grid">

        <Link to="/pong" className="project-card">
          <h3>Pong Clone</h3>
          <p>
            A browser game built with React and canvas. Angled bounces,
            power-ups, and just enough chaos.
          </p>
        </Link>

        <Link to="/visualizer/sorting" className="project-card">
          <h3>Algorithm Visualizer</h3>
          <p>
            A canvas-based visual playground for sorting algorithms. Step mode, stats, and custom inputs.
          </p>
        </Link>

        <Link to="/tools/pixel" className="project-card">
          <h3>Pixel Art Sandbox</h3>
          <p>
            Draw pixel art with a palette, eraser, grid toggle, and export-ready canvas.
          </p>
        </Link>


      </div>
    </Section>
  )
}

export default ProjectsSection
