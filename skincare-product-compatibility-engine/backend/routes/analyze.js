import { Router } from 'express';
import { analyzeRoutine } from '../controllers/analyzeController.js';

const router = Router();
router.post('/', analyzeRoutine);
export default router;
