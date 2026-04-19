// ─────────────────────────────────────────────────────────────
// UNIFIED ANALYSIS ENGINE (TASK 7)
// Orchestrates all 6 modules into one seamless analysis pipeline
// ─────────────────────────────────────────────────────────────

import type {
  SkinType, SkinConcern, SkinGoal, Product,
  AcneHabits, LifestyleData,
  UnifiedAnalysisInput, UnifiedAnalysisResult,
  SkinTypeSection, AcneRiskSection, IngredientSafetySection,
  LifestyleSection, RoutinePreviewSection, UnifiedExplanation,
} from '../types';

import { predictAcneRisk } from './acneRiskPredictor';
import { analyzeIngredients } from './ingredientAnalyzer';
import { calculateLifestyleImpact } from './lifestyleImpact';
import { generateRoutine } from './routineGenerator';

// ── Image-based skin type detection (client-side pixel analysis) ──
function detectSkinTypeFromImage(imageDataUrl: string): Promise<SkinTypeSection> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 150; // higher resolution for better analysis
        canvas.width = size;
        canvas.height = size;
        ctx!.drawImage(img, 0, 0, size, size);
        const imgData = ctx!.getImageData(0, 0, size, size);
        const pixels = imgData.data;

        let totalBrightness = 0;
        let totalRedness = 0;
        let totalSaturation = 0;
        let totalVariance = 0;
        const pixelCount = pixels.length / 4;

        // Collect brightness values for variance calculation
        const brightnessValues: number[] = [];

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          totalBrightness += brightness;
          totalRedness += Math.max(0, r - g);
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          totalSaturation += max > 0 ? ((max - min) / max) * 100 : 0;
          brightnessValues.push(brightness);
        }

        // Calculate variance (texture uniformity indicator)
        const avgBrightness = totalBrightness / pixelCount;
        for (const bv of brightnessValues) {
          totalVariance += (bv - avgBrightness) ** 2;
        }
        const variance = totalVariance / pixelCount;

        const avgRedness = totalRedness / pixelCount;
        const avgSaturation = totalSaturation / pixelCount;

        // Multi-factor scoring
        const scores: Record<string, number> = { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 0 };

        // Brightness analysis
        if (avgBrightness > 185) { scores.oily += 4; scores.combination += 1; }
        else if (avgBrightness > 150) { scores.normal += 2; scores.combination += 2; }
        else if (avgBrightness > 110) { scores.dry += 2; scores.sensitive += 1; scores.normal += 1; }
        else { scores.dry += 4; scores.sensitive += 1; }

        // Redness analysis
        if (avgRedness > 35) { scores.sensitive += 5; scores.dry += 1; }
        else if (avgRedness > 20) { scores.sensitive += 3; scores.combination += 1; }
        else if (avgRedness > 10) { scores.combination += 2; scores.normal += 1; }
        else { scores.oily += 1; scores.normal += 1; }

        // Saturation analysis
        if (avgSaturation < 15) { scores.oily += 3; }
        else if (avgSaturation < 30) { scores.combination += 2; scores.oily += 1; }
        else if (avgSaturation < 50) { scores.normal += 2; scores.combination += 1; }
        else { scores.dry += 2; scores.sensitive += 1; }

        // Texture variance (high variance = uneven texture = combination)
        if (variance > 2000) { scores.combination += 3; scores.sensitive += 1; }
        else if (variance > 1000) { scores.combination += 1; scores.normal += 1; }
        else { scores.normal += 2; }

        // Find best match
        let maxScore = 0;
        let detectedType = 'combination';
        for (const [type, score] of Object.entries(scores)) {
          if (score > maxScore) { maxScore = score; detectedType = type; }
        }

        const typeMap: Record<string, SkinType> = {
          dry: 'dry', oily: 'oily', combination: 'combination',
          sensitive: 'sensitive', normal: 'combination'
        };
        const finalType = typeMap[detectedType] || 'combination';
        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
        const confidence = totalScore > 0 ? Math.min(0.92, 0.55 + (maxScore / totalScore) * 0.35) : 0.55;

        const explanations: Record<string, string> = {
          dry: 'Image analysis suggests DRY skin. Lower brightness and higher color saturation indicate reduced sebum production. Hydration and barrier repair should be your priority.',
          oily: 'Image analysis suggests OILY skin. Higher brightness with lower saturation indicates excess sebum production. Oil control and non-comedogenic products are recommended.',
          combination: 'Image analysis suggests COMBINATION skin. Mixed characteristics detected — likely oily in the T-zone and dry on cheeks. Use balanced, zone-specific products.',
          sensitive: 'Image analysis suggests SENSITIVE skin. Higher redness indicators detected. Use gentle, fragrance-free products and avoid strong actives.',
        };

        resolve({
          skinType: finalType,
          confidence: Math.round(confidence * 100) / 100,
          method: 'image',
          explanation: explanations[finalType],
          indicators: {
            brightness: Math.round(avgBrightness),
            redness: Math.round(avgRedness),
            saturation: Math.round(avgSaturation),
          },
          breakdown: scores,
        });
      } catch {
        resolve({
          skinType: 'combination',
          confidence: 0.60,
          method: 'image',
          explanation: 'Image analysis completed with basic heuristics. Manual selection recommended for better accuracy.',
          indicators: {},
        });
      }
    };
    img.onerror = () => {
      resolve({
        skinType: 'combination',
        confidence: 0.50,
        method: 'image',
        explanation: 'Could not process image. Please select your skin type manually.',
        indicators: {},
      });
    };
    img.src = imageDataUrl;
  });
}

// ── Map unified input to AcneHabits ──
function mapToAcneHabits(input: UnifiedAnalysisInput): AcneHabits {
  const dietMap: Record<string, AcneHabits['dietType']> = {
    poor: 'junk-food', average: 'high-sugar', good: 'balanced', excellent: 'healthy',
  };
  const exerciseMap: Record<number, AcneHabits['exerciseFrequency']> = {
    0: 'none', 1: '1-2x', 2: '1-2x', 3: '3-4x', 4: '3-4x', 5: 'daily',
    6: 'daily', 7: 'daily',
  };

  return {
    currentAcne: input.concerns.includes('acne') ? 'moderate' : 'mild',
    sleepHours: input.sleepHours,
    waterIntake: input.waterIntake,
    dietType: dietMap[input.dietQuality] || 'balanced',
    stressLevel: input.stressLevel === 'high' ? 'high' : input.stressLevel,
    exerciseFrequency: exerciseMap[input.exerciseDays] || '1-2x',
    faceWashFrequency: 'twice',
    makeupRemoval: 'sometimes',
    pillowcaseChange: 'weekly',
    sunscreenUse: 'sometimes',
    touchingFace: 'sometimes',
    currentBreakouts: input.concerns.includes('acne') ? 'moderate' : 'few',
  };
}

// ── Map unified input to LifestyleData ──
function mapToLifestyleData(input: UnifiedAnalysisInput): LifestyleData {
  return {
    sleepHours: input.sleepHours,
    waterIntake: input.waterIntake,
    dietQuality: input.dietQuality,
    stressLevel: input.stressLevel,
    exerciseDays: input.exerciseDays,
    alcoholConsumption: 'none',
    smokingStatus: 'non-smoker',
    screenTime: 6,
  };
}

// ── Extract ingredients from product strings ──
function extractIngredients(products: { name: string; ingredients: string }[]): string[] {
  const allIngredients: string[] = [];
  for (const product of products) {
    if (product.ingredients) {
      const parts = product.ingredients.split(/[,;|]+/).map(s => s.trim()).filter(s => s.length > 0);
      allIngredients.push(...parts);
    }
  }
  return [...new Set(allIngredients)];
}

// ── Calculate overall grade from score ──
function getOverallGrade(score: number): UnifiedAnalysisResult['overallGrade'] {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C+';
  if (score >= 40) return 'C';
  if (score >= 25) return 'D';
  return 'F';
}

// ═══════════════════════════════════════════════════════════════
// MAIN FUNCTION: Run complete unified analysis
// ═══════════════════════════════════════════════════════════════
export async function runUnifiedAnalysis(
  input: UnifiedAnalysisInput
): Promise<UnifiedAnalysisResult> {
  // ── STEP 1: Skin Type Detection ──
  let skinTypeResult: SkinTypeSection;

  if (input.imageData) {
    skinTypeResult = await detectSkinTypeFromImage(input.imageData);
  } else {
    const st = input.skinType || 'combination';
    skinTypeResult = {
      skinType: st as SkinType,
      confidence: 0.85,
      method: 'manual',
      explanation: `You selected ${st} skin type. Based on this, we will personalize all recommendations.`,
    };
  }

  const detectedSkinType = skinTypeResult.skinType;

  // ── STEP 2: Acne Risk Prediction ──
  const acneHabits = mapToAcneHabits(input);
  const products: Product[] = input.products.map((p, i) => ({
    id: `p-${i}`,
    name: p.name,
    type: 'other' as const,
    ingredients: p.ingredients,
  }));
  const acneResult = predictAcneRisk(acneHabits, products, detectedSkinType);

  const acneSection: AcneRiskSection = {
    riskLevel: acneResult.riskLevel,
    riskScore: acneResult.riskScore,
    breakdown: acneResult.breakdown,
    topTriggers: acneResult.triggers.slice(0, 5),
    summary: acneResult.summary,
    routineChanges: acneResult.routineChanges,
  };

  // ── STEP 3: Ingredient Safety Analysis ──
  const ingredients = extractIngredients(input.products);
  let ingredientSection: IngredientSafetySection;

  if (ingredients.length > 0) {
    const ingredientResult = analyzeIngredients(
      ingredients, detectedSkinType, input.concerns as string[], acneResult.riskLevel
    );

    const safe = ingredientResult.ingredients
      .filter(i => i.suitability === 'excellent' || i.suitability === 'good')
      .map(i => i.name);
    const risky = ingredientResult.ingredients
      .filter(i => i.suitability === 'avoid' || i.suitability === 'caution')
      .map(i => i.name);

    ingredientSection = {
      overallSafety: ingredientResult.overallSafety,
      overallScore: ingredientResult.overallScore,
      safeProducts: safe,
      riskyProducts: risky,
      harmfulCombinations: ingredientResult.harmfulCombinations,
      bestIngredient: ingredientResult.bestIngredient,
      worstIngredient: ingredientResult.ingredients
        .filter(i => i.suitability === 'avoid')
        .sort((a, b) => a.personalScore - b.personalScore)[0]?.name || null,
      recommendations: ingredientResult.recommendations,
    };
  } else {
    ingredientSection = {
      overallSafety: 'safe',
      overallScore: 70,
      safeProducts: [],
      riskyProducts: [],
      harmfulCombinations: [],
      bestIngredient: null,
      worstIngredient: null,
      recommendations: ['Add your current products to analyze ingredient compatibility'],
    };
  }

  // ── STEP 4: Lifestyle Impact Analysis ──
  const lifestyleData = mapToLifestyleData(input);
  const lifestyleResult = calculateLifestyleImpact(lifestyleData);

  const lifestyleSection: LifestyleSection = {
    overallScore: lifestyleResult.overallScore,
    sleepScore: lifestyleResult.sleepImpact.score,
    hydrationScore: lifestyleResult.hydrationImpact.score,
    dietScore: lifestyleResult.dietImpact.score,
    stressScore: lifestyleResult.stressImpact.score,
    recommendations: lifestyleResult.recommendations,
    impact: lifestyleResult.overallScore >= 65 ? 'positive' : lifestyleResult.overallScore >= 40 ? 'neutral' : 'negative',
  };

  // ── STEP 5: Routine Preview ──
  const routineResult = generateRoutine({
    skinType: detectedSkinType,
    concerns: input.concerns,
    goals: input.goals,
    budget: input.budget,
    acneRisk: acneResult.riskLevel,
    sleepHours: input.sleepHours,
    waterIntake: input.waterIntake,
  });

  const routinePreview: RoutinePreviewSection = {
    morningSteps: routineResult.morningRoutine.steps.map(s => `${s.emoji} ${s.name}`),
    nightSteps: routineResult.nightRoutine.steps.map(s => `${s.emoji} ${s.name}`),
    keyIngredients: routineResult.explanation.keyIngredients,
    estimatedCost: routineResult.estimatedMonthlyCost,
    routineScore: routineResult.routineScore,
  };

  // ── STEP 6: Calculate Overall Score ──
  const skinTypeConfidence = skinTypeResult.confidence * 100;

  // Acne score (inverted: low risk = high score)
  const acneScore = acneSection.riskLevel === 'low' ? 90 :
    acneSection.riskLevel === 'moderate' ? 65 :
    acneSection.riskLevel === 'high' ? 40 : 20;

  const ingredientScore = ingredientSection.overallScore;
  const lifestyleScore = lifestyleSection.overallScore;
  const routineScore = routinePreview.routineScore;

  // Weighted overall score
  const overallScore = Math.round(
    (skinTypeConfidence * 0.10) +
    (acneScore * 0.25) +
    (ingredientScore * 0.25) +
    (lifestyleScore * 0.25) +
    (routineScore * 0.15)
  );

  // ── STEP 7: Generate Unified Explanation ──
  const explanation = generateUnifiedExplanation(
    skinTypeResult, acneSection, ingredientSection, lifestyleSection,
    routinePreview, input.concerns, input.goals, overallScore
  );

  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    overallGrade: getOverallGrade(Math.max(0, Math.min(100, overallScore))),
    skinType: skinTypeResult,
    acneRisk: acneSection,
    ingredientSafety: ingredientSection,
    lifestyle: lifestyleSection,
    routinePreview,
    explanation,
    timestamp: new Date().toISOString(),
  };
}

// ── Generate the unified explanation ──
function generateUnifiedExplanation(
  skinType: SkinTypeSection,
  acneRisk: AcneRiskSection,
  ingredients: IngredientSafetySection,
  lifestyle: LifestyleSection,
  routine: RoutinePreviewSection,
  concerns: SkinConcern[],
  goals: SkinGoal[],
  overallScore: number,
): UnifiedExplanation {
  const skinLabel = skinType.skinType;
  const keyInsights: string[] = [];
  const actionItems: string[] = [];

  // ── Overall Summary ──
  let overallSummary = '';
  if (overallScore >= 75) {
    overallSummary = `Great news! Based on our comprehensive analysis of your ${skinLabel} skin, your current skincare situation looks promising. `;
  } else if (overallScore >= 50) {
    overallSummary = `Based on our comprehensive analysis, your ${skinLabel} skin has room for improvement. `;
  } else {
    overallSummary = `Our analysis reveals that your ${skinLabel} skin needs immediate attention. `;
  }

  overallSummary += `Your skin type is ${skinLabel} (detected via ${skinType.method} with ${Math.round(skinType.confidence * 100)}% confidence). `;
  overallSummary += `Your acne risk is ${acneRisk.riskLevel}, `;
  overallSummary += ingredients.overallSafety === 'safe' ? 'your product ingredients look safe, ' :
    ingredients.overallSafety === 'caution' ? 'some ingredients need caution, ' : 'your ingredients may be causing issues, ';
  overallSummary += lifestyle.impact === 'positive' ? 'and your lifestyle supports healthy skin.' :
    lifestyle.impact === 'neutral' ? 'and your lifestyle has mixed effects on your skin.' :
    'and your lifestyle is negatively impacting your skin.';

  // ── Why It Works ──
  let whyItWorks = `Your personalized routine is designed for ${skinLabel} skin`;
  if (concerns.length > 0) {
    whyItWorks += ` with focus on ${concerns.join(', ')}`;
  }
  if (goals.length > 0) {
    whyItWorks += `. The goal: ${goals.join(', ')}`;
  }
  whyItWorks += '. ';

  if (ingredients.bestIngredient) {
    whyItWorks += `Your best ingredient match is ${ingredients.bestIngredient}, which is specifically beneficial for your skin profile. `;
  }
  if (ingredients.worstIngredient) {
    whyItWorks += `Consider avoiding ${ingredients.worstIngredient} as it may not suit your skin type. `;
  }
  if (lifestyle.impact !== 'positive') {
    whyItWorks += 'Improving your lifestyle factors (sleep, hydration, diet) would significantly boost your results.';
  } else {
    whyItWorks += 'Your healthy lifestyle supports the routine well — keep it up!';
  }

  // ── Key Insights ──
  keyInsights.push(`Skin Type: ${skinLabel} (${Math.round(skinType.confidence * 100)}% confidence via ${skinType.method})`);

  if (acneRisk.riskLevel === 'high' || acneRisk.riskLevel === 'severe') {
    keyInsights.push(`Acne Risk: ${acneRisk.riskLevel.toUpperCase()} — your habits and products are contributing to breakouts`);
  } else {
    keyInsights.push(`Acne Risk: ${acneRisk.riskLevel} — your current routine is reasonably safe`);
  }

  if (ingredients.harmfulCombinations.length > 0) {
    keyInsights.push(`${ingredients.harmfulCombinations.length} harmful ingredient combination(s) detected in your products`);
  }

  if (lifestyle.overallScore < 50) {
    keyInsights.push(`Lifestyle score: ${lifestyle.overallScore}/100 — lifestyle factors are dragging your skin health down`);
  } else if (lifestyle.overallScore >= 75) {
    keyInsights.push(`Lifestyle score: ${lifestyle.overallScore}/100 — great habits supporting your skin`);
  }

  if (routine.routineScore >= 80) {
    keyInsights.push(`Routine quality: ${routine.routineScore}/100 — excellent personalized routine generated`);
  }

  // ── Action Items ──
  if (acneRisk.riskLevel === 'high' || acneRisk.riskLevel === 'severe') {
    actionItems.push('Switch to non-comedogenic, oil-free products immediately');
    actionItems.push('Reduce dairy and sugar intake — proven acne triggers');
  }

  if (ingredients.worstIngredient) {
    actionItems.push(`Stop using products containing ${ingredients.worstIngredient}`);
  }

  if (ingredients.harmfulCombinations.length > 0) {
    actionItems.push('Separate conflicting ingredients into AM and PM routines');
  }

  if (lifestyle.sleepScore < 60) {
    actionItems.push('Increase sleep to 7-8 hours — the single biggest lifestyle improvement');
  }
  if (lifestyle.hydrationScore < 60) {
    actionItems.push('Drink 8+ glasses of water daily for proper skin hydration');
  }
  if (lifestyle.dietScore < 60) {
    actionItems.push('Improve diet quality — add fruits, vegetables, and omega-3 fatty acids');
  }

  actionItems.push(`Follow your personalized ${routine.morningSteps.length}-step morning and ${routine.nightSteps.length}-step night routine`);
  actionItems.push('Always use SPF 50+ sunscreen — the most important step');

  if (concerns.includes('acne')) {
    actionItems.push('Use salicylic acid cleanser for acne-prone areas');
  }
  if (concerns.includes('dryness')) {
    actionItems.push('Apply hyaluronic acid serum on damp skin for maximum hydration');
  }
  if (concerns.includes('pigmentation')) {
    actionItems.push('Add Vitamin C serum in the morning for dark spot reduction');
  }

  const confidence = Math.round(
    (skinType.confidence * 30 +
    (ingredients.overallSafety === 'safe' ? 25 : ingredients.overallSafety === 'caution' ? 15 : 5) +
    (100 - acneRisk.riskScore) * 0.25 +
    lifestyle.overallScore * 0.20)
  );

  return {
    overallSummary,
    whyItWorks,
    keyInsights: keyInsights.slice(0, 6),
    actionItems: actionItems.slice(0, 8),
    confidence: Math.max(30, Math.min(95, confidence)),
  };
}
