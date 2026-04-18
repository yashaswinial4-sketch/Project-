import { Router } from 'express';
import { analyzeRoutine } from '../controllers/analyzeController.js';

const router = Router();

// POST /api/analyze — Analyze skincare routine
router.post('/', analyzeRoutine);

export default router;
