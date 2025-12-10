#!/usr/bin/env python3
import logging
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="../frontend/dist")

#Allow CORS for local development
from flask_cors import CORS
CORS(app)

# Register blueprints
from routes.auth_routes import auth_bp
from routes.activity_routes import activity_bp
from routes.data_routes import data_bp

app.register_blueprint(auth_bp)
app.register_blueprint(activity_bp)
app.register_blueprint(data_bp)

# Suppress garminconnect library logging to avoid tracebacks in normal operation
logging.getLogger("garminconnect").setLevel(logging.CRITICAL)


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html") # type: ignore

@app.route("/<path:filename>")
def static_files(filename):
    """Serve static files or fallback to index.html for SPA routing"""
    import os
    file_path = os.path.join(app.static_folder, filename) # type: ignore
    
    # If it's an actual file (CSS, JS, images), serve it
    if os.path.isfile(file_path):
        return send_from_directory(app.static_folder, filename) # type: ignore
    
    # If it's not a file and doesn't start with /api/, serve index.html for SPA routing
    if not filename.startswith('api/'):
        return send_from_directory(app.static_folder, "index.html") # type: ignore
    
    # For API routes that don't exist, let Flask handle the 404
    return "API endpoint not found", 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
