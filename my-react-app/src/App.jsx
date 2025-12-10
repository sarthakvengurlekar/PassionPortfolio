import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function MyButton() {
  return (
    <button>I am a button</button>
  )
  
}

function App() {
  return (
    <div className="app">
      {/* Top navigation */}
      <header className="nav">
        <div className="nav-left">Sarthak.dev</div>
        <nav className="nav-right">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Intro section */}
      <main>
        <section className="hero">
          <p className="hero-intro">Hello, I&apos;m</p>
          <h1 className="hero-name">Sarthak Vengurlekar</h1>
          <h2 className="hero-title">
            Full Stack Developer & Aspiring Game creator
          </h2>
          <p className="hero-text">
            I build backend systems and I&apos;m slowly crafting a playground of
            passion projects — chess tools, Pong, Tetris, and other interactive
            experiments — all in one place.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">View Projects</a>
            <a href="#contact" className="btn btn-secondary">Get in Touch</a>
          </div>
        </section>

        {/* About section */}
        <section id="about" className="section">
          <h2>About</h2>
          <p>
            I&apos;m a software engineer with experience in backend development,
            automation testing, and now frontend with React. This site will
            become my central hub for everything I&apos;m working on — portfolio,
            games, tools, and experiments.
          </p>
          </section>
          
        {/* Experience section */}
        <section id="experience" className="section">
          <h2>Experience</h2>
          <ul classname="experience-list">
            <li>
              <h3>Software Engineer @ WOLFFKRAN</h3>
              <p>Fill this later...</p>
            </li>
          </ul>
        </section>

        {/* Projects section */}
        <section id="projects" className="section">
          <h2>Projects</h2>
          <p>
            This section will hold my passion projects and experiments.
          </p>

          <div className="projects-grid">
            <div className="project-card">
              <h3>Pong (Coming soon)</h3>
              <p>A comp v comp pong</p>
            </div>
            <div className="project-card">
              <h3>Utility tools (Coming soon)</h3>
              <p>Gotta wait...</p>
            </div>
          </div>
        </section>

        {/* Contact section */}
        <section id="contact" className="section">
          <h2>Contact</h2>
          <p>
            Want to say hi, collaborate, or talk about games and backend stuff?
            Reach out at:
          </p>
          <p className="contact-email">
            <a href="mailto:sarthakvengurlekar10@gmail.com">
              sarthakvengurlekar10@gmail.com
            </a>
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Sarthak Sachin Vengurlekar</p>
      </footer>
    </div>
  )
}

export default App
