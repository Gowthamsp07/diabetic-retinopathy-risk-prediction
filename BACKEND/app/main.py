from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.predict import router as predict_router

app = FastAPI(
    title="DR Risk Predictor API",
    version="1.0.0"
)

# ===============================
# CORS (FOR FRONTEND)
# ===============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# ROUTES
# ===============================
app.include_router(predict_router)


@app.get("/")
def root():
    return {"status": "DR Risk Predictor API is running"}
