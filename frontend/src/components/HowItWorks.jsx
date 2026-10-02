import { steps } from '../data/presets.js'
export default function HowItWorks() {
  return (
    <section className="section" id="how">
      <h2>How it works</h2>
      <ol className="steps">
        {steps.map((s, i) => (
          <li key={s.title} className="glass step">
            <span className="num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
