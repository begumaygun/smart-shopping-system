# app/main.py
from fastapi import FastAPI
from pydantic import BaseModel
from app.ai_model import predict_persona

app = FastAPI()

# Giriş verisini temsil eden sınıf
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
@app.get("/")
def read_root():
    return {"message": "ShopLens API is working."}

@app.post("/predict_persona")
def predict(data: CustomerData):
    input_dict = data.dict()
    result = predict_persona(input_dict)
    return {"persona": result}
