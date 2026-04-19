// ============================================================
// TASK 4: IMAGE PROCESSING UTILITIES (BACKEND)
// ============================================================
// Simulates image preprocessing for skin analysis.
// In production, you'd use OpenCV.js or a cloud ML API.
// ============================================================

/**
 * Normalize image brightness to a standard range.
 * Simulates histogram equalization.
 */
export function normalizeLighting(imageData) {
  // In production: apply histogram equalization
  // Here: return normalized metrics based on image properties
  const size = imageData?.size || 0;
  const brightness = Math.min(255, Math.max(0, 128 + (size % 100) - 50));
  return { brightness, step: 'Brightness normalized' };
}

/**
 * Adjust image contrast for better skin feature detection.
 */
export function adjustContrast(imageData) {
  const size = imageData?.size || 0;
  const contrast = Math.min(2, Math.max(0.5, 1 + (size % 50) / 100 - 0.25));
  return { contrast, step: 'Contrast adjusted' };
}

/**
 * Reduce image noise for cleaner skin analysis.
 */
export function reduceNoise(imageData) {
  return { step: 'Noise reduced (Gaussian blur applied)' };
}

/**
 * Full preprocessing pipeline.
 */
export function preprocessImage(imageData) {
  const steps = [];
  const lighting = normalizeLighting(imageData);
  steps.push(lighting.step);
  const contrast = adjustContrast(imageData);
  steps.push(contrast.step);
  const noise = reduceNoise(imageData);
  steps.push(noise.step);

  // Simulate skin region detection
  const skinRegion = {
    detected: true,
    coverage: Math.round(40 + Math.random() * 30),
    confidence: Math.round((0.7 + Math.random() * 0.25) * 100) / 100,
  };
  steps.push(`Skin region detected (${skinRegion.coverage}% coverage)`);

  // Generate simulated metrics
  const metrics = {
    brightness: lighting.brightness,
    redness: Math.round(5 + Math.random() * 25),
    saturation: Math.round(15 + Math.random() * 35),
    uniformity: Math.round(40 + Math.random() * 40),
    oiliness: Math.round(20 + Math.random() * 50),
    dryness: Math.round(20 + Math.random() * 50),
  };

  // Quality assessment
  let quality = 'good';
  const qualityIssues = [];
  if (metrics.brightness < 80 || metrics.brightness > 220) {
    quality = 'fair';
    qualityIssues.push('Uneven lighting detected');
  }
  if (metrics.uniformity < 40) {
    quality = 'fair';
    qualityIssues.push('Inconsistent skin tone');
  }
  if (qualityIssues.length === 0) quality = 'excellent';

  return {
    metrics,
    quality,
    qualityIssues,
    preprocessingSteps: steps,
    skinRegion,
  };
}

/**
 * Analyze preprocessed image metrics to predict skin type.
 */
export function analyzeSkinFromMetrics(metrics) {
  const scores = { dry: 0, oily: 0, combination: 0, sensitive: 0 };

  // Brightness analysis
  if (metrics.brightness > 190) { scores.oily += 3; scores.combination += 1; }
  else if (metrics.brightness > 160) { scores.oily += 1; scores.combination += 2; }
  else if (metrics.brightness > 130) { scores.combination += 2; scores.dry += 1; }
  else { scores.dry += 3; }

  // Redness analysis
  if (metrics.redness > 25) { scores.sensitive += 4; scores.dry += 1; }
  else if (metrics.redness > 12) { scores.sensitive += 2; }
  else { scores.oily += 1; }

  // Saturation analysis
  if (metrics.saturation > 40) { scores.oily += 2; }
  else if (metrics.saturation > 20) { scores.combination += 2; }
  else { scores.dry += 2; }

  // Uniformity analysis
  if (metrics.uniformity < 40) { scores.combination += 3; }

  // Oiliness/Dryness
  if (metrics.oiliness > 60) scores.oily += 2;
  if (metrics.dryness > 60) scores.dry += 2;

  let maxScore = 0;
  let detectedType = 'combination';
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) { maxScore = score; detectedType = type; }
  }

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? Math.min(0.80, 0.50 + (maxScore / totalScore) * 0.30) : 0.50;

  return { skinType: detectedType, confidence: Math.round(confidence * 100) / 100, scores };
}
