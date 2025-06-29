from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ai_model import predict_persona
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from collections import Counter
from datetime import datetime
import requests
from fastapi import Request
app = FastAPI()
import os
from dotenv import load_dotenv
from openai import OpenAI
load_dotenv()
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("HF_API_KEY")
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
df = pd.read_csv("../app/data/shoplens_temiz_veri_cleaned.csv", sep=";")
users_df = pd.read_csv("../app/data/All_Data_MailPassword_withRoles.csv", sep=";")
user_dict = dict(zip(users_df["email"], users_df["password"]))
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

class ChatRequest(BaseModel):
    message: str
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
    print(f"[DEBUG] Email: {email} | Seller ID: {seller_id}")
    seller_orders = df[df["seller_id"] == seller_id]
    print(f"[DEBUG] Sipariş sayısı: {seller_orders.shape[0]}")
    if seller_orders.empty:
        return []
    expected_cols = ["customer_city", "product_category","is_returned","repeat_purchase_ratio","product_stock"]
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
@app.get("/seller-review-score/{email}")
def get_avg_review_score(email: str):
    users_df = pd.read_csv("../app/data/All_Data_MailPassword_withRoles.csv", sep=";")
    user_row = users_df[users_df["email"] == email]
    if user_row.empty:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    seller_id = user_row.iloc[0]["seller_id"]
    df = pd.read_csv("../app/data/shoplens_temiz_veri_cleaned.csv", sep=";")
    seller_data = df[df["seller_id"] == seller_id]
    if seller_data.empty:
        raise HTTPException(status_code=404, detail="Satıcıya ait sipariş verisi yok")
    avg_score = seller_data["review_score"].mean()
    return {"avg_review_score": round(avg_score, 2)}
@app.get("/seller-repeat-ratio/{seller_id}")
def get_repeat_purchase_ratio(seller_id: str):
    seller_df = df[df["seller_id"] == seller_id]
    if seller_df.empty:
        return {"repeat_purchase_ratio": 0.0}
    mean_ratio = seller_df["repeat_purchase_ratio"].astype(float).mean()
    return {"repeat_purchase_ratio": mean_ratio}
@app.get("/seller-stock/{email}")
def get_seller_stock(email: str):
    seller_row = users_df[users_df["email"] == email]
    if seller_row.empty:
        raise HTTPException(status_code=404, detail="Satıcı bulunamadı")
    seller_id = seller_row["seller_id"].values[0]
    seller_data = df[df["seller_id"] == seller_id]
    if "product_category" not in seller_data.columns or "product_stock" not in seller_data.columns:
        raise HTTPException(status_code=500, detail="Gerekli sütunlar eksik!")
    seller_data = seller_data.sort_values("last_order_date", ascending=False)
    latest_stock = seller_data.drop_duplicates(subset=["product_category"])
    result = latest_stock[["product_category", "product_stock"]].to_dict(orient="records")
    critical = [item for item in result if item["product_stock"] < 10]
    return {
        "all_stock": result,
        "critical_stock": critical
    }
@app.get("/seller-efficiency/{email}")
def get_seller_efficiency(email: str):
    seller_row = users_df[users_df["email"] == email]
    if seller_row.empty:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    role = seller_row["role"].values[0]
    if role != "seller":
        raise HTTPException(status_code=403, detail="Bu kullanıcı bir satıcı değil")
    seller_id = seller_row["seller_id"].values[0]
    seller_df = df[df["seller_id"] == seller_id]
    if seller_df.empty:
        return {"email": email, "efficiency": 0}
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
@app.get("/user-persona/{email}")
def get_user_persona(email: str):
    user_row = users_df[users_df["email"] == email]
    if user_row.empty:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    customer_id = user_row["customer_unique_id"].values[0]
    persona_df = pd.read_csv("../app/data/shoplens_with_persona_codes.csv", sep=";")
    persona_row = persona_df[persona_df["customer_unique_id"] == customer_id]
    if persona_row.empty:
        raise HTTPException(status_code=404, detail="Persona bulunamadı")
    return {
        "customer_id": customer_id,
        "persona_code": persona_row["persona_code"].values[0],
        "review_style": persona_row["persona_review_score"].values[0],
        "order_style": persona_row["persona_order_value"].values[0],
        "repeat_style": persona_row["persona_repeat_ratio"].values[0],
        "weight_style": persona_row["persona_product_weight"].values[0],
        "activity_style": persona_row["persona_active_days"].values[0]
    }
@app.get("/customer-orders-by-month/{email}")
def get_customer_orders_by_month(email: str):
    user_row = users_df[users_df["email"] == email]
    if user_row.empty:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    customer_id = user_row["customer_unique_id"].values[0]
    customer_orders = df[df["customer_unique_id"] == customer_id]
    if customer_orders.empty:
        return {}
    customer_orders["order_purchase_timestamp"] = pd.to_datetime(customer_orders["order_purchase_timestamp"])
    customer_orders["month"] = customer_orders["order_purchase_timestamp"].dt.strftime("%B")
    month_counts = customer_orders["month"].value_counts().to_dict()
    month_order = ["January", "February", "March", "April", "May", "June",
                   "July", "August", "September", "October", "November", "December"]
    sorted_months = {month: month_counts.get(month, 0) for month in month_order}
    return sorted_months
@app.get("/customer-category-distribution/{email}")
def get_customer_category_distribution(email: str):
    user_row = users_df[users_df["email"] == email]
    if user_row.empty:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    customer_id = user_row["customer_unique_id"].values[0]
    customer_orders = df[df["customer_unique_id"] == customer_id]
    if customer_orders.empty:
        return {}
    counts = customer_orders["product_category"].value_counts().to_dict()
    return counts
df_orders = pd.read_csv("data/shoplens_temiz_veri_cleaned.csv", sep=";",low_memory=False)
df_users = pd.read_csv("data/All_Data_MailPassword_withRoles.csv", sep=";",low_memory=False)
df_persona = pd.read_csv("data/shoplens_with_persona_codes.csv", sep=";",low_memory=False)
@app.post("/chat")
async def personalized_chat(request: Request):
    data = await request.json()
    email = data.get("email")
    user_input = data.get("message")

    if not email or not user_input:
        raise HTTPException(status_code=400, detail="Email ve mesaj alanları zorunludur.")

    user_row = df_users[df_users["email"] == email]
    if user_row.empty:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı.")

    role = user_row["role"].values[0]

    # 📌 Sistem promptu: Genel tavır, görev ve stil
    system_prompt = (
        "Sen ShopLens adlı e-ticaret platformunda çalışan bir yapay zeka asistanısın.\n"
        "Kullanıcılara alışveriş tercihleri, sipariş geçmişi, ya da satış performansı hakkında yardımcı ol.\n"
        "Yanıtların kısa, samimi ve açıklayıcı olmalı.\n"
        "Kullanıcı bir şeyi belirsiz sorarsa kibarca tekrar açıklamasını iste.\n"
    )

    # 🧠 Kullanıcının mesajı + sistem promptu
    personalized_prompt = f"<|system|>{system_prompt}<|user|>{user_input}<|assistant|>"

    # 👥 ROL: CUSTOMER
    if role == "customer":
        customer_id = user_row["customer_unique_id"].values[0]
        persona_row = df_persona[df_persona["customer_unique_id"] == customer_id]

        if not persona_row.empty:
            persona_description = "\nBu müşteriye ait alışveriş analizi:\n"
            for col in persona_row.columns:
                if col != "customer_unique_id":
                    value = persona_row[col].values[0]
                    label = col.replace("_", " ").capitalize()
                    persona_description += f"• {label}: {value}\n"

            personalized_prompt += f"\n{persona_description}"

    # 🧾 ROL: SELLER
    elif role == "seller":
        seller_id = user_row["seller_id"].values[0]
        seller_df = df_orders[df_orders["seller_id"] == seller_id]

        if not seller_df.empty:
            avg_delivery = round(seller_df["delivery_days"].mean(), 1)
            avg_review = round(seller_df["review_score"].mean(), 2)
            stock_info = seller_df.groupby("product_category")["product_stock"].mean().to_dict()

            personalized_prompt += (
                f"\nSatıcıya ait bilgiler:\n"
                f"- Ortalama teslim süresi: {avg_delivery} gün\n"
                f"- Ortalama müşteri puanı: {avg_review}/5\n"
            )

            stock_lines = "\n".join([f"• {cat}: {int(stock)} adet" for cat, stock in stock_info.items()])
            personalized_prompt += f"\nStok durumu:\n{stock_lines}"

    else:
        personalized_prompt += "\nBu kullanıcı rolü için ekstra bilgi bulunamadı."

    # 🤖 MODEL API Çağrısı
    try:
        completion = client.chat.completions.create(
            model="deepseek/deepseek-r1-0528:free",
            messages=[{"role": "user", "content": personalized_prompt}],
            extra_headers={
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "ShopLens AI"
            },
            extra_body={}
        )
        reply = completion.choices[0].message.content
        
    except Exception as e:
        print("[CHATBOT HATASI]:", e)
        reply = "Cevap üretilemedi, lütfen tekrar deneyin."

    return {"reply": reply}

@app.get("/seller-revenue/{email}")
def get_seller_revenue(email: str):
    user_row = users_df[users_df["email"] == email]
    if user_row.empty:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı.")
    seller_id = user_row["seller_id"].values[0]
    seller_orders = df[df["seller_id"] == seller_id]
    if seller_orders.empty:
        return {"monthly_revenue": []}
    seller_orders["order_purchase_timestamp"] = pd.to_datetime(seller_orders["order_purchase_timestamp"], errors='coerce')
    seller_orders = seller_orders.dropna(subset=["order_purchase_timestamp"])
    seller_orders["year_month"] = seller_orders["order_purchase_timestamp"].dt.to_period("M").astype(str)
    if "price" in seller_orders.columns:
        seller_orders["total_price"] = seller_orders["price"]  
    elif "payment_value" in seller_orders.columns:
        seller_orders["total_price"] = seller_orders["payment_value"] 
    else:
        raise HTTPException(status_code=500, detail="price veya payment_value sütunu eksik.")
    grouped = seller_orders.groupby("year_month")["total_price"].sum().reset_index()
    result = [
        {"date": row["year_month"], "total_revenue": round(row["total_price"], 2)}
        for _, row in grouped.iterrows()
    ]
    return {"monthly_revenue": result}
