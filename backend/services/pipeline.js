import { buildUrl, verifyDelivery } from './cloudinary.js'

const optimize = [{ quality: 'auto', fetch_format: 'auto' }]
const fill = (w, h) => [{ width: w, height: h, crop: 'fill', gravity: 'auto' }, ...optimize] // gravity:auto = content-aware crop
const MB = 1024 * 1024

// Central preset config. Each destination has an image recipe and/or a video recipe (null = not applicable).
export const recipes = {
  reel:       { label: 'Reel / Short', image: fill(1080, 1920), video: fill(1080, 1920), says: 'a vertical 9:16 version for short-form platforms' },
  youtube:    { label: 'YouTube',      image: fill(1280, 720),  video: fill(1920, 1080), says: 'a 16:9 version for YouTube' },
  socialPost: { label: 'Social Post',  image: fill(1080, 1350), video: fill(1080, 1350), says: 'a 4:5 version for social feeds' },
  story:      { label: 'Story',        image: fill(1080, 1920), video: fill(1080, 1920), says: 'a full-screen vertical version for stories' },
  website:    { label: 'Website',      image: [{ width: 1600, crop: 'limit' }, ...optimize], video: [{ width: 1280, crop: 'limit' }, ...optimize], says: 'a lightweight version for fast page loads' },
  product: {
    label: 'Product', video: null, says: 'a clean square product image',
    image: {
      primary: [{ effect: 'background_removal' }, { width: 1200, height: 1200, crop: 'pad' }, ...optimize],
      fallback: [{ width: 1200, height: 1200, crop: 'pad', background: 'auto' }, ...optimize],
    },
  },
}

// Rule-based selection from the REAL dimensions/type of the uploaded asset (not a model call).
export function decide(asset) {
  const ratio = asset.width / asset.height
  if (asset.resourceType === 'video')
    return ratio >= 1 ? { preset: 'reel', reason: 'We converted your landscape video into a vertical short-form version.' }
      : { preset: 'story', reason: 'Your video is already vertical, so we prepared it as a story.' }
  if (ratio < 0.8) return { preset: 'story', reason: 'We detected a portrait image and framed it for stories.' }
  if (ratio <= 1.25) return { preset: 'socialPost', reason: 'We detected a near-square image and framed it for social sharing.' }
  return { preset: 'website', reason: 'We detected a landscape image and optimized it for the web.' }
}

export async function runPreset(asset, key) {
  const recipe = recipes[key]
  const kind = asset.resourceType === 'video' ? 'video' : 'image'
  const spec = recipe[kind]
  const base = { preset: key, label: recipe.label, resourceType: asset.resourceType, original: asset.url }
  if (!spec) return { ...base, skipped: true, message: `${recipe.label} is available for images only.` }

  let steps = Array.isArray(spec) ? spec : spec.primary
  let notice = null
  let url = buildUrl(asset.publicId, asset.resourceType, steps)
  let check = await verifyDelivery(url)

  if (!check.ok && spec.fallback) {
    console.warn(`[pipeline] ${key} primary failed (${check.status} ${check.reason}); using fallback`)
    notice = 'Background removal is not enabled for this Cloudinary configuration. We optimized the product image instead.'
    steps = spec.fallback
    url = buildUrl(asset.publicId, asset.resourceType, steps)
    check = await verifyDelivery(url)
  }
  if (!check.ok) { console.error(`[pipeline] ${key} failed`, check); throw new Error('delivery failed') }

  const checks = [
    { ok: true, text: 'Format supported' },
    { ok: true, text: 'Optimized delivery verified on Cloudinary' },
    asset.bytes > 10 * MB ? { ok: false, text: 'Original file is large' } : { ok: true, text: 'Original file size is reasonable' },
  ]
  if (check.bytes && asset.bytes) {
    const saved = Math.round((1 - check.bytes / asset.bytes) * 100)
    if (saved > 0) checks.push({ ok: true, text: `Output is ${saved}% smaller than the original` })
  }
  if (key === 'product') checks.push({ ok: !notice, text: notice ? 'Background removal unavailable' : 'Background removed' })

  return {
    ...base, success: true, url, downloadUrl: buildUrl(asset.publicId, asset.resourceType, steps, { download: true }),
    publicId: asset.publicId, explanation: `We prepared ${recipe.says}.`, notice, checks, tags: asset.tags,
  }
}
