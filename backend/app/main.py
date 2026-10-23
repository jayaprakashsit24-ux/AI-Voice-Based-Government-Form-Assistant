from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .api.endpoints import forms, voice_assistant, submissions

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Accessible voice-first backend for government form filling powered by Web Speech & Gemini AI."
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(forms.router, prefix=f"{settings.API_PREFIX}/forms", tags=["forms"])
app.include_router(voice_assistant.router, prefix=f"{settings.API_PREFIX}/assistant", tags=["assistant"])
app.include_router(submissions.router, prefix=f"{settings.API_PREFIX}/submissions", tags=["submissions"])

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "gemini_configured": bool(settings.GEMINI_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
