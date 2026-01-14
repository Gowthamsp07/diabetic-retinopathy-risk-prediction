# Integration Test Script for DR Risk Predictor
# Tests the full flow: Frontend → Backend → Prediction → Results

Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "DR Risk Predictor - Integration Test" -ForegroundColor Yellow
Write-Host ("=" * 61) -ForegroundColor Cyan
Write-Host ""

# Test 1: Check Backend Health
Write-Host "1. Testing Backend Health..." -ForegroundColor Green
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:8000/" -UseBasicParsing -TimeoutSec 5
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Backend is running" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Backend is not running!" -ForegroundColor Red
    Write-Host "   Please start the backend with: cd BACKEND; python run.py" -ForegroundColor Yellow
    exit 1
}

# Test 2: Test Prediction Endpoint
Write-Host "`n2. Testing Prediction Endpoint..." -ForegroundColor Green

$testPayload = @{
    age = 55
    gender = "Male"
    time_in_hospital = 5
    num_lab_procedures = 45
    num_medications = 12
    number_outpatient = 2
    number_emergency = 1
    number_inpatient = 1
    number_diagnoses = 6
    insulin = "Yes"
    diabetesMed = "Yes"
} | ConvertTo-Json

try {
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-WebRequest `
        -Uri "http://localhost:8000/api/predict" `
        -Method POST `
        -Headers $headers `
        -Body $testPayload `
        -UseBasicParsing `
        -TimeoutSec 10
    
    $result = $response.Content | ConvertFrom-Json
    
    if ($result.success -eq $true) {
        Write-Host "   ✅ Prediction successful!" -ForegroundColor Green
        Write-Host "   Risk Probability: $($result.probability)%" -ForegroundColor Cyan
        Write-Host "   Risk Level: $($result.risk_level)" -ForegroundColor Cyan
        Write-Host "   Recommendation: $($result.recommendation)" -ForegroundColor Cyan
    } else {
        Write-Host "   ❌ Prediction returned success=false" -ForegroundColor Red
        Write-Host "   Error: $($result.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Prediction failed!" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Verify Frontend Files
Write-Host "`n3. Verifying Frontend Files..." -ForegroundColor Green

$frontendFiles = @(
    "FRONTEND\src\lib\prediction-service.ts",
    "FRONTEND\src\pages\Assessment.tsx",
    "FRONTEND\src\pages\Analyzing.tsx",
    "FRONTEND\src\pages\Results.tsx"
)

$allFilesExist = $true
foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Missing: $file" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host "   ⚠️  Some frontend files are missing" -ForegroundColor Yellow
}

# Test 4: Verify Backend Model Files
Write-Host "`n4. Verifying Backend Model Files..." -ForegroundColor Green

$modelFiles = @(
    "BACKEND\model\ann_model.pkl",
    "BACKEND\model\scaler.pkl",
    "BACKEND\model\feature_names.pkl"
)

$allModelsExist = $true
foreach ($file in $modelFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Missing: $file" -ForegroundColor Red
        $allModelsExist = $false
    }
}

if (-not $allModelsExist) {
    Write-Host "   ⚠️  Model files are missing. Train the model first." -ForegroundColor Yellow
}

# Summary
Write-Host "`n" -NoNewline
Write-Host ("=" * 61) -ForegroundColor Cyan
Write-Host "Integration Test Summary" -ForegroundColor Yellow
Write-Host ("=" * 61) -ForegroundColor Cyan

if ($allFilesExist -and $allModelsExist) {
    Write-Host "✅ All checks passed! The system is ready to use." -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Start backend: cd BACKEND; python run.py" -ForegroundColor White
    Write-Host "2. Start frontend: cd FRONTEND; npm run dev" -ForegroundColor White
    Write-Host "3. Open browser: http://localhost:5173" -ForegroundColor White
} else {
    Write-Host "⚠️  Some issues found. Please fix them before proceeding." -ForegroundColor Yellow
}

Write-Host ("=" * 61) -ForegroundColor Cyan
