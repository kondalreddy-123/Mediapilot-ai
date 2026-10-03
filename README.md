# MediaPilot AI — One upload. One choice. Ready to share.

MediaPilot AI is an AI-powered media pipeline built for **Cloudinary AI Media Pipelines — Track 1**.

Users upload an image or video, choose how they want to use it, and MediaPilot AI automatically processes the media through a real Cloudinary pipeline to produce an optimized, ready-to-share output.

## Track

**PS-01 · AI Media Pipelines**

---

## Problem

Creating ready-to-share media often requires multiple manual steps such as uploading files, resizing or cropping them, optimizing quality, converting formats, processing videos, and preparing different versions for different destinations.

MediaPilot AI simplifies this workflow into a single pipeline:

**Upload → Choose → Process → Verify → Preview → Share**

The goal is to reduce manual media-processing work while using Cloudinary's media infrastructure and AI capabilities where available.

---

## How It Works

```text
User Upload
     ↓
React + Vite Frontend
     ↓
Express Backend API
     ↓
Cloudinary
     ↓
AI / Media Processing
     ↓
Transformation & Optimization
     ↓
Verified Delivery URL
     ↓
Preview / Download / Share
