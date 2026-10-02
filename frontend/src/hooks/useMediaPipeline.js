import { useCallback, useState } from 'react'
import * as api from '../services/api.js'

const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime']
const MAX = 100 * 1024 * 1024

// phase: idle | uploading | uploaded | processing | completed | error
export default function useMediaPipeline() {
  const [s, set] = useState({ phase: 'idle', progress: 0, asset: null, results: [], error: null })
  const patch = (p) => set((v) => ({ ...v, ...p }))

  const loadAsset = useCallback((asset) => set({ phase: 'uploaded', progress: 1, asset, results: [], error: null }), [])
  const reset = useCallback(() => set({ phase: 'idle', progress: 0, asset: null, results: [], error: null }), [])

  const upload = useCallback(async (file) => {
    if (!TYPES.includes(file.type)) { patch({ phase: 'error', error: 'Please upload a JPG, PNG, WebP, MP4 or MOV file.' }); return null }
    if (file.size > MAX) { patch({ phase: 'error', error: 'This file is too large. The limit is 100 MB.' }); return null }
    patch({ phase: 'uploading', progress: 0, error: null })
    try {
      const asset = await api.uploadFile(file, (p) => patch({ progress: p }))
      set({ phase: 'uploaded', progress: 1, asset, results: [], error: null })
      return asset
    } catch (e) { patch({ phase: 'error', error: e.message }); return null }
  }, [])

  // Run one destination (or 'ai'). Replaces any existing result for that destination.
  const run = useCallback(async (preset, assetArg) => {
    const asset = assetArg || s.asset
    patch({ phase: 'processing', error: null })
    try {
      const r = await api.processMedia(asset, preset)
      set((v) => ({ ...v, phase: 'completed', results: [...v.results.filter((x) => x.preset !== r.preset), r] }))
    } catch (e) { patch({ phase: 'error', error: e.message }) }
  }, [s.asset])

  const runAll = useCallback(async (assetArg) => {
    const asset = assetArg || s.asset
    patch({ phase: 'processing', error: null, results: [] })
    try { const d = await api.generateAll(asset); patch({ phase: 'completed', results: d.results }) }
    catch (e) { patch({ phase: 'error', error: e.message }) }
  }, [s.asset])

  return { ...s, upload, run, runAll, loadAsset, reset }
}
