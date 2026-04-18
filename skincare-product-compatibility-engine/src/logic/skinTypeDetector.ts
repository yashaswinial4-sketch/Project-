// ─────────────────────────────────────────────────────────────
// SKIN TYPE DETECTION ENGINE (IMPROVED v2)
// Multi-factor scoring with weighted questions and cross-validation
// ─────────────────────────────────────────────────────────────

import type { QuizAnswer, SkinDetectionResult, SkinType } from '../types';

// Question weights — some questions are more diagnostic than others
const questionWeights: Record<number, number> = {
  1: 1.5, // How skin feels after washing — HIGH diagnostic value
  2: 1.3, // Shine frequency — HIGH diagnostic value
  3: 1.0, // Acne frequency — MEDIUM diagnostic value
  4: 1.2, // Pore visibility — HIGH diagnostic value
  5: 1.5, // Skin reactivity — CRITICAL for sensitive detection
  6: 1.4, // Midday oil pattern — HIGH diagnostic value
  7: 1.1, // Overall appearance — MEDIUM diagnostic value
  8: 1.2, // Flaking frequency — HIGH diagnostic value
};

// Answer scoring matrix: questionId -> answer -> {dry, oily, combination, normal, sensitive}
const scoringMatrix: Record<number, Record<string, Record<string, number>>> = {
  1: { // How does your skin feel after washing?
    'tight':     { dry: 4, oily: 0, combination: 1, normal: 0, sensitive: 1 },
    'normal':    { dry: 0, oily: 0, combination: 2, normal: 4, sensitive: 0 },
    'oily':      { dry: 0, oily: 4, combination: 1, normal: 0, sensitive: 0 },
    'comfortable': { dry: 0, oily: 0, combination: 1, normal: 4, sensitive: 0 },
    'tight-flaky': { dry: 5, oily: 0, combination: 0, normal: 0, sensitive: 2 },
  },
  2: { // How often does your face get shiny?
    'rarely':  { dry: 4, oily: 0, combination: 1, normal: 1, sensitive: 0 },
    'sometimes': { dry: 0, oily: 0, combination: 4, normal: 1, sensitive: 0 },
    'often':   { dry: 0, oily: 4, combination: 1, normal: 0, sensitive: 0 },
    'never':   { dry: 3, oily: 0, combination: 0, normal: 2, sensitive: 1 },
  },
  3: { // Do you experience acne?
    'never':     { dry: 2, oily: 0, combination: 0, normal: 3, sensitive: 1 },
    'sometimes': { dry: 0, oily: 1, combination: 3, normal: 0, sensitive: 0 },
    'frequently':{ dry: 0, oily: 4, combination: 1, normal: 0, sensitive: 0 },
    'rarely':    { dry: 1, oily: 1, combination: 2, normal: 2, sensitive: 0 },
  },
  4: { // Are your pores visible?
    'no':        { dry: 4, oily: 0, combination: 0, normal: 1, sensitive: 0 },
    't-zone':    { dry: 0, oily: 0, combination: 4, normal: 0, sensitive: 0 },
    'yes':       { dry: 0, oily: 4, combination: 0, normal: 0, sensitive: 0 },
    'slightly':  { dry: 1, oily: 0, combination: 2, normal: 2, sensitive: 0 },
  },
  5: { // Does your skin react easily? (Sensitive override question)
    'yes':       { dry: 0, oily: 0, combination: 0, normal: 0, sensitive: 5 },
    'sometimes': { dry: 0, oily: 0, combination: 1, normal: 0, sensitive: 3 },
    'rarely':    { dry: 0, oily: 0, combination: 0, normal: 2, sensitive: 0 },
    'no':        { dry: 0, oily: 1, combination: 0, normal: 2, sensitive: 0 },
  },
  6: { // By midday, how does your skin look?
    'tight-dry':   { dry: 4, oily: 0, combination: 1, normal: 0, sensitive: 1 },
    'comfortable': { dry: 0, oily: 0, combination: 1, normal: 4, sensitive: 0 },
    'oily-all-over': { dry: 0, oily: 4, combination: 0, normal: 0, sensitive: 0 },
    'oily-tzone':  { dry: 0, oily: 1, combination: 4, normal: 0, sensitive: 0 },
  },
  7: { // How would you describe your skin texture?
    'dull-flat':   { dry: 3, oily: 0, combination: 1, normal: 0, sensitive: 1 },
    'glowy':       { dry: 0, oily: 0, combination: 0, normal: 4, sensitive: 0 },
    'very-shiny':  { dry: 0, oily: 4, combination: 0, normal: 0, sensitive: 0 },
    'mixed':       { dry: 0, oily: 0, combination: 4, normal: 0, sensitive: 0 },
    'rough':       { dry: 3, oily: 0, combination: 1, normal: 0, sensitive: 1 },
  },
  8: { // Does your skin flake or peel?
    'often':     { dry: 4, oily: 0, combination: 1, normal: 0, sensitive: 2 },
    'sometimes': { dry: 2, oily: 0, combination: 1, normal: 1, sensitive: 1 },
    'rarely':    { dry: 0, oily: 1, combination: 1, normal: 2, sensitive: 0 },
    'never':     { dry: 0, oily: 2, combination: 0, normal: 2, sensitive: 0 },
  },
};

export function detectSkinType(answers: QuizAnswer[]): SkinDetectionResult {
  const scores: Record<string, number> = { dry: 0, oily: 0, combination: 0, normal: 0, sensitive: 0 };
  let sensitiveFlag = false;
  let sensitiveScore = 0;
  const answeredQuestions = new Set<number>();

  for (const qa of answers) {
    const { questionId, answer } = qa;
    answeredQuestions.add(questionId);
    const weight = questionWeights[questionId] || 1.0;
    const matrix = scoringMatrix[questionId];

    if (matrix && matrix[answer]) {
      const answerScores = matrix[answer];
      for (const [type, score] of Object.entries(answerScores)) {
        scores[type] += score * weight;
      }
    }

    // Track sensitive flag separately for override logic
    if (questionId === 5 && answer === 'yes') {
      sensitiveFlag = true;
      sensitiveScore = 5;
    }
    if (questionId === 5 && answer === 'sometimes') {
      sensitiveScore = Math.max(sensitiveScore, 3);
    }
  }

  // Cross-validation: check for consistency
  const totalQuestions = 8;
  const answeredCount = answeredQuestions.size;
  const completenessFactor = answeredCount / totalQuestions;

  // Sensitive skin override logic — only if strong evidence
  const isStronglySensitive = scores.sensitive >= 5 && sensitiveFlag;
  const isModeratelySensitive = scores.sensitive >= 3 && sensitiveScore >= 3;

  if (isStronglySensitive) {
    return buildResult('sensitive', scores, 'questionnaire', completenessFactor, 0.92);
  }

  // Find the dominant skin type (excluding sensitive from primary competition)
  const primaryTypes = ['dry', 'oily', 'combination', 'normal'] as const;
  let maxScore = 0;
  let detectedType = 'combination';

  for (const type of primaryTypes) {
    if (scores[type] > maxScore) {
      maxScore = scores[type];
      detectedType = type;
    }
  }

  // Map normal to combination for final output
  const typeMap: Record<string, SkinType> = {
    dry: 'dry',
    oily: 'oily',
    combination: 'combination',
    normal: 'combination',
    sensitive: 'sensitive'
  };

  const finalType = isModeratelySensitive ? 'sensitive' : (typeMap[detectedType] || 'combination');
  const confidence = calculateConfidence(scores, maxScore, completenessFactor, finalType);

  return buildResult(finalType, scores, 'questionnaire', completenessFactor, confidence);
}

function calculateConfidence(
  scores: Record<string, number>,
  maxScore: number,
  completeness: number,
  detectedType: string
): number {
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  if (totalScore === 0) return 0.50;

  // Base confidence from score dominance
  const dominanceRatio = maxScore / totalScore;
  let baseConfidence = 0.55 + dominanceRatio * 0.35;

  // Adjust for completeness
  baseConfidence *= completeness;

  // Adjust for margin between top two scores
  const sortedScores = Object.entries(scores)
    .filter(([type]) => type !== 'sensitive')
    .map(([, score]) => score)
    .sort((a, b) => b - a);

  if (sortedScores.length >= 2) {
    const margin = sortedScores[0] - sortedScores[1];
    if (margin > 5) baseConfidence += 0.08; // Clear winner
    else if (margin > 2) baseConfidence += 0.04; // Moderate margin
    else baseConfidence -= 0.05; // Close call
  }

  // Sensitive skin detection is more confident when flagged
  if (detectedType === 'sensitive') {
    baseConfidence = Math.max(baseConfidence, 0.75);
  }

  return Math.round(Math.min(0.96, Math.max(0.50, baseConfidence)) * 100) / 100;
}

function buildResult(
  skinType: SkinType,
  scores: Record<string, number>,
  method: 'questionnaire' | 'image',
  _completeness: number,
  confidence: number
): SkinDetectionResult {
  const explanations: Record<SkinType, string> = {
    dry: 'Based on your answers, you have DRY skin. Your skin lacks natural oils and moisture, often feeling tight after cleansing. Focus on hydration with hyaluronic acid, ceramides, and gentle cleansing. Avoid alcohol-based products, harsh exfoliants, and foaming cleansers that strip natural oils.',
    oily: 'Based on your answers, you have OILY skin. Your skin produces excess sebum, leading to shine and enlarged pores. Focus on oil control with salicylic acid, niacinamide, and lightweight gel moisturizers. Avoid heavy oils, comedogenic ingredients, and over-washing which triggers more oil production.',
    combination: 'Based on your answers, you have COMBINATION skin. Your T-zone (forehead, nose, chin) is oily while your cheeks are normal to dry. Use balanced products — gentle cleansers, lightweight moisturizers, and targeted treatments for different face zones. Avoid products that are too heavy or too drying.',
    sensitive: 'Based on your answers, you have SENSITIVE skin. Your skin reacts easily to products, environmental factors, and friction. Use gentle, fragrance-free products with soothing ingredients like centella asiatica, ceramides, and panthenol. Avoid retinol, AHAs/BHAs, fragrance, and alcohol. Always patch test new products.'
  };

  return {
    skinType,
    confidence,
    method,
    breakdown: scores,
    explanation: explanations[skinType],
  };
}

// ── Image-based detection (client-side heuristic) ──
export function analyzeImageHeuristics(canvas: HTMLCanvasElement): SkinDetectionResult {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      skinType: 'combination',
      confidence: 0.50,
      method: 'image',
      explanation: 'Could not analyze image. Please try the quiz method for accurate results.',
    };
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  let totalBrightness = 0;
  let totalRedness = 0;
  let totalSaturation = 0;
  let pixelCount = 0;

  const brightnessValues: number[] = [];
  const redValues: number[] = [];

  for (let i = 0; i < pixels.length; i += 16) { // Sample every 4th pixel
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const brightness = (r + g + b) / 3;
    const redness = r - g;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;

    brightnessValues.push(brightness);
    redValues.push(redness);

    totalBrightness += brightness;
    totalRedness += redness;
    totalSaturation += saturation;
    pixelCount++;
  }

  const avgBrightness = totalBrightness / pixelCount;
  const avgRedness = totalRedness / pixelCount;
  const avgSaturation = totalSaturation / pixelCount;

  // Calculate brightness variance (uniformity)
  const brightnessVariance = brightnessValues.reduce((sum, val) => sum + Math.pow(val - avgBrightness, 2), 0) / pixelCount;
  const uniformity = Math.max(0, 1 - (brightnessVariance / 10000));

  // Skin type detection heuristics based on image metrics
  const scores: Record<string, number> = { dry: 0, oily: 0, combination: 0, sensitive: 0 };

  // Brightness analysis
  if (avgBrightness > 200) {
    scores.oily += 3; // Very bright = oily/shiny
    scores.combination += 1;
  } else if (avgBrightness > 170) {
    scores.oily += 2;
    scores.combination += 2;
  } else if (avgBrightness > 140) {
    scores.normal += 2;
    scores.combination += 1;
  } else {
    scores.dry += 3; // Darker = dry/dull
  }

  // Redness analysis
  if (avgRedness > 30) {
    scores.sensitive += 4; // High redness = sensitive/irritated
    scores.dry += 1;
  } else if (avgRedness > 15) {
    scores.sensitive += 2;
    scores.combination += 1;
  } else {
    scores.oily += 1;
    scores.normal += 1;
  }

  // Saturation analysis
  if (avgSaturation > 0.4) {
    scores.oily += 2; // High saturation = oily
  } else if (avgSaturation > 0.2) {
    scores.combination += 2;
  } else {
    scores.dry += 2; // Low saturation = dry/dull
  }

  // Uniformity analysis
  if (uniformity < 0.5) {
    scores.combination += 3; // Low uniformity = combination (different zones)
  } else if (uniformity > 0.8) {
    scores.oily += 1;
    scores.dry += 1;
  }

  // Determine result
  let maxScore = 0;
  let detectedType: SkinType = 'combination';
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedType = type as SkinType;
    }
  }

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? Math.min(0.75, 0.45 + (maxScore / totalScore) * 0.30) : 0.45;

  const explanations: Record<SkinType, string> = {
    dry: 'Image analysis suggests DRY skin. The image shows lower brightness and saturation levels consistent with dry skin. For more accurate results, take our detailed quiz.',
    oily: 'Image analysis suggests OILY skin. Higher brightness and saturation levels indicate excess sebum. For more accurate results, take our detailed quiz.',
    combination: 'Image analysis suggests COMBINATION skin. Mixed brightness patterns indicate different zones on your face. For more accurate results, take our detailed quiz.',
    sensitive: 'Image analysis suggests SENSITIVE skin. Higher redness levels indicate potential sensitivity. For more accurate results, take our detailed quiz.'
  };

  return {
    skinType: detectedType,
    confidence: Math.round(confidence * 100) / 100,
    method: 'image',
    breakdown: scores,
    explanation: explanations[detectedType],
    indicators: {
      brightness: Math.round(avgBrightness),
      redness: Math.round(avgRedness),
      saturation: Math.round(avgSaturation * 100),
      scores,
    }
  };
}
