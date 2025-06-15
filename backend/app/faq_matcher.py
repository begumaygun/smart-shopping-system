import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
from pathlib import Path

class FAQMatcher:
    def __init__(self, csv_path: str):
        df = pd.read_csv(csv_path)
        self.questions = df['question'].fillna('').astype(str).tolist()
        self.answers = df['answer'].fillna('').astype(str).tolist()
        self.vectorizer = TfidfVectorizer()
        question_vecs = self.vectorizer.fit_transform(self.questions)
        self.nn = NearestNeighbors(n_neighbors=1, metric='cosine')
        self.nn.fit(question_vecs)

    def get_answer(self, query: str) -> str:
        if not query:
            return ""
        vec = self.vectorizer.transform([query])
        dist, idx = self.nn.kneighbors(vec)
        return self.answers[idx[0][0]]

# load default matcher
BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "faq.csv"
faq_matcher = FAQMatcher(DATA_FILE)
