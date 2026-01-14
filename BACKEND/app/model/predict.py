import joblib
import pandas as pd
from pathlib import Path
import numpy as np

# ======================================================
# LOAD MODEL ARTIFACTS (ONCE AT STARTUP)
# ======================================================

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "model"

model = joblib.load(MODEL_DIR / "ann_model.pkl")
scaler = joblib.load(MODEL_DIR / "scaler.pkl")
feature_names = joblib.load(MODEL_DIR / "feature_names.pkl")

print("✅ Model, scaler, and feature names loaded")


# ======================================================
# HELPER: CLEAN INPUT (FRONTEND MAY SEND JUNK)
# ======================================================

def clean_value(val, default=0):
    """
    Convert junk frontend values to safe numeric values
    """
    if val is None:
        return default
    if isinstance(val, str):
        val = val.strip()
        if val in ["", "?", "NA", "None"]:
            return default
    return val


# ======================================================
# MAIN PREDICTION FUNCTION
# ======================================================

def predict_diabetic_retinopathy(patient_data: dict) -> dict:
    """
    Predict diabetic retinopathy risk using trained ANN model
    """

    try:
        # --------------------------------------------------
        # 1. CLEAN INPUT DATA
        # --------------------------------------------------
        cleaned_data = {k: clean_value(v) for k, v in patient_data.items()}

        # --------------------------------------------------
        # 2. CONVERT JSON → DATAFRAME
        # --------------------------------------------------
        df = pd.DataFrame([cleaned_data])

        # --------------------------------------------------
        # 3. ONE-HOT ENCODE (MATCH TRAINING)
        # Must use drop_first=True to match training pipeline
        # --------------------------------------------------
        df = pd.get_dummies(df, drop_first=True)

        # --------------------------------------------------
        # 4. ALIGN FEATURES WITH TRAINED MODEL
        # --------------------------------------------------
        df = df.reindex(columns=feature_names, fill_value=0)

        # --------------------------------------------------
        # 5. SCALE FEATURES
        # --------------------------------------------------
        X_scaled = scaler.transform(df)

        # --------------------------------------------------
        # 6. PREDICT PROBABILITY
        # --------------------------------------------------
        probability = float(model.predict_proba(X_scaled)[0][1])

        probability = max(0.0, min(1.0, probability))

        # --------------------------------------------------
        # 7. RISK INTERPRETATION
        # --------------------------------------------------
        if probability >= 0.7:
            risk_level = "HIGH RISK"
            recommendation = (
                "Immediate consultation with an ophthalmologist is recommended. "
                "High probability of developing diabetic retinopathy."
            )
        elif probability >= 0.5:
            risk_level = "MODERATE RISK"
            recommendation = (
                "Schedule a comprehensive eye examination within 1 month. "
                "Regular monitoring is advised."
            )
        elif probability >= 0.3:
            risk_level = "LOW RISK"
            recommendation = (
                "Annual retinal screening is recommended. "
                "Continue good diabetes management."
            )
        else:
            risk_level = "VERY LOW RISK"
            recommendation = (
                "Continue routine eye examinations and maintain healthy diabetes management."
            )

        return {
            "success": True,
            "probability": round(probability * 100, 2),
            "risk_level": risk_level,
            "recommendation": recommendation,
            "model": "Deep Learning Neural Network (MLPClassifier)",
            "features_used": list(feature_names)
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "required_features": list(feature_names)
        }


# ======================================================
# LOCAL TEST
# ======================================================

if __name__ == "__main__":
    # Test with data matching frontend format
    test_data = {
        "age": 65,
        "gender": "Male",
        "time_in_hospital": 7,
        "num_lab_procedures": 55,
        "num_medications": 18,
        "number_outpatient": 2,
        "number_emergency": 1,
        "number_inpatient": 3,
        "number_diagnoses": 8,
        "insulin": "Yes",  # Frontend sends "Yes"/"No", not "Up"/"Down"
        "diabetesMed": "Yes"
    }

    result = predict_diabetic_retinopathy(test_data)
    print("🧪 Test Result:", result)
    if result.get('success'):
        print(f"✅ Prediction successful: {result.get('probability', 0):.2f}% risk")
    else:
        print(f"❌ Prediction failed: {result.get('error', 'Unknown error')}")