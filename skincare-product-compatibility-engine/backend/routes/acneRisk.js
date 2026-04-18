import express from 'express';
import { predictAcneRisk } from '../logic/acneRiskPredictor.js';

const router = express.Router();

// POST /api/acne-risk
router.post('/', (req, res) => {
  try {
    const { habits, products, skinType } = req.body;

    if (!habits) {
      return res.status(400).json({
        success: false,
        error: 'Habits data is required.'
      });
    }

    const result = predictAcneRisk(habits, products || [], skinType || '');

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to predict acne risk.',
      details: error.message
    });
  }
});

export default router;
