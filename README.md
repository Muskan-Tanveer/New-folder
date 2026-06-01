# Explore Pakistan

Full-stack AI travel guide: Next.js frontend + FastAPI chatbot (Gemini + Qdrant).

**Deploy (course requirement):** backend on **Railway**, frontend on **Vercel**.

## Local development

**Backend** (terminal 1):

```bash
cd Backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # fill keys
python run.py
```

**Frontend** (terminal 2, repo root):

```bash
npm install
cp .env.example .env.local  # optional; omit NEXT_PUBLIC_API_URL to use localhost:8000
npm run dev
```

Open http://localhost:3000

## Deploy backend (Railway)

1. Push repo to GitHub.
2. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** → select repo.
3. Service **Settings** → **Root Directory** → `Backend`
4. **Variables** (from `Backend/.env.example`):
   - `GEMINI_API_KEY`
   - `QDRANT_URL`
   - `QDRANT_API_KEY`
   - `FRONTEND_URL` = your Vercel URL (set after frontend deploy, then redeploy backend)
5. **Settings** → **Networking** → **Generate Domain** → copy URL (e.g. `https://xxx.up.railway.app`)

Health check: `https://your-railway-url/health` should show `"status":"ok"` when all keys are set. Root `/` returns a short JSON welcome message.

## Deploy frontend (Vercel)

1. [vercel.com](https://vercel.com) → **Add New Project** → import same GitHub repo.
2. Framework: **Next.js** (root directory = repo root, not `Backend`).
3. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = Railway URL (no trailing slash), e.g. `https://xxx.up.railway.app`
4. Deploy → copy production URL (e.g. `https://your-app.vercel.app`).
5. Railway → set `FRONTEND_URL` to that Vercel URL → **Redeploy** backend (CORS).

Test chat on the live Vercel site.

## Checklist for submission

- [ ] Railway backend URL works (`/` JSON response)
- [ ] Vercel site loads destinations pages
- [ ] Chat widget returns answers (not “unavailable”)
- [ ] `FRONTEND_URL` on Railway matches Vercel URL exactly (https, no trailing slash)
