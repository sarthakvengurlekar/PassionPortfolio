// src/components/Hero.jsx
import PixelBackground from './PixelBackground'


function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="hero scanlines">
      <PixelBackground />
      <div className="hero-inner">

        <h1 className="hero-name">Hi, I&apos;m Sarthak Vengurlekar</h1>
        <h2 className="hero-title hero-title-main">
          Welcome to my playground.
        </h2>

        <p className="hero-text hero-text-sub">
          A little corner of the internet where I build backend systems, games,
          and quirky side projects.
        </p>

        <div className="hero-btn-row">
          
          {/* Primary CTA */}
          <button 
            className="btn primary hero-about-btn" 
            onClick={() => scrollTo("about")}
          >
            About me <span className="hero-arrow">↓</span>
          </button>

          {/* Secondary CTAs */}
          <button 
            className="btn primary hero-btn" 
            onClick={() => scrollTo("projects")}
          >
            Projects
          </button>

          <button 
            className="btn primary hero-btn" 
            onClick={() => scrollTo("contact")}
          >
            Contact me
          </button>

        </div>
      </div>
    </section>
  )
}

export default Hero
