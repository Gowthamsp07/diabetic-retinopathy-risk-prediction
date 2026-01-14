//Diabetic Retinopathy Risk Predictor//
Full-Stack Machine Learning Application

Project Summary
The Diabetic Retinopathy Risk Predictor is a full-stack machine learning project that estimates the risk probability of Diabetic Retinopathy (DR) using structured diabetic health data.
This project focuses on risk prediction and early screening, not medical diagnosis.
It combines machine learning, FastAPI backend, and a React + TypeScript frontend into a complete, production-style system.

The goal of this project is to demonstrate:
End-to-end ML pipeline design

Real-world backend–frontend integration
Practical healthcare risk modeling
Clean, scalable full-stack architecture

Problem Statement

Diabetic Retinopathy is a common complication of long-term diabetes and is a major cause of vision impairment.
Early stages often show no symptoms, making early risk estimation important.

This project predicts:
The probability (%) of developing Diabetic Retinopathy
A risk category (Low / Moderate / High)

A general preventive recommendation
The prediction is based on clinical, hospital, and treatment indicators derived from diabetic patient data.

Key Features

Artificial Neural Network (ANN)–based risk prediction
FastAPI REST backend
React + TypeScript frontend
Secure authentication integration
Real-time prediction flow
Clean UI with clear medical disclaimers
Modular and maintainable codebase
Production-style project structure
integreted with ai-assistant

Machine Learning Overview
Model Type
Artificial Neural Network (ANN)
Input Data

Structured diabetic patient indicators such as:
Age and gender
Hospital visit history
Lab procedures
Medication usage
Diagnosis counts
Diabetes treatment indicators

Output
Risk Probability (0–100%)
Risk Level:
LOW
MODERATE
HIGH

Preventive recommendation

Important Note on Predictions

Most normal patients correctly receive very low risk probabilities

High risk predictions appear only for clinically severe profiles

This behavior reflects realistic and conservative medical modeling

The system avoids over-prediction for safety reasons

Project Architecture

User
→ Frontend (React + TypeScript)
→ Feature Mapping Layer
→ FastAPI Backend
→ ANN Model
→ Risk Probability + Interpretation
→ Results Dashboard

Backend Structure (FastAPI)

BACKEND/

app/
api/ API endpoints
model/ Trained ANN model files
schemas/ Request/response validation
utils/ Preprocessing utilities
main.py FastAPI entry point
training/ Model training scripts
notebooks/ Data exploration & experiments
data/ Dataset files
requirements.txt
Backend Responsibilities
Accept patient data via REST API

Validate inputs

Preprocess and scale features

Load trained model

Generate prediction
Return structured JSON response

Frontend Structure (React + TypeScript)

FRONTEND/
src/
pages/ Application pages
components/ Reusable UI components
lib/ API and data mapping logic
contexts/ Authentication logic
main.tsx
public/
package.json

Frontend Responsibilities
User authentication
Data collection via assessment form
Trigger prediction requests
Display loading and analysis state
Visualize risk results
Show recommendations and disclaimers

How the Prediction Pipeline Works
User enters diabetic health data in the frontend
Frontend maps UI data to backend-expected features
Backend receives validated request
Features are preprocessed and scaled
ANN model generates probability
Risk level is derived from probability
Result is returned to frontend
Frontend displays result clearly to the user

Running the Project Locally
Backend

Open a terminal:

cd BACKEND
pip install -r requirements.txt
uvicorn app.main:app --reload


Backend runs on:
http://127.0.0.1:8000

Frontend

Open another terminal:

cd FRONTEND
npm install
npm run dev


Frontend runs on:
http://localhost:8080

⚠️ Both frontend and backend must be running at the same time.

Why Jupyter Notebooks Exist in This Project

Jupyter notebooks were used for:
Dataset exploration
Feature understanding
Model experimentation
Performance evaluation

Final production logic was moved into Python scripts for deployment.
Notebooks are kept for transparency and reproducibility.

Limitations
Uses only structured diabetic health data
Does not analyze retinal images
Not intended for real medical diagnosis
Predictions depend on training data distribution
Conservative risk estimation by design

Future Enhancements
Retinal image-based DR detection (CNN)
Explainable AI (SHAP/LIME)
Model calibration improvements
Cloud deployment
Multi-year risk forecasting
Integration with real clinical workflows

Skills Demonstrated
Machine Learning (ANN, preprocessing, evaluation)
FastAPI backend development

REST API design
React + TypeScript frontend development
Full-stack integration
Authentication systems
Healthcare ML ethics awareness
Clean project structuring

Disclaimer//

This project is strictly for educational and research purposes.
It does not replace professional medical advice, diagnosis, or treatment.

Final Note//

This project demonstrates a realistic, full-stack machine learning workflow applied to healthcare risk prediction.
It prioritizes engineering correctness, clarity, and ethical responsibility over unrealistic accuracy claims.
