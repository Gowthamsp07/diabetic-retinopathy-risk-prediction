# Python Interpreter Setup for Retraining Notebook

## Which Python Interpreter to Use

You should use the **virtual environment Python interpreter** located at:
```
DR risk predictor\BACKEND\venv\Scripts\python.exe
```

## Step-by-Step Setup

### 1. Activate the Virtual Environment

**In PowerShell:**
```powershell
cd "DR risk predictor\BACKEND"
.\venv\Scripts\Activate.ps1
```

**In Command Prompt:**
```cmd
cd "DR risk predictor\BACKEND"
venv\Scripts\activate.bat
```

### 2. Install Required Packages (if not already installed)

```bash
pip install pandas numpy scikit-learn joblib jupyter notebook matplotlib seaborn
```

### 3. Set Up Jupyter Notebook Kernel

```bash
# Install ipykernel
pip install ipykernel

# Add the virtual environment as a Jupyter kernel
python -m ipykernel install --user --name=dr-risk-predictor --display-name "Python (DR Risk Predictor)"
```

### 4. Open Jupyter Notebook

```bash
jupyter notebook notebooks/06_retrain_model_for_frontend.ipynb
```

### 5. Select the Correct Kernel

When the notebook opens:
1. Click on **"Kernel"** in the menu bar
2. Select **"Change Kernel"**
3. Choose **"Python (DR Risk Predictor)"** or the kernel that points to your venv

## About the Old Trained Dataset

**IMPORTANT:** Before retraining, **backup the old model files**:

```powershell
# Create backup directory
cd "DR risk predictor\BACKEND\model"
mkdir backup_old_model
copy ann_model.pkl backup_old_model\
copy scaler.pkl backup_old_model\
copy feature_names.pkl backup_old_model\
```

The new training will **overwrite** these files, so backup is essential if you want to revert.

## Common Errors and Fixes

### Error 1: ModuleNotFoundError
**Error:** `ModuleNotFoundError: No module named 'pandas'`

**Fix:**
```bash
# Make sure venv is activated
.\venv\Scripts\Activate.ps1

# Install missing packages
pip install pandas numpy scikit-learn joblib
```

### Error 2: FileNotFoundError for diabetic_data.csv
**Error:** `FileNotFoundError: [Errno 2] No such file or directory: '../data/diabetic_data.csv'`

**Fix:**
- Make sure you're running the notebook from the `BACKEND/notebooks/` directory
- Verify the file exists at `BACKEND/data/diabetic_data.csv`
- If using Jupyter, check the current working directory in the first cell

### Error 3: Permission Denied when Saving Model
**Error:** `PermissionError: [Errno 13] Permission denied`

**Fix:**
- Close any Python processes that might be using the model files
- Stop the backend server if it's running
- Make sure you have write permissions to the `model/` directory

### Error 4: Jupyter Kernel Not Found
**Error:** Kernel not found or kernel dies

**Fix:**
```bash
# Reinstall ipykernel
pip install --upgrade ipykernel

# Re-add kernel
python -m ipykernel install --user --name=dr-risk-predictor --display-name "Python (DR Risk Predictor)"
```

## Quick Setup Script

Run this PowerShell script to set everything up:

```powershell
# Navigate to BACKEND directory
cd "DR risk predictor\BACKEND"

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install required packages
pip install pandas numpy scikit-learn joblib jupyter notebook ipykernel

# Add kernel
python -m ipykernel install --user --name=dr-risk-predictor --display-name "Python (DR Risk Predictor)"

# Backup old model
if (Test-Path "model\ann_model.pkl") {
    New-Item -ItemType Directory -Force -Path "model\backup_old_model" | Out-Null
    Copy-Item "model\*.pkl" "model\backup_old_model\" -Force
    Write-Host "✅ Old model backed up to model\backup_old_model"
}

# Start Jupyter
Write-Host "🚀 Starting Jupyter Notebook..."
jupyter notebook notebooks/06_retrain_model_for_frontend.ipynb
```

## After Retraining

1. **Restart the backend server** to load the new model:
   ```bash
   python run.py
   ```

2. **Test the predictions** through the frontend to verify they work correctly

3. **If something goes wrong**, restore from backup:
   ```powershell
   cd "DR risk predictor\BACKEND\model"
   copy backup_old_model\*.pkl .
   ```
