// ─────────────────────────────────────────────────────────────
// TASK 4: LIFESTYLE IMPACT ENGINE
// Calculates how lifestyle factors affect skin health
// ─────────────────────────────────────────────────────────────

import type { LifestyleData, LifestyleImpact } from '../types';

export function calculateLifestyleImpact(data: LifestyleData): LifestyleImpact {
  const recommendations: string[] = [];

  // ── Sleep Impact (0-100) ──
  let sleepScore: number;
  let sleepLabel: string;
  let sleepDesc: string;

  if (data.sleepHours >= 8) {
    sleepScore = 95; sleepLabel = 'Excellent'; sleepDesc = 'Your sleep duration is optimal for skin repair and regeneration.';
  } else if (data.sleepHours >= 7) {
    sleepScore = 80; sleepLabel = 'Good'; sleepDesc = 'Adequate sleep for skin health. Try to reach 8 hours for optimal results.';
  } else if (data.sleepHours >= 6) {
    sleepScore = 55; sleepLabel = 'Fair'; sleepDesc = 'Borderline insufficient. Skin repair is compromised below 7 hours.';
    recommendations.push('Try to sleep 7-8 hours for better skin repair');
  } else if (data.sleepHours >= 5) {
    sleepScore = 30; sleepLabel = 'Poor'; sleepDesc = 'Sleep deprivation increases cortisol by 45%, causing excess oil and breakouts.';
    recommendations.push('Increase sleep to at least 7 hours — critical for skin health');
  } else {
    sleepScore = 10; sleepLabel = 'Critical'; sleepDesc = 'Severe sleep deprivation is one of the biggest acne triggers. Your skin cannot repair itself.';
    recommendations.push('Prioritize sleep immediately — it\'s the #1 lifestyle factor for clear skin');
  }

  // ── Hydration Impact (0-100) ──
  let hydrationScore: number;
  let hydrationLabel: string;
  let hydrationDesc: string;

  if (data.waterIntake >= 10) {
    hydrationScore = 95; hydrationLabel = 'Excellent'; hydrationDesc = 'Excellent hydration! Your skin cells are well-nourished and plump.';
  } else if (data.waterIntake >= 8) {
    hydrationScore = 85; hydrationLabel = 'Good'; hydrationDesc = 'Good hydration level. Skin cells are adequately hydrated.';
  } else if (data.waterIntake >= 6) {
    hydrationScore = 60; hydrationLabel = 'Fair'; hydrationDesc = 'Below optimal. Dehydrated skin overproduces oil to compensate for lack of moisture.';
    recommendations.push('Increase water intake to 8+ glasses daily');
  } else if (data.waterIntake >= 4) {
    hydrationScore = 35; hydrationLabel = 'Poor'; hydrationDesc = 'Dehydration causes dull skin, fine lines, and increased oil production.';
    recommendations.push('Drink at least 8 glasses of water daily for healthy skin');
  } else {
    hydrationScore = 10; hydrationLabel = 'Critical'; hydrationDesc = 'Severe dehydration. Your skin is struggling to maintain basic functions.';
    recommendations.push('Start drinking water immediately — aim for 8+ glasses daily');
  }

  // ── Diet Impact (0-100) ──
  let dietScore: number;
  let dietLabel: string;
  let dietDesc: string;

  switch (data.dietQuality) {
    case 'excellent':
      dietScore = 95; dietLabel = 'Excellent'; dietDesc = 'Your diet provides optimal nutrients for skin health — antioxidants, omega-3s, vitamins.';
      break;
    case 'good':
      dietScore = 75; dietLabel = 'Good'; dietDesc = 'Good diet overall. Skin is getting adequate nutrients.';
      break;
    case 'average':
      dietScore = 50; dietLabel = 'Average'; dietDesc = 'Average diet. Some nutrient gaps may be affecting your skin health.';
      recommendations.push('Add more fruits, vegetables, and omega-3 rich foods to your diet');
      break;
    case 'poor':
      dietScore = 20; dietLabel = 'Poor'; dietDesc = 'Poor diet causes inflammation, hormonal imbalance, and nutrient deficiencies — all acne triggers.';
      recommendations.push('Switch to whole foods. Reduce sugar, processed foods, and dairy');
      break;
    default:
      dietScore = 50; dietLabel = 'Average'; dietDesc = 'Unknown diet quality. Consider improving for better skin health.';
  }

  // ── Stress Impact (0-100) ──
  let stressScore: number;
  let stressLabel: string;
  let stressDesc: string;

  switch (data.stressLevel) {
    case 'low':
      stressScore = 90; stressLabel = 'Low Stress'; stressDesc = 'Low stress means lower cortisol levels — great for your skin!';
      break;
    case 'moderate':
      stressScore = 60; stressLabel = 'Moderate Stress'; stressDesc = 'Moderate stress elevates cortisol slightly, which can increase oil production.';
      recommendations.push('Practice stress management: meditation, exercise, or hobbies');
      break;
    case 'high':
      stressScore = 30; stressLabel = 'High Stress'; stressDesc = 'High stress significantly increases cortisol and androgen levels — major acne triggers.';
      recommendations.push('Prioritize stress reduction: yoga, meditation, or therapy');
      break;
    default:
      stressScore = 60; stressLabel = 'Moderate Stress'; stressDesc = 'Unknown stress level. Consider managing stress for better skin.';
  }

  // ── Exercise Impact (0-100) ──
  let exerciseScore: number;
  let exerciseLabel: string;
  let exerciseDesc: string;

  if (data.exerciseDays >= 5) {
    exerciseScore = 90; exerciseLabel = 'Excellent'; exerciseDesc = 'Regular exercise improves blood circulation, reduces stress, and helps flush toxins.';
  } else if (data.exerciseDays >= 3) {
    exerciseScore = 75; exerciseLabel = 'Good'; exerciseDesc = 'Good exercise routine. Blood circulation supports healthy skin.';
  } else if (data.exerciseDays >= 1) {
    exerciseScore = 45; exerciseLabel = 'Fair'; exerciseDesc = 'Some exercise is better than none, but more would benefit your skin.';
    recommendations.push('Aim for 3-4 exercise sessions per week for better skin health');
  } else {
    exerciseScore = 15; exerciseLabel = 'Sedentary'; exerciseDesc = 'Lack of exercise reduces blood circulation and stress management — both affect skin.';
    recommendations.push('Start with 20-30 minutes of walking daily');
  }

  // ── Overall Score (weighted average) ──
  const overallScore = Math.round(
    sleepScore * 0.25 +
    hydrationScore * 0.20 +
    dietScore * 0.25 +
    stressScore * 0.15 +
    exerciseScore * 0.15
  );

  return {
    overallScore,
    sleepImpact: { score: sleepScore, label: sleepLabel, description: sleepDesc },
    hydrationImpact: { score: hydrationScore, label: hydrationLabel, description: hydrationDesc },
    dietImpact: { score: dietScore, label: dietLabel, description: dietDesc },
    stressImpact: { score: stressScore, label: stressLabel, description: stressDesc },
    exerciseImpact: { score: exerciseScore, label: exerciseLabel, description: exerciseDesc },
    recommendations,
  };
}

/**
 * Merge lifestyle impact with image analysis for a comprehensive skin assessment.
 */
export function mergeLifestyleWithImageAnalysis(
  imageSkinType: string,
  imageConfidence: number,
  lifestyleImpact: LifestyleImpact
): {
  adjustedSkinType: string;
  adjustedConfidence: number;
  lifestyleAdjusted: boolean;
  combinedInsights: string[];
} {
  const insights: string[] = [];
  let adjustedType = imageSkinType;
  let adjustedConfidence = imageConfidence;
  let lifestyleAdjusted = false;

  // If lifestyle is poor, increase likelihood of sensitive/oily skin
  if (lifestyleImpact.overallScore < 40) {
    insights.push('⚠️ Poor lifestyle habits may be worsening your skin condition. Improving habits could change your skin type assessment.');
    if (imageSkinType === 'combination' || imageSkinType === 'dry') {
      adjustedType = 'sensitive';
      lifestyleAdjusted = true;
      insights.push('🔄 Adjusted to sensitive skin due to poor lifestyle factors (stress, diet, sleep).');
    }
    adjustedConfidence = Math.max(0.45, imageConfidence - 0.10);
  }

  // If lifestyle is excellent, skin may be healthier than image suggests
  if (lifestyleImpact.overallScore >= 80) {
    insights.push('✅ Excellent lifestyle habits are supporting your skin health.');
    adjustedConfidence = Math.min(0.90, imageConfidence + 0.05);
  }

  // Specific lifestyle adjustments
  if (lifestyleImpact.stressImpact.score < 40) {
    insights.push('🔴 High stress is likely causing inflammation and excess oil production.');
  }
  if (lifestyleImpact.hydrationImpact.score < 40) {
    insights.push('💧 Dehydration may be making your skin appear drier or oilier than it actually is.');
  }
  if (lifestyleImpact.dietImpact.score < 40) {
    insights.push('🍔 Poor diet is contributing to inflammation and potential breakouts.');
  }
  if (lifestyleImpact.sleepImpact.score < 40) {
    insights.push('😴 Sleep deprivation is preventing your skin from repairing itself overnight.');
  }

  return { adjustedSkinType: adjustedType, adjustedConfidence, lifestyleAdjusted, combinedInsights: insights };
}
