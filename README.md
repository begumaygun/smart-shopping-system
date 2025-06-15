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

Both the seller and customer dashboards now include a simple chatbot powered by a small FAQ dataset located at `backend/app/data/faq.csv`. Incoming questions are matched to the closest entry using a TF‑IDF KNN classifier.

### Adding questions

Edit `faq.csv` and append rows with a `question` and an `answer`. Example prompts:

```
question,answer
"top categories","Top categories are electronics, books, and clothing."
"average review score","Average review score is 4.2."
```

After updating the CSV, restart the backend to load the new data.
