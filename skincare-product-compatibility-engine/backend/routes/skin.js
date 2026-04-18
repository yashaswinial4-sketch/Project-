import { Router } from 'express';
import { saveSkinRecord, getSkinHistory, compareRecords, analyzeImage, getLifestyleImpact } from '../controllers/skinController.js';

const router = Router();

// Save a skin analysis record
router.post('/save-record', saveSkinRecord);

// Get skin history
router.get('/history', getSkinHistory);

// Compare two skin records
router.get('/compare', compareRecords);

// Analyze uploaded image
router.post('/analyze-image', analyzeImage);

// Calculate lifestyle impact
router.post('/lifestyle-impact', getLifestyleImpact);

export default router;
