import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './components/NavBar'
import Hero from './components/Hero'
import ProjectsSection from './components/ProjectSection'
import Footer from './components/Footer'
import Section from './components/Section'
import TechStack from './components/TechStack'
import JournalSection from './components/JournalSection'


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

        <TechStack />

        {/* About section */}
        <Section id="about" title="About">
          <p>
            I&apos;m a software engineer with experience in backend development,
            automation testing, and now frontend with React. This site will
            become my central hub for everything I&apos;m working on — portfolio,
            games, tools, and experiments.
          </p>
        </Section>

        <div className="pixel-divider"></div>

        <Section id="experience" title="Experience">
          <div className="experience-item">
            <h3>Backend Software Engineer – R&amp;D · WOLFFKRAN</h3>
            <p className="experience-meta">Dubai, UAE · Oct 2025 – Present</p>
            <ul>
              <li>
                Designing telemetry and IoT backend systems for tower cranes using C#, Node.js, and TypeScript.
              </li>
              <li>
                Integrating PLC and sensor data into centralized monitoring and health dashboards.
              </li>
              <li>
                Building REST APIs and data pipelines on top of MongoDB, MySQL, and InfluxDB.
              </li>
            </ul>
          </div>

          <div className="experience-item">
            <h3>Software Developer · VJTI</h3>
            <p className="experience-meta">Feb 2024 – Mar 2025</p>
            <ul>
              <li>
                Improved CerebralZip&apos;s UI with React + D3, increasing engagement by ~30%.
              </li>
              <li>
                Built Java microservices for a SOC monitoring OT devices, deployed via Docker + Kubernetes.
              </li>
              <li>
                Designed relational schemas in SQL Server/PostgreSQL and tuned queries for lower latency.
              </li>
            </ul>
          </div>

          <div className="experience-item">
            <h3>Associate Software Engineer · Capgemini (HPE)</h3>
            <p className="experience-meta">Chicago, IL · May 2021 – Mar 2023</p>
            <ul>
              <li>
                Developed data-fabric microservices with Java/Spring backed by Oracle.
              </li>
              <li>
                Managed MapR and Spectrum Scale clusters with Helm, Docker, and AWS.
              </li>
              <li>
                Set up CI/CD with Jenkins + Argo CD, and automated testing with Python/ROBOT.
              </li>
            </ul>
          </div>

          <div className="experience-item">
            <h3>Software Developer · Marlabs Inc.</h3>
            <p className="experience-meta">Piscataway, NJ · Jul 2020 – May 2021</p>
            <ul>
              <li>
                Built a real-time stock platform with Java 11, Spring Boot, WebSockets, and MySQL.
              </li>
              <li>
                Designed microservices with Spring Cloud + Kubernetes for blue/green releases.
              </li>
              <li>
                Implemented Kafka-based pipelines processing tens of thousands of messages per second.
              </li>
            </ul>
          </div>
        </Section>

        <div className="pixel-divider"></div>

        <ProjectsSection />

        <div className="pixel-divider"></div>

        <JournalSection />

        <div className="pixel-divider"></div>

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

        <div className="pixel-divider"></div>

      </main>

      <Footer />
    </div>
  )
}

export default App
