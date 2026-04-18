import {
  analyzeSkincareRoutine,
  validateInput,
  sampleProducts
} from '../logic/skincareRules.js';

// POST /api/analyze
export const analyzeRoutine = (req, res) => {
  try {
    const { skinType, concerns, products } = req.body;

    // Validate input
    const validation = validateInput({ skinType, concerns, products });
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }

    // Run the analysis engine
    const result = analyzeSkincareRoutine({ skinType, concerns, products });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during analysis',
      error: error.message
    });
  }
};
