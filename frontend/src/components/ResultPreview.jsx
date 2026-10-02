import { useState } from 'react'
import { Download, Link2, RefreshCw, Check, AlertTriangle } from 'lucide-react'
import BeforeAfter from './BeforeAfter.jsx'

export default function ResultPreview({ r, onRegenerate, busy }) {
  const [copied, setCopied] = useState(false)
  if (r.failed) return <article className="glass rcard"><h3>{r.label}</h3><p className="muted">{r.message}</p><button className="btn btn-sm" onClick={() => onRegenerate(r.preset)} disabled={busy}>Try Again</button></article>
  const copy = async () => { try { await navigator.clipboard.writeText(r.url); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {} }
  return (
    <article className="glass rcard">
      <h3>{r.label}</h3>
      <p className="muted">{r.explanation}</p>
      {r.resourceType === 'video' ? (
        <div className="vid2">
          <figure><video src={r.original} controls preload="metadata" /><figcaption>Original</figcaption></figure>
          <figure><video src={r.url} controls preload="metadata" /><figcaption>Processed</figcaption></figure>
        </div>
      ) : <BeforeAfter before={r.original} after={r.url} />}
      {r.notice && <p className="notice"><AlertTriangle size={16} aria-hidden /> {r.notice}</p>}
      <ul className="checks">{r.checks.map((c) => <li key={c.text}>{c.ok ? <Check size={14} aria-hidden /> : <AlertTriangle size={14} aria-hidden />}<span className="sr">{c.ok ? 'Passed: ' : 'Warning: '}</span>{c.text}</li>)}</ul>
      {r.tags?.length > 0 && <ul className="tags" aria-label="AI tags">{r.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
      <div className="actions">
        <a className="btn btn-sm" href={r.downloadUrl}><Download size={16} aria-hidden /> Download</a>
        <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? <><Check size={16} aria-hidden /> Link copied</> : <><Link2 size={16} aria-hidden /> Copy link</>}</button>
        <button className="btn btn-sm btn-ghost" onClick={() => onRegenerate(r.preset)} disabled={busy}><RefreshCw size={16} aria-hidden /> Regenerate</button>
      </div>
    </article>
  )
}
