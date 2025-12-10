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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
