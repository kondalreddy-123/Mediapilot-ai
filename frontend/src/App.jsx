import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import UploadModal from './components/UploadModal.jsx'
import Home from './pages/Home.jsx'
import Library from './pages/Library.jsx'

export default function App() {
  const [view, setView] = useState('home')
  const [studio, setStudio] = useState({ open: false, preset: null, asset: null })
  const start = (preset = null, asset = null) => setStudio({ open: true, preset, asset })
  return (<>
    <a className="skip" href="#main">Skip to content</a>
    <Navbar onStart={() => start()} onLibrary={() => setView('library')} onHome={() => setView('home')} />
    <main id="main">{view === 'home' ? <Home onStart={start} /> : <Library onOpen={(a) => start(null, a)} onUpload={() => start()} />}</main>
    <Footer />
    <UploadModal open={studio.open} preset={studio.preset === 'ai' ? 'ai' : studio.preset} asset={studio.asset} onClose={() => setStudio({ open: false, preset: null, asset: null })} />
  </>)
}
