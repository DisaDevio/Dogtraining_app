#!/usr/bin/env python3
"""
Simple Garmin Connect API Example
"""

import logging
import os
import json
import sys
from datetime import date
from getpass import getpass
from pathlib import Path

import requests
from flask import Flask, jsonify, send_from_directory, request
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


@app.route("/api/login", methods=["POST"])
def login():
    """Login to Garmin Connect."""
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


@app.route("/api/check_login")
def check_login():
    """Check if user is logged in."""
    if init_api():
        return jsonify({"logged_in": True})
    else:
        return jsonify({"logged_in": False})


@app.route("/api/activities")
def get_activities():
    api = init_api()
    if not api:
        return jsonify({"error": "Not logged in"}), 401
    activities = api.get_activities(0, 1000)  # first 100
    hunting_activities = [
        a for a in activities
        if isinstance(a, dict) and a.get("activityType", {}).get("typeKey", "").lower() in ["hunting", "running", "hiking"]
    ]

    return jsonify(hunting_activities)

@app.route("/api/activity/<activity_id>/route")
def get_activity_route(activity_id):
    api = init_api()
    if not api:
        return jsonify({"error": "Not logged in"}), 401

    details = api.get_activity_details(activity_id)
    gps_points = details.get("geoPolylineDTO", {}).get("polyline", [])
    line = [[p['lat'], p['lon']] for p in gps_points]
    return jsonify(line)

@app.route("/api/activity/<activity_id>/stats")
def get_activity_stats(activity_id):
    api = init_api()
    if not api:
        return jsonify({"error": "Not logged in"}), 401

    try:
        activity = api.get_activity(activity_id)
        
        stats = {
            "Namn": activity.get("activityName"),
            "Tid": activity['summaryDTO'].get("startTimeLocal").split("T")[0]+" "+activity['summaryDTO'].get("startTimeLocal").split("T")[1].split(".")[0],
            "Varaktighet": activity['summaryDTO'].get("duration"),
            "Distans (m)": activity['summaryDTO'].get("distance"),
            "Höjdmeter upp/ned (m)": str(activity['summaryDTO'].get("elevationGain")) + " / " + str(activity['summaryDTO'].get("elevationLoss")),
        }

        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/activity/<activity_id>/weather")
def get_activity_weather(activity_id):
    api = init_api()
    if not api:
        return jsonify({"error": "Not logged in"}), 401

    try:
        activity = api.get_activity(activity_id)
        weather = activity.get("weather") or activity.get("weatherConditions")

        if not weather:
            return jsonify({"message": "No weather data available"}), 404

        return jsonify(weather)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html") # type: ignore




DATA_FILE = 'app_data_{id}.json'
@app.route("/api/load/<id>", methods=["GET"])
def load_data(id):
    """
    Loads application state data from the local JSON file.
    If the file doesn't exist, returns a default initial state.

    This function simulates a GET request endpoint (e.g., /api/load) in a
    Python web framework (Flask/FastAPI).
    """
    # Check if the data file exists
    if os.path.exists(DATA_FILE.format(id=id)):
        try:
            with open(DATA_FILE.format(id=id), 'r') as f:
                # Load the JSON content from the file
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            # Handle empty or corrupted file gracefully
            print(f"Error loading data: {e}. Starting with api default data.")
            # Return a default structure if file is corrupt or unreadable
            return { "data": "none"}
    else:
        # File does not exist, return initial state
        print("Data file not found. Starting with default data.")
        return {"data": "none"}

@app.route("/api/save", methods=["POST"])
def save_data():
    """
    Saves the current application state data to the local JSON file.
    
    This function simulates a POST request endpoint (e.g., /api/save) that 
    accepts JSON data from the React frontend.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400
        
        activity_id = data.get("id")
        if not activity_id:
            return jsonify({"error": "Activity ID is missing"}), 400

        # Open file in write mode ('w'), which will create it if it doesn't exist
        with open(DATA_FILE.format(id=activity_id), 'w') as f:
            # Use json.dump to write the Python dictionary (data) to the file,
            # using an indent of 4 for human readability.
            json.dump(data, f, indent=4)
        print("Data saved successfully.")
        return jsonify({"message": "Data saved successfully"}), 200
    except IOError as e:
        print(f"Error saving data: {e}")
        return jsonify({"error": f"Error saving data: {e}"}), 500


import glob

@app.route("/api/birds", methods=["GET"])
def get_all_birds():
    """
    Aggregates all bird markers from saved data files into a GeoJSON FeatureCollection.
    """
    features = []
    # Use glob to find all files matching the pattern 'app_data_*.json'
    for data_file in glob.glob("app_data_*.json"):
        try:
            with open(data_file, 'r') as f:
                data = json.load(f)
                markers = data.get("markers", [])
                for marker in markers:
                    # Ensure the marker has the required keys
                    if "coordinates" in marker and "type" in marker:
                        features.append({
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": marker["coordinates"]
                            },
                            "properties": {
                                "type": marker["type"]
                            }
                        })
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error processing file {data_file}: {e}")

    feature_collection = {
        "type": "FeatureCollection",
        "features": features
    }

    return jsonify(feature_collection)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
