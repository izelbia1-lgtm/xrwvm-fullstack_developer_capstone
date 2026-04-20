from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/analyze/<path:text>")
def analyze(text):
    text_lower = text.lower()
    if any(word in text_lower for word in ["great", "good", "fantastic", "excellent", "love"]):
        sentiment = "positive"
    elif any(word in text_lower for word in ["bad", "poor", "terrible", "hate"]):
        sentiment = "negative"
    else:
        sentiment = "neutral"
    return jsonify({"sentiment": sentiment})

app.run(port=5050)
