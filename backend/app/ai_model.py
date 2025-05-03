import joblib
import pandas as pd

persona_labels = {
    0: "Dengeli Yorumcu",
    1: "Alisveris Hastasi",
    2: "Zor Begenen"
}

def predict_persona(input_data: dict):
    df = pd.DataFrame([input_data])
    pipeline = joblib.load("app/kmeans_model.pkl")  # Model dosyası sabit
    prediction = pipeline.predict(df)[0]
    return persona_labels.get(prediction, f"Küme {prediction}")
