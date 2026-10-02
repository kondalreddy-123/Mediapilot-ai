import { Download, Link2, Trash2, Play } from 'lucide-react'
export default function MediaCard({ a, onOpen, onDelete }) {
  return (
    <article className="glass mcard">
      <img src={a.thumb} alt={`${a.resourceType} uploaded ${new Date(a.createdAt).toLocaleDateString()}`} loading="lazy" />
      <div className="mmeta">
        <span>{a.resourceType === 'video' ? 'Video' : 'Image'} · {a.width}×{a.height} · {new Date(a.createdAt).toLocaleDateString()}</span>
        {a.tags.length > 0 && <ul className="tags">{a.tags.slice(0, 4).map((t) => <li key={t}>{t}</li>)}</ul>}
        <div className="actions">
          <button className="btn btn-sm" onClick={() => onOpen(a)}><Play size={14} aria-hidden /> Create versions</button>
          <a className="btn btn-sm btn-ghost" href={a.url} download aria-label="Download original"><Download size={14} aria-hidden /></a>
          <button className="btn btn-sm btn-ghost" onClick={() => navigator.clipboard?.writeText(a.url)} aria-label="Copy original link"><Link2 size={14} aria-hidden /></button>
          <button className="btn btn-sm btn-ghost" onClick={() => onDelete(a)} aria-label="Delete"><Trash2 size={14} aria-hidden /></button>
        </div>
      </div>
    </article>
  )
}
