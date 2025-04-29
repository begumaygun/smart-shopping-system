import pandas as pd
import numpy as np 
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt 

# 1. Veriyi oku
data = pd.read_csv('../shoplens_temiz_veri_cleaned.csv', delimiter=';')

# 2. Eksik kritik sütunları temizle
data = data.dropna(subset=['order_delivered_timestamp', 'product_category_pt', 'product_category'])

# 3. Sayısal veri temizlikleri: price
data['price'] = pd.to_numeric(data['price'], errors='coerce')
data = data[data['price'].notnull()]

# 4. payment_value temizliği
data['payment_value'] = pd.to_numeric(data['payment_value'], errors='coerce')
payment_limit = data['payment_value'].quantile(0.999)
data['payment_value'] = data['payment_value'].clip(upper=payment_limit)

# 5. freight_value temizliği
data['freight_value'] = pd.to_numeric(data['freight_value'], errors='coerce')
freight_limit = data['freight_value'].quantile(0.999)
data['freight_value'] = data['freight_value'].clip(upper=freight_limit)

# 6. avg_order_value temizliği
data['avg_order_value'] = pd.to_numeric(data['avg_order_value'], errors='coerce')
avg_limit = data['avg_order_value'].quantile(0.999)
data['avg_order_value'] = data['avg_order_value'].clip(upper=avg_limit)
data['avg_order_value'] = data['avg_order_value'].fillna(data['avg_order_value'].median())

# 7. payment_type dil düzenlemesi
data['payment_type'] = data['payment_type'].str.strip().str.lower()
data['payment_type'] = data['payment_type'].replace({
    'boleto': 'bank slip',
    'cartao de credito': 'credit card',
    'voucher': 'voucher',
    'debito': 'debit card'
})

# 8. review_score boşsa ortanca değerle doldur
data['review_score'] = pd.to_numeric(data['review_score'], errors='coerce')
data['review_score'] = data['review_score'].fillna(data['review_score'].median())

# 9. first_order_date kaldır
if 'first_order_date' in data.columns:
    data.drop(columns=['first_order_date'], inplace=True)

# 10. repeat_purchase_ratio hesapla
repeat_counts = data.groupby(['customer_unique_id', 'order_id']).size().reset_index(name='purchase_count')
repeated_customers = repeat_counts[repeat_counts['purchase_count'] > 1]['customer_unique_id'].unique()
data['repeat_purchase_ratio'] = data['customer_unique_id'].apply(lambda x: 1.0 if x in repeated_customers else 0.0)

# 11. active_days tahmini hesapla
order_counts = data.groupby('customer_unique_id').size().rename('order_count')
data = data.merge(order_counts, on='customer_unique_id', how='left')
data['active_days'] = data['order_count'] * 5
data.drop(columns=['order_count'], inplace=True)

# 12. features çıkar
features = pd.DataFrame()
features['order_count'] = data.groupby('customer_unique_id').size()
features['total_spent'] = data.groupby('customer_unique_id')['payment_value'].sum()
features['avg_spent'] = data.groupby('customer_unique_id')['payment_value'].mean()
features['category_diversity'] = data.groupby('customer_unique_id')['product_category'].nunique()

# 13. avg_spent ve total_spent son temizlik
features['avg_spent'] = pd.to_numeric(features['avg_spent'], errors='coerce')
features['total_spent'] = pd.to_numeric(features['total_spent'], errors='coerce')
avg_limit = features['avg_spent'].quantile(0.999)
total_limit = features['total_spent'].quantile(0.999)
features['avg_spent'] = features['avg_spent'].clip(upper=avg_limit)
features['total_spent'] = features['total_spent'].clip(upper=total_limit)
features['avg_spent'] = features['avg_spent'].fillna(features['avg_spent'].median())
features['total_spent'] = features['total_spent'].fillna(features['total_spent'].median())

# 14. Temiz veri dosyalarını kaydet
data.to_csv('../shoplens_temiz_veri_cleaned_v2.csv', index=False, sep=';')
features.to_csv('../shoplens_features_cleaned_v2.csv', index=True, sep=';')

print("\u2705 Temiz veri ve öznitelikler başarıyla dışa aktarıldı!")