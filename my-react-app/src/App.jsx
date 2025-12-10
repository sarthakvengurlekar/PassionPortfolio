import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './components/NavBar'
import Hero from './components/Hero'
import ProjectsSection from './components/ProjectSection'
import Footer from './components/Footer'
import Section from './components/Section'

function MyButton() {
  return (
    <button>I am a button</button>
  )
  
}

function App() {
  return (
    <div className="app">
      <NavBar />

      <main>
        <Hero />

        {/* About section */}
        <Section id="about" title="About">
          <p>
            I&apos;m a software engineer with experience in backend development,
            automation testing, and now frontend with React. This site will
            become my central hub for everything I&apos;m working on — portfolio,
            games, tools, and experiments.
          </p>
        </Section>
          
        {/* Experience section */}
        <Section id="experience" className="section">
          <ul classname="experience-list">
            <li>
              <h3>Software Engineer @ WOLFFKRAN</h3>
              <p>Fill this later...</p>
            </li>
          </ul>
        </Section>

        <ProjectsSection />

        {/* Contact section */}
        <Section id="contact" className="section">
          <p>
            Want to say hi, collaborate, or talk about games and backend stuff?
            Reach out at:
          </p>
          <p className="contact-email">
            <a href="mailto:sarthakvengurlekar10@gmail.com">
              sarthakvengurlekar10@gmail.com
            </a>
          </p>
        </Section>
      </main>

      <Footer />
    </div>
  )
}

export default App
