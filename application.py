import os
import re
from flask import Flask, jsonify, render_template, request

import json
from cs50 import SQL

# Configure application
app = Flask(__name__)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finalproject.db")


# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Home


@app.route("/")
def index():
    """Render map"""
    if not os.environ.get("API_KEY"):
        raise RuntimeError("API_KEY not set")
    return render_template("index.html", key=os.environ.get("API_KEY"))


@app.route("/lats")
def lats():
    """Look up latitudes for geographic center of every state and Washington DC"""
    state_latitude = db.execute("SELECT latitude FROM geostates")
    return jsonify(state_latitude)


@app.route("/longs")
def longs():
    """Look up longitudes for geographic center of every state and Washington DC"""
    state_longitude = db.execute("SELECT longitude FROM geostates")
    return jsonify(state_longitude)


@app.route("/boundaries")
def boundaries():
    """Gets all county boundaries for each state and Washington DC"""
    countyboundaries = db.execute("SELECT geometry FROM countyboundaries")
    return jsonify(countyboundaries)


@app.route("/search")
def search():
    """Search for places that match query"""
    if not request.args.get("q"):
        raise RuntimeError("missing query")
    q = request.args.get("q") + "%"
    return jsonify(db.execute("SELECT * FROM places WHERE postal_code LIKE :q OR place_name LIKE :q LIMIT 10", q=q))


@app.route("/statecodes")
def statecodes():
    """Gets fusion table identification code for each state and Washington DC"""
    statecodes = db.execute("SELECT codes FROM statecodes")
    return jsonify(statecodes)