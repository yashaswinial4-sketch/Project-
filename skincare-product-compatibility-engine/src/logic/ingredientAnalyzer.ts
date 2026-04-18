// ─────────────────────────────────────────────────────────────
// INGREDIENT ANALYZER ENGINE (TASK 5 — XAI)
// Evaluates ingredient suitability based on user profile
// ─────────────────────────────────────────────────────────────

import type {
  AnalyzedIngredient, IngredientAnalysisResult,
  IngredientAlternative, SkinType, HarmfulCombination,
} from '../types';
import { ingredientDatabase, harmfulCombinations, findIngredient } from './ingredientDatabase';

// ── Core Analysis: evaluate each ingredient against user profile ──
function analyzeIngredient(
  ingredientName: string,
  skinType: SkinType | '',
  concerns: string[],
  acneRisk: string
): AnalyzedIngredient {
  const key = findIngredient(ingredientName);

  if (!key) {
    return {
      name: ingredientName,
      matched: false,
      suitability: 'unknown',
      personalScore: 50,
      reasons: ['This ingredient is not in our database. We cannot evaluate its safety or suitability.'],
      benefits: [],
      warnings: ['Unknown ingredient — proceed with caution and patch test first.'],
    };
  }

  const info = ingredientDatabase[key];
  let personalScore = 50; // baseline
  const reasons: string[] = [];
  const benefits: string[] = [];
  const warnings: string[] = [];

  // ── Skin type matching (±25 points) ──
  const skinTypeStr = skinType || '';
  const isBestFor = info.bestFor.some(b =>
    b.toLowerCase() === skinTypeStr.toLowerCase() ||
    b.toLowerCase().includes(skinTypeStr.toLowerCase()) ||
    skinTypeStr.toLowerCase().includes(b.toLowerCase())
  );
  const isAvoidFor = info.avoidFor.some(a =>
    a.toLowerCase() === skinTypeStr.toLowerCase() ||
    a.toLowerCase().includes(skinTypeStr.toLowerCase()) ||
    skinTypeStr.toLowerCase().includes(a.toLowerCase())
  );

  if (isBestFor) {
    personalScore += 25;
    reasons.push(`Excellent for ${skinType || 'your'} skin type`);
    benefits.push(`Specifically recommended for ${skinType} skin`);
  } else if (isAvoidFor) {
    personalScore -= 25;
    reasons.push(`Not recommended for ${skinType || 'your'} skin type`);
    warnings.push(`This ingredient may not be suitable for ${skinType} skin. Consider an alternative.`);
  } else {
    personalScore += 5;
    reasons.push(`Generally compatible with ${skinType || 'your'} skin type`);
  }

  // ── Concern matching (±15 points) ──
  const concernMatches = info.benefits.filter(benefit =>
    concerns.some(concern =>
      benefit.toLowerCase().includes(concern.toLowerCase()) ||
      concern.toLowerCase().includes(benefit.toLowerCase()) ||
      partialMatch(concern, benefit)
    )
  );

  if (concernMatches.length >= 2) {
    personalScore += 15;
    reasons.push(`Addresses multiple skin concerns: ${concernMatches.slice(0, 3).join(', ')}`);
    benefits.push(...concernMatches);
  } else if (concernMatches.length === 1) {
    personalScore += 8;
    reasons.push(`Addresses skin concern: ${concernMatches[0]}`);
    benefits.push(concernMatches[0]);
  }

  // ── Acne risk adjustment (±10 points) ──
  if (acneRisk === 'high' || acneRisk === 'severe') {
    if (info.comedogenicRating >= 3) {
      personalScore -= 10;
      warnings.push(`High comedogenic rating (${info.comedogenicRating}/5) — may worsen acne.`);
      reasons.push(`Comedogenic ingredient — can clog pores`);
    }
    if (info.bestFor.includes('acne-prone')) {
      personalScore += 10;
      benefits.push('Specifically formulated for acne-prone skin');
    }
  }

  // ── Strength adjustment ──
  if (info.strength === 'strong' && skinType === 'sensitive') {
    personalScore -= 10;
    warnings.push('This is a strong active that may irritate sensitive skin.');
  }
  if (info.strength === 'gentle') {
    personalScore += 5;
    benefits.push('Gentle and well-tolerated by most skin types');
  }

  // ── Determine suitability label ──
  let suitability: AnalyzedIngredient['suitability'];
  if (personalScore >= 75) suitability = 'excellent';
  else if (personalScore >= 55) suitability = 'good';
  else if (personalScore >= 40) suitability = 'caution';
  else suitability = 'avoid';

  if (isAvoidFor && personalScore < 40) suitability = 'avoid';

  return {
    name: ingredientName,
    matched: true,
    info,
    suitability,
    personalScore: Math.max(0, Math.min(100, personalScore)),
    reasons,
    benefits,
    warnings,
  };
}

// ── Check for harmful combinations between ingredients ──
function detectHarmfulCombinations(ingredientNames: string[]): HarmfulCombination[] {
  const detected: HarmfulCombination[] = [];
  const normalized = ingredientNames.map(name => {
    const key = findIngredient(name);
    return key || name.toLowerCase().trim();
  });

  for (const combo of harmfulCombinations) {
    const has1 = normalized.some(n => n === combo.ingredient1 || n.includes(combo.ingredient1) || combo.ingredient1.includes(n));
    const has2 = normalized.some(n => n === combo.ingredient2 || n.includes(combo.ingredient2) || combo.ingredient2.includes(n));
    if (has1 && has2) {
      detected.push(combo);
    }
  }

  return detected;
}

// ── Find alternative ingredients ──
function findAlternatives(analyzed: AnalyzedIngredient[], skinType: SkinType | ''): IngredientAlternative[] {
  const alternatives: IngredientAlternative[] = [];
  const skinTypeStr = skinType || '';

  for (const item of analyzed) {
    if (item.suitability === 'avoid' || item.suitability === 'caution') {
      // Find better alternatives from database
      for (const [key, data] of Object.entries(ingredientDatabase)) {
        if (data.bestFor.some(b => b.toLowerCase().includes(skinTypeStr.toLowerCase()) || skinTypeStr.toLowerCase().includes(b.toLowerCase()))) {
          // Check if this ingredient shares some category or benefits
          const sharesBenefits = data.benefits.some(b =>
            item.info?.benefits?.some(ib => b.toLowerCase().includes(ib.toLowerCase()) || ib.toLowerCase().includes(b.toLowerCase()))
          );
          const sharesCategory = data.category.toLowerCase().includes(item.info?.category?.toLowerCase() || '___') ||
            item.info?.category?.toLowerCase().includes(data.category.toLowerCase());

          if ((sharesBenefits || sharesCategory) && key !== findIngredient(item.name)) {
            alternatives.push({
              original: item.name,
              alternative: data.name,
              reason: `${data.name} (${data.category}) is better suited for ${skinType || 'your'} skin type. ${data.purpose}`,
              betterFor: data.bestFor,
            });
            break; // One alternative per problematic ingredient
          }
        }
      }
    }
  }

  return alternatives.slice(0, 5);
}

// ── Partial string matching helper ──
function partialMatch(str1: string, str2: string): boolean {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  const keywords1 = s1.split(/[\s\-_,]+/).filter(w => w.length > 3);
  const keywords2 = s2.split(/[\s\-_,]+/).filter(w => w.length > 3);
  return keywords1.some(k => keywords2.some(k2 => k.includes(k2) || k2.includes(k)));
}

// ── MAIN ANALYSIS FUNCTION ──
export function analyzeIngredients(
  ingredients: string[],
  skinType: SkinType | '',
  concerns: string[],
  acneRisk: string
): IngredientAnalysisResult {
  // Step 1: Analyze each ingredient individually
  const analyzedIngredients = ingredients.map(ing =>
    analyzeIngredient(ing, skinType, concerns, acneRisk)
  );

  // Step 2: Detect harmful combinations
  const harmfulCombos = detectHarmfulCombinations(ingredients);

  // Step 3: Calculate overall score
  const avgScore = analyzedIngredients.length > 0
    ? Math.round(analyzedIngredients.reduce((sum, a) => sum + a.personalScore, 0) / analyzedIngredients.length)
    : 50;

  // Penalty for harmful combinations
  let comboPenalty = 0;
  for (const combo of harmfulCombos) {
    if (combo.severity === 'high') comboPenalty += 15;
    else if (combo.severity === 'medium') comboPenalty += 8;
    else comboPenalty += 3;
  }
  const overallScore = Math.max(0, Math.min(100, avgScore - comboPenalty));

  // Step 4: Determine overall safety
  let overallSafety: IngredientAnalysisResult['overallSafety'];
  if (overallScore >= 70) overallSafety = 'safe';
  else if (overallScore >= 45) overallSafety = 'caution';
  else overallSafety = 'avoid';

  // Step 5: Find alternatives
  const alternatives = findAlternatives(analyzedIngredients, skinType);

  // Step 6: Find best ingredient
  const bestIngredient = analyzedIngredients
    .filter(a => a.matched && a.suitability === 'excellent')
    .sort((a, b) => b.personalScore - a.personalScore)[0]?.info?.name || null;

  // Step 7: Collect all warnings
  const allWarnings: string[] = [];
  for (const combo of harmfulCombos) {
    allWarnings.push(`COMBINATION RISK: ${combo.ingredient1} + ${combo.ingredient2} — ${combo.reason}. ${combo.suggestion}`);
  }
  for (const item of analyzedIngredients) {
    allWarnings.push(...item.warnings);
  }

  // Step 8: Generate recommendations
  const recommendations: string[] = [];
  if (harmfulCombos.length > 0) {
    recommendations.push('Separate conflicting ingredients into AM and PM routines');
  }
  if (analyzedIngredients.some(a => a.suitability === 'avoid')) {
    recommendations.push('Replace flagged ingredients with safer alternatives listed below');
  }
  if (analyzedIngredients.some(a => a.info?.strength === 'strong')) {
    recommendations.push('Introduce strong actives gradually (start 2-3x per week)');
  }
  if (analyzedIngredients.some(a => a.info?.strength === 'strong' || a.info?.strength === 'moderate')) {
    recommendations.push('Always use SPF 30+ when using active ingredients');
  }
  if (analyzedIngredients.filter(a => a.info?.strength === 'strong').length > 2) {
    recommendations.push('Reduce the number of strong actives in your routine to prevent barrier damage');
  }
  if (!analyzedIngredients.some(a => findIngredient(a.name) === 'ceramides' || findIngredient(a.name) === 'hyaluronic acid' || findIngredient(a.name) === 'niacinamide')) {
    recommendations.push('Consider adding barrier-supporting ingredients: ceramides, hyaluronic acid, or niacinamide');
  }

  // Step 9: Generate summary
  const excellentCount = analyzedIngredients.filter(a => a.suitability === 'excellent').length;
  const goodCount = analyzedIngredients.filter(a => a.suitability === 'good').length;
  const cautionCount = analyzedIngredients.filter(a => a.suitability === 'caution').length;
  const avoidCount = analyzedIngredients.filter(a => a.suitability === 'avoid').length;

  let summary = '';
  if (overallSafety === 'safe') {
    summary = `This combination looks good for your ${skinType || 'skin'}! ${excellentCount + goodCount} out of ${analyzedIngredients.length} ingredients are well-suited for you.`;
    if (harmfulCombos.length > 0) {
      summary += ` However, ${harmfulCombos.length} ingredient combination(s) need attention — see warnings below.`;
    }
  } else if (overallSafety === 'caution') {
    summary = `This combination has some concerns for your ${skinType || 'skin'}. ${cautionCount} ingredient(s) need caution and ${harmfulCombos.length} combination conflict(s) detected. Review the detailed analysis below.`;
  } else {
    summary = `This combination may not be ideal for your ${skinType || 'skin'}. ${avoidCount} ingredient(s) should be avoided and ${harmfulCombos.length} harmful combination(s) detected. Consider the suggested alternatives.`;
  }

  // Step 10: Generate explanation and whyItWorks
  const explanation = generateExplanation(analyzedIngredients, skinType, concerns, harmfulCombos);
  const whyItWorks = generateWhyItWorks(analyzedIngredients, skinType, concerns, bestIngredient);

  // Step 11: Calculate confidence
  const matchedCount = analyzedIngredients.filter(a => a.matched).length;
  const confidence = analyzedIngredients.length > 0
    ? Math.round((matchedCount / analyzedIngredients.length) * 100)
    : 0;

  return {
    ingredients: analyzedIngredients,
    overallSafety,
    overallScore,
    harmfulCombinations: harmfulCombos,
    explanation,
    whyItWorks,
    warnings: allWarnings,
    recommendations,
    confidence: Math.max(30, confidence),
    alternatives,
    bestIngredient,
    summary,
  };
}

// ── Generate Human-Readable Explanation ──
function generateExplanation(
  analyzed: AnalyzedIngredient[],
  skinType: SkinType | '',
  concerns: string[],
  harmfulCombos: HarmfulCombination[]
): string {
  if (analyzed.length === 0) return 'No ingredients provided for analysis.';

  const parts: string[] = [];
  const skinLabel = skinType ? `${skinType} skin` : 'your skin';

  // Ingredient-by-ingredient explanation
  const matchedItems = analyzed.filter(a => a.matched);
  if (matchedItems.length > 0) {
    parts.push(`We analyzed ${matchedItems.length} ingredient(s) against your profile (${skinLabel}, concerns: ${concerns.join(', ') || 'none specified'}).\n`);

    for (const item of matchedItems) {
      if (item.suitability === 'excellent') {
        parts.push(`${item.info!.name}: This is an excellent match for you. ${item.info!.purpose}`);
      } else if (item.suitability === 'good') {
        parts.push(`${item.info!.name}: This is a good choice for your skin. ${item.info!.purpose}`);
      } else if (item.suitability === 'caution') {
        parts.push(`${item.info!.name}: Use with caution. While ${item.info!.purpose.toLowerCase().split('.')[0]}, it may not be ideal for ${skinLabel}. ${item.warnings.join(' ')}`);
      } else if (item.suitability === 'avoid') {
        parts.push(`${item.info!.name}: We recommend avoiding this for ${skinLabel}. ${item.warnings.join(' ')}`);
      }
    }
  }

  // Combination warnings
  if (harmfulCombos.length > 0) {
    parts.push(`\nCombination Alert: ${harmfulCombos.length} harmful ingredient pair(s) detected.`);
    for (const combo of harmfulCombos.slice(0, 2)) {
      parts.push(`${combo.ingredient1} + ${combo.ingredient2}: ${combo.reason} ${combo.suggestion}`);
    }
  }

  return parts.join('\n\n');
}

// ── Generate "WHY This Works For YOU" ──
function generateWhyItWorks(
  analyzed: AnalyzedIngredient[],
  skinType: SkinType | '',
  concerns: string[],
  bestIngredient: string | null
): string {
  if (analyzed.length === 0) return 'No ingredients to analyze.';

  const skinLabel = skinType ? `${skinType} skin` : 'your skin type';
  const excellentItems = analyzed.filter(a => a.suitability === 'excellent' || a.suitability === 'good');
  const poorItems = analyzed.filter(a => a.suitability === 'avoid' || a.suitability === 'caution');

  if (excellentItems.length === 0 && poorItems.length > 0) {
    return `Based on your ${skinLabel} and concerns (${concerns.join(', ')}), these ingredients are not well-matched for you. ${poorItems[0].info?.name || 'Some ingredients'} may cause issues because ${poorItems[0].reasons[0]?.toLowerCase() || 'they do not align with your skin profile'}. We recommend switching to the alternatives suggested below for better results.`;
  }

  const parts: string[] = [];
  parts.push(`Based on your ${skinLabel} and skin concerns (${concerns.join(', ')}), here is why this combination works (or does not work) for you:\n`);

  if (bestIngredient) {
    const bestItem = excellentItems.find(a => a.info?.name === bestIngredient);
    if (bestItem?.info) {
      parts.push(`Best Match: ${bestIngredient} — ${bestItem.info.purpose} This ingredient is particularly effective for ${skinLabel} because ${bestItem.info.howItWorks.split('.')[0].toLowerCase()}.`);
    }
  }

  if (excellentItems.length > 1) {
    const otherGood = excellentItems.filter(a => a.info?.name !== bestIngredient);
    parts.push(`Other good matches: ${otherGood.map(a => a.info?.name).join(', ')}. These ingredients complement your skin profile well.`);
  }

  if (poorItems.length > 0) {
    parts.push(`Concerns: ${poorItems.map(a => `${a.info?.name || a.name} (${a.suitability})`).join(', ')}. These may not be ideal for your skin.`);
  }

  return parts.join('\n\n');
}
