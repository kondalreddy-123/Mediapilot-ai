import * as cld from '../services/cloudinary.js'
import { recipes, decide, runPreset } from '../services/pipeline.js'

const FAIL = "We couldn't process this file. Please try again."
const bad = (res, message = FAIL, code = 400) => res.status(code).json({ success: false, message })
const guard = (fn) => async (req, res) => {
  if (!cld.isConfigured()) { console.error('Cloudinary credentials missing'); return bad(res, FAIL, 503) }
  try { await fn(req, res) } catch (e) { console.error(`[${req.method} ${req.path}]`, e); bad(res, FAIL, 500) }
}
const loadAsset = async (publicId, resourceType) => {
  if (!cld.ownsAsset(publicId) || !['image', 'video'].includes(resourceType)) return null
  return cld.getAsset(publicId, resourceType)
}

export const upload = guard(async (req, res) => {
  if (!req.file) return bad(res, 'Please choose a file to upload.')
  const { result, taggingApplied } = await cld.uploadBuffer(req.file.buffer)
  res.json({ success: true, asset: cld.toAsset(result), aiTagging: taggingApplied })
})

export const process = guard(async (req, res) => {
  const { publicId, resourceType, preset } = req.body || {}
  const asset = await loadAsset(publicId, resourceType)
  if (!asset || !(preset === 'ai' || recipes[preset])) return bad(res)
  let reason = null, key = preset
  if (preset === 'ai') ({ preset: key, reason } = decide(asset))
  const result = await runPreset(asset, key)
  if (result.skipped) return bad(res, result.message)
  res.json({ ...result, explanation: reason || result.explanation, aiDecided: preset === 'ai' })
})

export const generate = guard(async (req, res) => {
  const { publicId, resourceType } = req.body || {}
  const asset = await loadAsset(publicId, resourceType)
  if (!asset) return bad(res)
  const settled = await Promise.allSettled(Object.keys(recipes).map((k) => runPreset(asset, k)))
  const results = settled.map((s, i) => {
    const key = Object.keys(recipes)[i]
    if (s.status === 'fulfilled') return s.value
    console.error(`[generate] ${key}`, s.reason)
    return { preset: key, label: recipes[key].label, failed: true, message: FAIL }
  })
  res.json({ success: true, results })
})

export const list = guard(async (_req, res) => res.json({ success: true, media: await cld.listAssets() }))

export const remove = guard(async (req, res) => {
  const { id } = req.params
  const type = req.query.resourceType
  if (!cld.ownsAsset(id) || !['image', 'video'].includes(type)) return bad(res)
  const r = await cld.deleteAsset(id, type)
  res.json({ success: r.result === 'ok', message: r.result === 'ok' ? 'Deleted' : FAIL })
})
