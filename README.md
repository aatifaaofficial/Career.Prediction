# 🧠 AI Career Prediction System

A production-ready Machine Learning web application that predicts the most suitable career stream — **Science**, **Commerce**, or **Humanities** — based on 20 smart questions.

Built with **Flask + Scikit-learn (Random Forest)** on the backend and a **hand-crafted dark glassmorphism UI** on the frontend using pure HTML5, CSS3, and Vanilla JavaScript.

---

## 🚀 Quick Start

### 1. Clone or Download
```bash
cd Career-Predictor
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. (Optional) Add API Key
Open `config.py` and fill in your API key if you want AI-powered career advice:
```python
API_KEY = "your-key-here"
```
> ⚠️ The app works **fully without** an API key using built-in career descriptions.

### 5. Run the App
```bash
python app.py
```

Open your browser at: **http://localhost:5000**

---

## 📁 Project Structure

```
Career-Predictor/
│
├── app.py                  # Flask entry point, routes
├── model_loader.py         # Loads & caches the Random Forest model
├── predictor.py            # Prediction pipeline + career metadata
├── config.py               # ⚙️  ONLY FILE YOU NEED TO EDIT
├── requirements.txt        # Python dependencies
├── README.md
│
├── models/
│   └── final_random_forest_model.joblib   # Pre-trained RF model
│
├── static/
│   ├── css/
│   │   └── style.css       # Full glassmorphism dark UI
│   ├── js/
│   │   └── app.js          # All 20 questions + fetch + PDF
│   └── images/             # (placeholder for future images)
│
├── templates/
│   ├── index.html          # Landing page + Quiz form
│   └── result.html         # Rich result page with charts
│
├── utils/
│   ├── encoder.py          # Answer → model feature conversion
│   └── validator.py        # Input validation
│
└── api/                    # Reserved for future API versioning
```

---

## 🤖 How the Model Works

| Feature | Detail |
|---|---|
| Algorithm | Random Forest Classifier (100 trees) |
| Training samples | 223 |
| Features | 23 (Q1–Q20 answers + 3 score columns) |
| Output classes | 0=Science, 1=Commerce, 2=Humanities |
| Encoding | Q answer 0=Science, 1=Commerce, 2=Humanities |
| Score columns | Count of each answer type across 20 questions |

**Feature order (exact training order):**
`Q1, Q2, ..., Q20, Score_Science, Score_Commerce, Score_Humanities`

---

## 🎨 UI Features

- Dark + Blue Gradient theme
- Glassmorphism cards with backdrop blur
- Animated gradient blobs + CSS-only particles
- Smooth question transitions with progress indicator
- 20-dot progress tracker
- Confidence ring chart on result page
- Probability bar chart per career stream
- Score breakdown grid
- Downloadable PDF report
- Print-friendly layout
- Fully responsive (mobile + desktop)

---

## 🔌 API Endpoint

```
POST /predict
Content-Type: application/json

{
  "Q1": 0,
  "Q2": 1,
  ...
  "Q20": 2
}
```

**Response:**
```json
{
  "success": true,
  "career": "Science",
  "confidence": 87.5,
  "probabilities": {
    "Science": 87.5,
    "Commerce": 8.3,
    "Humanities": 4.2
  },
  "scores": {
    "Science": 14,
    "Commerce": 4,
    "Humanities": 2
  },
  "info": {
    "emoji": "🔬",
    "tagline": "Innovate. Discover. Engineer the Future.",
    ...
  }
}
```

---

## 🚢 Deployment

### Gunicorn (Linux/macOS)
```bash
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

### Render / Railway / Fly.io
- Set start command: `gunicorn app:app`
- Set `DEBUG=False` in `config.py`

---

## 📸 Screenshots
> _Add screenshots here after running the app_

- Landing page with animated hero
- Question form with progress bar
- Result page with confidence ring and probability bars
- Downloaded PDF report

---

## 📄 License
MIT — free to use and modify.
