"""
model_loader.py
================
Responsible for loading the Random Forest model from disk.
The model is loaded once at startup and cached in memory.
"""

import joblib
import logging
from config import MODEL_PATH

logger = logging.getLogger(__name__)

_model = None  # Module-level cache


def load_model():
    """
    Load the Random Forest model from disk.
    Uses module-level caching so the model is only loaded once.

    Returns:
        sklearn.ensemble.RandomForestClassifier: The loaded model.

    Raises:
        FileNotFoundError: If the model file does not exist.
        Exception: If the model cannot be loaded.
    """
    global _model

    if _model is not None:
        return _model

    try:
        logger.info(f"Loading model from: {MODEL_PATH}")
        _model = joblib.load(MODEL_PATH)
        logger.info(f"Model loaded successfully. Classes: {_model.classes_}")
        return _model
    except FileNotFoundError:
        logger.error(f"Model file not found: {MODEL_PATH}")
        raise FileNotFoundError(
            f"Model file not found at '{MODEL_PATH}'. "
            "Please ensure the model file is placed in the 'models/' directory."
        )
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        raise Exception(f"Model load error: {str(e)}")


def get_model():
    """
    Return the cached model, loading it first if necessary.
    Convenience wrapper around load_model().
    """
    return load_model()
