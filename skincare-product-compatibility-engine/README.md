# 🧴 AI Personalized Skincare Advisor

> A complete MERN stack application that prevents harmful skincare product combinations and detects your skin type through smart analysis.

---

## 📋 Project Overview

This project implements **two major tasks**:

| Task | Feature | Description |
|------|---------|-------------|
| **Task 1** | 🛡️ Ingredient Conflict Detection | Prevents harmful product combinations, validates products by skin type, suggests safer alternatives |
| **Task 2** | 🎯 Skin Type Detection System | Detects skin type via 8-question quiz or photo analysis, auto-integrates with Task 1 |

---

## 🏗️ Folder Structure

```
project-root/
├── src/                          # Frontend (React + TypeScript)
│   ├── components/
│   │   ├── SkinForm.tsx          # Skin type selector + concerns picker
│   │   ├── ProductInputList.tsx  # Dynamic product entry form
│   │   ├── ResultDisplay.tsx     # Analysis results visualization
│   │   ├── SkinQuiz.tsx          # 8-question skin type quiz (Task 2)
│   │   ├── ImageUpload.tsx       # Photo upload + canvas analysis (Task 2)
│   │   └── SkinResultCard.tsx    # Skin type result display (Task 2)
│   ├── pages/
│   │   ├── HomePage.tsx          # Landing page with feature highlights
│   │   ├── SkinTypePage.tsx      # Skin type detection page (Task 2)
│   │   ├── AnalysisPage.tsx      # Product analysis form (Task 1)
│   │   └── ResultPage.tsx        # Analysis results page
│   ├── logic/
│   │   ├── skincareRules.ts      # Client-side conflict detection engine
│   │   └── skinTypeDetector.ts   # Client-side quiz scoring engine
│   ├── context/
│   │   └── SkinContext.tsx       # Global state for detected skin type
│   ├── api.ts                    # API layer with backend fallback
│   ├── types.ts                  # TypeScript interfaces
│   ├── App.tsx                   # Router + Provider setup
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Custom styles + animations
├── backend/                      # Backend (Express + MongoDB)
│   ├── server.js                 # Express server setup
│   ├── routes/
│   │   ├── analyze.js            # POST /api/analyze (Task 1)
│   │   ├── products.js           # GET /api/products
│   │   └── skinAnalyze.js        # POST /api/analyze-skin (Task 2)
│   ├── controllers/
│   │   ├── analyzeController.js  # Routine analysis handler
│   │   ├── productController.js  # Sample products handler
│   │   └── skinAnalyzeController.js  # Skin detection handler
│   ├── logic/
│   │   ├── skincareRules.js      # Backend rules engine (Task 1 + 2)
│   │   └── imageAnalysis.js      # Canvas-based image analysis (Task 2)
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema
│   │   └── Ingredient.js         # Ingredient schema
│   ├── package.json
│   └── .env.example
├── server/                       # Legacy backend (same as backend/)
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Quick Start

### Frontend Only (No Backend Required)

The frontend works **completely standalone** with client-side logic:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The app will work at `http://localhost:5173` with all features using client-side fallback logic.

### Full Stack (Frontend + Backend)

#### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MongoDB URI
# MONGO_URI=mongodb://localhost:27017/skincare_advisor
# PORT=5000

# Start backend server
npm start
# or for development with auto-restart:
npm run dev
```

#### 2. Frontend Setup

```bash
# From project root
npm install

# Start frontend (will auto-connect to backend if running)
npm run dev
```

---

## 🔑 Environment Variables (`.env`)

Create `backend/.env` with:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/skincare_advisor

# Server Port
PORT=5000

# Optional: Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **IMPORTANT**: The app works WITHOUT MongoDB. If MongoDB is not available, the backend serves sample data and the frontend falls back to client-side logic.

---

## 📡 API Endpoints

### Task 1: Ingredient Conflict Detection

#### `POST /api/analyze`
Analyzes a skincare routine for conflicts, skin type mismatches, and overuse.

**Request Body:**
```json
{
  "skinType": "oily",
  "concerns": ["acne", "pigmentation"],
  "products": [
    {
      "id": "1",
      "name": "Retinol Night Cream",
      "type": "moisturizer",
      "ingredients": "retinol, ceramides, squalane"
    },
    {
      "id": "2",
      "name": "Vitamin C Serum",
      "type": "serum",
      "ingredients": "vitamin c, hyaluronic acid, vitamin e"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "warnings": [...],
    "conflicts": [...],
    "skinTypeIssues": [...],
    "safeProducts": [...],
    "unsafeProducts": [...],
    "suggestions": [...],
    "recommendations": [...],
    "overallScore": 70,
    "summary": "..."
  }
}
```

### Task 2: Skin Type Detection

#### `POST /api/analyze-skin`
Detects skin type via questionnaire or image.

**Request Body (Questionnaire):**
```json
{
  "method": "questionnaire",
  "answers": [
    { "questionId": 1, "answer": "tight" },
    { "questionId": 2, "answer": "rarely" },
    { "questionId": 3, "answer": "never" },
    { "questionId": 4, "answer": "no" },
    { "questionId": 5, "answer": "yes" },
    { "questionId": 6, "answer": "tight-dry" },
    { "questionId": 7, "answer": "dull-flat" },
    { "questionId": 8, "answer": "often" }
  ]
}
```

**Request Body (Image):**
```json
{
  "method": "image",
  "image": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "skinType": "dry",
    "confidence": 0.88,
    "method": "questionnaire",
    "breakdown": { "dry": 15, "oily": 2, "combination": 1, "sensitive": 5, "normal": 3 },
    "explanation": "Based on your answers, you have DRY skin..."
  }
}
```

### Other Endpoints

- `GET /api/products` — Returns 12 sample skincare products
- `GET /api/health` — Health check with feature list

---

## 🧠 How the Logic Works

### Task 1: Conflict Detection Engine

1. **Skin Type Compatibility** — Each skin type (dry/oily/combination/sensitive) has lists of ingredients to avoid and prefer
2. **Ingredient Conflicts** — 14 conflict rules detect dangerous combinations (e.g., Retinol ❌ Vitamin C)
3. **Allergy/Sensitivity Filter** — Sensitive skin blocks fragrance, alcohol, and strong actives
4. **Overuse Detection** — Warns when 2+ or 3+ strong actives are used together
5. **Safety Score** — 0-100 score based on conflicts, mismatches, and overuse
6. **Alternative Suggestions** — Recommends safer replacement products

### Task 2: Skin Type Detection

#### Questionnaire Method:
- **8 targeted questions** covering post-wash feel, oiliness, acne, pores, sensitivity, midday oil, end-of-day look, and flakiness
- **Scoring system** with weighted points for dry, oily, combination, normal, and sensitive
- **Sensitive override** — If user reports easy reactions, skin type is set to "sensitive" regardless of other scores
- **Confidence calculation** based on score distribution

#### Image Method:
- **Canvas-based pixel analysis** — Analyzes brightness, redness, and saturation
- **Heuristic scoring** — High brightness + low saturation → oily; High redness → sensitive
- **Fallback** — Returns mock result if canvas analysis fails

---

## 🔄 User Flow

```
┌─────────────────────────────────────────────────────┐
│                    HOME PAGE                         │
│  ┌─────────────────┐  ┌──────────────────────────┐  │
│  │  Analyze Routine │  │  Detect Skin Type (NEW)  │  │
│  │   (Task 1)       │  │  (Task 2)                │  │
│  └─────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐        ┌──────────────────────────┐
│  ANALYSIS PAGE  │        │   SKIN TYPE PAGE          │
│  - Manual input │        │  ┌────────┐ ┌──────────┐ │
│  - OR auto-fill │        │  │  Quiz  │ │  Photo   │ │
│    from Task 2  │        │  │ (8 Qs) │ │  Upload  │ │
└─────────────────┘        │  └────────┘ └──────────┘ │
         │                 └──────────────────────────┘
         ▼                              │
┌─────────────────┐                     │
│  RESULT PAGE    │◄────────────────────┘
│  - Score circle │  (auto-fills skin type)
│  - Conflicts    │
│  - Alternatives │
│  - Tips         │
└─────────────────┘
```

---

## 🎨 UI Color System

| Color | Meaning | Usage |
|-------|---------|-------|
| 🟢 Green/Emerald | Safe | Safe products, high scores, positive actions |
| 🟡 Amber/Yellow | Warning | Skin mismatches, moderate conflicts |
| 🔴 Red | Danger | Ingredient conflicts, unsafe products |
| 🟣 Violet/Purple | Detection | Skin type detection features |
| 🔵 Blue | Info | Alternatives, suggestions |

---

## 🧪 Test Scenarios

### Task 1 Test Cases

| Scenario | Products | Expected Result |
|----------|----------|----------------|
| Retinol + Vitamin C | Retinol Cream + Vitamin C Serum | ❌ High severity conflict |
| Retinol + AHA | Retinol Cream + Glycolic Toner | ❌ High severity conflict |
| Sensitive + Fragrance | Fragrance product + Sensitive skin | ⚠️ Skin mismatch |
| 3+ Strong Actives | Retinol + Salicylic + Benzoyl | ⚠️ Overuse warning |
| Safe Routine | Gentle Cleanser + HA Moisturizer + SPF | ✅ Score 100 |

### Task 2 Test Cases

| Scenario | Quiz Answers | Expected Result |
|----------|-------------|-----------------|
| Dry Skin | Tight + rarely shiny + never acne + no pores + no reaction + tight-dry + dull + often flaky | 🏜️ Dry |
| Oily Skin | Oily + often shiny + frequent acne + visible pores + no reaction + oily-all-over + very-shiny + never flaky | 💧 Oily |
| Combination | Normal + sometimes shiny + sometimes acne + T-zone pores + no reaction + oily-tzone + mixed + sometimes flaky | ⚖️ Combination |
| Sensitive | Any + yes to reaction | 🌸 Sensitive (override) |

---

## 📦 Dependencies

### Frontend
- React 18 + TypeScript
- React Router DOM
- Tailwind CSS
- Lucide React (icons)

### Backend
- Express.js
- MongoDB + Mongoose
- CORS
- dotenv

---

## ⚠️ Important Notes

1. **No ML/AI Required** — All logic is rule-based. The image analysis uses canvas pixel heuristics, not machine learning.
2. **Works Offline** — Frontend has complete fallback logic. No backend needed for full functionality.
3. **Session Storage** — Detected skin type persists via sessionStorage across page navigations.
4. **Backend Optional** — If backend is not running, all features work client-side.
5. **MongoDB Optional** — Server runs with sample data even without MongoDB connection.

---

## 🛠️ Tech Stack

```
Frontend:  React + TypeScript + Tailwind CSS + Vite
Backend:   Express.js + MongoDB + Mongoose
State:     React Context API
Routing:   React Router DOM
Icons:     Lucide React
```

---

## 📝 License

Built as a MERN stack project for AI Personalized Skincare Advisor.

---

> **Built with ❤️ using the MERN Stack**
