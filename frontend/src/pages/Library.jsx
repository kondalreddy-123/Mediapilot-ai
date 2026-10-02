import { useEffect, useState } from 'react'
import { listMedia, deleteMedia, FRIENDLY } from '../services/api.js'
import MediaCard from '../components/MediaCard.jsx'

export default function Library({ onOpen, onUpload }) {
  const [items, setItems] = useState(null)
  const [err, setErr] = useState(null)
  const load = () => { setErr(null); listMedia().then(setItems).catch(() => setErr(FRIENDLY)) }
  useEffect(load, [])
  const del = async (a) => {
    if (!window.confirm('Delete this media from Cloudinary?')) return
    try { await deleteMedia(a); setItems((v) => v.filter((x) => x.publicId !== a.publicId)) } catch { setErr(FRIENDLY) }
  }
  return (
    <section className="section">
      <h2>My Media</h2>
      <p className="lead">Your uploads, stored on Cloudinary. Versions are generated from the original whenever you open one.</p>
      {err && <div className="err" role="alert"><p>{err}</p><button className="btn btn-sm" onClick={load}>Try Again</button></div>}
      {!err && items === null && <p className="muted" role="status">Loading…</p>}
      {items?.length === 0 && <div className="glass empty"><p>Nothing here yet. Upload an image or video to get started.</p><button className="btn" onClick={() => onUpload()}>Upload Media</button></div>}
      <div className="lib">{items?.map((a) => <MediaCard key={a.publicId} a={a} onOpen={onOpen} onDelete={del} />)}</div>
    </section>
  )
}
