import { Link, NavLink } from 'react-router-dom'

function NavBar() {
  return (
    <header className="nav">
      <Link to="/" className="nav-left">
        Sarthak.dev
      </Link>

      <nav className="nav-right">
        <NavLink to="/#about">About</NavLink>
        <NavLink to="/#experience">Experience</NavLink>
        <NavLink to="/#projects">Projects</NavLink>
        <NavLink to="/journal">Journal</NavLink>
        <NavLink to="/#contact">Contact</NavLink>
      </nav>
    </header>
  )
}

export default NavBar
