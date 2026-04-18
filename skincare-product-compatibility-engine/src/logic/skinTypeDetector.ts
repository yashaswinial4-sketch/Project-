// ─────────────────────────────────────────────────────────────
// CLIENT-SIDE SKIN TYPE DETECTION ENGINE
// ─────────────────────────────────────────────────────────────
// Mirrors the backend logic/skincareRules.js questionnaire engine.
// Used when no backend is available (fallback mode).
// ─────────────────────────────────────────────────────────────

import type { QuizAnswer, SkinDetectionResult, SkinType } from '../types';

export function detectSkinType(answers: QuizAnswer[]): SkinDetectionResult {
  const scores: Record<string, number> = { dry: 0, oily: 0, combination: 0, normal: 0 };
  let sensitiveFlag = false;

  for (const qa of answers) {
    const { questionId, answer } = qa;
    switch (questionId) {
      case 1:
        if (answer === 'tight') scores.dry += 3;
        else if (answer === 'normal') { scores.normal += 2; scores.combination += 1; }
        else if (answer === 'oily') scores.oily += 3;
        else if (answer === 'comfortable') scores.normal += 3;
        break;
      case 2:
        if (answer === 'rarely') scores.dry += 3;
        else if (answer === 'sometimes') scores.combination += 3;
        else if (answer === 'often') scores.oily += 3;
        else if (answer === 'never') scores.dry += 2;
        break;
      case 3:
        if (answer === 'never') { scores.dry += 1; scores.normal += 2; }
        else if (answer === 'sometimes') scores.combination += 3;
        else if (answer === 'frequently') scores.oily += 3;
        else if (answer === 'rarely') { scores.normal += 2; scores.combination += 1; }
        break;
      case 4:
        if (answer === 'no') scores.dry += 3;
        else if (answer === 't-zone') scores.combination += 3;
        else if (answer === 'yes') scores.oily += 3;
        else if (answer === 'slightly') { scores.normal += 2; scores.combination += 1; }
        break;
      case 5:
        if (answer === 'yes') { sensitiveFlag = true; scores.sensitive = 5; }
        else if (answer === 'sometimes') { scores.sensitive = 3; scores.combination += 1; }
        else if (answer === 'rarely') scores.normal += 1;
        break;
      case 6:
        if (answer === 'tight-dry') scores.dry += 3;
        else if (answer === 'comfortable') scores.normal += 3;
        else if (answer === 'oily-all-over') scores.oily += 3;
        else if (answer === 'oily-tzone') scores.combination += 3;
        break;
      case 7:
        if (answer === 'dull-flat') scores.dry += 2;
        else if (answer === 'glowy') scores.normal += 2;
        else if (answer === 'very-shiny') scores.oily += 3;
        else if (answer === 'mixed') scores.combination += 3;
        break;
      case 8:
        if (answer === 'often') { scores.dry += 3; scores.sensitive = Math.max(scores.sensitive || 0, 2); }
        else if (answer === 'sometimes') { scores.dry += 1; scores.combination += 1; }
        else if (answer === 'rarely') { scores.normal += 2; scores.oily += 1; }
        else if (answer === 'never') { scores.oily += 2; scores.normal += 1; }
        break;
      default: break;
    }
  }

  if (sensitiveFlag) {
    return {
      skinType: 'sensitive',
      confidence: 0.88,
      method: 'questionnaire',
      breakdown: scores,
      explanation: 'Based on your answers, you have SENSITIVE skin. Your skin reacts easily to products and environmental factors. Use gentle, fragrance-free products and avoid strong actives like retinol and AHAs.'
    };
  }

  let maxScore = 0;
  let detectedType = 'combination';
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) { maxScore = score; detectedType = type; }
  }

  const typeMap: Record<string, SkinType> = { dry: 'dry', oily: 'oily', combination: 'combination', normal: 'combination', sensitive: 'sensitive' };
  const finalType = typeMap[detectedType] || 'combination';
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? Math.min(0.95, 0.6 + (maxScore / totalScore) * 0.35) : 0.6;

  const typeDescriptions: Record<SkinType, string> = {
    dry: 'Based on your answers, you have DRY skin. Your skin lacks natural oils and moisture. Focus on hydration, ceramides, and gentle cleansing. Avoid alcohol-based products and harsh exfoliants.',
    oily: 'Based on your answers, you have OILY skin. Your skin produces excess sebum. Focus on oil control, salicylic acid, and lightweight hydration. Avoid heavy oils and comedogenic ingredients.',
    combination: 'Based on your answers, you have COMBINATION skin. Your T-zone is oily while cheeks are dry/normal. Use balanced products — gentle cleansers, lightweight moisturizers, and targeted treatments.',
    sensitive: 'Based on your answers, you have SENSITIVE skin. Your skin reacts easily to products and environmental factors. Use gentle, fragrance-free products and avoid strong actives like retinol and AHAs.'
  };

  return {
    skinType: finalType,
    confidence: Math.round(confidence * 100) / 100,
    method: 'questionnaire',
    breakdown: scores,
    explanation: typeDescriptions[finalType]
  };
}
