# 🧠 AI Personalized Skincare Advisor

> **Task 1**: Prevent harmful skincare product combinations using rule-based ingredient conflict detection.

---

## 📋 Project Overview

A full-stack **MERN** application that analyzes users' skincare routines to detect:

- ❌ **Ingredient conflicts** (e.g., Retinol + Vitamin C)
- ⚠️ **Skin type mismatches** (e.g., Alcohol on sensitive skin)
- 🔥 **Overuse of strong actives** (e.g., 3+ strong ingredients)
- ✅ **Safe product recommendations** and alternatives

### 🚀 Live Demo
The frontend runs standalone with client-side analysis logic. The backend API is included for full MERN deployment.

---

## 🏗️ Folder Structure

```
├── client/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── SkinForm.tsx         # Skin type & concerns form
│   │   │   ├── ProductInputList.tsx # Product entry with ingredient hints
│   │   │   └── ResultDisplay.tsx    # Analysis results visualization
│   │   ├── pages/
│   │   │   ├── HomePage.tsx         # Landing page
│   │   │   ├── AnalysisPage.tsx     # Multi-step analysis form
│   │   │   └── ResultPage.tsx       # Results display
│   │   ├── logic/
│   │   │   └── skincareRules.ts     # Client-side rules engine
│   │   ├── api.ts                   # API layer (with fallback)
│   │   ├── types.ts                 # TypeScript types
│   │   ├── App.tsx                  # Router setup
│   │   └── main.tsx                 # Entry point
│   ├── index.html
│   └── package.json
│
├── server/                          # Express Backend
│   ├── logic/
│   │   └── skincareRules.js         # Core rules engine (14+ conflict rules)
│   ├── models/
│   │   ├── Product.js               # Product schema
│   │   ├── Ingredient.js            # Ingredient schema
│   │   └── User.js                  # User schema
│   ├── controllers/
│   │   ├── analyzeController.js     # Analysis endpoint logic
│   │   └── productController.js     # Products endpoint logic
│   ├── routes/
│   │   ├── analyze.js               # POST /api/analyze
│   │   └── products.js              # GET /api/products
│   ├── server.js                    # Express server entry
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Routing** | React Router DOM v7 |
| **Icons** | Lucide React |
| **HTTP** | Fetch API (with Axios alternative in backend) |

---

## 🚀 How to Run

### Option A: Frontend Only (Quick Start)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The frontend works **standalone** with client-side analysis logic. No backend required for demo.

---

### Option B: Full MERN Stack (Production)

#### 1. Setup MongoDB

```bash
# Install MongoDB locally (Ubuntu)
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb

# OR use MongoDB Atlas (cloud)
# Get connection string from: https://cloud.mongodb.com
```

#### 2. Setup Backend Server

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI
nano .env
```

**`.env` Configuration:**
```env
MONGO_URI=mongodb://localhost:27017/skincare_advisor
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skincare_advisor
PORT=5000
NODE_ENV=development
```

```bash
# Start server
npm run dev
# Server runs on http://localhost:5000
```

#### 3. Setup Frontend

```bash
# In project root
npm install

# Create .env for frontend (optional)
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start frontend
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📡 API Endpoints

### `POST /api/analyze`
Analyzes a skincare routine for conflicts and mismatches.

**Request Body:**
```json
{
  "skinType": "sensitive",
  "concerns": ["acne", "pigmentation"],
  "products": [
    {
      "name": "Retinol Cream",
      "type": "moisturizer",
      "ingredients": "retinol, ceramides, fragrance"
    },
    {
      "name": "Vitamin C Serum",
      "type": "serum",
      "ingredients": "vitamin c, hyaluronic acid"
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
    "overallScore": 45,
    "summary": "❌ Your routine has significant issues..."
  }
}
```

### `GET /api/products`
Returns sample/reference products.

### `GET /api/health`
Health check endpoint.

---

## 🧠 Rules Engine Details

### Ingredient Conflicts (14 Rules)

| Conflict | Severity | Reason |
|----------|----------|--------|
| Retinol ❌ Vitamin C | HIGH | Irritation + reduced effectiveness |
| Retinol ❌ Glycolic Acid | HIGH | Excessive exfoliation |
| Retinol ❌ Salicylic Acid | HIGH | Over-drying |
| Retinol ❌ Benzoyl Peroxide | HIGH | Deactivates retinol |
| Salicylic Acid ❌ Benzoyl Peroxide | MEDIUM | Over-drying |
| Glycolic Acid ❌ Salicylic Acid | MEDIUM | Barrier damage |
| AHA ❌ BHA | MEDIUM | Over-exfoliation |
| Vitamin C ❌ Niacinamide | LOW | Possible flushing |

### Skin Type Rules

| Skin Type | Avoid | Prefer |
|-----------|-------|--------|
| **Dry** | Alcohol, Salicylic Acid, Clay | Hyaluronic Acid, Ceramides, Squalane |
| **Oily** | Mineral Oil, Coconut Oil, Heavy Oils | Salicylic Acid, Niacinamide, Clay |
| **Combination** | Heavy Oils, Alcohol Denat | Niacinamide, Hyaluronic Acid |
| **Sensitive** | Fragrance, Retinol, AHAs, BHAs | Aloe Vera, Centella, Ceramides |

### Overuse Detection
- **3+ strong actives** → HIGH warning
- **2 strong actives** → MEDIUM warning

---

## 🎨 UI Features

- **Multi-step form** with progress bar
- **Ingredient hint system** — click to add common ingredients
- **Color-coded results**:
  - 🔴 Red = Harmful conflicts
  - 🟡 Yellow = Warnings / mismatches
  - 🟢 Green = Safe products
  - 🔵 Blue = Alternatives
  - 🟣 Purple = Recommendations
- **Circular safety score** (0-100)
- **Responsive design** — works on mobile, tablet, desktop

---

## 🔒 Environment Variables

### Backend (`server/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | development/production | No |

### Frontend (`.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | No (falls back to client-side) |

---

## 📦 Sample Products Included

1. Salicylic Acid Cleanser
2. Vitamin C Brightening Serum
3. Retinol Night Cream
4. Hyaluronic Acid Moisturizer
5. Glycolic Acid Toner
6. Benzoyl Peroxide Gel
7. Niacinamide Serum
8. Gentle Foaming Cleanser
9. SPF 50 Sunscreen
10. AHA/BHA Exfoliating Toner
11. Ceramide Repair Cream
12. Clay Purifying Mask

---

## 🧪 Testing Scenarios

### Test Case 1: Sensitive Skin with Conflicts
- **Skin Type**: Sensitive
- **Concerns**: Acne, Pigmentation
- **Products**:
  - Retinol Night Cream (retinol, ceramides)
  - Vitamin C Serum (vitamin c, hyaluronic acid)
  - Glycolic Acid Toner (glycolic acid, aloe vera)
- **Expected**: Multiple HIGH severity conflicts + skin mismatches

### Test Case 2: Oily Skin Safe Routine
- **Skin Type**: Oily
- **Concerns**: Acne
- **Products**:
  - Salicylic Acid Cleanser
  - Niacinamide Serum
  - SPF 50 Sunscreen
- **Expected**: High score, minimal warnings

### Test Case 3: Overuse Detection
- **Skin Type**: Combination
- **Concerns**: Aging, Acne
- **Products**:
  - Retinol Cream (retinol)
  - Glycolic Toner (glycolic acid)
  - Salicylic Cleanser (salicylic acid)
  - Benzoyl Peroxide Gel (benzoyl peroxide)
- **Expected**: Overuse warning + multiple conflicts

---

## ⚠️ Important Notes

1. **No ML/AI**: This is purely rule-based logic. No image analysis or machine learning.
2. **Client-side fallback**: The frontend works without the backend by using the embedded rules engine.
3. **MongoDB optional**: The server gracefully falls back to sample data if MongoDB is unavailable.
4. **Not medical advice**: This tool is for educational purposes only. Consult a dermatologist for medical advice.

---

## 🛠️ Future Enhancements (Tasks 2+)

- [ ] Image-based skin analysis (ML/CV)
- [ ] User accounts & authentication
- [ ] Routine tracking over time
- [ ] Product database with barcode scanning
- [ ] Dermatologist consultation booking
- [ ] Push notifications for routine reminders

---

## 📄 License

MIT License — Built for educational purposes.

---

## 👨‍💻 Developer

Built with ❤️ as a MERN stack project demonstrating:
- Rule-based decision engines
- Full-stack API design
- React component architecture
- MongoDB schema design
- Responsive UI with Tailwind CSS
