import { v2 as cloudinary } from 'cloudinary'

export const isConfigured = () => ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].every((k) => process.env[k])
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const FOLDER = 'mediapilot'
export const ownsAsset = (publicId) => typeof publicId === 'string' && publicId.startsWith(`${FOLDER}/`)

export const toAsset = (r) => ({
  publicId: r.public_id,
  url: r.secure_url,
  resourceType: r.resource_type,
  format: r.format,
  width: r.width,
  height: r.height,
  duration: r.duration ?? null,
  bytes: r.bytes,
  tags: (r.tags || []).filter((t) => t !== FOLDER),
  createdAt: r.created_at,
  thumb: cloudinary.url(r.public_id, {
    resource_type: r.resource_type, format: 'jpg', secure: true,
    transformation: [{ width: 480, height: 320, crop: 'fill' }, { quality: 'auto' }],
  }),
})

function streamUpload(buffer, opts) {
  return new Promise((resolve, reject) =>
    cloudinary.uploader.upload_stream(opts, (e, r) => (e ? reject(e) : resolve(r))).end(buffer))
}

// Real upload. If an AI-tagging add-on is configured we request it; if Cloudinary rejects it, we retry without.
export async function uploadBuffer(buffer) {
  const base = { resource_type: 'auto', folder: FOLDER, tags: [FOLDER] }
  const tagging = process.env.CLOUDINARY_AI_TAGGING
  if (tagging) {
    try {
      return { result: await streamUpload(buffer, { ...base, categorization: tagging, auto_tagging: 0.6 }), taggingApplied: true }
    } catch (e) {
      console.warn('[cloudinary] AI tagging unavailable, uploading without it:', e.message)
    }
  }
  return { result: await streamUpload(buffer, base), taggingApplied: false }
}

export const getAsset = async (publicId, resourceType) => toAsset(await cloudinary.api.resource(publicId, { resource_type: resourceType }))

export async function listAssets() {
  const get = (resource_type) => cloudinary.api.resources_by_tag(FOLDER, { resource_type, tags: true, max_results: 100 }).then((r) => r.resources)
  const all = [...(await get('image')), ...(await get('video'))]
  return all.map(toAsset).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export const deleteAsset = (publicId, resourceType) => cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true })

export function buildUrl(publicId, resourceType, transformation, { download = false } = {}) {
  return cloudinary.url(publicId, {
    resource_type: resourceType, type: 'upload', secure: true,
    transformation: download ? [...transformation, { flags: 'attachment' }] : transformation,
  })
}

// Ask Cloudinary for the derived asset and confirm it is really deliverable (423 = still processing).
export async function verifyDelivery(url, tries = 8) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { method: 'HEAD' })
    if (res.ok) return { ok: true, bytes: Number(res.headers.get('content-length')) || null }
    if (res.status === 423 || res.status === 202) { await new Promise((s) => setTimeout(s, 2000)); continue }
    return { ok: false, status: res.status, reason: res.headers.get('x-cld-error') }
  }
  return { ok: false, status: 423, reason: 'still processing' }
}
