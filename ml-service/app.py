from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib


# -----------------------------------
# CREATE FLASK APP
# -----------------------------------

app = Flask(__name__)
CORS(app)


# -----------------------------------
# LOAD TRAINED MODEL
# -----------------------------------

model = joblib.load("spam_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")


# -----------------------------------
# HOME ROUTE
# -----------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "AI Phishing & Scam Detection ML Service",
        "status": "running"
    })


# -----------------------------------
# PREDICTION ROUTE
# -----------------------------------

@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        if not data or "message" not in data:
            return jsonify({
                "success": False,
                "message": "Message is required."
            }), 400

        message = data["message"].strip()

        if not message:
            return jsonify({
                "success": False,
                "message": "Message cannot be empty."
            }), 400


        # Convert message into TF-IDF
        message_vector = vectorizer.transform([message])


        # Prediction
        prediction = model.predict(message_vector)[0]


        # Probability
        probabilities = model.predict_proba(message_vector)[0]

        ham_probability = probabilities[0]
        spam_probability = probabilities[1]


        # Final result
        if prediction == 1:
            result = "spam"
            confidence = spam_probability
        else:
            result = "ham"
            confidence = ham_probability


        return jsonify({
            "success": True,
            "prediction": result,
            "confidence": round(confidence * 100, 2)
        })


    except Exception as error:

        print("Prediction error:", error)

        return jsonify({
            "success": False,
            "message": "Unable to analyze message."
        }), 500


# -----------------------------------
# START SERVER
# -----------------------------------

if __name__ == "__main__":

    print("ML Service starting...")
    print("ML API running on http://localhost:8000")

    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )