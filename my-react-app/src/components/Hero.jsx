// src/components/Hero.jsx

function Hero() {
  return (
    <section className="hero">
      <p className="hero-intro">Hello, I&apos;m</p>
      <h1 className="hero-name">Sarthak Sachin Vengurlekar</h1>
      <h2 className="hero-title">
        Backend Engineer &amp; Aspiring Game Creator
      </h2>
      <p className="hero-text">
        I build backend systems and I&apos;m slowly crafting a playground of passion
        projects — chess tools, Pong, Tetris, and other interactive experiments
        — all in one place.
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
