import { useState } from 'react'
export default function BeforeAfter({ before, after }) {
  const [pos, setPos] = useState(50)
  return (
    <div className="ba">
      <img src={after} alt="After: processed by Cloudinary" />
      <div className="ba-top" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}><img src={before} alt="Before: original upload" /></div>
      <span className="ba-tag l">Before</span><span className="ba-tag r">After</span>
      <span className="ba-line" style={{ left: `${pos}%` }} aria-hidden />
      <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(+e.target.value)} aria-label="Compare before and after" />
    </div>
  )
}
