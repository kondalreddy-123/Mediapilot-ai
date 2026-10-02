import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mediaRoutes from './routes/media.js'
import { isConfigured } from './services/cloudinary.js'

const app = express()

// Allowed frontend origins
const allowedOrigins = [
  'https://mediapilot-ai.vercel.app',
  'http://localhost:5173'
]

// Add any extra origins from Render environment variable
if (process.env.CORS_ORIGIN) {
  const extraOrigins = process.env.CORS_ORIGIN
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)

  allowedOrigins.push(...extraOrigins)
}

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      console.warn(`CORS blocked origin: ${origin}`)
      return callback(new Error('Not allowed by CORS'))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
)

// Handle JSON requests
app.use(express.json({ limit: '100kb' }))

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    cloudinary: isConfigured(),
    aiTagging: Boolean(process.env.CLOUDINARY_AI_TAGGING)
  })
})

// Media API routes
app.use('/api', mediaRoutes)

// Error handler
app.use((err, _req, res, _next) => {
  console.error('[server]', err)

  res.status(500).json({
    success: false,
    message: "We couldn't process this file. Please try again."
  })
})

// Render provides PORT through environment variables
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`MediaPilot API running on port ${port}`)

  if (!isConfigured()) {
    console.warn(
      'Cloudinary credentials missing — set them in Render Environment Variables'
    )
  }
})
