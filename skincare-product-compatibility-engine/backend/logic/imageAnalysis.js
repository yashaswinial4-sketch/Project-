// ============================================================
// 🧠 IMAGE-BASED SKIN ANALYSIS (SIMPLIFIED)
// ============================================================
// This module simulates skin type detection from uploaded images.
// It analyzes basic image properties (brightness, color distribution)
// to infer skin characteristics.
// NOTE: This is a SIMPLIFIED heuristic — NOT a real ML model.
// ============================================================

/**
 * Analyze a skin image using canvas-based heuristics.
 * @param {string} base64Image - Base64 encoded image data
 * @returns {Promise<{skinType: string, confidence: number, indicators: object}>}
 */
export async function analyzeSkinImage(base64Image) {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 100;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);
        const imageData = ctx.getImageData(0, 0, size, size);
        const pixels = imageData.data;

        let totalBrightness = 0;
        let totalRedness = 0;
        let totalGreen = 0;
        let totalBlue = 0;
        let totalSaturation = 0;
        let pixelCount = pixels.length / 4;

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];

          // Brightness (perceived)
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          totalBrightness += brightness;

          // Redness indicator (r - g difference)
          totalRedness += Math.max(0, r - g);

          // Saturation approximation
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          totalSaturation += max > 0 ? ((max - min) / max) * 100 : 0;

          totalRed += r;
          totalGreen += g;
          totalBlue += b;
        }

        const avgBrightness = totalBrightness / pixelCount;
        const avgRedness = totalRedness / pixelCount;
        const avgSaturation = totalSaturation / pixelCount;
        const avgRed = totalRed / pixelCount;
        const avgGreen = totalGreen / pixelCount;
        const avgBlue = totalBlue / pixelCount;

        // ── Heuristic Scoring ──
        let scores = { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 0 };

        // Brightness analysis
        // High brightness + low saturation → oily (shiny reflection)
        if (avgBrightness > 180) {
          scores.oily += 3;
          scores.combination += 1;
        } else if (avgBrightness > 140) {
          scores.normal += 2;
          scores.combination += 1;
        } else if (avgBrightness > 100) {
          scores.dry += 2;
          scores.sensitive += 1;
        } else {
          scores.dry += 3;
        }

        // Redness analysis
        // High redness → sensitive or irritated skin
        if (avgRedness > 30) {
          scores.sensitive += 4;
          scores.dry += 1;
        } else if (avgRedness > 15) {
          scores.sensitive += 2;
          scores.combination += 1;
        } else {
          scores.normal += 1;
          scores.oily += 1;
        }

        // Saturation analysis
        // Low saturation → oily (washed out by shine)
        if (avgSaturation < 20) {
          scores.oily += 2;
        } else if (avgSaturation < 40) {
          scores.combination += 2;
          scores.normal += 1;
        } else {
          scores.dry += 2;
          scores.sensitive += 1;
        }

        // Color balance
        // Warm tone (more red) → sensitive/dry
        if (avgRed > avgGreen + 10 && avgRed > avgBlue + 10) {
          scores.sensitive += 2;
          scores.dry += 1;
        }
        // Cool tone → normal/combination
        if (avgBlue > avgRed - 5 && avgGreen > avgRed - 5) {
          scores.normal += 1;
          scores.combination += 1;
        }

        // Determine result
        let maxScore = 0;
        let detectedType = 'normal';
        for (const [type, score] of Object.entries(scores)) {
          if (score > maxScore) {
            maxScore = score;
            detectedType = type;
          }
        }

        // Map to standard skin types
        const typeMap = {
          dry: 'dry',
          oily: 'oily',
          combination: 'combination',
          sensitive: 'sensitive',
          normal: 'combination'
        };

        const finalType = typeMap[detectedType] || 'combination';
        const confidence = Math.min(0.92, 0.55 + (maxScore / 20));

        resolve({
          skinType: finalType,
          confidence: Math.round(confidence * 100) / 100,
          method: 'image',
          indicators: {
            brightness: Math.round(avgBrightness),
            redness: Math.round(avgRedness),
            saturation: Math.round(avgSaturation),
            scores
          }
        });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image for analysis'));
      };
      img.src = base64Image;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Server-side fallback: returns mock analysis based on image metadata.
 * Used when running in Node.js without canvas.
 * @param {object} imageInfo - Basic image info (size, format, etc.)
 * @returns {object} Mock analysis result
 */
export function mockImageAnalysis(imageInfo) {
  // Generate a deterministic result based on image properties
  const hash = (imageInfo?.size || 0) % 4;
  const types = ['oily', 'dry', 'combination', 'sensitive'];
  const skinType = types[hash];
  const confidence = 0.65 + ((imageInfo?.size || 0) % 30) / 100;

  return {
    skinType,
    confidence: Math.round(confidence * 100) / 100,
    method: 'image',
    note: 'Image analysis is simulated. For accurate results, take the skin type quiz.',
    indicators: {
      brightness: 120 + (hash * 20),
      redness: 10 + (hash * 8),
      saturation: 25 + (hash * 10)
    }
  };
}
