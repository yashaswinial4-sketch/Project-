// ============================================================
// SKIN ANALYZE CONTROLLER
// ============================================================
// Handles POST /api/analyze-skin
// Supports two methods:
//   1. Questionnaire-based detection (answers array)
//   2. Image-based detection (base64 image)
// ============================================================

import { detectSkinTypeFromAnswers } from '../logic/skincareRules.js';
import { mockImageAnalysis } from '../logic/imageAnalysis.js';

// POST /api/analyze-skin
export const analyzeSkin = (req, res) => {
  try {
    const { method, answers, image } = req.body;

    // ── Questionnaire Method ──
    if (method === 'questionnaire' && answers) {
      const result = detectSkinTypeFromAnswers(answers);
      return res.status(200).json({
        success: true,
        data: {
          skinType: result.skinType,
          confidence: result.confidence,
          method: 'questionnaire',
          breakdown: result.breakdown,
          explanation: result.explanation
        }
      });
    }

    // ── Image Method ──
    if (method === 'image' && image) {
      // In production, you'd use a real ML model or cloud API.
      // Here we use mock analysis since Node.js doesn't have canvas.
      const result = mockImageAnalysis({ size: image.length });
      return res.status(200).json({
        success: true,
        data: {
          skinType: result.skinType,
          confidence: result.confidence,
          method: 'image',
          note: result.note,
          indicators: result.indicators
        }
      });
    }

    // ── Invalid Request ──
    return res.status(400).json({
      success: false,
      message: 'Invalid request. Provide either "method: questionnaire" with "answers" or "method: image" with "image".'
    });

  } catch (error) {
    console.error('Skin analysis error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during skin analysis',
      error: error.message
    });
  }
};
