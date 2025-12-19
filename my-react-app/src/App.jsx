import { Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Pong from './games/Pong'
import Journal from './journal/Journal'
import JournalPost from './journal/JournalPost'
import SortingVisualizer from './tools/SortingVisualizer'
import PixelArtSandbox from './tools/PixelArtSandbox'

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
          <Route path="/visualizer/sorting" element={<SortingVisualizer />} />
          <Route path="/tools/pixel" element={<PixelArtSandbox />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
