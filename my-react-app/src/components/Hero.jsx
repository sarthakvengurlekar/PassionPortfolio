// src/components/Hero.jsx

function Hero() {
  return (
    <section className="hero">
      <p className="hero-intro">Hello, I&apos;m</p>
      <h1 className="hero-name">Sarthak Sachin Vengurlekar</h1>

      <h2 className="hero-title">
        Backend Engineer &amp; Aspiring Game Creator
      </h2>

      <p className="hero-subtitle">
        Spring Boot · Kubernetes · AWS · Microservices · React · Node.js
      </p>

      <p className="hero-meta">
        Dubai, UAE ·{' '}
        <a href="https://sarthakvengurlekar10@gmail.com">
          sarthakvengurlekar10@gmail.com
        </a>{' '}
        · +971 56 330 2286
      </p>

      <div className="hero-links">
        <a
          href="https://github.com/sarthakvengurlekar"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <span>.</span>
        <a
          href="https://www.linkedin.com/in/sarthak-vengurlekar/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <span>.</span>
        <a
          href="https://sarthakvengurlekar.github.io/"
          target="_blank"
          rel="noreferrer"
        >
          Old Portfolio
        </a>
      </div>
      <p className="hero-text">
        Results-driven Software Engineer with 4+ years of experience building
        scalable backend systems, cloud-native microservices, and DevOps
        pipelines. I enjoy working at the intersection of backend, cloud, and
        automation — and this site is my hub for portfolio projects, games, and
        experiments.
      </p>

      <div className="hero-buttons">
        <a href="#projects" className="btn primary">
          View Projects
        </a>
        <a href="#contact" className="btn secondary">
          Contact Me
        </a>
      </div>
    </section>
  )
}

export default Hero
