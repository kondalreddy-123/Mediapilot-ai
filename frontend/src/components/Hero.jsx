import { lazy, Suspense, useEffect, useState } from 'react'
import { Upload, Sparkles } from 'lucide-react'
const Scene3D = lazy(() => import('./Scene3D.jsx'))

function useShow3D() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const small = window.matchMedia('(max-width: 760px)').matches
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setOk(!small && !still)
  }, [])
  return ok
}
export default function Hero({ onStart }) {
  const show3D = useShow3D()
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <h1>MediaPilot AI</h1>
        <p className="tag">One upload. One choice. Ready to share.</p>
        <p className="sub">Turn photos and videos into platform-ready content automatically with an AI-powered Cloudinary media pipeline.</p>
        <div className="cta-row">
          <button className="btn" onClick={() => onStart()}><Upload size={18} aria-hidden /> Upload Media</button>
          <button className="btn btn-ghost" onClick={() => onStart("ai")}><Sparkles size={18} aria-hidden /> Let AI Decide</button>
        </div>
      </div>
      <div className="hero-3d">
        {show3D ? (
          <Suspense fallback={<div className="stage-fallback" />}><Scene3D /></Suspense>
        ) : (
          <div className="stage-static" aria-hidden>
            <span className="chip c1" /><span className="chip core" /><span className="chip c2" /><span className="chip c3" />
          </div>
        )}
      </div>
    </section>
  )
}
