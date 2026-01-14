from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent.parent.parent  # backend/

MODEL_PATH = BASE_DIR / "app" / "model" / "ann_model.h5"
SCALER_PATH = BASE_DIR / "app" / "model" / "scaler.pkl"
FEATURE_NAMES_PATH = BASE_DIR / "app" / "model" / "feature_names.pkl"
DATA_PATH = BASE_DIR / "data" / "diabetic_retinopathy.csv"

RISK_THRESHOLDS = {
    "low": 0.3,
    "moderate": 0.7  # Anything above is high
}