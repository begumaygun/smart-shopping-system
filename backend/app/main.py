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
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ana veri seti
df = pd.read_csv("../app/data/shoplens_temiz_veri_cleaned.csv", sep=";")

# Kullanıcı e-posta + şifreleri (giriş kontrolü için)
users_df = pd.read_csv("../app/data/All_Data_MailPassword.csv", sep=";")
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
            return {"message": "Giriş başarılı"}
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
