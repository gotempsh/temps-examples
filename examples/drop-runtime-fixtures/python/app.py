from flask import Flask, jsonify

app = Flask(__name__)


@app.get("/")
def index():
    return jsonify(runtime="python", status="ok")


@app.get("/health")
def health():
    return "ok"
