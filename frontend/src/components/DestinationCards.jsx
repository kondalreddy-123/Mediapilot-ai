import { useRef } from 'react'
import * as Icons from 'lucide-react'
import { presets } from '../data/presets.js'

function Tilt({ children }) {
  const ref = useRef()
  const move = (e) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`
  }
  const reset = () => { ref.current.style.transform = '' }
  return <div ref={ref} className="tilt" onPointerMove={move} onPointerLeave={reset}>{children}</div>
}
export default function DestinationCards({ onStart }) {
  return (
    <section className="section" id="destinations">
      <h2>What are you creating?</h2>
      <p className="lead">Pick a destination. MediaPilot handles sizes, crops and formats.</p>
      <ul className="grid">
        {Object.entries(presets).map(([key, p]) => {
          const Icon = Icons[p.icon] || Icons.Image
          return (
            <li key={key}>
              <Tilt>
                <button className="glass dest" type="button" onClick={() => onStart(key)}>
                  <span className="ico"><Icon size={24} aria-hidden /></span>
                  <strong>{p.label}</strong>
                  <span>{p.blurb}</span>
                </button>
              </Tilt>
            </li>
          )
        })}
        <li className="span-all">
          <button className="glass dest ai" type="button" onClick={() => onStart("ai")}>
            <span className="ico"><Icons.Sparkles size={24} aria-hidden /></span>
            <strong>Let AI Decide</strong>
            <span>Not sure? We'll pick the right pipeline for your file.</span>
          </button>
        </li>
      </ul>
    </section>
  )
}
