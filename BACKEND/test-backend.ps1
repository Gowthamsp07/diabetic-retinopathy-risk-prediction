Write-Host "Testing DR Risk Prediction Backend..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Yellow

# 1. Test Health Endpoint
Write-Host "`n1. Testing /health endpoint..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing
    $healthData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Health Check Passed!" -ForegroundColor Green
    Write-Host "   Status: $($healthData.status)"
    Write-Host "   Model Loaded: $($healthData.model_loaded)"
    Write-Host "   Version: $($healthData.version)"
} catch {
    Write-Host "❌ Health Check Failed!" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}

# 2. Test Model Info
Write-Host "`n2. Testing /api/model-info endpoint..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/model-info" -UseBasicParsing
    $modelInfo = $response.Content | ConvertFrom-Json
    Write-Host "✅ Model Info Retrieved!" -ForegroundColor Green
    Write-Host "   Model Type: $($modelInfo.model_type)"
    Write-Host "   Framework: $($modelInfo.framework)"
    if ($modelInfo.input_shape) {
        Write-Host "   Input Shape: $($modelInfo.input_shape)"
    }
} catch {
    Write-Host "❌ Model Info Failed!" -ForegroundColor Red
}

# 3. Test Prediction
Write-Host "`n3. Testing /api/predict endpoint..." -ForegroundColor Green

# Sample patient data
$patientData = @{
    age = 55
    diabetes_duration = 8
    hb1ac = 7.2
    fasting_blood_sugar = 130
    postprandial_blood_sugar = 180
    systolic_bp = 135
    diastolic_bp = 85
    bmi = 28.5
    smoking_status = 1
    physical_activity = 2
    family_history = 1
} | ConvertTo-Json

try {
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/predict" `
                                  -Method POST `
                                  -Body $patientData `
                                  -Headers $headers `
                                  -UseBasicParsing
    $prediction = $response.Content | ConvertFrom-Json
    Write-Host "✅ Prediction Successful!" -ForegroundColor Green
    Write-Host "   Risk Score: $($prediction.risk_score)"
    Write-Host "   Risk Percentage: $($prediction.risk_percentage)%"
    Write-Host "   Risk Level: $($prediction.risk_level)"
    Write-Host "   Confidence: $($prediction.confidence)"
    
    Write-Host "`n   Top Factors:" -ForegroundColor Yellow
    foreach ($factor in $prediction.top_factors) {
        Write-Host "     - $factor"
    }
    
    Write-Host "`n   Recommendations:" -ForegroundColor Yellow
    foreach ($rec in $prediction.recommendations) {
        Write-Host "     • $rec"
    }
    
} catch {
    Write-Host "❌ Prediction Failed!" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host "`n==========================================" -ForegroundColor Yellow
Write-Host "Testing Complete!" -ForegroundColor Cyan