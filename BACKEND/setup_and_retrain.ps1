# Setup and Retrain Script for DR Risk Predictor
# This script sets up the environment and helps you retrain the model

Write-Host "=" * 60
Write-Host "DR Risk Predictor - Model Retraining Setup"
Write-Host "=" * 60

# Navigate to BACKEND directory
$backendPath = Join-Path $PSScriptRoot "BACKEND"
if (-not (Test-Path $backendPath)) {
    $backendPath = "DR risk predictor\BACKEND"
}

Set-Location $backendPath
Write-Host "📁 Working directory: $(Get-Location)"

# Check if virtual environment exists
$venvPath = Join-Path $backendPath "venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "❌ Virtual environment not found. Creating one..."
    python -m venv venv
    Write-Host "✅ Virtual environment created"
}

# Activate virtual environment
Write-Host "`n🔧 Activating virtual environment..."
& "$venvPath\Scripts\Activate.ps1"

# Upgrade pip
Write-Host "`n📦 Upgrading pip..."
python -m pip install --upgrade pip

# Install required packages
Write-Host "`n📦 Installing required packages..."
$packages = @(
    "pandas",
    "numpy",
    "scikit-learn",
    "joblib",
    "jupyter",
    "notebook",
    "ipykernel",
    "matplotlib",
    "seaborn"
)

foreach ($package in $packages) {
    Write-Host "  Installing $package..."
    pip install $package -q
}

# Add Jupyter kernel
Write-Host "`n🔧 Setting up Jupyter kernel..."
python -m ipykernel install --user --name=dr-risk-predictor --display-name "Python (DR Risk Predictor)"

# Backup old model
Write-Host "`n💾 Backing up old model files..."
$modelDir = Join-Path $backendPath "model"
$backupDir = Join-Path $modelDir "backup_old_model"

if (Test-Path "$modelDir\ann_model.pkl") {
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
    Copy-Item "$modelDir\*.pkl" $backupDir -Force
    Write-Host "✅ Old model backed up to: $backupDir"
} else {
    Write-Host "ℹ️  No existing model found to backup"
}

# Check if data file exists
$dataFile = Join-Path $backendPath "data\diabetic_data.csv"
if (-not (Test-Path $dataFile)) {
    Write-Host "`n⚠️  WARNING: Data file not found at: $dataFile"
    Write-Host "   Please ensure diabetic_data.csv is in the data directory"
}

# Summary
Write-Host "`n" + "=" * 60
Write-Host "✅ Setup Complete!"
Write-Host "=" * 60
Write-Host "`nNext steps:"
Write-Host "1. The Jupyter notebook will open automatically"
Write-Host "2. Select kernel: Python (DR Risk Predictor)"
Write-Host "3. Run all cells in the notebook"
Write-Host "4. After training, restart the backend server"
Write-Host "`nPress any key to open Jupyter Notebook..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Start Jupyter
Write-Host "`n🚀 Starting Jupyter Notebook..."
$notebookPath = Join-Path $backendPath "notebooks\06_retrain_model_for_frontend.ipynb"
jupyter notebook $notebookPath
