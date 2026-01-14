"""
Quick script to verify model accuracy from notebook output
Run this after training to check your model metrics
"""
import joblib
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier

print("="*60)
print("🔍 VERIFYING MODEL ACCURACY")
print("="*60)

# Load model artifacts
model_dir = Path("model")
try:
    model = joblib.load(model_dir / "ann_model.pkl")
    scaler = joblib.load(model_dir / "scaler.pkl")
    feature_names = joblib.load(model_dir / "feature_names.pkl")
    print("✅ Model artifacts loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    exit(1)

# Load and prepare test data (same as training)
print("\n📊 Loading test data...")
try:
    df = pd.read_csv("data/diabetic_data.csv")
    df.replace("?", np.nan, inplace=True)
    df.drop(columns=["encounter_id", "patient_nbr"], inplace=True, errors='ignore')
    
    # Convert age
    age_map = {
        '[0-10)': 5, '[10-20)': 15, '[20-30)': 25,
        '[30-40)': 35, '[40-50)': 45, '[50-60)': 55,
        '[60-70)': 65, '[70-80)': 75, '[80-90)': 85,
        '[90-100)': 95
    }
    df["age"] = df["age"].map(age_map)
    
    # Create target
    df["high_risk"] = np.where(
        (df["A1Cresult"].isin([">8", ">7"])) |
        (df["max_glu_serum"] == ">300") |
        (df["number_diagnoses"] >= 7),
        1, 0
    )
    
    # Prepare features
    features = [
        "age", "gender", "time_in_hospital",
        "num_lab_procedures", "num_medications",
        "number_outpatient", "number_emergency",
        "number_inpatient", "number_diagnoses",
        "insulin", "diabetesMed"
    ]
    
    X = df[features].copy()
    y = df["high_risk"].copy()
    
    # Normalize categorical values
    X = X.fillna({'gender': 'Male', 'insulin': 'No', 'diabetesMed': 'No'})
    X['gender'] = X['gender'].map({'Male': 'Male', 'Female': 'Female', 'Unknown/Invalid': 'Male'}).fillna('Male')
    X['insulin'] = X['insulin'].map({'Up': 'Yes', 'Down': 'Yes', 'Steady': 'Yes', 'No': 'No'}).fillna('No')
    X['diabetesMed'] = X['diabetesMed'].map({'Yes': 'Yes', 'No': 'No', 'Ch': 'Yes'}).fillna('No')
    
    # Encode
    X_encoded = pd.get_dummies(X, drop_first=True)
    
    # Align with model features
    X_encoded = X_encoded.reindex(columns=feature_names, fill_value=0)
    
    # Split (same random state as training)
    X_train, X_test, y_train, y_test = train_test_split(
        X_encoded, y, test_size=0.2, stratify=y, random_state=42
    )
    
    # Scale
    X_test_scaled = scaler.transform(X_test)
    
    print(f"✅ Test data prepared: {X_test.shape[0]} samples")
    
except Exception as e:
    print(f"❌ Error preparing test data: {e}")
    exit(1)

# Evaluate model
print("\n🎯 Evaluating model performance...")
try:
    y_pred = model.predict(X_test_scaled)
    y_proba = model.predict_proba(X_test_scaled)[:, 1]
    
    accuracy = accuracy_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_proba)
    
    print("\n" + "="*60)
    print("📊 MODEL PERFORMANCE METRICS")
    print("="*60)
    print(f"\n✅ Accuracy: {accuracy*100:.2f}%")
    print(f"✅ ROC-AUC Score: {roc_auc:.4f}")
    
    print("\n" + "-"*60)
    print("📋 Classification Report:")
    print("-"*60)
    print(classification_report(y_test, y_pred, target_names=['Low Risk', 'High Risk']))
    
    print("\n" + "="*60)
    print("✅ VERIFICATION COMPLETE")
    print("="*60)
    
    if accuracy >= 0.90:
        print("🎉 Excellent model performance!")
    elif accuracy >= 0.85:
        print("✅ Good model performance!")
    else:
        print("⚠️  Model performance could be improved")
        
except Exception as e:
    print(f"❌ Error evaluating model: {e}")
    exit(1)
