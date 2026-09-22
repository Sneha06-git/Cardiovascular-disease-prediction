from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load the trained machine learning model
model = joblib.load("cardio_model.pkl")


# Home page
@app.route("/")
def home():
    return render_template("index.html")


# Prediction route
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Get user input
        age_years = float(data["age_years"])
        gender = int(data["gender"])
        height = float(data["height"])
        weight = float(data["weight"])
        ap_hi = float(data["ap_hi"])
        ap_lo = float(data["ap_lo"])
        cholesterol = int(data["cholesterol"])
        gluc = int(data["gluc"])
        smoke = int(data["smoke"])
        alco = int(data["alco"])
        active = int(data["active"])

        # Calculate BMI
        bmi = weight / ((height / 100) ** 2)

        # Create input DataFrame
        patient_data = pd.DataFrame([{
            "gender": gender,
            "height": height,
            "weight": weight,
            "ap_hi": ap_hi,
            "ap_lo": ap_lo,
            "cholesterol": cholesterol,
            "gluc": gluc,
            "smoke": smoke,
            "alco": alco,
            "active": active,
            "age_years": age_years,
            "bmi": bmi
        }])

        # Make prediction
        prediction = int(model.predict(patient_data)[0])

        # Convert prediction into readable result
        if prediction == 1:
            result = "Cardiovascular Disease Detected"
        else:
            result = "No Cardiovascular Disease Detected"

        return jsonify({
            "prediction": prediction,
            "result": result,
            "bmi": round(bmi, 2)
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


# Run the Flask application
if __name__ == "__main__":
    app.run(debug=True)