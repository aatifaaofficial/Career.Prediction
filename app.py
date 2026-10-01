"""
app.py
=======
Flask application entry point for Sleep Disturbance Analyzer.
Registers all routes, handles predictions, and logs all user responses to CSV.
"""

import csv
import json
import logging
import os
import threading
import traceback
import urllib.request
import uuid
from datetime import datetime
from flask import Flask, render_template, request, jsonify, session
from config import DEBUG, SECRET_KEY, APP_NAME, APP_VERSION, GOOGLE_SHEET_WEBHOOK_URL
from predictor import predict_disorder
from utils.validator import validate_answers

# ─── Logging ─────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.DEBUG if DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s – %(message)s",
)
logger = logging.getLogger(__name__)

# ─── Flask App ────────────────────────────────────────────────────────────────
app = Flask(__name__)
app.secret_key = SECRET_KEY
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '-1'
    return response

CSV_LOG_FILE = "user_responses_log.csv"


def log_response_to_csv(user_info, answers, result, timestamp):
    """Appends user demographics, Q1-Q20 answers, scores & prediction to CSV log."""
    file_exists = os.path.exists(CSV_LOG_FILE)
    fieldnames = [
        "Timestamp", "Certificate_ID", "Full_Name", "Age", "Gender",
        *[f"Q{i}" for i in range(1, 21)],
        "Insomnia_Score", "Sleep_Apnea_Score", "Hypersomnia_Score",
        "Predicted_Disorder", "Confidence_Percentage"
    ]
    try:
        with open(CSV_LOG_FILE, mode="a", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            if not file_exists:
                writer.writeheader()

            row = {
                "Timestamp": timestamp,
                "Certificate_ID": user_info["cert_id"],
                "Full_Name": user_info["user_name"],
                "Age": user_info["age"],
                "Gender": user_info["gender"],
                **{f"Q{i}": answers.get(f"Q{i}", "") for i in range(1, 21)},
                "Insomnia_Score": result["scores"].get("Insomnia", 0),
                "Sleep_Apnea_Score": result["scores"].get("Sleep Apnea", 0),
                "Hypersomnia_Score": result["scores"].get("Hypersomnia", 0),
                "Predicted_Disorder": result["disorder"],
                "Confidence_Percentage": result["confidence"],
            }
            writer.writerow(row)
        logger.info(f"✅ Response logged to CSV for {user_info['user_name']} ({user_info['cert_id']})")
        
        # Async post to Google Sheet Webhook if configured
        if GOOGLE_SHEET_WEBHOOK_URL:
            threading.Thread(target=post_to_google_sheet, args=(row,), daemon=True).start()
    except Exception as e:
        logger.error(f"❌ Failed to write response to CSV log: {e}")


def post_to_google_sheet(row_data):
    """Sends row data as JSON POST to Google Apps Script Webhook."""
    if not GOOGLE_SHEET_WEBHOOK_URL:
        return
    try:
        req = urllib.request.Request(
            GOOGLE_SHEET_WEBHOOK_URL,
            data=json.dumps(row_data).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            logger.info("✅ Live response synced to Google Sheet Webhook")
    except Exception as e:
        logger.warning(f"Google Sheet webhook post notice: {e}")


logger.info("✅ Sleep Disturbance Analyzer engine & CSV Logger ready.")


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    """Landing page with user information & sleep assessment form."""
    return render_template("index.html", app_name=APP_NAME)


@app.route("/predict", methods=["POST"])
def predict():
    """
    POST endpoint that receives user demographic data and JSON answers,
    returning disorder prediction JSON and logging user response to CSV.
    """
    try:
        data = request.get_json(force=True)

        # Validate answers & user info
        valid, error_msg = validate_answers(data)
        if not valid:
            return jsonify({"success": False, "error": error_msg}), 400

        # Predict disorder
        result = predict_disorder(data)

        # Generate unique Certificate ID
        timestamp_str = datetime.now().strftime("%d %B %Y, %I:%M %p")
        cert_id = f"CERT-SLP-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"

        user_info = {
            "user_name": str(data.get("user_name")).strip(),
            "age": int(data.get("age")),
            "gender": str(data.get("gender")).strip(),
            "cert_id": cert_id,
        }

        # Log to CSV
        log_response_to_csv(user_info, data, result, timestamp_str)

        # Store in session for result page
        session["result"]    = result
        session["answers"]   = data
        session["user_info"] = user_info
        session["timestamp"] = timestamp_str

        return jsonify({"success": True, "user_info": user_info, **result}), 200

    except ValueError as ve:
        logger.warning(f"Validation error: {ve}")
        return jsonify({"success": False, "error": str(ve)}), 400

    except Exception as e:
        logger.error(f"Prediction error: {traceback.format_exc()}")
        return jsonify({"success": False, "error": "An internal error occurred. Please try again."}), 500


@app.route("/result")
def result():
    """Result page – reads prediction and user info from session."""
    result_data = session.get("result")
    answers     = session.get("answers", {})
    user_info   = session.get("user_info", {})
    timestamp   = session.get("timestamp", "")

    if not result_data:
        return render_template(
            "index.html",
            app_name=APP_NAME,
            error="No analysis found. Please complete the sleep assessment first."
        )

    return render_template(
        "result.html",
        app_name=APP_NAME,
        result=result_data,
        answers=answers,
        user_info=user_info,
        timestamp=timestamp,
    )


# ─── Error Handlers ───────────────────────────────────────────────────────────

@app.errorhandler(404)
def not_found(e):
    return jsonify({"success": False, "error": "Endpoint not found."}), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"success": False, "error": "Method not allowed."}), 405


@app.errorhandler(500)
def server_error(e):
    return jsonify({"success": False, "error": "Internal server error."}), 500


# ─── Entry Point ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=DEBUG, host="0.0.0.0", port=5000)
