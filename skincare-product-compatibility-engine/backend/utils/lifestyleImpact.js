// ============================================================
// TASK 4: LIFESTYLE IMPACT CALCULATOR (BACKEND)
// ============================================================
// Calculates how lifestyle factors affect skin health.
// Merges with image analysis for comprehensive assessment.
// ============================================================

export function calculateLifestyleImpact(data) {
  const recommendations = [];

  // Sleep Impact
  let sleepScore, sleepLabel, sleepDesc;
  if (data.sleepHours >= 8) { sleepScore = 95; sleepLabel = 'Excellent'; sleepDesc = 'Optimal sleep for skin repair.'; }
  else if (data.sleepHours >= 7) { sleepScore = 80; sleepLabel = 'Good'; sleepDesc = 'Adequate sleep for skin health.'; }
  else if (data.sleepHours >= 6) { sleepScore = 55; sleepLabel = 'Fair'; sleepDesc = 'Borderline insufficient for skin repair.'; recommendations.push('Increase sleep to 7-8 hours'); }
  else if (data.sleepHours >= 5) { sleepScore = 30; sleepLabel = 'Poor'; sleepDesc = 'Sleep deprivation increases cortisol by 45%.'; recommendations.push('Prioritize 7+ hours of sleep'); }
  else { sleepScore = 10; sleepLabel = 'Critical'; sleepDesc = 'Severe sleep deprivation — major acne trigger.'; recommendations.push('Sleep is critical — aim for 7-8 hours immediately'); }

  // Hydration Impact
  let hydrationScore, hydrationLabel, hydrationDesc;
  if (data.waterIntake >= 10) { hydrationScore = 95; hydrationLabel = 'Excellent'; hydrationDesc = 'Excellent hydration!'; }
  else if (data.waterIntake >= 8) { hydrationScore = 85; hydrationLabel = 'Good'; hydrationDesc = 'Good hydration level.'; }
  else if (data.waterIntake >= 6) { hydrationScore = 60; hydrationLabel = 'Fair'; hydrationDesc = 'Below optimal. Dehydrated skin overproduces oil.'; recommendations.push('Increase water to 8+ glasses daily'); }
  else if (data.waterIntake >= 4) { hydrationScore = 35; hydrationLabel = 'Poor'; hydrationDesc = 'Dehydration causes dull skin and increased oil.'; recommendations.push('Drink 8+ glasses of water daily'); }
  else { hydrationScore = 10; hydrationLabel = 'Critical'; hydrationDesc = 'Severe dehydration affecting skin functions.'; recommendations.push('Start drinking water immediately'); }

  // Diet Impact
  let dietScore, dietLabel, dietDesc;
  switch (data.dietQuality) {
    case 'excellent': dietScore = 95; dietLabel = 'Excellent'; dietDesc = 'Optimal nutrients for skin health.'; break;
    case 'good': dietScore = 75; dietLabel = 'Good'; dietDesc = 'Good diet overall.'; break;
    case 'average': dietScore = 50; dietLabel = 'Average'; dietDesc = 'Some nutrient gaps may affect skin.'; recommendations.push('Add more fruits, vegetables, omega-3s'); break;
    case 'poor': dietScore = 20; dietLabel = 'Poor'; dietDesc = 'Poor diet causes inflammation and hormonal imbalance.'; recommendations.push('Switch to whole foods, reduce sugar and dairy'); break;
    default: dietScore = 50; dietLabel = 'Average'; dietDesc = 'Consider improving diet for better skin.';
  }

  // Stress Impact
  let stressScore, stressLabel, stressDesc;
  switch (data.stressLevel) {
    case 'low': stressScore = 90; stressLabel = 'Low Stress'; stressDesc = 'Low cortisol — great for skin!'; break;
    case 'moderate': stressScore = 60; stressLabel = 'Moderate'; stressDesc = 'Moderate cortisol elevation.'; recommendations.push('Practice stress management techniques'); break;
    case 'high': stressScore = 30; stressLabel = 'High Stress'; stressDesc = 'High cortisol and androgens — major acne triggers.'; recommendations.push('Prioritize stress reduction immediately'); break;
    default: stressScore = 60; stressLabel = 'Moderate'; stressDesc = 'Consider managing stress.';
  }

  // Exercise Impact
  let exerciseScore, exerciseLabel, exerciseDesc;
  if (data.exerciseDays >= 5) { exerciseScore = 90; exerciseLabel = 'Excellent'; exerciseDesc = 'Regular exercise supports healthy skin.'; }
  else if (data.exerciseDays >= 3) { exerciseScore = 75; exerciseLabel = 'Good'; exerciseDesc = 'Good exercise routine.'; }
  else if (data.exerciseDays >= 1) { exerciseScore = 45; exerciseLabel = 'Fair'; exerciseDesc = 'More exercise would benefit your skin.'; recommendations.push('Aim for 3-4 exercise sessions per week'); }
  else { exerciseScore = 15; exerciseLabel = 'Sedentary'; exerciseDesc = 'Lack of exercise affects skin health.'; recommendations.push('Start with 20-30 min walking daily'); }

  const overallScore = Math.round(
    sleepScore * 0.25 + hydrationScore * 0.20 + dietScore * 0.25 + stressScore * 0.15 + exerciseScore * 0.15
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
 * Merge lifestyle impact with image analysis for comprehensive assessment.
 */
export function mergeLifestyleWithImage(imageSkinType, imageConfidence, lifestyleImpact) {
  const insights = [];
  let adjustedType = imageSkinType;
  let adjustedConfidence = imageConfidence;
  let lifestyleAdjusted = false;

  if (lifestyleImpact.overallScore < 40) {
    insights.push('⚠️ Poor lifestyle habits may be worsening your skin condition.');
    if (imageSkinType === 'combination' || imageSkinType === 'dry') {
      adjustedType = 'sensitive';
      lifestyleAdjusted = true;
      insights.push('🔄 Adjusted to sensitive skin due to poor lifestyle factors.');
    }
    adjustedConfidence = Math.max(0.45, imageConfidence - 0.10);
  }

  if (lifestyleImpact.overallScore >= 80) {
    insights.push('✅ Excellent lifestyle habits support your skin health.');
    adjustedConfidence = Math.min(0.90, imageConfidence + 0.05);
  }

  if (lifestyleImpact.stressImpact.score < 40) insights.push('🔴 High stress causing inflammation and excess oil.');
  if (lifestyleImpact.hydrationImpact.score < 40) insights.push('💧 Dehydration affecting skin appearance.');
  if (lifestyleImpact.dietImpact.score < 40) insights.push('🍔 Poor diet contributing to inflammation.');
  if (lifestyleImpact.sleepImpact.score < 40) insights.push('😴 Sleep deprivation preventing skin repair.');

  return { adjustedSkinType: adjustedType, adjustedConfidence, lifestyleAdjusted, combinedInsights: insights };
}
