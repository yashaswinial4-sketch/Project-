// ─────────────────────────────────────────────────────────────
// TASK 4: IMAGE PREPROCESSING ENGINE
// Handles real-world conditions: lighting, angles, skin tones
// ─────────────────────────────────────────────────────────────

import type { ImagePreprocessingResult, ImageMetrics } from '../types';

export interface PreprocessingOptions {
  targetWidth?: number;
  targetHeight?: number;
  normalizeBrightness?: boolean;
  adjustContrast?: boolean;
  reduceNoise?: boolean;
  detectSkinRegion?: boolean;
}

const defaultOptions: PreprocessingOptions = {
  targetWidth: 300,
  targetHeight: 300,
  normalizeBrightness: true,
  adjustContrast: true,
  reduceNoise: true,
  detectSkinRegion: true,
};

/**
 * Preprocess an uploaded image for skin analysis.
 * Resizes, normalizes brightness/contrast, reduces noise,
 * and extracts skin quality metrics.
 */
export function preprocessImage(
  imageFile: File | HTMLImageElement,
  options: PreprocessingOptions = {}
): Promise<ImagePreprocessingResult> {
  return new Promise((resolve, reject) => {
    const opts = { ...defaultOptions, ...options };
    const img = new Image();
    const qualityIssues: string[] = [];
    const preprocessingSteps: string[] = [];

    const handleImage = (source: HTMLImageElement) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }

      // Step 1: Resize to target dimensions
      canvas.width = opts.targetWidth || 300;
      canvas.height = opts.targetHeight || 300;
      ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
      preprocessingSteps.push(`Resized to ${canvas.width}x${canvas.height}`);

      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Step 2: Normalize brightness
      if (opts.normalizeBrightness) {
        const brightnessStats = analyzeBrightness(imageData);
        if (brightnessStats.avg < 80) {
          imageData = adjustBrightness(imageData, 1.3);
          preprocessingSteps.push('Brightness normalized (was too dark)');
          qualityIssues.push('Original image was underexposed');
        } else if (brightnessStats.avg > 220) {
          imageData = adjustBrightness(imageData, 0.7);
          preprocessingSteps.push('Brightness normalized (was overexposed)');
          qualityIssues.push('Original image was overexposed');
        } else {
          preprocessingSteps.push('Brightness within acceptable range');
        }
      }

      // Step 3: Adjust contrast
      if (opts.adjustContrast) {
        const contrastFactor = calculateContrastFactor(imageData);
        if (contrastFactor < 0.3) {
          imageData = adjustContrast(imageData, 1.4);
          preprocessingSteps.push('Contrast enhanced (was too flat)');
          qualityIssues.push('Original image had low contrast');
        } else {
          preprocessingSteps.push('Contrast within acceptable range');
        }
      }

      // Step 4: Reduce noise (simple box blur for skin smoothing)
      if (opts.reduceNoise) {
        imageData = reduceNoise(imageData, canvas.width, canvas.height);
        preprocessingSteps.push('Noise reduced (skin smoothing applied)');
      }

      // Step 5: Put processed data back
      ctx.putImageData(imageData, 0, 0);

      // Step 6: Extract metrics
      const metrics = extractMetrics(imageData);

      // Step 7: Detect skin region (center-weighted sampling)
      if (opts.detectSkinRegion) {
        const skinMetrics = extractSkinRegionMetrics(imageData, canvas.width, canvas.height);
        // Blend center metrics with overall metrics
        metrics.brightness = Math.round(metrics.brightness * 0.4 + skinMetrics.brightness * 0.6);
        metrics.redness = Math.round(metrics.redness * 0.3 + skinMetrics.redness * 0.7);
        metrics.oiliness = Math.round(metrics.oiliness * 0.3 + skinMetrics.oiliness * 0.7);
        metrics.dryness = Math.round(metrics.dryness * 0.3 + skinMetrics.dryness * 0.7);
        preprocessingSteps.push('Skin region detected (center-weighted analysis)');
      }

      // Step 8: Calculate overall quality
      const quality = calculateQuality(metrics, qualityIssues);

      // Step 9: Generate output
      const processedUrl = canvas.toDataURL('image/jpeg', 0.9);
      const originalUrl = imageFile instanceof File ? URL.createObjectURL(imageFile) : source.src;

      resolve({
        originalUrl,
        processedUrl,
        metrics,
        quality,
        qualityIssues,
        preprocessingSteps,
      });
    };

    if (imageFile instanceof File) {
      img.onload = () => handleImage(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageFile);
    } else {
      handleImage(imageFile);
    }
  });
}

// ── Brightness Analysis ──
function analyzeBrightness(imageData: ImageData): { avg: number; min: number; max: number } {
  const pixels = imageData.data;
  let sum = 0, min = 255, max = 0, count = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    sum += brightness;
    if (brightness < min) min = brightness;
    if (brightness > max) max = brightness;
    count++;
  }
  return { avg: sum / count, min, max };
}

// ── Brightness Adjustment ──
function adjustBrightness(imageData: ImageData, factor: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.round(data[i] * factor));
    data[i + 1] = Math.min(255, Math.round(data[i + 1] * factor));
    data[i + 2] = Math.min(255, Math.round(data[i + 2] * factor));
  }
  return new ImageData(data, imageData.width, imageData.height);
}

// ── Contrast Factor Calculation ──
function calculateContrastFactor(imageData: ImageData): number {
  const pixels = imageData.data;
  let sum = 0, count = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    sum += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    count++;
  }
  const mean = sum / count;
  let variance = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    variance += Math.pow(brightness - mean, 2);
  }
  const stdDev = Math.sqrt(variance / count);
  return stdDev / 128; // Normalized contrast factor
}

// ── Contrast Adjustment ──
function adjustContrast(imageData: ImageData, factor: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const intercept = 128 * (1 - factor);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, Math.round(data[i] * factor + intercept)));
    data[i + 1] = Math.min(255, Math.max(0, Math.round(data[i + 1] * factor + intercept)));
    data[i + 2] = Math.min(255, Math.max(0, Math.round(data[i + 2] * factor + intercept)));
  }
  return new ImageData(data, imageData.width, imageData.height);
}

// ── Noise Reduction (Simple 3x3 Box Blur) ──
function reduceNoise(imageData: ImageData, width: number, height: number): ImageData {
  const src = imageData.data;
  const dst = new Uint8ClampedArray(src.length);
  const radius = 1; // 3x3 kernel

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ny = Math.min(height - 1, Math.max(0, y + dy));
          const nx = Math.min(width - 1, Math.max(0, x + dx));
          const idx = (ny * width + nx) * 4;
          r += src[idx];
          g += src[idx + 1];
          b += src[idx + 2];
          count++;
        }
      }
      const idx = (y * width + x) * 4;
      dst[idx] = Math.round(r / count);
      dst[idx + 1] = Math.round(g / count);
      dst[idx + 2] = Math.round(b / count);
      dst[idx + 3] = src[idx + 3];
    }
  }
  return new ImageData(dst, width, height);
}

// ── Extract Overall Metrics ──
function extractMetrics(imageData: ImageData): ImageMetrics {
  const pixels = imageData.data;
  let totalBrightness = 0, totalRedness = 0, totalSaturation = 0;
  let totalGreen = 0, totalBlue = 0;
  let count = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
    totalBrightness += (r + g + b) / 3;
    totalRedness += Math.max(0, r - g);
    totalGreen += g;
    totalBlue += b;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    totalSaturation += max === 0 ? 0 : (max - min) / max;
    count++;
  }

  const avgBrightness = totalBrightness / count;
  const avgRedness = totalRedness / count;
  const avgSaturation = totalSaturation / count;

  // Calculate uniformity (lower variance = more uniform)
  let brightnessVariance = 0;
  for (let i = 0; i < pixels.length; i += 16) {
    const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    brightnessVariance += Math.pow(brightness - avgBrightness, 2);
  }
  const uniformity = Math.max(0, Math.min(100, 100 - (brightnessVariance / (pixels.length / 16) / 100)));

  // Oiliness: higher brightness + higher saturation = more oily
  const oiliness = Math.min(100, Math.round((avgBrightness / 255) * 50 + avgSaturation * 50));

  // Dryness: lower brightness + lower saturation = more dry
  const dryness = Math.min(100, Math.round((1 - avgBrightness / 255) * 50 + (1 - avgSaturation) * 50));

  return {
    brightness: Math.round(avgBrightness),
    redness: Math.round(avgRedness),
    saturation: Math.round(avgSaturation * 100),
    uniformity: Math.round(uniformity),
    oiliness,
    dryness,
  };
}

// ── Extract Skin Region Metrics (Center-Weighted) ──
function extractSkinRegionMetrics(imageData: ImageData, width: number, height: number): ImageMetrics {
  const pixels = imageData.data;
  // Focus on center 60% of image (where face typically is)
  const marginX = Math.round(width * 0.2);
  const marginY = Math.round(height * 0.2);
  const centerX = Math.round(width / 2);
  const centerY = Math.round(height / 2);

  let totalBrightness = 0, totalRedness = 0, totalSaturation = 0;
  let count = 0;

  for (let y = marginY; y < height - marginY; y++) {
    for (let x = marginX; x < width - marginX; x++) {
      // Weight pixels closer to center more heavily
      const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const maxDist = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
      const weight = 1 - (distFromCenter / maxDist) * 0.5; // Center gets 1.0, edges get 0.5

      const idx = (y * width + x) * 4;
      const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2];
      totalBrightness += ((r + g + b) / 3) * weight;
      totalRedness += Math.max(0, r - g) * weight;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      totalSaturation += (max === 0 ? 0 : (max - min) / max) * weight;
      count += weight;
    }
  }

  const avgBrightness = totalBrightness / count;
  const avgRedness = totalRedness / count;
  const avgSaturation = totalSaturation / count;

  return {
    brightness: Math.round(avgBrightness),
    redness: Math.round(avgRedness),
    saturation: Math.round(avgSaturation * 100),
    uniformity: 50, // Placeholder
    oiliness: Math.min(100, Math.round((avgBrightness / 255) * 50 + avgSaturation * 50)),
    dryness: Math.min(100, Math.round((1 - avgBrightness / 255) * 50 + (1 - avgSaturation) * 50)),
  };
}

// ── Quality Assessment ──
function calculateQuality(metrics: ImageMetrics, issues: string[]): 'poor' | 'fair' | 'good' | 'excellent' {
  let qualityScore = 100;

  // Check for extreme values
  if (metrics.brightness < 50 || metrics.brightness > 240) qualityScore -= 30;
  else if (metrics.brightness < 80 || metrics.brightness > 210) qualityScore -= 15;

  if (metrics.uniformity < 30) qualityScore -= 20;
  else if (metrics.uniformity < 50) qualityScore -= 10;

  // Deduct for each quality issue
  qualityScore -= issues.length * 10;

  if (qualityScore >= 80) return 'excellent';
  if (qualityScore >= 60) return 'good';
  if (qualityScore >= 40) return 'fair';
  return 'poor';
}

/**
 * Analyze a preprocessed image and return skin type prediction
 * based on image metrics combined with lighting correction.
 */
export function analyzePreprocessedImage(metrics: ImageMetrics): {
  skinType: string;
  confidence: number;
  indicators: ImageMetrics;
} {
  const scores: Record<string, number> = { dry: 0, oily: 0, combination: 0, sensitive: 0 };

  // Brightness-based analysis (corrected for lighting)
  if (metrics.brightness > 190) {
    scores.oily += 3;
    scores.combination += 1;
  } else if (metrics.brightness > 160) {
    scores.oily += 1;
    scores.combination += 2;
  } else if (metrics.brightness > 130) {
    scores.combination += 2;
    scores.dry += 1;
  } else {
    scores.dry += 3;
  }

  // Redness-based analysis
  if (metrics.redness > 25) {
    scores.sensitive += 4;
    scores.dry += 1;
  } else if (metrics.redness > 12) {
    scores.sensitive += 2;
  } else {
    scores.oily += 1;
  }

  // Saturation-based analysis
  if (metrics.saturation > 40) {
    scores.oily += 2;
  } else if (metrics.saturation > 20) {
    scores.combination += 2;
  } else {
    scores.dry += 2;
  }

  // Uniformity-based analysis
  if (metrics.uniformity < 40) {
    scores.combination += 3; // Different zones = combination
  } else if (metrics.uniformity > 70) {
    scores.oily += 1;
    scores.dry += 1;
  }

  // Oiliness/Dryness direct metrics
  if (metrics.oiliness > 60) scores.oily += 2;
  if (metrics.dryness > 60) scores.dry += 2;

  let maxScore = 0;
  let detectedType = 'combination';
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedType = type;
    }
  }

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? Math.min(0.78, 0.48 + (maxScore / totalScore) * 0.30) : 0.48;

  return { skinType: detectedType, confidence, indicators: metrics };
}
