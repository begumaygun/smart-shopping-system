# app/ai_model.py

import pandas as pd
from sklearn.cluster import KMeans

# Veriyi oku
data = pd.read_csv('app/shoplens_with_persona_codes.csv', sep=';')

# Sadece sayısal ve model için uygun sütunları al
used_columns = [
    'total_orders',
    'avg_order_value',
    'category_diversity',
    'avg_review_score',
    'unique_product_count',
    'payment_type_diversity',
    'avg_product_weight',
    'active_days',
    'repeat_purchase_ratio'
]
features = data[used_columns].copy()
features = features.fillna(0)  # Null değerleri sıfırla

# KMeans modelini eğit
kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(features)

# Küme etiketlerini temsil eden isimler
persona_labels = {
    0: "Zor Begenen",
    1: "Alisveris Hastasi",
    2: "Dengeli Yorumcu"
}

def predict_persona(input_data: dict):
    df = pd.DataFrame([input_data])
    prediction = kmeans.predict(df)[0]
    return persona_labels.get(prediction, f"Küme {prediction}")
