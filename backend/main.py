from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import generate

app = FastAPI(
    title="Lovable Clone API",
    description="AI-powered app builder backend using Claude API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router, prefix="/api")


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "lovable-clone-api"}
