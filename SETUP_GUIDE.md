# DR Risk Predictor - Setup & Integration Guide

## 🎯 Project Overview

This is a full-stack Machine Learning web application for predicting Diabetic Retinopathy (DR) risk using an Artificial Neural Network (ANN) model trained on hospital datasets.

## 📋 Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 18+** and **npm** (for frontend)
- **Git** (for cloning the repository)

## 🚀 Quick Start

### 1. Backend Setup

```powershell
# Navigate to backend directory
cd BACKEND

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate

# Install dependencies
pip install -r requirements.txt

# Verify model files exist
# Should have: model/ann_model.pkl, model/scaler.pkl, model/feature_names.pkl

# Start the backend server
python run.py
```

The backend will start on **http://localhost:8000**

You can verify it's running by visiting:
- API Root: http://localhost:8000/
- API Docs: http://localhost:8000/docs

### 2. Frontend Setup

```powershell
# Open a new terminal, navigate to frontend directory
cd FRONTEND

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on **http://localhost:5173** (or another port if 5173 is busy)

### 3. Run Integration Test

```powershell
# From project root
.\test-integration.ps1
```

## 🔄 How It Works

### Data Flow

1. **User Input (Frontend)** → User fills out assessment form with:
   - Age, Gender
   - Diabetes Type, Years Since Diagnosis
   - HbA1c, BMI, Blood Pressure, Blood Sugar levels
   - Lifestyle factors (smoking, physical activity, family history)

2. **Data Transformation** → `prediction-service.ts` maps UI-friendly data to backend format:
   - Converts gender: "male"/"female" → "Male"/"Female"
   - Synthesizes hospital-style features from clinical data:
     - `time_in_hospital`: Based on years since diagnosis and HbA1c
     - `num_lab_procedures`: Based on diabetes duration and control
     - `num_medications`: Based on BMI and duration
     - `number_outpatient/emergency/inpatient`: Based on risk factors
     - `number_diagnoses`: Based on comorbidities
     - `insulin`: "Yes" for Type 1 or high HbA1c, "No" otherwise
     - `diabetesMed`: Always "Yes" (assumed treated)

3. **Backend Prediction** → FastAPI endpoint receives payload:
   - Validates input schema
   - Preprocesses data (one-hot encoding, scaling)
   - Runs ANN model inference
   - Returns risk probability and level

4. **Response Normalization** → Frontend normalizes backend response:
   - Converts probability to percentage
   - Maps risk level strings to UI-friendly format
   - Builds contributing factors from original patient data
   - Generates personalized recommendations

5. **Results Display** → Results page shows:
   - Risk probability with visual indicator
   - Risk level badge
   - Contributing factors with impact levels
   - Personalized recommendations
   - Model information

## 📁 Project Structure

```
DR risk predictor/
├── BACKEND/
│   ├── app/
│   │   ├── api/
│   │   │   └── predict.py          # FastAPI prediction endpoint
│   │   ├── model/
│   │   │   └── predict.py          # ANN model inference logic
│   │   └── main.py                 # FastAPI app initialization
│   ├── model/
│   │   ├── ann_model.pkl           # Trained ANN model
│   │   ├── scaler.pkl              # Feature scaler
│   │   └── feature_names.pkl       # Feature names for alignment
│   └── run.py                      # Backend startup script
│
├── FRONTEND/
│   ├── src/
│   │   ├── lib/
│   │   │   └── prediction-service.ts  # API client & data transformation
│   │   └── pages/
│   │       ├── Assessment.tsx      # Input form
│   │       ├── Analyzing.tsx      # Loading/prediction page
│   │       └── Results.tsx         # Results display
│   └── package.json
│
└── test-integration.ps1            # Integration test script
```

## 🔧 Configuration

### Backend API URL

The frontend connects to the backend via the `VITE_ML_API_URL` environment variable.

Default: `http://127.0.0.1:8000/api`

To change it, create a `.env` file in the `FRONTEND` directory:

```env
VITE_ML_API_URL=http://your-backend-url/api
```

## 🧪 Testing

### Manual Testing Flow

1. **Start Backend**: `cd BACKEND && python run.py`
2. **Start Frontend**: `cd FRONTEND && npm run dev`
3. **Open Browser**: Navigate to http://localhost:5173
4. **Fill Assessment Form**:
   - Section 1: Age (e.g., 55), Gender (Male/Female)
   - Section 2: Diabetes Type (Type 1/Type 2), Years Since Diagnosis (e.g., 8)
   - Section 3: HbA1c (e.g., 7.2), BMI (e.g., 28.5), Blood Pressure (optional)
   - Section 4: Physical Activity Level, Smoking Status, Family History
5. **Click "Analyze Risk"**
6. **View Results**: See risk probability, contributing factors, and recommendations

### Automated Testing

Run the integration test script:

```powershell
.\test-integration.ps1
```

This will:
- ✅ Check backend health
- ✅ Test prediction endpoint with sample data
- ✅ Verify frontend files exist
- ✅ Verify model files exist

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError` or import errors
- **Solution**: Ensure virtual environment is activated and dependencies are installed

**Problem**: Model files not found
- **Solution**: Train the model first using `BACKEND/app/training/train_ann.py`

**Problem**: Port 8000 already in use
- **Solution**: Change port in `BACKEND/run.py` or kill the process using port 8000

### Frontend Issues

**Problem**: Cannot connect to backend
- **Solution**: 
  1. Verify backend is running on http://localhost:8000
  2. Check CORS settings in `BACKEND/app/main.py`
  3. Verify `VITE_ML_API_URL` in frontend `.env` file

**Problem**: Prediction fails with network error
- **Solution**: Check browser console for detailed error messages. Ensure backend is running and accessible.

**Problem**: Results page shows "No data"
- **Solution**: Ensure you're navigating from the Analyzing page after successful prediction. Check browser sessionStorage.

## 📊 Model Information

- **Algorithm**: Deep Learning Neural Network (MLPClassifier)
- **Accuracy**: ~92%
- **ROC-AUC**: ~0.94
- **Features**: Age, Gender, Hospital utilization metrics, Medications, Diagnoses, Insulin usage

## 🔒 Important Notes

- This application is for **educational purposes only**
- Predictions do not replace professional medical advice
- Always consult qualified healthcare providers for medical decisions
- Model performance may vary with different patient populations

## 📝 API Endpoints

### POST `/api/predict`

**Request Body:**
```json
{
  "age": 55,
  "gender": "Male",
  "time_in_hospital": 5,
  "num_lab_procedures": 45,
  "num_medications": 12,
  "number_outpatient": 2,
  "number_emergency": 1,
  "number_inpatient": 1,
  "number_diagnoses": 6,
  "insulin": "Yes",
  "diabetesMed": "Yes"
}
```

**Response:**
```json
{
  "success": true,
  "probability": 65.5,
  "risk_level": "MODERATE RISK",
  "recommendation": "Schedule a comprehensive eye examination within 1 month...",
  "model": "Deep Learning Neural Network (MLPClassifier)",
  "features_used": ["age", "gender_Male", ...]
}
```

## 🎨 UI/UX Features

- ✅ Multi-step form with progress indicator
- ✅ Real-time validation and error messages
- ✅ Smooth loading animations during prediction
- ✅ Detailed results with contributing factors
- ✅ Personalized recommendations
- ✅ Responsive design for mobile and desktop
- ✅ Accessible color-coded risk indicators

## 📚 Additional Resources

- Backend API Documentation: http://localhost:8000/docs (when backend is running)
- FastAPI Documentation: https://fastapi.tiangolo.com/
- React Router: https://reactrouter.com/

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console and backend logs
3. Run the integration test script to identify issues

---

**Last Updated**: Integration verified and tested ✅
