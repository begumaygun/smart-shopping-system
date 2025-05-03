import pandas as pd

# Dosyayı yükle (aynı klasörde olduğundan emin ol)
df = pd.read_csv("shoplens_segmentation_cleaned_rounded.csv", sep=';')

# Sayısal olmayan sütunları düzelt (virgül varsa noktaya çevir)
for col in df.columns:
    if df[col].dtype == 'object' and col != 'customer_unique_id':
        df[col] = df[col].str.replace(',', '.')
    try:
        df[col] = pd.to_numeric(df[col], errors='ignore')
    except:
        pass

# Eksik verileri ortalamayla doldur
df.fillna(df.mean(numeric_only=True), inplace=True)

# Persona etiketleme fonksiyonları
def label_review(score):
    if score < 3.5:
        return "Zor Begenen"
    elif score <= 4.5:
        return "Dengeli Yorumcu"
    else:
        return "Alisveris Hastasi"

def label_order_value(val):
    if val < 500:
        return "Tutumlu Tuketici"
    elif val <= 1500:
        return "Standart Alisverisci"
    else:
        return "Sepet Canavari"

def label_repeat(val):
    if val == 0:
        return "Tek Seferlik Musteri"
    elif val <= 0.5:
        return "Deneyip Giden"
    else:
        return "Sadik Musteri"

def label_weight(w):
    if w < 1000:
        return "Hafif Urun Tuketicisi"
    elif w <= 4000:
        return "Dengeli Sepetci"
    else:
        return "Agir Alisverisci"

def label_active(days):
    if days == 5:
        return "Ziyaretci Musteri"
    elif days <= 20:
        return "Donemsel Takipci"
    else:
        return "Sadik ve Uzun Sureli Kullanici"

# Persona sütunlarını oluştur
df['persona_review_score'] = df['avg_review_score'].apply(label_review)
df['persona_order_value'] = df['avg_order_value'].apply(label_order_value)
df['persona_repeat_ratio'] = df['repeat_purchase_ratio'].apply(label_repeat)
df['persona_product_weight'] = df['avg_product_weight'].apply(label_weight)
df['persona_active_days'] = df['active_days'].apply(label_active)

# Sonuçları yeni CSV olarak kaydet


# Kodlama eşleştirmeleri (persona_code için)
mapping_review = {
    "Zor Begenen": "G",
    "Dengeli Yorumcu": "D",
    "Alisveris Hastasi": "B"
}

mapping_order = {
    "Tutumlu Tuketici": "T",
    "Standart Alisverisci": "S",
    "Sepet Canavari": "C"
}

mapping_repeat = {
    "Tek Seferlik Musteri": "T",
    "Deneyip Giden": "D",
    "Sadik Musteri": "S"
}

mapping_active = {
    "Ziyaretci Musteri": "Z",
    "Donemsel Takipci": "D",
    "Sadik ve Uzun Sureli Kullanici": "S"
}

# 4 harfli persona kodunu oluştur
df["persona_code"] = (
    df["persona_review_score"].map(mapping_review) +
    df["persona_order_value"].map(mapping_order) +
    df["persona_active_days"].map(mapping_active) +
    df["persona_repeat_ratio"].map(mapping_repeat)
)

# Yeni dosya olarak kaydet
df.to_csv("shoplens_with_persona_codes.csv", sep=';', index=False)
print("4 harfli persona kodları eklendi: shoplens_with_persona_codes.csv")
