const BASE = import.meta.env.VITE_API_BASE_URL || ''
export const FRIENDLY = "We couldn't process this file. Please try again."

async function request(path, options) {
  let res, data
  try { res = await fetch(`${BASE}${path}`, options); data = await res.json() } catch { throw new Error(FRIENDLY) }
  if (!res.ok || data?.success === false) throw new Error(data?.message || FRIENDLY)
  return data
}
const post = (path, body) => request(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

export const health = () => request('/api/health')
export const processMedia = (asset, preset) => post('/api/process', { publicId: asset.publicId, resourceType: asset.resourceType, preset })
export const generateAll = (asset) => post('/api/generate', { publicId: asset.publicId, resourceType: asset.resourceType })
export const listMedia = () => request('/api/media').then((d) => d.media)
export const deleteMedia = (a) => request(`/api/media/${encodeURIComponent(a.publicId)}?resourceType=${a.resourceType}`, { method: 'DELETE' })

// XMLHttpRequest so the progress bar reflects real bytes sent.
export function uploadFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const x = new XMLHttpRequest()
    x.open('POST', `${BASE}/api/upload`)
    x.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total)
    x.onload = () => {
      try { const d = JSON.parse(x.responseText); x.status < 300 && d.success ? resolve(d.asset) : reject(new Error(d.message || FRIENDLY)) }
      catch { reject(new Error(FRIENDLY)) }
    }
    x.onerror = () => reject(new Error(FRIENDLY))
    const f = new FormData(); f.append('file', file); x.send(f)
  })
}
