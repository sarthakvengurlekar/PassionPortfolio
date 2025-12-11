// src/components/TechStack.jsx
import Section from './Section'
import awsLogo from '../assets/logos/aws.webp'

const techs = [
  {
    name: 'Java',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  },
  {
    name: 'Spring Boot',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
  },
  {
    name: 'Kubernetes',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
  },
  {
    name: 'Docker',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  },
  {
    name: 'AWS',
    logo: awsLogo,
  },
  {
    name: 'PostgreSQL',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  },
  {
    name: 'Kafka',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg',
  },
  {
    name: 'React',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  },
  {
    name: 'Git',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  },
]

function TechStack() {
  return (
    <Section id="skills" title="Tech Stack">
      <p className="section-intro">
        A quick snapshot of the tools I&apos;m most comfortable with across backend,
        cloud, and frontend.
      </p>

      <div className="tech-logo-grid">
        {techs.map((tech) => (
          <div key={tech.name} className="tech-logo-card">
            <img src={tech.logo} alt={`${tech.name} logo`} />
            <span>{tech.name}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}

export default TechStack
