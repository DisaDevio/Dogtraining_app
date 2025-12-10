import os
from pathlib import Path
from flask import Blueprint, jsonify, request
from garth.exc import GarthHTTPError
from garminconnect import (
    Garmin,
    GarminConnectAuthenticationError,
    GarminConnectConnectionError,
)

auth_bp = Blueprint('auth', __name__)

def init_api() -> Garmin | None:
    """Initialize Garmin API with authentication and token management."""
    try:
        garmin = Garmin()
        tokenstore = os.getenv("GARMINTOKENS", "~/.garminconnect")
        tokenstore_path = Path(tokenstore).expanduser()
        garmin.login(str(tokenstore_path))
        return garmin
    except (FileNotFoundError, GarthHTTPError, GarminConnectAuthenticationError):
        return None

@auth_bp.route("/api/login", methods=["POST"])
def login():
    """Login to Garmin Connect and store authentication tokens."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        garmin = Garmin(email, password)
        garmin.login()
        tokenstore = os.getenv("GARMINTOKENS", "~/.garminconnect")
        tokenstore_path = Path(tokenstore).expanduser()
        garmin.garth.dump(str(tokenstore_path))
        return jsonify({"message": "Login successful"})
    except (GarminConnectConnectionError, GarthHTTPError) as e:
        return jsonify({"error": str(e)}), 500
    except GarminConnectAuthenticationError as e:
        return jsonify({"error": str(e)}), 401

@auth_bp.route("/api/check_login")
def check_login():
    """Check if user is logged in."""
    if init_api():
        return jsonify({"logged_in": True})
    else:
        return jsonify({"logged_in": False})

@auth_bp.route("/api/logout", methods=["POST"])
def logout():
    """Logout by clearing stored authentication tokens."""
    try:
        tokenstore = os.getenv("GARMINTOKENS", "~/.garminconnect")
        tokenstore_path = Path(tokenstore).expanduser()
        
        # Handle both file and directory cases
        if tokenstore_path.exists():
            if tokenstore_path.is_file():
                tokenstore_path.unlink()
            elif tokenstore_path.is_dir():
                # Remove all files in the token directory
                import shutil
                shutil.rmtree(tokenstore_path)
            return jsonify({"message": "Logout successful"})
        else:
            return jsonify({"message": "Already logged out"})
    except Exception as e:
        return jsonify({"error": f"Failed to logout: {str(e)}"}), 500