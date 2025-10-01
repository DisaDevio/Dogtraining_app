#!/usr/bin/env python3
"""
Simple Garmin Connect API Example
"""

import logging
import os
import sys
from datetime import date
from getpass import getpass
from pathlib import Path

import requests
from flask import Flask, jsonify, send_from_directory
from garth.exc import GarthException, GarthHTTPError

from garminconnect import (
    Garmin,
    GarminConnectAuthenticationError,
    GarminConnectConnectionError,
    GarminConnectTooManyRequestsError,
)

app = Flask(__name__, static_folder="../frontend/dist")

# Suppress garminconnect library logging to avoid tracebacks in normal operation
logging.getLogger("garminconnect").setLevel(logging.CRITICAL)


def get_credentials():
    """Get email and password from environment or user input."""
    email = os.getenv("EMAIL")
    password = os.getenv("PASSWORD")

    if not email or not password:
        print("Please set EMAIL and PASSWORD environment variables.")
        sys.exit(1)

    return email, password


def init_api() -> Garmin | None:
    """Initialize Garmin API with authentication and token management."""
    # Configure token storage
    tokenstore = os.getenv("GARMINTOKENS", "~/.garminconnect")
    tokenstore_path = Path(tokenstore).expanduser()
    print(f"Token storage: {tokenstore_path}")

    # Check if token files exist
    if tokenstore_path.exists():
        print("Found existing token directory")
        token_files = list(tokenstore_path.glob("*.json"))
        if token_files:
            print(
                f"Found {len(token_files)} token file(s): {[f.name for f in token_files]}"
            )
        else:
            print("Token directory exists but no token files found")
    else:
        print("No existing token directory found")

    # First try to login with stored tokens
    try:
        print("Attempting to use saved authentication tokens...")
        garmin = Garmin()
        garmin.login(str(tokenstore_path))
        print("Successfully logged in using saved tokens!")
        return garmin
    except (
        FileNotFoundError,
        GarthHTTPError,
        GarminConnectAuthenticationError,
        GarminConnectConnectionError,
    ):
        print("No valid tokens found. Requesting fresh login credentials.")

    # Loop for credential entry with retry on auth failure
    while True:
        try:
            # Get credentials
            email, password = get_credentials()
            print(" Logging in with credentials...")
            garmin = Garmin(
                email=email, password=password, is_cn=False, return_on_mfa=True
            )
            result1, result2 = garmin.login()
            if result2 is None:
                print("Login successful!")
                # Save tokens for future use
                garmin.garth.dump(str(tokenstore_path))
                print(f"Authentication tokens saved to: {tokenstore_path}")
                return garmin

            if result1 == "needs_mfa":
                print("Multi-factor authentication required")
                mfa_code = input("Please enter your MFA code: ")
                print("Submitting MFA code...")
                try:
                    garmin.resume_login(result2, mfa_code) # type: ignore
                    print("MFA authentication successful!")
                except GarthHTTPError as garth_error:
                    # Handle specific HTTP errors from MFA
                    error_str = str(garth_error)
                    if "429" in error_str and "Too Many Requests" in error_str:
                        print("Too many MFA attempts")
                        print("Please wait 30 minutes before trying again")
                        sys.exit(1)
                    elif "401" in error_str or "403" in error_str:
                        print("Invalid MFA code")
                        print("Please verify your MFA code and try again")
                        continue
                    else:
                        # Other HTTP errors - don't retry
                        print(f"MFA authentication failed: {garth_error}")
                        sys.exit(1)
                except GarthException as garth_error:
                    print(f"MFA authentication failed: {garth_error}")
                    print("Please verify your MFA code and try again")
                    continue

            # Save tokens for future use
            garmin.garth.dump(str(tokenstore_path))
            print(f"Authentication tokens saved to: {tokenstore_path}")
            print("Login successful!")
            return garmin
        except GarminConnectAuthenticationError:
            print("Authentication failed:")
            print("Please check your username and password and try again")
            # Continue the loop to retry
            continue
        except (
            FileNotFoundError,
            GarthHTTPError,
            GarminConnectConnectionError,
            requests.exceptions.HTTPError,
        ) as err:
            print(f"Connection error: {err}")
            print("Please check your internet connection and try again")
            return None
        except KeyboardInterrupt:
            print("\nCancelled by user")
            return None

@app.route("/api/activities")
def get_activities():
    api = init_api()
    if not api:
        return jsonify({"error": "Failed to initialize API"}), 500

    activity_type = "running"

    start_date = "2000-01-01"
    end_date = date.today().isoformat()
    activities = api.get_activities_by_date(
        start_date, end_date, activity_type
    )

    return jsonify(activities)

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html") # type: ignore

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
