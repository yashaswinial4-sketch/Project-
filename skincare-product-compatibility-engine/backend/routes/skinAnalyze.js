import { Router } from 'express';
import { analyzeSkin } from '../controllers/skinAnalyzeController.js';

const router = Router();

// POST /api/analyze-skin — Detect skin type via questionnaire or image
router.post('/', analyzeSkin);

export default router;
