import { useState } from 'react'
import { Sparkles, Menu, X } from 'lucide-react'
const links = [['How it works', '#how'], ['Destinations', '#destinations'], ['Pipeline', '#pipeline']]
export default function Navbar({ onStart, onLibrary, onHome }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="nav">
      <div className="nav-in">
        <a href="#top" className="brand" aria-label="MediaPilot AI home"><span className="logo"><Sparkles size={16} aria-hidden /></span>MediaPilot AI</a>
        <nav aria-label="Primary" className={open ? 'links open' : 'links'}>
          {links.map(([t, h]) => <a key={h} href={h} onClick={() => { setOpen(false); onHome() }}>{t}</a>)}
          <button className="linkbtn" onClick={() => { setOpen(false); onLibrary() }}>My Media</button><button className="btn btn-sm" onClick={() => { setOpen(false); onStart() }}>Upload Media</button>
        </nav>
        <button className="burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  )
}
