import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mediaRoutes from './routes/media.js'
import { isConfigured } from './services/cloudinary.js'

const app = express()
app.use(cors({ origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',') }))
app.use(express.json({ limit: '100kb' }))
app.get('/api/health', (_req, res) => res.json({ success: true, cloudinary: isConfigured(), aiTagging: Boolean(process.env.CLOUDINARY_AI_TAGGING) }))
app.use('/api', mediaRoutes)
app.use((err, _req, res, _next) => {
  console.error('[server]', err)
  res.status(500).json({ success: false, message: "We couldn't process this file. Please try again." })
})
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`MediaPilot API on :${port}`)
  if (!isConfigured()) console.warn('Cloudinary credentials missing — set them in backend/.env')
})
