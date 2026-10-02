import { Upload } from 'lucide-react'
export default function FinalCTA({ onStart }) {
  return (
    <section className="section final">
      <h2>Your media. Ready for anywhere.</h2>
      <button className="btn" onClick={() => onStart()}><Upload size={18} aria-hidden /> Upload Media</button>
    </section>
  )
}
