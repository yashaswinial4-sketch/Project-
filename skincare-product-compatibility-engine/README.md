# 🧴 AI Personalized Skincare Advisor

> A complete MERN stack application with **three powerful features**: ingredient conflict detection, skin type identification, and acne risk prediction.

---

## 📋 Project Overview

| Task | Feature | Description |
|------|---------|-------------|
| **Task 1** | 🛡️ Ingredient Conflict Detection | 14+ conflict rules, skin type compatibility, safe alternatives |
| **Task 2** | 🎯 Skin Type Detection | 8-question quiz + photo analysis, auto-integration |
| **Task 3** | 🔴 Acne Risk Prediction | 12+ habit factors, 30+ ingredient checks, personalized tips |

---

## 🚀 Quick Start

### Frontend Only (No Backend Required)
```bash
npm install
npm run dev
```
The app works fully client-side with fallback logic.

### Full MERN Stack
```bash
# Terminal 1 — Backend
cd backend
npm install
cp .env.example .env   # Edit with your MongoDB URI
npm run dev

# Terminal 2 — Frontend
npm install
npm run dev
```

---

## ⚙️ Environment Setup

### Backend `.env` File
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skincare_advisor
NODE_ENV=development
```

**⚠️ Important:**
- If MongoDB is not running, the server still works with in-memory sample data
- The frontend automatically falls back to client-side logic if the backend is unavailable
- Set `VITE_API_URL=http://localhost:5000/api` in frontend `.env` if backend runs on a different port

---

## 🧩 Task 1: Ingredient Conflict Detection

### What It Does
- Detects **14+ ingredient conflict rules** (Retinol ❌ Vitamin C, Retinol ❌ AHA, etc.)
- Validates products against **4 skin types** (Dry, Oily, Combination, Sensitive)
- Detects **overuse of strong actives**
- Suggests **safer alternatives** for problematic products
- Generates **personalized ingredient recommendations**

### API Endpoint
```
POST /api/analyze
```
**Request Body:**
```json
{
  "skinType": "oily",
  "concerns": ["acne", "pigmentation"],
  "products": [
    { "name": "Retinol Cream", "type": "serum", "ingredients": "retinol, ceramides, squalane" },
    { "name": "Vitamin C Serum", "type": "serum", "ingredients": "vitamin c, hyaluronic acid" }
  ]
}
```

**Response:**
```json
{
  "warnings": [...],
  "conflicts": [...],
  "skinTypeIssues": [...],
  "safeProducts": [...],
  "unsafeProducts": [...],
  "suggestions": [...],
  "recommendations": [...],
  "overallScore": 65,
  "summary": "Your routine has some issues..."
}
```

### Key Files
| File | Purpose |
|------|---------|
| `src/logic/skincareRules.ts` | Client-side rules engine (336 lines) |
| `backend/logic/skincareRules.js` | Server-side rules engine |
| `backend/controllers/analyzeController.js` | POST /api/analyze handler |
| `src/components/ProductInputList.tsx` | Product entry UI |
| `src/components/ResultDisplay.tsx` | Results visualization |

---

## 🧩 Task 2: Skin Type Detection System

### What It Does
- **8-Question Smart Quiz** with scoring system (Dry, Oily, Combination, Sensitive)
- **Photo Analysis** using canvas-based pixel heuristics (brightness, redness, saturation)
- **Auto-integration** — detected skin type flows into AnalysisPage
- **React Context** for global state management
- **Session persistence** — survives page refreshes

### Quiz Scoring Logic
Each answer contributes to Dry/Oily/Combination scores. Sensitive is a flag override.
```
Tight skin after washing → +Dry
Oily shine often → +Oily
T-zone only → +Combination
Reacts easily → Sensitive override
```

### API Endpoint
```
POST /api/analyze-skin
```
**Request Body (Quiz):**
```json
{
  "method": "questionnaire",
  "answers": [
    { "questionId": 1, "answer": "tight" },
    { "questionId": 2, "answer": "often" }
  ]
}
```

**Request Body (Image):**
```json
{
  "method": "image",
  "image": "data:image/png;base64,..."
}
```

**Response:**
```json
{
  "skinType": "oily",
  "confidence": 0.85,
  "method": "questionnaire",
  "explanation": "Your answers strongly indicate oily skin...",
  "breakdown": { "dry": 10, "oily": 80, "combination": 10 }
}
```

### Key Files
| File | Purpose |
|------|---------|
| `src/logic/skinTypeDetector.ts` | Quiz scoring algorithm |
| `backend/logic/imageAnalysis.js` | Image heuristic analysis |
| `src/components/SkinQuiz.tsx` | Quiz UI with progress bar |
| `src/components/ImageUpload.tsx` | Drag-and-drop image upload |
| `src/components/SkinResultCard.tsx` | Detection result display |
| `src/pages/SkinTypePage.tsx` | Main detection page |
| `src/context/SkinContext.tsx` | Global state management |

---

## 🧩 Task 3: Acne Risk Prediction

### What It Does
- Analyzes **12+ daily habit factors** (sleep, water, diet, stress, hygiene, etc.)
- Scans products against **30+ comedogenic ingredients** with severity ratings
- Detects **routine gaps** (missing cleanser, moisturizer, sunscreen)
- Calculates **weighted risk score** (0-100) across 4 dimensions
- Generates **personalized prevention tips** prioritized by severity
- Suggests **specific routine changes**

### Scoring Breakdown
| Factor | Weight | What It Measures |
|--------|--------|-----------------|
| Lifestyle Habits | 35% | Sleep, water, diet, stress, exercise |
| Product Ingredients | 30% | Comedogenic ratings, acne triggers |
| Routine Gaps | 25% | Missing steps, over-exfoliation |
| Skin Type | 10% | Natural acne predisposition |

### Risk Levels
| Score | Level | Color |
|-------|-------|-------|
| 0-29 | 🟢 Low | Green |
| 30-49 | 🟡 Moderate | Yellow |
| 50-69 | 🟠 High | Orange |
| 70-100 | 🔴 Severe | Red |

### Habit Factors Analyzed
1. Current acne severity
2. Current breakout count
3. Sleep hours per night
4. Water intake (glasses/day)
5. Diet type (sugar, dairy, junk food)
6. Stress level
7. Exercise frequency
8. Face wash frequency
9. Makeup removal consistency
10. Pillowcase change frequency
11. Sunscreen usage
12. Face touching frequency

### Comedogenic Ingredient Database
Includes 30+ ingredients with ratings 1-5:
- **Rating 5 (Extreme):** isopropyl myristate, myristyl myristate, wheat germ oil
- **Rating 4 (High):** coconut oil, cocoa butter, butyl stearate, laureth-4
- **Rating 3 (Medium):** sodium lauryl sulfate, alcohol, oleic acid
- **Rating 2 (Low):** lanolin, mineral oil, fragrance, dimethicone
- **Rating 1 (Minimal):** petroleum, petrolatum

### API Endpoint
```
POST /api/acne-risk
```
**Request Body:**
```json
{
  "habits": {
    "currentAcne": "moderate",
    "sleepHours": 5,
    "waterIntake": 3,
    "dietType": "high-sugar",
    "stressLevel": "high",
    "exerciseFrequency": "none",
    "faceWashFrequency": "once",
    "makeupRemoval": "sometimes",
    "pillowcaseChange": "monthly",
    "sunscreenUse": "never",
    "touchingFace": "often",
    "currentBreakouts": "moderate"
  },
  "products": [
    { "name": "Heavy Cream", "type": "moisturizer", "ingredients": "coconut oil, cocoa butter, fragrance" }
  ],
  "skinType": "oily"
}
```

**Response:**
```json
{
  "riskLevel": "severe",
  "riskScore": 78,
  "breakdown": {
    "habitScore": 85,
    "ingredientScore": 60,
    "routineScore": 45,
    "skinTypeScore": 15
  },
  "triggers": [...],
  "safeProducts": [],
  "riskyProducts": [{ "name": "Heavy Cream", "triggers": ["coconut oil (rating: 4/5)"] }],
  "tips": [...],
  "summary": "🔴 Your acne risk is SEVERE...",
  "routineChanges": [...]
}
```

### Key Files
| File | Purpose |
|------|---------|
| `src/logic/acneRiskPredictor.ts` | Client-side prediction engine (400+ lines) |
| `backend/logic/acneRiskPredictor.js` | Server-side prediction engine |
| `src/components/AcneHabitForm.tsx` | 12-factor habit questionnaire |
| `src/components/AcneProductReview.tsx` | Product acne trigger scanner |
| `src/components/AcneRiskResult.tsx` | Risk visualization with score circle |
| `src/pages/AcneRiskPage.tsx` | 3-step assessment flow |
| `backend/routes/acneRisk.js` | POST /api/acne-risk route |

---

## 🗂️ Complete Folder Structure

```
├── src/                          # Frontend (React + TypeScript)
│   ├── components/
│   │   ├── SkinForm.tsx          # Task 1: Skin type + concerns form
│   │   ├── ProductInputList.tsx  # Task 1: Product entry
│   │   ├── ResultDisplay.tsx     # Task 1: Results visualization
│   │   ├── SkinQuiz.tsx          # Task 2: 8-question quiz
│   │   ├── ImageUpload.tsx       # Task 2: Photo upload + analysis
│   │   ├── SkinResultCard.tsx    # Task 2: Detection result
│   │   ├── AcneHabitForm.tsx     # Task 3: Habit questionnaire
│   │   ├── AcneProductReview.tsx # Task 3: Product acne scanner
│   │   └── AcneRiskResult.tsx    # Task 3: Risk visualization
│   ├── pages/
│   │   ├── HomePage.tsx          # Landing page with 3 CTAs
│   │   ├── SkinTypePage.tsx      # Task 2: Detection page
│   │   ├── AnalysisPage.tsx      # Task 1: Product analysis
│   │   ├── ResultPage.tsx        # Task 1: Results page
│   │   └── AcneRiskPage.tsx      # Task 3: Acne risk page
│   ├── logic/
│   │   ├── skincareRules.ts      # Task 1: Rules engine
│   │   ├── skinTypeDetector.ts   # Task 2: Quiz scoring
│   │   └── acneRiskPredictor.ts  # Task 3: Risk prediction
│   ├── context/
│   │   └── SkinContext.tsx       # Global skin type state
│   ├── api.ts                    # API layer with fallback
│   ├── types.ts                  # All TypeScript interfaces
│   ├── App.tsx                   # Router + providers
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Custom animations
├── backend/                      # Backend (Express + MongoDB)
│   ├── logic/
│   │   ├── skincareRules.js      # Task 1: Server rules
│   │   ├── imageAnalysis.js      # Task 2: Image analysis
│   │   └── acneRiskPredictor.js  # Task 3: Server prediction
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Ingredient.js
│   ├── controllers/
│   │   ├── analyzeController.js
│   │   └── productController.js
│   ├── routes/
│   │   ├── analyze.js            # Task 1 route
│   │   ├── products.js           # Sample products route
│   │   ├── skinAnalyze.js        # Task 2 route
│   │   └── acneRisk.js           # Task 3 route
│   ├── server.js                 # Express server
│   ├── package.json
│   └── .env.example
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🧪 Test Scenarios

### Task 1: Conflict Detection
1. Add "Retinol Night Cream" + "Vitamin C Serum" → Should detect Retinol ❌ Vitamin C conflict
2. Set skin type to "Sensitive" + add product with "Fragrance" → Should flag skin mismatch
3. Add 3+ products with strong actives → Should trigger overuse warning

### Task 2: Skin Type Detection
1. Quiz: Tight skin + No shine + No acne → Should detect **Dry**
2. Quiz: Oily + Acne + Visible pores → Should detect **Oily**
3. Quiz: Mixed answers → Should detect **Combination**
4. Quiz: Reacts easily → Should override to **Sensitive**

### Task 3: Acne Risk Prediction
1. **Low Risk:** Good sleep (8h), 8+ water, healthy diet, low stress, good hygiene → Score < 30
2. **Moderate Risk:** 6h sleep, 5 water, balanced diet, moderate stress → Score 30-49
3. **High Risk:** 5h sleep, 3 water, high sugar, high stress, rarely wash face → Score 50-69
4. **Severe Risk:** 4h sleep, 2 water, junk food, extreme stress, never remove makeup + coconut oil products → Score 70+

---

## 🎨 UI Design System

| Element | Color | Usage |
|---------|-------|-------|
| Primary | Emerald/Teal | Task 1, main brand |
| Secondary | Violet/Purple | Task 2, skin detection |
| Accent | Rose/Pink | Task 3, acne risk |
| Danger | Red | Conflicts, severe risk |
| Warning | Amber | Cautions, moderate risk |
| Success | Green | Safe products, low risk |

---

## 📦 Dependencies

### Frontend
- React 18 + TypeScript
- React Router DOM
- Tailwind CSS
- Lucide React (icons)
- Axios

### Backend
- Express.js
- MongoDB + Mongoose
- CORS
- dotenv
- Nodemon (dev)

---

## 🔧 Troubleshooting

### Frontend builds but backend fails
- The app works fully client-side. Backend is optional.

### MongoDB connection fails
- Server runs with in-memory sample data. No data loss.

### Port 5000 already in use
- Change `PORT` in `backend/.env` and update `VITE_API_URL` in frontend.

### Quiz doesn't detect skin type correctly
- Ensure you answer all 8 questions. The scoring system needs complete data.

### Acne risk seems too high/low
- The scoring is weighted: habits (35%), products (30%), routine (25%), skin type (10%).
- Check each breakdown section in the results for specific factors.

---

## 📝 License

Built for educational purposes — AI Personalized Skincare Advisor (MERN Stack)
