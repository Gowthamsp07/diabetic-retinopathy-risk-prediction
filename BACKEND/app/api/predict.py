from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, validator
from typing import Literal

from app.model.predict import predict_diabetic_retinopathy

# Router
router = APIRouter(prefix="/api", tags=["Prediction"])


# ===============================
# INPUT SCHEMA (STRICT + SAFE)
# ===============================
class PatientInput(BaseModel):
    age: int = Field(..., ge=1, le=120)
    gender: Literal["Male", "Female"]

    time_in_hospital: int = Field(..., ge=0, le=30)
    num_lab_procedures: int = Field(..., ge=0)
    num_medications: int = Field(..., ge=0)

    number_outpatient: int = Field(..., ge=0)
    number_emergency: int = Field(..., ge=0)
    number_inpatient: int = Field(..., ge=0)

    number_diagnoses: int = Field(..., ge=0)

    insulin: Literal["Yes", "No"]
    diabetesMed: Literal["Yes", "No"]

    @validator("*", pre=True)
    def no_null_values(cls, v):
        if v is None:
            raise ValueError("Field cannot be null")
        return v


# ===============================
# PREDICTION ENDPOINT
# ===============================
@router.post("/predict")
def predict(data: PatientInput):
    try:
        # Convert validated input to dict
        input_data = data.dict()

        # Call model logic (UNCHANGED)
        result = predict_diabetic_retinopathy(input_data)

        return result

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Internal server error during prediction"
        )
