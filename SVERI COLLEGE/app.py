from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from chat.gemini_chat import ask_gemini
import os

app = Flask(__name__)
load_dotenv()

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "")
    response = ask_gemini(user_input)
    return jsonify({"reply": response})

if __name__ == "__main__":
    app.run(debug=True)
