# Quick Start: Retrain Model

## 🎯 Which Python Interpreter?

**Use the virtual environment Python:**
```
DR risk predictor\BACKEND\venv\Scripts\python.exe
```

## 🚀 Quick Setup (3 Steps)

### Option 1: Automated Script (Recommended)

1. **Open PowerShell** in the project root
2. **Run the setup script:**
   ```powershell
   cd "DR risk predictor\BACKEND"
   .\setup_and_retrain.ps1
   ```
   This will:
   - Activate the virtual environment
   - Install all required packages
   - Backup old model files
   - Open Jupyter Notebook

### Option 2: Manual Setup

1. **Activate virtual environment:**
   ```powershell
   cd "DR risk predictor\BACKEND"
   .\venv\Scripts\Activate.ps1
   ```

2. **Install packages:**
   ```bash
   pip install pandas numpy scikit-learn joblib jupyter notebook ipykernel
   ```

3. **Add Jupyter kernel:**
   ```bash
   python -m ipykernel install --user --name=dr-risk-predictor --display-name "Python (DR Risk Predictor)"
   ```

4. **Open notebook:**
   ```bash
   jupyter notebook notebooks/06_retrain_model_for_frontend.ipynb
   ```

5. **Select kernel:** In Jupyter, go to Kernel → Change Kernel → Select "Python (DR Risk Predictor)"

## 📦 About the Old Trained Dataset

**IMPORTANT:** The old model will be **overwritten** when you retrain.

**Backup first:**
```powershell
cd "DR risk predictor\BACKEND\model"
mkdir backup_old_model
copy *.pkl backup_old_model\
```

**To restore later (if needed):**
```powershell
cd "DR risk predictor\BACKEND\model"
copy backup_old_model\*.pkl .
```

## ⚠️ Common Errors & Fixes

### Error: "ModuleNotFoundError: No module named 'pandas'"
**Fix:** Make sure venv is activated and install packages:
```bash
.\venv\Scripts\Activate.ps1
pip install pandas numpy scikit-learn joblib
```

### Error: "FileNotFoundError: diabetic_data.csv"
**Fix:** 
- Make sure you're in the `BACKEND` directory
- Check that `data/diabetic_data.csv` exists
- The notebook will try to find it automatically

### Error: "PermissionError" when saving model
**Fix:**
- Stop the backend server if it's running
- Close any Python processes using the model files
- Make sure you have write permissions

### Error: "Kernel died" in Jupyter
**Fix:**
```bash
# Reinstall ipykernel
pip install --upgrade ipykernel
python -m ipykernel install --user --name=dr-risk-predictor --display-name "Python (DR Risk Predictor)"
```

## ✅ After Retraining

1. **Restart backend server:**
   ```bash
   cd "DR risk predictor\BACKEND"
   python run.py
   ```

2. **Test predictions** through the frontend

3. **Verify** that risk probabilities are no longer 0.0%

## 📝 Checklist

- [ ] Virtual environment activated
- [ ] All packages installed
- [ ] Old model backed up
- [ ] Jupyter kernel set to venv Python
- [ ] All notebook cells run successfully
- [ ] Model files saved to `model/` directory
- [ ] Backend server restarted
- [ ] Frontend tested with new predictions
