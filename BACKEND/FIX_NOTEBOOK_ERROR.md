# Fix: ModuleNotFoundError in Jupyter Notebook

## Quick Fix (Choose One Method)

### Method 1: Install Packages in Current Kernel (Easiest)

1. **In the notebook, run the new cell** that says "QUICK FIX: Install missing packages"
   - This will automatically install pandas, numpy, scikit-learn, and joblib
   - Then continue with the rest of the notebook

### Method 2: Use Virtual Environment Kernel (Recommended)

1. **Open a new terminal/PowerShell** (keep Jupyter running)

2. **Activate virtual environment:**
   ```powershell
   cd "DR risk predictor\BACKEND"
   .\venv\Scripts\Activate.ps1
   ```

3. **Install ipykernel:**
   ```bash
   pip install ipykernel
   ```

4. **Add kernel:**
   ```bash
   python -m ipykernel install --user --name=dr-risk-predictor --display-name "Python (DR Risk Predictor)"
   ```

5. **In Jupyter Notebook:**
   - Go to **Kernel** → **Change Kernel**
   - Select **"Python (DR Risk Predictor)"**

6. **Restart the kernel** (Kernel → Restart)

### Method 3: Install Packages via Notebook

Add a new cell at the top and run:
```python
import sys
!{sys.executable} -m pip install pandas numpy scikit-learn joblib
```

Then restart the kernel and run all cells again.

## Why This Happens

The notebook is using a Python kernel that doesn't have the required packages installed. This could be:
- The system Python (not the venv)
- A different conda environment
- A fresh Python installation

## Best Practice

**Always use the virtual environment kernel** to ensure consistency:
- All packages are in one place
- Matches the backend server environment
- Easier to manage dependencies

## Verify It's Working

After fixing, the first cell should print:
```
✅ Python version: 3.12.x
✅ Python executable: ...\BACKEND\venv\Scripts\python.exe
✅ Working directory: ...
✅ Imports complete
```

If the executable path shows `venv\Scripts\python.exe`, you're using the correct kernel!
