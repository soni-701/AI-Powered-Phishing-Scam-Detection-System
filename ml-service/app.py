import os

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

from url_model import extract_url_features


# =========================================
# CREATE FLASK APP
# =========================================

app = Flask(__name__)

CORS(app)


# =========================================
# LOAD SMS MODEL
# =========================================

print("Loading SMS model...")

spam_model = joblib.load("spam_model.pkl")

tfidf_vectorizer = joblib.load(
    "tfidf_vectorizer.pkl"
)

print("SMS model loaded successfully.")


# =========================================
# LOAD URL MODEL
# =========================================

print("Loading URL model...")

url_model = joblib.load(
    "url_phishing_model.pkl"
)

print("URL model loaded successfully.")


# =========================================
# HOME ROUTE
# =========================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "AI Phishing & Scam Detection ML Service",
        "status": "running",
        "services": [
            "SMS Spam Detection",
            "URL Phishing Detection"
        ]
    })


# =========================================
# SMS PREDICTION
# =========================================

@app.route("/predict", methods=["POST"])
def predict_message():

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

        message_vector = (
            tfidf_vectorizer.transform([message])
        )


        # Prediction

        prediction = spam_model.predict(
            message_vector
        )[0]


        # Probability

        probabilities = spam_model.predict_proba(
            message_vector
        )[0]


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

            "confidence": round(
                confidence * 100,
                2
            )

        })


    except Exception as error:

        print(
            "SMS prediction error:",
            error
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to analyze message."

        }), 500


# =========================================
# URL PREDICTION
# =========================================

@app.route("/predict-url", methods=["POST"])
def predict_url():

    try:

        data = request.get_json()


        if not data or "url" not in data:

            return jsonify({

                "success": False,

                "message":
                    "URL is required."

            }), 400


        url = data["url"].strip()


        if not url:

            return jsonify({

                "success": False,

                "message":
                    "URL cannot be empty."

            }), 400


        # ---------------------------------
        # EXTRACT URL FEATURES
        # ---------------------------------

        features = extract_url_features(
            url
        )


        # ---------------------------------
        # CONVERT FEATURES FOR MODEL
        # ---------------------------------

        feature_vector = [
            features
        ]


        # ---------------------------------
        # PREDICTION
        #
        # 0 = legitimate
        # 1 = phishing
        # ---------------------------------

        prediction = url_model.predict(
            feature_vector
        )[0]

          

        # ---------------------------------
        # PREDICTION PROBABILITY
        # ---------------------------------

        probabilities = (
            url_model.predict_proba(
                feature_vector
            )[0]
        )


        legitimate_probability = (
            probabilities[0]
        )

        phishing_probability = (
            probabilities[1]
        )


        # ---------------------------------
        # FINAL RESULT
        # ---------------------------------

        if prediction == 1:

            result = "phishing"

            confidence = (
                phishing_probability
            )

        else:

            result = "legitimate"

            confidence = (
                legitimate_probability
            )


        return jsonify({

            "success": True,

            "prediction": result,

            "confidence": round(
                confidence * 100,
                2
            ),

            "features": features

        })


    except Exception as error:

        print(
            "URL prediction error:",
            error
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to analyze URL."

        }), 500


# =========================================
# START SERVER
# =========================================

if __name__ == "__main__":

    print("")
    print("======================================")
    print("AI PHISHING ML SERVICE")
    print("======================================")
    print("SMS API  : http://localhost:8000/predict")
    print("URL API  : http://localhost:8000/predict-url")
    print("======================================")
    print("")


port = int(os.environ.get("PORT", 8000))

app.run(
    host="0.0.0.0",
    port=port,
    debug=False
)