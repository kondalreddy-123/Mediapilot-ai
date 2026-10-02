import { useEffect, useRef, useState } from 'react'
import { X, UploadCloud, Sparkles, Loader2, Check, Layers } from 'lucide-react'
import * as Icons from 'lucide-react'
import { presets } from '../data/presets.js'
import useMediaPipeline from '../hooks/useMediaPipeline.js'
import ResultPreview from './ResultPreview.jsx'

export default function UploadModal({ open, preset, asset: initial, onClose }) {
  const p = useMediaPipeline()
  const [drag, setDrag] = useState(false)
  const closeRef = useRef()

  useEffect(() => {
    if (!open) return
    initial ? p.loadAsset(initial) : p.reset()
    closeRef.current?.focus()
    const esc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = '' }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial])

  if (!open) return null
  const onFile = async (file) => {
    if (!file) return
    const a = await p.upload(file)
    if (a && preset) preset === 'all' ? p.runAll(a) : p.run(preset, a)
  }
  const busy = p.phase === 'processing'
  const retry = () => (p.asset ? p.loadAsset(p.asset) : p.reset())

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal glass" role="dialog" aria-modal="true" aria-labelledby="studio-h" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="x" onClick={onClose} aria-label="Close"><X /></button>
        <h2 id="studio-h">{p.asset ? 'What are you creating?' : 'Upload your media'}</h2>

        {!p.asset && p.phase !== 'uploading' && (
          <label className={`drop ${drag ? 'on' : ''}`} onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]) }}>
            <UploadCloud size={36} aria-hidden />
            <strong>Drop a file here or click to choose</strong>
            <span className="muted">JPG, PNG, WebP, MP4 or MOV · up to 100 MB</span>
            <input type="file" accept=".jpg,.jpeg,.png,.webp,.mp4,.mov" onChange={(e) => onFile(e.target.files[0])} />
          </label>
        )}
        {p.phase === 'uploading' && (
          <div role="status"><p>Uploading… {Math.round(p.progress * 100)}%</p>
            <div className="prog"><span style={{ width: `${p.progress * 100}%` }} /></div></div>
        )}
        {p.phase === 'error' && (
          <div className="err" role="alert"><p>{p.error}</p><button className="btn btn-sm" onClick={retry}>Try Again</button></div>
        )}

        {p.asset && (
          <>
            <div className="src">
              {p.asset.resourceType === 'video' ? <video src={p.asset.url} controls preload="metadata" /> : <img src={p.asset.thumb} alt="Your upload" />}
              <p role="status"><Check size={16} aria-hidden /> Uploaded to Cloudinary · {p.asset.width}×{p.asset.height}</p>
            </div>
            <ul className="grid pick">
              {Object.entries(presets).map(([k, v]) => { const I = Icons[v.icon] || Icons.Image; return (
                <li key={k}><button className="glass dest" disabled={busy} onClick={() => p.run(k)}><span className="ico"><I size={22} aria-hidden /></span><strong>{v.label}</strong></button></li>) })}
              <li><button className="glass dest ai" disabled={busy} onClick={() => p.run('ai')}><span className="ico"><Sparkles size={22} aria-hidden /></span><strong>Let AI Decide</strong></button></li>
              <li><button className="glass dest ai" disabled={busy} onClick={() => p.runAll()}><span className="ico"><Layers size={22} aria-hidden /></span><strong>Generate All</strong></button></li>
            </ul>
          </>
        )}
        {busy && <p className="proc" role="status"><Loader2 className="spin" size={18} aria-hidden /> Cloudinary is processing your media…</p>}
        {p.phase === 'completed' && <p className="ok" role="status"><Check size={16} aria-hidden /> Ready</p>}
        {p.results.length > 0 && (
          <div className="results">{p.results.map((r) => <ResultPreview key={r.preset} r={r} busy={busy} onRegenerate={(k) => p.run(k)} />)}</div>
        )}
      </div>
    </div>
  )
}
