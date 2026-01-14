# SIMPLE WORKING TRAINING SCRIPT
print("Starting Deep Learning Model Training...")

import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier
import joblib
import pickle

# Create sample data with YOUR structure
print("Creating/loading dataset...")
data = {
    'age': [45, 60, 52, 38, 70, 48, 55, 42],
    'years_since_diagnosis': [5, 15, 10, 3, 20, 8, 12, 6],
    'hba1c': [6.8, 8.5, 7.2, 6.2, 9.1, 7.8, 8.2, 6.9],
    'fasting_blood_sugar': [130, 190, 145, 115, 210, 165, 180, 140],
    'postprandial_blood_sugar': [180, 260, 210, 160, 290, 230, 250, 195],
    'systolic_bp': [130, 150, 140, 120, 160, 145, 155, 135],
    'diastolic_bp': [85, 95, 90, 80, 100, 92, 96, 88],
    'bmi': [26.0, 31.0, 29.0, 23.0, 34.0, 28.5, 30.5, 27.0],
    'smoking': [0, 1, 0, 0, 1, 0, 1, 0],
    'physical_activity': [1, 0, 2, 3, 0, 1, 0, 3],  # Encoded: 0=sede, 1=light, 2=moderate, 3=active
    'family_history': [0, 1, 1, 0, 1, 0, 1, 0],
    'risk_label': [0, 1, 1, 0, 1, 1, 1, 0]
}

df = pd.DataFrame(data)

# Save to CSV
os.makedirs('data', exist_ok=True)
df.to_csv('data/diabetic_retinopathy.csv', index=False)
print(f"Dataset created: {df.shape[0]} rows, {df.shape[1]} columns")

# Prepare data
X = df.drop('risk_label', axis=1)
y = df['risk_label']

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)

# Create model directory
os.makedirs('model', exist_ok=True)

# Save scaler
with open('model/scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)
print("✅ Scaler saved")

# Train Neural Network
print("Training Neural Network (64->128->64 neurons)...")
model = MLPClassifier(
    hidden_layer_sizes=(64, 128, 64),
    activation='relu',
    solver='adam',
    max_iter=500,
    random_state=42
)

model.fit(X_train_scaled, y_train)

# Save model
joblib.dump(model, 'model/ann_model.pkl')
print("✅ Model saved: model/ann_model.pkl")

# Save feature names
feature_names = X.columns.tolist()
with open('model/feature_names.pkl', 'wb') as f:
    pickle.dump(feature_names, f)
print(f"✅ Feature names saved: {feature_names}")

# Evaluate
accuracy = model.score(scaler.transform(X_test), y_test)
print(f"\n🎯 MODEL TRAINING COMPLETE!")
print(f"Accuracy: {accuracy:.3f} ({accuracy*100:.1f}%)")
print(f"\n✅ Deep Learning Model is READY!")
