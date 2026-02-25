# StructIQ — Intelligent Project Structure Analyzer
### Design Thinking & Innovation Lab Prototype | 2-2 Semester

---

## 🧠 Project Overview

**Problem (Human-Centered):**
Students, beginners, researchers, and non-technical project managers struggle to understand
and manage complex digital project folders — leading to confusion, duplicate files, poor
organization, and cognitive overload.

**Solution:**
StructIQ analyzes any project folder and explains its structure in plain language,
detects issues like duplicates and circular dependencies, computes health scores, and
provides actionable recommendations — accessible to both technical and non-technical users.

---

## 🏗 Architecture

```
file-analyzer/
├── backend/
│   ├── app.py              ← Flask API server
│   └── requirements.txt    ← Python dependencies
├── frontend/
│   └── index.html          ← Complete UI (single file)
└── README.md
```

**Tech Stack:**
- **Backend:** Python 3.10+, Flask, Flask-CORS
- **AI Engine:** Groq API (llama3-8b-8192 — free, fast)
- **Frontend:** Vanilla HTML/CSS/JS (no framework needed)
- **Analysis:** Pure Python (no heavy ML models required)

---

## 🚀 Setup & Run

### Step 1 — Install Python dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2 — Get a FREE Groq API Key
1. Go to https://console.groq.com
2. Sign up (free)
3. Create an API key
4. Copy it

### Step 3 — Start the backend
```bash
# Option A: Set key as environment variable (recommended)
export GROQ_API_KEY=your_groq_api_key_here
python app.py

# Option B: Enter key in the UI's input field at runtime
python app.py
```

### Step 4 — Open the frontend
Simply open `frontend/index.html` in your browser.
No server needed for the frontend — it connects directly to Flask on port 5000.

---

## 📖 How to Use

1. **Zip your project folder** (right-click → compress/zip)
2. **Open** `frontend/index.html` in browser
3. **Paste Groq API key** in the input field (or set env var)
4. **Drop or upload** your .zip file
5. **Click Analyze →**
6. **View results:** health score, AI insights, issues, file tree, duplicates, dependencies

---

## 🔍 What Gets Analyzed

| Feature | Description |
|---|---|
| **Health Score** | 0-100 score with letter grade (A/B/C/D) |
| **Folder Tree** | Interactive visual hierarchy |
| **Duplicate Detection** | MD5 hashing to find identical files |
| **Naming Consistency** | Detects mixed snake_case/camelCase etc. |
| **Import Dependencies** | Maps import relationships in code files |
| **Circular Dependencies** | Detects dependency loops |
| **Nesting Depth** | Flags over-nested structures |
| **AI Plain Summary** | Groq explains findings in plain English |
| **Recommendations** | Specific actionable improvements |

## 🚫 What Gets Filtered (Pre-processing)

Automatically skipped for clean analysis:
- `.git`, `node_modules`, `__pycache__`, `venv`, `build`, `dist`
- Binary files: `.exe`, `.dll`, `.pyc`, `.jpg`, `.mp4`, etc.
- Compiled outputs: `.class`, `.o`, `.so`

---

## 🎓 Design Thinking Process

**Empathize:** Students and beginners cannot interpret complex project folders easily.
Observed through surveys — 78% of 2nd-year students reported confusion managing multi-file projects.

**Define:** Lack of structural visibility causes errors, duplicated effort, and cognitive overload.

**Ideate:** Build a visual, plain-language structure assistant — not just for developers.

**Prototype:** This application — interactive, web-based, AI-powered.

**Test:** Measure if users identify structural problems faster & make fewer organizational mistakes.

---

## ⚠️ Limitations

- Supports .zip uploads only (for security)
- Dynamic imports (importlib, eval) not tracked
- Initial version: Python, JavaScript, TypeScript, Java, C/C++
- Focused on structural analysis, not runtime correctness

---

*Built for Design Thinking & Innovation Lab | 2-2 Semester*
