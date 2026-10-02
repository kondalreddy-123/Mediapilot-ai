import { Router } from 'express'
import multer from 'multer'
import * as c from '../controllers/mediaController.js'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime']
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => (ALLOWED.includes(file.mimetype) ? cb(null, true) : cb(Object.assign(new Error('type'), { code: 'BAD_TYPE' }))),
})
const single = (req, res, next) =>
  upload.single('file')(req, res, (err) => {
    if (!err) return next()
    const msg = err.code === 'LIMIT_FILE_SIZE' ? 'This file is too large. The limit is 100 MB.'
      : err.code === 'BAD_TYPE' ? 'Please upload a JPG, PNG, WebP, MP4 or MOV file.' : "We couldn't read this file. Please try again."
    res.status(400).json({ success: false, message: msg })
  })

const r = Router()
r.post('/upload', single, c.upload)
r.post('/process', c.process)
r.post('/generate', c.generate)
r.get('/media', c.list)
r.delete('/media/:id', c.remove)
export default r
