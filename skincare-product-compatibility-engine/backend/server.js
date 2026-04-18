import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import analyzeRoutes from './routes/analyze.js';
import productRoutes from './routes/products.js';
import skinAnalyzeRoutes from './routes/skinAnalyze.js';
import acneRiskRoutes from './routes/acneRisk.js';
import skinRoutes from './routes/skin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ──
app.use('/api/analyze', analyzeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analyze-skin', skinAnalyzeRoutes);
app.use('/api/acne-risk', acneRiskRoutes);
app.use('/api/skin', skinRoutes);

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AI Personalized Skincare Advisor API is running',
    features: [
      'Task 1: Ingredient Conflict Detection',
      'Task 2: Skin Type Detection',
      'Task 3: Acne Risk Prediction',
      'Task 4: Progress Tracking & Lifestyle Integration'
    ],
    timestamp: new Date().toISOString()
  });
});

// ── MongoDB Connection ──
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skincare_advisor';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection failed. Server will run with sample data only.');
    console.warn('Error:', err.message);
  });

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`🚀 Skincare Advisor API running on http://localhost:${PORT}`);
  console.log(`📋 API Endpoints:`);
  console.log(`   POST /api/analyze        — Analyze skincare routine (Task 1)`);
  console.log(`   POST /api/analyze-skin   — Detect skin type (Task 2)`);
  console.log(`   GET  /api/products       — Get sample products`);
  console.log(`   POST /api/acne-risk      — Predict acne risk (Task 3)`);
  console.log(`   POST /api/skin/save-record — Save skin record (Task 4)`);
  console.log(`   GET  /api/skin/history   — Get skin history (Task 4)`);
  console.log(`   GET  /api/skin/compare   — Compare records (Task 4)`);
  console.log(`   POST /api/skin/analyze-image — Analyze image (Task 4)`);
  console.log(`   POST /api/lifestyle-impact — Lifestyle impact (Task 4)`);
  console.log(`   GET  /api/health         — Health check`);
});
