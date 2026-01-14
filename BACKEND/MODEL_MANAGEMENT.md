# Model Management Guide

## Do I Need to Remove the Old Model?

**No, you don't need to manually remove it!** The retraining notebook will:

1. ✅ **Automatically backup** existing model files before saving new ones
2. ✅ **Overwrite** the old model files with new trained models
3. ✅ **Keep backups** in `model/backup_old_model/` directory

## What Happens During Retraining

### Before Training
- Old model files are detected: `ann_model.pkl`, `scaler.pkl`, `feature_names.pkl`
- They are automatically copied to `model/backup_old_model/`
- You'll see: `📦 Backing up existing model files...`

### During Training
- New model is trained with your data
- Model performance is evaluated

### After Training
- New model files are saved to `model/` directory
- Old files are overwritten (but you have backups!)
- You'll see: `✅ ALL MODEL ARTIFACTS SAVED SUCCESSFULLY`

## File Structure

```
BACKEND/
├── model/
│   ├── ann_model.pkl          ← NEW model (overwritten)
│   ├── scaler.pkl             ← NEW scaler (overwritten)
│   ├── feature_names.pkl      ← NEW features (overwritten)
│   └── backup_old_model/      ← OLD model (backed up)
│       ├── ann_model.pkl
│       ├── scaler.pkl
│       └── feature_names.pkl
```

## Restoring Old Model (If Needed)

If something goes wrong and you need to restore the old model:

```powershell
cd "DR risk predictor\BACKEND\model"
copy backup_old_model\*.pkl .
```

## Best Practices

1. **Always backup before retraining** ✅ (Done automatically)
2. **Test new model** before deploying to production
3. **Keep backups** until you verify the new model works
4. **Version your models** by renaming backup folders with dates:
   ```
   backup_old_model_2024_01_15
   backup_old_model_2024_01_20
   ```

## After Retraining Checklist

- [ ] Old model automatically backed up
- [ ] New model saved successfully
- [ ] Model evaluation shows good metrics (>90% accuracy)
- [ ] Test prediction works correctly
- [ ] Backend server restarted
- [ ] Frontend tested with new predictions
- [ ] Old backup kept until new model verified

## Troubleshooting

### "Permission denied" when saving
- **Fix:** Stop the backend server first, then retrain

### Want to keep multiple model versions
- **Fix:** Rename backup folder before retraining:
  ```powershell
  cd model
  ren backup_old_model backup_old_model_2024_01_15
  ```

### Model not loading after retraining
- **Fix:** Make sure backend server is restarted
- **Fix:** Check that all 3 files were saved (model, scaler, features)
