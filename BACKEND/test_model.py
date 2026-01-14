"""
Test script to verify the retrained model works correctly
"""
import sys
from pathlib import Path
import joblib
import pandas as pd
import numpy as np

# Add app to path
sys.path.insert(0, str(Path(__file__).parent))

from app.model.predict import predict_diabetic_retinopathy

print("="*60)
print("🧪 TESTING RETRAINED MODEL")
print("="*60)

# Test 1: Check model files exist
print("\n📦 Test 1: Checking model files...")
model_dir = Path("model")
files_to_check = ["ann_model.pkl", "scaler.pkl", "feature_names.pkl"]
all_exist = True

for file_name in files_to_check:
    file_path = model_dir / file_name
    exists = file_path.exists()
    size = file_path.stat().st_size if exists else 0
    print(f"  {'✅' if exists else '❌'} {file_name}: {exists} ({size:,} bytes)")
    if not exists:
        all_exist = False

if not all_exist:
    print("\n❌ ERROR: Some model files are missing!")
    sys.exit(1)

# Test 2: Load and check feature names
print("\n📋 Test 2: Checking feature names...")
try:
    feature_names = joblib.load(model_dir / "feature_names.pkl")
    print(f"  ✅ Loaded {len(feature_names)} feature names")
    print(f"  📝 First 5 features: {feature_names[:5]}")
    print(f"  📝 Last 5 features: {feature_names[-5:]}")
except Exception as e:
    print(f"  ❌ Error loading features: {e}")
    sys.exit(1)

# Test 3: Test predictions with different scenarios
print("\n🎯 Test 3: Testing predictions...")

test_cases = [
    {
        "name": "Low Risk Patient",
        "data": {
            "age": 45,
            "gender": "Male",
            "time_in_hospital": 2,
            "num_lab_procedures": 30,
            "num_medications": 5,
            "number_outpatient": 0,
            "number_emergency": 0,
            "number_inpatient": 0,
            "number_diagnoses": 2,
            "insulin": "No",
            "diabetesMed": "Yes"
        }
    },
    {
        "name": "High Risk Patient",
        "data": {
            "age": 65,
            "gender": "Male",
            "time_in_hospital": 10,
            "num_lab_procedures": 70,
            "num_medications": 25,
            "number_outpatient": 5,
            "number_emergency": 3,
            "number_inpatient": 2,
            "number_diagnoses": 9,
            "insulin": "Yes",
            "diabetesMed": "Yes"
        }
    },
    {
        "name": "Female Patient - Moderate Risk",
        "data": {
            "age": 55,
            "gender": "Female",
            "time_in_hospital": 5,
            "num_lab_procedures": 45,
            "num_medications": 15,
            "number_outpatient": 2,
            "number_emergency": 1,
            "number_inpatient": 1,
            "number_diagnoses": 5,
            "insulin": "Yes",
            "diabetesMed": "Yes"
        }
    }
]

all_passed = True
for i, test_case in enumerate(test_cases, 1):
    print(f"\n  Test 3.{i}: {test_case['name']}")
    try:
        result = predict_diabetic_retinopathy(test_case['data'])
        
        if result.get('success'):
            prob = result.get('probability', 0)
            risk_level = result.get('risk_level', 'UNKNOWN')
            
            print(f"    ✅ Prediction successful")
            print(f"    📊 Risk Probability: {prob:.2f}%")
            print(f"    🎯 Risk Level: {risk_level}")
            
            # Verify probability is reasonable (0-100)
            if prob < 0 or prob > 100:
                print(f"    ⚠️  WARNING: Probability out of range: {prob}%")
                all_passed = False
            elif prob == 0:
                print(f"    ⚠️  WARNING: Probability is 0% - model may not be working correctly")
                all_passed = False
        else:
            print(f"    ❌ Prediction failed: {result.get('error', 'Unknown error')}")
            all_passed = False
            
    except Exception as e:
        print(f"    ❌ Error: {e}")
        all_passed = False

# Test 4: Verify feature alignment
print("\n🔍 Test 4: Verifying feature alignment...")
try:
    # Create a test sample
    test_data = {
        "age": 50,
        "gender": "Male",
        "time_in_hospital": 5,
        "num_lab_procedures": 45,
        "num_medications": 15,
        "number_outpatient": 2,
        "number_emergency": 1,
        "number_inpatient": 1,
        "number_diagnoses": 5,
        "insulin": "Yes",
        "diabetesMed": "Yes"
    }
    
    # Convert to DataFrame and encode (same as prediction function)
    df = pd.DataFrame([test_data])
    df_encoded = pd.get_dummies(df, drop_first=True)
    df_aligned = df_encoded.reindex(columns=feature_names, fill_value=0)
    
    print(f"  ✅ Input features: {len(test_data)}")
    print(f"  ✅ Encoded features: {df_encoded.shape[1]}")
    print(f"  ✅ Aligned features: {df_aligned.shape[1]} (matches model: {len(feature_names)})")
    
    if df_aligned.shape[1] != len(feature_names):
        print(f"  ❌ ERROR: Feature count mismatch!")
        all_passed = False
    else:
        print(f"  ✅ Feature alignment correct!")
        
except Exception as e:
    print(f"  ❌ Error: {e}")
    all_passed = False

# Final Summary
print("\n" + "="*60)
if all_passed:
    print("✅ ALL TESTS PASSED!")
    print("="*60)
    print("\n🎉 The retrained model is working correctly!")
    print("\n📋 Next Steps:")
    print("  1. Restart your backend server: python run.py")
    print("  2. Test predictions through the frontend")
    print("  3. Verify risk probabilities are calculated correctly")
else:
    print("❌ SOME TESTS FAILED")
    print("="*60)
    print("\n⚠️  Please check the errors above and fix them before using the model.")
    sys.exit(1)
