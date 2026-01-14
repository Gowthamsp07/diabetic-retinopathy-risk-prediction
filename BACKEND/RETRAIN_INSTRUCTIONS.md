# Model Retraining Instructions

## Problem
The current model is showing 0.0% risk probability for all predictions because there's a mismatch between:
1. The features the model was trained on
2. The features the frontend sends
3. The feature encoding/alignment in the prediction pipeline

## Solution
A new training notebook has been created: `notebooks/06_retrain_model_for_frontend.ipynb`

This notebook:
- ✅ Properly normalizes categorical values to match frontend format
- ✅ Uses the same one-hot encoding as the prediction pipeline
- ✅ Saves feature names that exactly match what the backend expects
- ✅ Tests the prediction pipeline with sample data

## Steps to Retrain

1. **Open the notebook:**
   ```bash
   cd BACKEND/notebooks
   jupyter notebook 06_retrain_model_for_frontend.ipynb
   ```

2. **Run all cells** in order. The notebook will:
   - Load and clean the data
   - Normalize categorical values (gender, insulin, diabetesMed) to match frontend
   - One-hot encode features
   - Train the model with optimized hyperparameters
   - Evaluate the model
   - Save model artifacts to `../model/` directory
   - Test the prediction pipeline

3. **Verify the output:**
   - Check that accuracy is > 90%
   - Check that ROC-AUC is > 0.95
   - Verify the test prediction shows a non-zero probability

4. **Restart the backend server:**
   ```bash
   cd BACKEND
   python run.py
   ```

5. **Test through the frontend:**
   - Fill out the assessment form
   - Submit and verify risk probability is calculated correctly
   - Check that different inputs produce different risk probabilities

## Key Changes in the New Training Pipeline

### Categorical Value Normalization
- **Gender**: Normalized to "Male" or "Female" (matches frontend)
- **Insulin**: Normalized to "Yes" or "No" (matches frontend)
- **DiabetesMed**: Normalized to "Yes" or "No" (matches frontend)

### Feature Encoding
- Uses `pd.get_dummies(drop_first=True)` to match backend prediction code
- Saves exact feature names for proper alignment during prediction

### Model Improvements
- Increased max_iter to 200 for better convergence
- Added early stopping to prevent overfitting
- Uses adaptive learning rate

## Expected Results

After retraining, you should see:
- **Accuracy**: ~94-95%
- **ROC-AUC**: ~0.98
- **Test predictions**: Non-zero probabilities that vary with input

## Troubleshooting

If predictions still show 0.0%:
1. Check that feature names in `model/feature_names.pkl` match what the backend expects
2. Verify the backend is using the new model files
3. Check backend logs for any errors during prediction
4. Ensure categorical values in frontend match exactly: "Male"/"Female", "Yes"/"No"
