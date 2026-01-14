from pydantic import BaseModel
from typing import List

class PredictionResponse(BaseModel):
    success: bool
    probability: float
    risk_level: str
    recommendation: str
    model: str
    features_used: List[str]
