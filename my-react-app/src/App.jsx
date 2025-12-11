import { Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Pong from './games/Pong'

function App() {
  return (
    <div className="app">
      <NavBar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pong" element={<Pong />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
