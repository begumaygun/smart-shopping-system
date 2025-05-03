import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
import joblib

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

# CSV verisi app/data/ klasöründe
data = pd.read_csv("app/data/shoplens_with_persona_codes.csv", sep=';')
features = data[used_columns].copy()
features = features.fillna(0)

pipeline = make_pipeline(StandardScaler(), KMeans(n_clusters=3, random_state=42))
pipeline.fit(features)

joblib.dump(pipeline, "app/kmeans_model.pkl")
print("✅ Model kaydedildi.")
