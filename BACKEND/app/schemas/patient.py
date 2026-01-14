from pydantic import BaseModel, Field
from typing import Literal

class PatientData(BaseModel):
    age: int = Field(..., ge=20, le=100)
    years_since_diagnosis: int = Field(..., ge=0, le=50)
    hba1c: float = Field(..., ge=4.0, le=15.0)
    fasting_blood_sugar: int = Field(..., ge=70, le=300)
    postprandial_blood_sugar: int = Field(..., ge=100, le=400)
    systolic_bp: int = Field(..., ge=90, le=200)
    diastolic_bp: int = Field(..., ge=60, le=130)
    bmi: float = Field(..., ge=15.0, le=50.0)
    smoking: Literal[0, 1]
    physical_activity: Literal["sedentary", "light", "moderate", "active"]
    family_history: Literal[0, 1]

    class Config:
        json_schema_extra = {
            "example": {
                "age": 45,
                "years_since_diagnosis": 5,
                "hba1c": 6.8,
                "fasting_blood_sugar": 130,
                "postprandial_blood_sugar": 180,
                "systolic_bp": 130,
                "diastolic_bp": 85,
                "bmi": 26.0,
                "smoking": 0,
                "physical_activity": "moderate",
                "family_history": 0
            }
        }
