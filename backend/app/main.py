from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ai_model import predict_persona
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from collections import Counter
from datetime import datetime

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ana veri seti
df = pd.read_csv("../app/data/shoplens_temiz_veri_cleaned.csv", sep=";")


# Kullanıcı e-posta + şifreleri (giriş kontrolü için)
users_df = pd.read_csv("../app/data/All_Data_MailPassword_withRoles.csv", sep=";")
user_dict = dict(zip(users_df["email"], users_df["password"]))


# MODELLER
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginEmail(BaseModel):
    email: str

class CustomerData(BaseModel):
    total_orders: int
    avg_order_value: float
    category_diversity: int
    avg_review_score: float
    unique_product_count: int
    payment_type_diversity: int
    avg_product_weight: float
    active_days: int
    repeat_purchase_ratio: float

# ENDPOINTLER
@app.get("/all-users")
def get_all_users():
    try:
        return users_df[["email", "seller_id", "role"]].head(20).to_dict(orient="records")
    except Exception as e:
        print("[HATA - /all-users]:", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def read_root():
    return {"message": "ShopLens API is working."}

@app.post("/predict_persona")
def predict(data: CustomerData):
    input_dict = data.dict()
    result = predict_persona(input_dict)
    return {"persona": result}

sample_customers = {
    "123": {
        "name": "John Doe",
        "segment": "Fırsat Avcısı",
        "total_orders": 12,
        "avg_order_value": 43.5,
        "avg_review_score": 4.2
    },
    "456": {
        "name": "Jane Smith",
        "segment": "Sadık Müşteri",
        "total_orders": 28,
        "avg_order_value": 87.2,
        "avg_review_score": 4.8
    }
}

@app.get("/customer/{customer_id}")
def get_customer(customer_id: str):
    customer = sample_customers.get(customer_id)
    if customer:
        return customer
    return {"error": "Customer not found"}

@app.get("/top-categories")
def get_top_categories():
    top_counts = df["product_category"].value_counts().head(5)
    return top_counts.to_dict()

# GİRİŞ KONTROLÜ
@app.post("/login")
def login(request: LoginRequest):
    if request.email in user_dict:
        if request.password == user_dict[request.email]:
            user_row = users_df[users_df["email"] == request.email]
            role = user_row["role"].values[0] if not user_row.empty else "customer"
            return {"message": "Giriş başarılı", "role": role}
        else:
            raise HTTPException(status_code=401, detail="Hatalı şifre")
    else:
        raise HTTPException(status_code=404, detail="E-posta bulunamadı")


# GİRİŞ LOG SİSTEMİ
last_login = {}

@app.post("/login-log")
def log_login(data: LoginEmail):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    last_login[data.email] = now
    print(f"Giriş yapan: {data.email} - Zaman: {now}")
    return {"message": f"{data.email} giriş yaptı"}

@app.get("/last-logins")
def get_last_logins():
    return last_login

@app.get("/seller-orders/{email}")
def get_seller_orders(email: str):
    seller_row = users_df[users_df["email"] == email]
    if seller_row.empty:
        raise HTTPException(status_code=404, detail="Satıcı bulunamadı")

    seller_id = seller_row["seller_id"].values[0]

    # Hata ayıklamak için terminale yazdır
    print(f"[DEBUG] Email: {email} | Seller ID: {seller_id}")

    seller_orders = df[df["seller_id"] == seller_id]

    print(f"[DEBUG] Sipariş sayısı: {seller_orders.shape[0]}")

    if seller_orders.empty:
        return []

    expected_cols = ["customer_city", "product_category"] 

    for col in expected_cols:
        if col not in df.columns:
            raise HTTPException(status_code=500, detail=f"{col} sütunu sipariş datasında yok!")

    return seller_orders[expected_cols].to_dict(orient="records")

@app.get("/seller-delivery-stats/{seller_id}")
def get_avg_delivery(seller_id: str):
    seller_df = df[df["seller_id"] == seller_id]
    if seller_df.empty:
        raise HTTPException(status_code=404, detail="Satıcı bulunamadı.")
    avg_days = round(seller_df["delivery_days"].mean(), 1)
    return {"seller_id": seller_id, "avg_delivery_days": avg_days}

@app.get("/seller-efficiency/{email}")
def get_seller_efficiency(email: str):
    # E-postaya göre seller bilgisi al
    seller_row = users_df[users_df["email"] == email]
    if seller_row.empty:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

    # Role kontrolü
    role = seller_row["role"].values[0]
    if role != "seller":
        raise HTTPException(status_code=403, detail="Bu kullanıcı bir satıcı değil")

    # Seller ID çek ve veriyi filtrele
    seller_id = seller_row["seller_id"].values[0]
    seller_df = df[df["seller_id"] == seller_id]

    if seller_df.empty:
        return {"email": email, "efficiency": 0}

    # Teslimat süresi toplamı ve ürün sayısı
    total_delivery_time = seller_df["delivery_days"].sum()
    total_products_sold = seller_df.shape[0]

    if total_products_sold == 0:
        return {"email": email, "efficiency": 0}

    efficiency = round(total_delivery_time / total_products_sold, 2)

    return {
        "email": email,
        "seller_id": seller_id,
        "avg_delivery_per_product": efficiency,
        "total_products_sold": total_products_sold
    }




