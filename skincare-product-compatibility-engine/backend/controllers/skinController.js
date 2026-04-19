import SkinRecord from '../models/SkinRecord.js';
import { preprocessImage, analyzeSkinFromMetrics } from '../utils/imageProcessing.js';
import { calculateLifestyleImpact, mergeLifestyleWithImage } from '../utils/lifestyleImpact.js';

// POST /api/skin/save-record — Save a skin analysis record
export const saveSkinRecord = async (req, res) => {
  try {
    const { skinType, imageUrl, imageMetrics, lifestyleData, analysisResult, acneRisk, notes, userId } = req.body;

    if (!skinType) {
      return res.status(400).json({ success: false, error: 'Skin type is required.' });
    }

    const record = new SkinRecord({
      userId: userId || null,
      skinType,
      imageUrl: imageUrl || '',
      imageMetrics: imageMetrics || {},
      lifestyleData: lifestyleData || {},
      analysisResult: analysisResult || null,
      acneRisk: acneRisk || null,
      notes: notes || '',
    });

    await record.save();

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save skin record.', details: error.message });
  }
};

// GET /api/skin/history — Get all skin records
export const getSkinHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const records = await SkinRecord.find(query).sort({ date: -1 }).limit(50);
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch skin history.', details: error.message });
  }
};

// GET /api/skin/compare — Compare two skin records
export const compareRecords = async (req, res) => {
  try {
    const { before, after } = req.query;
    if (!before || !after) {
      return res.status(400).json({ success: false, error: 'Both before and after record IDs are required.' });
    }

    const beforeRecord = await SkinRecord.findById(before);
    const afterRecord = await SkinRecord.findById(after);

    if (!beforeRecord || !afterRecord) {
      return res.status(404).json({ success: false, error: 'One or both records not found.' });
    }

    const bm = beforeRecord.imageMetrics || { brightness: 150, redness: 10, saturation: 20, uniformity: 50, oiliness: 40, dryness: 40 };
    const am = afterRecord.imageMetrics || { brightness: 150, redness: 10, saturation: 20, uniformity: 50, oiliness: 40, dryness: 40 };

    const rednessChange = bm.redness - am.redness;
    const oilChange = bm.oiliness - am.oiliness;
    const drynessChange = bm.dryness - am.dryness;
    const uniformityChange = am.uniformity - bm.uniformity;
    const brightnessChange = am.brightness - bm.brightness;

    let improvementScore = 0;
    if (rednessChange > 0) improvementScore += 25;
    if (uniformityChange > 0) improvementScore += 20;
    if (Math.abs(oilChange) < 10) improvementScore += 15;
    if (Math.abs(drynessChange) < 10) improvementScore += 15;
    if (Math.abs(brightnessChange) < 20) improvementScore += 10;
    if (beforeRecord.skinType !== afterRecord.skinType) improvementScore += 15;

    const insights = [];
    if (rednessChange > 5) insights.push('Reduced redness — less inflammation and irritation');
    if (rednessChange < -5) insights.push('Increased redness — may indicate new sensitivity');
    if (uniformityChange > 10) insights.push('More even skin tone — better overall skin health');
    if (oilChange > 10) insights.push('Reduced oiliness — better oil control');
    if (oilChange < -10) insights.push('Increased oiliness — may need lighter products');
    if (drynessChange > 10) insights.push('Reduced dryness — better hydration');
    if (drynessChange < -10) insights.push('Increased dryness — may need more moisturizing');
    if (beforeRecord.skinType !== afterRecord.skinType) insights.push(`Skin type changed from ${beforeRecord.skinType} to ${afterRecord.skinType}`);
    if (insights.length === 0) insights.push('Minor changes detected — continue your current routine');

    res.json({
      success: true,
      data: {
        before: beforeRecord,
        after: afterRecord,
        improvementScore: Math.min(100, Math.max(-50, improvementScore)),
        acneReduction: rednessChange > 0 ? `${Math.round(rednessChange)}%` : '0%',
        oilChange: oilChange > 0 ? `-${oilChange}%` : `+${Math.abs(oilChange)}%`,
        drynessChange: drynessChange > 0 ? `-${drynessChange}%` : `+${Math.abs(drynessChange)}%`,
        overallChange: improvementScore > 0 ? 'Improving' : improvementScore < 0 ? 'Declining' : 'Stable',
        insights,
        metricsComparison: {
          brightness: { before: bm.brightness, after: am.brightness, change: brightnessChange },
          redness: { before: bm.redness, after: am.redness, change: -rednessChange },
          oiliness: { before: bm.oiliness, after: am.oiliness, change: -oilChange },
          uniformity: { before: bm.uniformity, after: am.uniformity, change: uniformityChange },
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to compare records.', details: error.message });
  }
};

// POST /api/skin/analyze-image — Analyze uploaded image
export const analyzeImage = async (req, res) => {
  try {
    const { imageData, lifestyleData } = req.body;

    if (!imageData) {
      return res.status(400).json({ success: false, error: 'Image data is required.' });
    }

    // Preprocess image
    const preprocessing = preprocessImage(imageData);
    const analysis = analyzeSkinFromMetrics(preprocessing.metrics);

    let result = {
      skinType: analysis.skinType,
      confidence: analysis.confidence,
      method: 'image',
      indicators: preprocessing.metrics,
      quality: preprocessing.quality,
      qualityIssues: preprocessing.qualityIssues,
      preprocessingSteps: preprocessing.preprocessingSteps,
    };

    // Merge with lifestyle if provided
    if (lifestyleData) {
      const lifestyleImpact = calculateLifestyleImpact(lifestyleData);
      const merged = mergeLifestyleWithImage(analysis.skinType, analysis.confidence, lifestyleImpact);
      result = { ...result, ...merged, lifestyleImpact };
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to analyze image.', details: error.message });
  }
};

// POST /api/lifestyle-impact — Calculate lifestyle impact
export const getLifestyleImpact = async (req, res) => {
  try {
    const lifestyleData = req.body;
    if (!lifestyleData) {
      return res.status(400).json({ success: false, error: 'Lifestyle data is required.' });
    }
    const impact = calculateLifestyleImpact(lifestyleData);
    res.json({ success: true, data: impact });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to calculate lifestyle impact.', details: error.message });
  }
};
