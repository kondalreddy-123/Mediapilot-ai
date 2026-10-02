import { motion, useReducedMotion } from 'framer-motion'
import { stages } from '../data/presets.js'
export default function PipelineViz() {
  const reduce = useReducedMotion()
  return (
    <section className="section" id="pipeline">
      <h2>From upload to delivery</h2>
      <p className="lead">Every file passes through the same Cloudinary-powered pipeline.</p>
      <ol className="pipe">
        {stages.map((s, i) => (
          <motion.li
            key={s.title}
            className="glass stage"
            initial={reduce ? false : { opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.12 }}
          >
            <span className="dot" aria-hidden />
            <div><h3>{s.title}</h3><p>{s.text}</p></div>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
