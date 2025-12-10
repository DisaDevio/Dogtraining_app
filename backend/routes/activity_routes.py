import os
from pathlib import Path
from flask import Blueprint, jsonify
from garth.exc import GarthHTTPError
from garminconnect import (
    Garmin,
    GarminConnectAuthenticationError,
    )

activity_bp = Blueprint('activity', __name__)

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

@activity_bp.route("/api/activities")
def get_activities():
    """
    Retrieve a list of hunting-related activities from Garmin Connect, including hunting, running, and hiking.
    """
    api = init_api()
    if not api:
        return jsonify({"error": "Not logged in"}), 401
    activities = api.get_activities(0, 1000)  # first 100
    if not activities or len(activities) == 0:
        return jsonify({"error": "No activities found"}), 404
    hunting_activities = [
        a for a in activities
        if isinstance(a, dict) and a.get("activityType", {}).get("typeKey", "").lower() in ["hunting", "running", "hiking"]
    ]

    return jsonify(hunting_activities)

@activity_bp.route("/api/activity/<activity_id>/route")
def get_activity_route(activity_id):
    """
    Retrieve the GPS route for a specific activity as a list of latitude and longitude points.
    
    :param activity_id: The ID of the activity to retrieve the route for.
    :return: A JSON response containing the list of GPS points.
    """
    api = init_api()
    if not api:
        return jsonify({"error": "Not logged in"}), 401

    details = api.get_activity_details(activity_id)
    gps_points = details.get("geoPolylineDTO", {}).get("polyline", [])
    line = [[p['lat'], p['lon']] for p in gps_points]
    return jsonify(line)

@activity_bp.route("/api/activity/<activity_id>/stats")
def get_activity_stats(activity_id):
    """
    Retrieve key statistics for a specific activity.
    
    :param activity_id: The ID of the activity to retrieve statistics for.
    :return: A JSON response containing the activity statistics including name, time, duration, distance, and elevation gain/loss.
    """
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
    