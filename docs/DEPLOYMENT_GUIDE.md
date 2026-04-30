# 🚀 Deployment Guide: RK FURNISHINGS AI

This system is now architected for a production-grade decoupled deployment.

## 1. Backend (FastAPI + YOLO)
**Recommended Platform:** [Render.com](https://render.com) or [Railway.app](https://railway.app)

1.  Create a New Web Service.
2.  Connect your GitHub repository.
3.  Set **Root Directory** as `backend/`.
4.  **Runtime:** `Python 3.9+`.
5.  **Install Command:** `pip install -r requirements.txt`.
6.  **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000`.
7.  **Environment Variables:** 
    - `PORT=10000`
    - `HUGGINGFACE_HUB_TOKEN` (Optional, if using private models)

## 2. Frontend (Next.js)
**Recommended Platform:** [Vercel](https://vercel.com)

1.  Import project to Vercel.
2.  Set **Root Directory** as `./` (Project Root).
3.  **Build Command:** `npm run build`
4.  **Output Directory:** `.next`
5.  **Environment Variables:**
    - `NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com`
    - `NEXT_PUBLIC_GEMINI_API_KEY=your_key`
6.  Deploy!

## 🏠 Local Development (Triple-Stack)
Starting the entire ecosystem locally:

```bash
# In the project root:
npm run dev
```

This starts:
1.  **Frontend**: `localhost:3000` (Next.js)
2.  **Core API**: `localhost:5000` (Node/Express)
3.  **AI Engine**: `localhost:10000` (Python/FastAPI)

---

## 🧪 Consistency Fixes
- **No more shaky measurements**: The `AI_Measurer` class in `measurement.py` now locks the scale factor per image using a fixed vertical reference.
- **Persistent Logic**: Manual height adjustments in the UI no longer affect the width's pixel-to-ft ratio once detection is complete.
- **Low Latency**: The system caches AI results by image hash, ensuring instant re-loads for previously analyzed rooms.
