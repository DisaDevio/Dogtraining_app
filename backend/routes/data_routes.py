import os
import json
import glob
from flask import Blueprint, jsonify, request

data_bp = Blueprint('data', __name__)

DATA_FILE = 'app_data_{id}.json'

@data_bp.route("/api/load/<id>", methods=["GET"])
def load_data(id):
    """
    Loads application state data from the local JSON file.
    If the file doesn't exist, returns a default initial state.

    This function simulates a GET request endpoint (e.g., /api/load) in a
    Python web framework (Flask/FastAPI).
    """
    if os.path.exists(DATA_FILE.format(id=id)):
        try:
            with open(DATA_FILE.format(id=id), 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error loading data: {e}. Starting with api default data.")
            return { "data": "none"}
    else:
        print("Data file not found. Starting with default data.")
        return {"data": "none"}

@data_bp.route("/api/save", methods=["POST"])
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

        with open(DATA_FILE.format(id=activity_id), 'w') as f:
            json.dump(data, f, indent=4)
        print("Data saved successfully.")
        return jsonify({"message": "Data saved successfully"}), 200
    except IOError as e:
        print(f"Error saving data: {e}")
        return jsonify({"error": f"Error saving data: {e}"}), 500

@data_bp.route("/api/birds", methods=["GET"])
def get_all_birds():
    """
    Aggregates all bird markers from saved data files into a GeoJSON FeatureCollection.
    """
    features = []
    for data_file in glob.glob("app_data_*.json"):
        try:
            with open(data_file, 'r') as f:
                data = json.load(f)
                markers = data.get("markers", [])
                for marker in markers:
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