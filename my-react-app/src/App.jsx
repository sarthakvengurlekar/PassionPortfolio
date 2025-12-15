import { Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Pong from './games/Pong'
import Journal from './journal/Journal'
import JournalPost from './journal/JournalPost'

function App() {
  return (
    <div className="app">
      <NavBar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pong" element={<Pong />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:slug" element={<JournalPost />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
