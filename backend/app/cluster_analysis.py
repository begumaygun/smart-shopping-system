import pandas as pd
import joblib

pd.set_option('display.max_columns', None)

# Veriyi oku
data = pd.read_csv("data/shoplens_with_persona_codes.csv", sep=';')

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

features = data[used_columns].fillna(0)

# Eğitilmiş pipeline'ı yükle
pipeline = joblib.load("kmeans_model.pkl")

# Küme tahminleri
data["cluster"] = pipeline.predict(features)

# Her küme için ortalama değerleri hesapla
cluster_means = data.groupby("cluster")[used_columns].mean()
print("\n📊 Küme Ortalamaları:\n")
print(cluster_means)
