from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

app = FastAPI()
load_dotenv()

# CORS ayarı
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Gerekirse localhost:5173 ile sınırlandır
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face API Key (env'den alınır)
HUGGINGFACE_API_KEY = os.getenv("HF_API_KEY")

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_input = data["message"]

    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_KEY}"
    }

    payload = {
        "inputs": f"<|system|>You are a helpful assistant.<|user|>{user_input}<|assistant|>"
    }

    response = requests.post(
        "https://api-inference.huggingface.co/models/bigscience/bloomz-560m",
        headers=headers,
        json=payload
    )

    result = response.json()
    print("Hugging Face Cevabı:", result)

    try:
        reply = result[0]["generated_text"]
    except:
        reply = str(result)

    return {"reply": reply}
