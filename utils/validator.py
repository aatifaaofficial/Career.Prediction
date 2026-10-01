"""
utils/validator.py
===================
Validates user demographic info and quiz answers before prediction.
"""

import logging

logger = logging.getLogger(__name__)

VALID_OPTION_VALUES = {0, 1, 2}
TOTAL_QUESTIONS = 20


def validate_answers(data: dict) -> tuple[bool, str]:
    """
    Validate that user details and answers are complete and valid.

    Args:
        data (dict): Raw POST data from the frontend.

    Returns:
        (True, "") if valid.
        (False, error_message) if invalid.
    """
    if not data:
        return False, "No data received."

    # Validate User Information
    name = str(data.get("user_name", "")).strip()
    if not name:
        return False, "Please enter your full name."

    try:
        age = int(data.get("age", 0))
        if age < 1 or age > 120:
            return False, "Please enter a valid age between 1 and 120."
    except (TypeError, ValueError):
        return False, "Invalid age format. Please enter a valid number."

    gender = str(data.get("gender", "")).strip()
    if not gender:
        return False, "Please select your gender."

    # Validate 20 assessment questions
    for i in range(1, TOTAL_QUESTIONS + 1):
        key = f"Q{i}"
        if key not in data:
            return False, f"Answer missing for Question {i}."
        try:
            val = int(data[key])
        except (TypeError, ValueError):
            return False, f"Invalid value for Question {i}: must be 0, 1, or 2."
        if val not in VALID_OPTION_VALUES:
            return False, f"Out-of-range value for Question {i}: {val}."

    return True, ""
