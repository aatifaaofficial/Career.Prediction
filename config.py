"""
Sleep Disturbance Analyzer – Configuration File
=================================================
"""

# ─── Google Sheets Live Integration ─────────────────────────────────────────
# Paste your deployed Google Apps Script Web App URL below to log responses
# automatically to your Google Sheet in real time. Leave empty ("") to use
# local user_responses_log.csv logging only.
GOOGLE_SHEET_WEBHOOK_URL = ""

# ─── Optional AI Enhancement ────────────────────────────────────────────────
API_KEY = ""          # e.g. your Gemini or OpenAI key

# ─── Flask Settings ──────────────────────────────────────────────────────────
DEBUG = True           # Set True during local development
SECRET_KEY = "sleep-disturbance-analyzer-secret-2025"   # Change in production

# ─── Model Path ──────────────────────────────────────────────────────────────
MODEL_PATH = "models/final_random_forest_model.joblib"

# ─── App Meta ────────────────────────────────────────────────────────────────
APP_NAME = "Sleep Disturbance Analyzer"
APP_VERSION = "2.0.0"
