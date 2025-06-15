import csv
from pathlib import Path

class FAQMatcher:
    def __init__(self, csv_path: str):
        self.questions = []
        self.answers = []
        with open(csv_path, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                self.questions.append(str(row.get('question', '')))
                self.answers.append(str(row.get('answer', '')))
        self.question_tokens = [self._tokenize(q) for q in self.questions]

    def _tokenize(self, text: str):
        return set(text.lower().split())

    def get_answer(self, query: str) -> str:
        if not query:
            return ""
        query_tokens = self._tokenize(query)
        best_score = -1
        best_answer = ""
        for tokens, answer in zip(self.question_tokens, self.answers):
            if not tokens:
                continue
            intersect = query_tokens & tokens
            union = query_tokens | tokens
            score = len(intersect) / len(union) if union else 0
            if score > best_score:
                best_score = score
                best_answer = answer
        return best_answer

# load default matcher
BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "faq.csv"
faq_matcher = FAQMatcher(DATA_FILE)
