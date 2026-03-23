# ⚡ BuildKaro — AI-Powered App Builder

A **GenAi** full-stack app builder. Describe a UI in plain English, get working React code instantly — with a live preview.

**Stack:** FastAPI (Python) · Next.js · GeminiAi · Tailwind CSS

---

## 🏗 Architecture

```
BuildKaro/
├── backend/               ← FastAPI (Python)
│   ├── main.py            ← App entry point, CORS, router registration
│   ├── app/
│   │   ├── schemas.py     ← Pydantic request/response models
│   │   ├── claude_service.py  ← Anthropic SDK, prompt, LLM logic
│   │   └── routes/
│   │       └── generate.py    ← POST /api/generate endpoint
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/              ← Next.js (TypeScript)
    ├── app/page.tsx       ← Split-panel main page
    ├── components/
    │   ├── ChatPanel.tsx  ← Multi-turn chat UI
    │   └── CodePanel.tsx  ← Code view + live iframe preview
    └── lib/types.ts
```

---

## 🚀 Getting Started

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

uvicorn main:app --reload --port 8000
```

API running at → `http://localhost:8000`
Swagger docs → `http://localhost:8000/docs`

---

### Frontend (Next.js)

```bash
cd frontend
npm install

cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev
```

App running at → `http://localhost:3000`

---

## 🔌 API Reference

### `POST /api/generate`

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Build a dark dashboard with sidebar and analytics cards" }
  ]
}
```

**Response:**
```json
{
  "code": "export default function App() { ... }"
}
```

Full conversation history is passed on every request — Claude maintains full context for iterative refinements.

---

## ✨ Features

- 💬 **Multi-turn chat** — iterate on your app with follow-up prompts
- ⚡ **FastAPI backend** — typed endpoints, Pydantic validation, auto Swagger docs
- 🤖 **Gemini AI** — generates self-contained React JSX components
- 👁 **Live preview** — renders output in a sandboxed iframe via Babel Standalone
- ⌨️ **Syntax highlighting** — code view with line numbers
- 📋 **One-click copy** — copy generated code instantly

---

## 🔑 Environment Variables

| Location | Variable | Description |
|---|---|---|
| `backend/.env` | `ANTHROPIC_API_KEY` | Anthropic API key |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | FastAPI server URL |

---

## 📄 License

MIT
