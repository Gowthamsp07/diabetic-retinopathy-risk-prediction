"""
Train Neural Network using scikit-learn MLP (NO TensorFlow)
Updated for your dataset structure
"""
import pandas as pd
import numpy as np
import pickle
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score, confusion_matrix

print("=" * 70)
print("🧠 TRAINING DEEP LEARNING MODEL FOR DIABETIC RETINOPATHY")
print("=" * 70)
print("Using scikit-learn MLPClassifier (Neural Network)")
print("=" * 70)

# Load your dataset
data_path = 'data/diabetic_retinopathy.csv'
print(f"📂 Loading dataset from: {data_path}")

if not os.path.exists(data_path):
    print("⚠️  Dataset not found. Creating sample dataset...")
    # Create sample with YOUR structure
    sample_data = pd.DataFrame({
        'age': [45, 60, 52, 38, 70, 48, 55, 42, 35, 58],
        'years_since_diagnosis': [5, 15, 10, 3, 20, 8, 12, 6, 4, 18],
        'hba1c': [6.8, 8.5, 7.2, 6.2, 9.1, 7.8, 8.2, 6.9, 6.5, 8.8],
        'fasting_blood_sugar': [130, 190, 145, 115, 210, 165, 180, 140, 125, 195],
        'postprandial_blood_sugar': [180, 260, 210, 160, 290, 230, 250, 195, 175, 270],
        'systolic_bp': [130, 150, 140, 120, 160, 145, 155, 135, 125, 158],
        'diastolic_bp': [85, 95, 90, 80, 100, 92, 96, 88, 82, 98],
        'bmi': [26.0, 31.0, 29.0, 23.0, 34.0, 28.5, 30.5, 27.0, 24.5, 32.5],
        'smoking': [0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
        'physical_activity': ['moderate', 'sedentary', 'light', 'active', 'sedentary', 'moderate', 'sedentary', 'active', 'moderate', 'light'],
        'family_history': [0, 1, 1, 0, 1, 0, 1, 0, 0, 1],
        'risk_label': [0, 1, 1, 0, 1, 1, 1, 0, 0, 1]
    })
    os.makedirs('data', exist_ok=True)
    sample_data.to_csv(data_path, index=False)
    df = sample_data
    print("✅ Created sample dataset with 10 patients")
else:
    df = pd.read_csv(data_path)
    print(f"✅ Dataset loaded: {df.shape[0]} patients, {df.shape[1]} features")

# Display dataset info
print(f"\n📊 Dataset Information:")
print(f"Columns: {list(df.columns)}")
print(f"\nFirst 3 rows:")
print(df.head(3))

# Check for target column
if 'risk_label' not in df.columns:
    print("❌ ERROR: 'risk_label' column not found in dataset")
    print(f"Available columns: {list(df.columns)}")
    exit(1)

# Prepare features and target
X = df.drop('risk_label', axis=1)
y = df['risk_label']

print(f"\n🎯 Target Distribution:")
print(y.value_counts())
print(f"At Risk (1): {y.sum()} patients ({y.mean()*100:.1f}%)")
print(f"Not at Risk (0): {len(y)-y.sum()} patients ({100-y.mean()*100:.1f}%)")

# Encode categorical variables
print(f"\n🔤 Encoding categorical variables...")
categorical_cols = X.select_dtypes(include=['object']).columns.tolist()

if len(categorical_cols) > 0:
    print(f"Categorical columns: {categorical_cols}")
    
    label_encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        label_encoders[col] = le
    
    # Save label encoders
    with open('model/label_encoders.pkl', 'wb') as f:
        pickle.dump(label_encoders, f)
    print(f"✅ Label encoders saved")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"\n✂️  Data Split:")
print(f"Training: {X_train.shape[0]} samples")
print(f"Testing:  {X_test.shape[0]} samples")

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
print(f"✅ Features scaled")

# Create model directory
os.makedirs('model', exist_ok=True)

# Save scaler
scaler_path = 'model/scaler.pkl'
with open(scaler_path, 'wb') as f:
    pickle.dump(scaler, f)
print(f"✅ Scaler saved: {scaler_path}")

# Save feature names
feature_names = X.columns.tolist()
feature_names_path = 'model/feature_names.pkl'
with open(feature_names_path, 'wb') as f:
    pickle.dump(feature_names, f)
print(f"✅ Feature names saved: {feature_names}")

# Build Neural Network
print("\n" + "=" * 70)
print("🧬 BUILDING DEEP NEURAL NETWORK")
print("=" * 70)
print(f"Input features: {X_train.shape[1]}")
print("Architecture: Input → Dense(64) → Dense(128) → Dense(64) → Output")
print("Activation: ReLU")
print("Optimizer: Adam")

model = MLPClassifier(
    hidden_layer_sizes=(64, 128, 64),
    activation='relu',
    solver='adam',
    alpha=0.0001,
    batch_size=32,
    learning_rate='adaptive',
    learning_rate_init=0.001,
    max_iter=1000,
    random_state=42,
    verbose=True,
    early_stopping=True,
    validation_fraction=0.2,
    n_iter_no_change=10
)

# Train the model
print("\n" + "=" * 70)
print("🚀 TRAINING NEURAL NETWORK")
print("=" * 70)
print("Training in progress...")
model.fit(X_train_scaled, y_train)
print("✅ Training complete!")

# Save model
model_path = 'model/ann_model.pkl'
joblib.dump(model, model_path)
print(f"✅ Model saved: {model_path}")

# Evaluate
print("\n" + "=" * 70)
print("📊 MODEL EVALUATION")
print("=" * 70)

y_pred = model.predict(X_test_scaled)
y_prob = model.predict_proba(X_test_scaled)[:, 1]

accuracy = accuracy_score(y_test, y_pred)
auc = roc_auc_score(y_test, y_prob)

print(f"Test Accuracy: {accuracy:.4f} ({accuracy*100:.1f}%)")
print(f"AUC Score:     {auc:.4f}")
print(f"Final Loss:    {model.loss_:.4f}")
print(f"Iterations:    {model.n_iter_}")

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print(f"\n📊 Confusion Matrix:")
print(f"           Predicted 0   Predicted 1")
print(f"Actual 0:      {cm[0,0]:4d}           {cm[0,1]:4d}")
print(f"Actual 1:      {cm[1,0]:4d}           {cm[1,1]:4d}")

print(f"\n📋 Classification Report:")
print(classification_report(y_test, y_pred, target_names=['Not at Risk', 'At Risk']))

# Sample predictions
print(f"\n🧪 SAMPLE PREDICTIONS:")
print("-" * 60)
for i in range(min(3, len(X_test))):
    actual = y_test.iloc[i]
    predicted = y_pred[i]
    probability = y_prob[i]
    status = "✅ CORRECT" if predicted == actual else "❌ WRONG"
    print(f"Patient {i+1}: Actual={actual}, Predicted={predicted}, "
          f"Probability={probability:.3f} {status}")
print("-" * 60)

# Save training report
report = f"""
DIABETIC RETINOPATHY DEEP LEARNING MODEL
=========================================
Training Date: {pd.Timestamp.now()}
Dataset: {data_path}
Samples: {df.shape[0]}
Features: {len(feature_names)}

MODEL ARCHITECTURE
------------------
Type: Multi-layer Perceptron (MLP)
Hidden Layers: 64 → 128 → 64 neurons
Activation: ReLU
Optimizer: Adam
Max Iterations: 1000

PERFORMANCE METRICS
-------------------
Accuracy: {accuracy:.4f}
AUC Score: {auc:.4f}
Loss: {model.loss_:.4f}
Iterations: {model.n_iter_}

CONFUSION MATRIX
----------------
True Negatives:  {cm[0,0]}
False Positives: {cm[0,1]}
False Negatives: {cm[1,0]}
True Positives:  {cm[1,1]}

MODEL FILES
-----------
1. ann_model.pkl - Trained neural network
2. scaler.pkl - Feature scaler
3. feature_names.pkl - Feature names
4. label_encoders.pkl - Categorical encoders
"""

report_path = 'model/training_report.txt'
with open(report_path, 'w') as f:
    f.write(report)
print(f"\n📄 Training report saved: {report_path}")

print("\n" + "=" * 70)
print("🎉 DEEP LEARNING MODEL TRAINED SUCCESSFULLY!")
print("=" * 70)
print("\n✅ Your Neural Network is ready for predictions!")
print("\n🎯 NEXT STEPS:")
print("1. The backend is already running on http://localhost:8000")
print("2. Test predictions at: http://localhost:8000/docs")
print("3. Connect your frontend to: http://localhost:8000/api/predict")
print("=" * 70)