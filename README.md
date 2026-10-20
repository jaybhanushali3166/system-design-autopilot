# System Design Autopilot 🚀

Automated generation, rendering, and publishing pipeline for high-quality System Design short-form reels (Instagram Reels / YouTube Shorts) using [Remotion](https://www.remotion.dev/), Three.js, GSAP, and automated voiceover synthesis.

**Link to the page**: https://www.instagram.com/beyond.localhost?srtk=MTI2NHpjemZua2J6cg%3D%3D&utm_source=qr

## 📦 Features

- **Automated Video Compositions**: Programmatic motion graphics, architecture diagrams, and animated components via Remotion & React.
- **Dynamic 3D & Characters**: 3D visual elements powered by Three.js and GSAP animations.
- **Voiceover Pipeline**: Multi-service voice synthesis support (ElevenLabs, Edge-TTS, macOS say).
- **Social Media Autopilot**: Automated scheduling and publishing scripts (`scripts/publish-instagram.py`, `scripts/scheduler.py`).
- **Comprehensive Topic Content Plan**: Tracked in `SYSTEM_DESIGN_CONTENT_PLAN.md`.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- ffmpeg

### Installation
```bash
npm install
```

### Environment Configuration
Copy `.env.example` to `.env` and fill in API credentials:
```bash
cp .env.example .env
```

### Development Studio
Launch Remotion Studio to preview and customize reels:
```bash
npm run start
```

### Rendering Reels
```bash
# Render a specific composition
npm run render

# Batch render all planned compositions
npm run render:all
```

## 📁 Project Structure

```
├── assets/          # Static branding, profile images, and reference assets
├── public/          # Audio files, icons, and public assets
├── scripts/         # Video rendering, voiceover generation, and scheduling scripts
├── src/
│   ├── components/  # Diagrams, server nodes, character scenes, UI elements
│   ├── compositions/# Core reel compositions (SystemDesignReel, etc.)
│   ├── data/        # Script data, timestamps, and architectural metadata
│   ├── Root.tsx     # Composition registry
│   └── index.ts     # Remotion entrypoint
├── remotion.config.ts
└── SYSTEM_DESIGN_CONTENT_PLAN.md
```

