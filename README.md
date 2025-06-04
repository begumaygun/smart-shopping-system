# Smart Shopping System

This project contains a FastAPI backend and a React frontend for customer profiling and analytics.

## Running the backend

```bash
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload
```

## Running the frontend

```bash
cd frontend/shoplens-frontend
npm install
npm run dev
```

## Chatbot

Both the seller and customer dashboards now include a simple chatbot. Type a question such as `top categories` or `review score` to see data driven responses.
