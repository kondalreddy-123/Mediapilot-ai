# MediaPilot AI — One upload. One choice. Ready to share.

AI media pipeline for Hackathon Track 1. Users upload an image or video, choose a destination, and a real Cloudinary pipeline produces the output.

## How it works
React (Vite) → Express API → Cloudinary (upload, `c_fill,g_auto` content-aware crop, `q_auto`, `f_auto`, video transforms, optional background removal) → verified delivery URL → preview / download / share.

Every output URL is checked server-side (HEAD request to Cloudinary) before it is returned. Nothing is mocked.

## Honest feature notes
- **Background removal** (Product) needs the Cloudinary *AI Background Removal* add-on. If it isn't enabled, the app says so and falls back to a padded, optimized product image.
- **AI tags** need a tagging add-on. Set `CLOUDINARY_AI_TAGGING` (e.g. `google_tagging`) in `backend/.env`. Without it, no tags are shown.
- **Let AI Decide** picks a preset with simple rules from the real type and dimensions of your upload (not a model call) and explains the choice.
- **My Media** lists originals from Cloudinary (tag `mediapilot`). Versions are re-derived from the original on demand rather than stored.
- Video transforms are generated on first request and can take a few seconds.

## Setup
```bash
cd backend && cp .env.example .env   # fill Cloudinary credentials
npm install && npm run dev           # http://localhost:5000
cd ../frontend && cp .env.example .env
npm install && npm run dev           # http://localhost:5173
```
Set `VITE_API_BASE_URL=http://localhost:5000`. Secrets live only in `backend/.env`.

## Deploy
Backend → Render (root `backend`, start `npm start`, env vars incl. `CORS_ORIGIN=<vercel url>`). Frontend → Vercel (root `frontend`, `VITE_API_BASE_URL=<render url>`).
