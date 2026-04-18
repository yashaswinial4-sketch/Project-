// ─────────────────────────────────────────────────────────────
// TASK 3: ACNE RISK PREDICTION ENGINE (BACKEND)
// ─────────────────────────────────────────────────────────────

// Comedogenic Ingredients Database
const comedogenicIngredients = {
  'coconut oil': { rating: 4, description: 'Highly comedogenic — clogs pores severely' },
  'cocoa butter': { rating: 4, description: 'Very pore-clogging, especially for oily skin' },
  'isopropyl myristate': { rating: 5, description: 'Extremely comedogenic — one of the worst offenders' },
  'isopropyl palmitate': { rating: 4, description: 'Highly comedogenic ester' },
  'lanolin': { rating: 2, description: 'Moderately comedogenic — can clog pores' },
  'mineral oil': { rating: 2, description: 'Can trap bacteria and sebum in pores' },
  'petrolatum': { rating: 1, description: 'Occlusive — may trap bacteria' },
  'butyl stearate': { rating: 4, description: 'Highly comedogenic fatty acid ester' },
  'myristyl myristate': { rating: 5, description: 'Extremely pore-clogging' },
  'oleic acid': { rating: 3, description: 'Moderately comedogenic fatty acid' },
  'fragrance': { rating: 2, description: 'Can cause irritation leading to breakouts' },
  'parfum': { rating: 2, description: 'Synthetic fragrance can trigger acne' },
  'sodium lauryl sulfate': { rating: 3, description: 'Harsh surfactant — strips skin, causes rebound oil' },
  'sulfates': { rating: 3, description: 'Can disrupt skin barrier, leading to breakouts' },
  'alcohol': { rating: 3, description: 'Drying alcohol causes rebound oil production' },
  'alcohol denat': { rating: 3, description: 'Denatured alcohol — very drying, triggers oil overproduction' },
  'dimethicone': { rating: 2, description: 'Heavy silicone — may clog pores for some' },
  'wheat germ oil': { rating: 5, description: 'Extremely comedogenic oil' },
  'laureth-4': { rating: 4, description: 'Highly comedogenic emulsifier' },
};

function scoreHabits(habits) {
  let score = 0;
  const triggers = [];

  const acneSeverityMap = { none: 0, mild: 10, moderate: 20, severe: 30 };
  score += acneSeverityMap[habits.currentAcne] || 0;

  if (habits.sleepHours < 5) {
    score += 15;
    triggers.push({ type: 'habit', name: 'Severe Sleep Deprivation', severity: 'high', description: `Only ${habits.sleepHours} hours of sleep — this dramatically increases cortisol and sebum production.`, suggestion: 'Aim for 7-8 hours. Sleep is when your skin repairs itself.' });
  } else if (habits.sleepHours < 7) {
    score += 8;
    triggers.push({ type: 'habit', name: 'Insufficient Sleep', severity: 'medium', description: `${habits.sleepHours} hours is below the recommended 7-8 hours for skin health.`, suggestion: 'Try to get at least 7 hours of quality sleep.' });
  }

  if (habits.waterIntake < 4) {
    score += 12;
    triggers.push({ type: 'habit', name: 'Severe Dehydration', severity: 'high', description: `Only ${habits.waterIntake} glasses of water — dehydrated skin overproduces oil to compensate.`, suggestion: 'Drink at least 8 glasses of water daily for optimal skin health.' });
  } else if (habits.waterIntake < 6) {
    score += 6;
    triggers.push({ type: 'habit', name: 'Low Water Intake', severity: 'medium', description: `${habits.waterIntake} glasses is below the recommended 8 glasses.`, suggestion: 'Increase water intake to at least 8 glasses per day.' });
  }

  const dietRiskMap = {
    'high-sugar': { score: 15, name: 'High Sugar Diet', desc: 'High sugar intake spikes insulin, which increases sebum production and inflammation.', suggestion: 'Reduce refined sugars and switch to complex carbs.' },
    'high-dairy': { score: 12, name: 'High Dairy Intake', desc: 'Dairy contains hormones that can trigger acne, especially skim milk.', suggestion: 'Reduce dairy intake, especially skim milk. Try plant-based alternatives.' },
    'junk-food': { score: 18, name: 'Junk Food Diet', desc: 'Processed foods cause inflammation and hormonal imbalance — major acne triggers.', suggestion: 'Switch to whole foods, fruits, vegetables, and lean proteins.' },
    'balanced': { score: 0 },
    'healthy': { score: 0 },
  };
  const dietRisk = dietRiskMap[habits.dietType];
  if (dietRisk && dietRisk.score > 0) {
    score += dietRisk.score;
    triggers.push({ type: 'habit', name: dietRisk.name, severity: dietRisk.score > 14 ? 'high' : 'medium', description: dietRisk.desc, suggestion: dietRisk.suggestion });
  }

  const stressMap = {
    'low': { score: 0 },
    'moderate': { score: 8, name: 'Moderate Stress', desc: 'Moderate stress elevates cortisol, which can increase oil production.', suggestion: 'Practice stress management: meditation, exercise, or hobbies.' },
    'high': { score: 15, name: 'High Stress', desc: 'High stress significantly increases cortisol and androgen levels — major acne triggers.', suggestion: 'Prioritize stress reduction: yoga, meditation, therapy, or regular exercise.' },
    'extreme': { score: 22, name: 'Extreme Stress', desc: 'Extreme stress causes hormonal chaos — one of the biggest acne triggers.', suggestion: 'Seek professional help for stress management. Your skin will thank you.' },
  };
  const stressRisk = stressMap[habits.stressLevel];
  if (stressRisk.score > 0) {
    score += stressRisk.score;
    triggers.push({ type: 'habit', name: stressRisk.name, severity: stressRisk.score > 14 ? 'high' : 'medium', description: stressRisk.desc, suggestion: stressRisk.suggestion });
  }

  if (habits.exerciseFrequency === 'none') {
    score += 8;
    triggers.push({ type: 'habit', name: 'No Exercise', severity: 'medium', description: 'Lack of exercise reduces blood circulation and stress management — both affect skin health.', suggestion: 'Start with 20-30 minutes of moderate exercise 3-4 times per week.' });
  }

  if (habits.faceWashFrequency === 'rarely') {
    score += 18;
    triggers.push({ type: 'habit', name: 'Rarely Washing Face', severity: 'high', description: 'Not washing your face regularly allows oil, dirt, and bacteria to accumulate — direct cause of acne.', suggestion: 'Wash your face twice daily with a gentle cleanser suitable for your skin type.' });
  } else if (habits.faceWashFrequency === 'once') {
    score += 5;
    triggers.push({ type: 'habit', name: 'Washing Face Only Once', severity: 'low', description: 'Washing only once a day may not be enough to remove accumulated oil and dirt.', suggestion: 'Wash your face twice daily — morning and night.' });
  } else if (habits.faceWashFrequency === 'thrice') {
    score += 5;
    triggers.push({ type: 'habit', name: 'Over-washing Face', severity: 'low', description: 'Washing 3+ times a day can strip natural oils, causing rebound oil production.', suggestion: 'Limit face washing to twice daily. Over-washing can worsen acne.' });
  }

  if (habits.makeupRemoval === 'never') {
    score += 20;
    triggers.push({ type: 'habit', name: 'Never Removing Makeup', severity: 'high', description: 'Sleeping with makeup is one of the #1 causes of acne. It clogs pores all night.', suggestion: 'Always remove makeup before bed. Use a gentle micellar water or cleansing oil.' });
  } else if (habits.makeupRemoval === 'sometimes') {
    score += 10;
    triggers.push({ type: 'habit', name: 'Inconsistent Makeup Removal', severity: 'medium', description: 'Sometimes sleeping with makeup still clogs pores and causes breakouts.', suggestion: 'Make makeup removal a non-negotiable nightly habit.' });
  }

  if (habits.pillowcaseChange === 'rarely') {
    score += 14;
    triggers.push({ type: 'habit', name: 'Rarely Changing Pillowcase', severity: 'high', description: 'Dirty pillowcases harbor bacteria, oil, and dead skin — pressing them against your face nightly.', suggestion: 'Change pillowcases at least twice a week, or use a clean towel over it.' });
  } else if (habits.pillowcaseChange === 'monthly') {
    score += 8;
    triggers.push({ type: 'habit', name: 'Infrequent Pillowcase Changes', severity: 'medium', description: 'Monthly changes allow bacteria and oil buildup that transfers to your skin.', suggestion: 'Change pillowcases at least weekly for clearer skin.' });
  }

  if (habits.sunscreenUse === 'never') {
    score += 10;
    triggers.push({ type: 'habit', name: 'No Sunscreen Use', severity: 'medium', description: 'UV damage causes inflammation and post-acne hyperpigmentation, making acne marks worse.', suggestion: 'Use SPF 30+ daily. Look for non-comedogenic sunscreens.' });
  } else if (habits.sunscreenUse === 'sometimes') {
    score += 4;
    triggers.push({ type: 'habit', name: 'Inconsistent Sunscreen Use', severity: 'low', description: 'Inconsistent sun protection allows UV damage that worsens acne scarring.', suggestion: 'Make sunscreen a daily habit, even on cloudy days.' });
  }

  if (habits.touchingFace === 'often') {
    score += 14;
    triggers.push({ type: 'habit', name: 'Frequently Touching Face', severity: 'high', description: 'Hands carry thousands of bacteria. Touching your face transfers them directly to pores.', suggestion: 'Be mindful of face-touching. Keep hands away from your face as much as possible.' });
  } else if (habits.touchingFace === 'sometimes') {
    score += 5;
    triggers.push({ type: 'habit', name: 'Sometimes Touching Face', severity: 'low', description: 'Even occasional face touching can transfer bacteria to pores.', suggestion: 'Try to minimize face touching throughout the day.' });
  }

  const breakoutMap = { none: 0, few: 5, moderate: 12, many: 20 };
  score += breakoutMap[habits.currentBreakouts] || 0;

  return { score: Math.min(score, 100), triggers };
}

function scoreProducts(products) {
  let score = 0;
  const triggers = [];
  const riskyProducts = [];
  const safeProducts = [];

  for (const product of products) {
    const ingredients = (product.ingredients || '').split(',').map(i => i.trim().toLowerCase()).filter(Boolean);
    const productTriggers = [];

    for (const ing of ingredients) {
      for (const [key, data] of Object.entries(comedogenicIngredients)) {
        if (ing.includes(key) || key.includes(ing)) {
          score += data.rating * 4;
          productTriggers.push(`${key} (rating: ${data.rating}/5)`);
          triggers.push({ type: 'ingredient', name: `${key} in ${product.name}`, severity: data.rating >= 4 ? 'high' : data.rating >= 3 ? 'medium' : 'low', description: data.description, suggestion: `Replace ${product.name} with a non-comedogenic alternative.` });
        }
      }
    }

    if (productTriggers.length > 0) {
      riskyProducts.push({ name: product.name, triggers: productTriggers });
    } else {
      safeProducts.push(product.name);
    }
  }

  return { score: Math.min(score, 100), triggers, riskyProducts, safeProducts };
}

function scoreRoutine(products, skinType) {
  let score = 0;
  const triggers = [];
  const changes = [];
  const types = products.map(p => p.type);

  if (!types.includes('cleanser')) {
    score += 15;
    triggers.push({ type: 'routine', name: 'No Cleanser', severity: 'high', description: 'Without a cleanser, oil, dirt, and bacteria accumulate on your skin — a direct cause of acne.', suggestion: 'Add a gentle cleanser suitable for your skin type to your routine.' });
    changes.push('Add a gentle cleanser to your daily routine');
  }
  if (!types.includes('moisturizer')) {
    score += 10;
    triggers.push({ type: 'routine', name: 'No Moisturizer', severity: 'medium', description: 'Skipping moisturizer can cause your skin to overproduce oil to compensate, leading to breakouts.', suggestion: 'Add a lightweight, non-comedogenic moisturizer.' });
    changes.push('Add a non-comedogenic moisturizer to prevent rebound oil');
  }
  if (!types.includes('sunscreen')) {
    score += 12;
    triggers.push({ type: 'routine', name: 'No Sunscreen', severity: 'high', description: 'UV exposure causes inflammation, worsens acne marks, and damages the skin barrier.', suggestion: 'Use SPF 30+ daily. Choose a non-comedogenic, oil-free sunscreen.' });
    changes.push('Add SPF 30+ sunscreen to protect against UV-induced inflammation');
  }

  const activeCount = products.filter(p => ['serum', 'toner'].includes(p.type)).length;
  if (activeCount > 3) {
    score += 12;
    triggers.push({ type: 'routine', name: 'Too Many Active Products', severity: 'high', description: `Using ${activeCount} serums/toners can overwhelm your skin and cause breakouts.`, suggestion: 'Limit to 1-2 active products. Less is more for acne-prone skin.' });
    changes.push('Reduce active products to 1-2 maximum');
  }

  const exfoliantKeywords = ['salicylic acid', 'glycolic acid', 'lactic acid', 'aha', 'bha', 'exfoliat'];
  const exfoliantProducts = products.filter(p => exfoliantKeywords.some(k => (p.ingredients || '').toLowerCase().includes(k)));
  if (exfoliantProducts.length > 2) {
    score += 15;
    triggers.push({ type: 'routine', name: 'Over-Exfoliation', severity: 'high', description: `${exfoliantProducts.length} products contain exfoliating ingredients. Over-exfoliation destroys the skin barrier and causes breakouts.`, suggestion: 'Use only ONE exfoliating product, 2-3 times per week maximum.' });
    changes.push('Limit exfoliation to ONE product, 2-3 times per week');
  }

  if (skinType === 'oily' && products.some(p => {
    const ings = (p.ingredients || '').toLowerCase();
    return ings.includes('coconut oil') || ings.includes('cocoa butter') || ings.includes('mineral oil');
  })) {
    score += 10;
    triggers.push({ type: 'product', name: 'Heavy Oils on Oily Skin', severity: 'high', description: 'Using heavy oils on oily skin is a guaranteed acne trigger.', suggestion: 'Switch to lightweight, oil-free, non-comedogenic products.' });
    changes.push('Replace heavy oils with lightweight, oil-free alternatives');
  }

  return { score: Math.min(score, 100), triggers, changes };
}

function generateTips(habits, skinType) {
  const tips = [];
  tips.push({ icon: '💧', title: 'Hydrate Inside & Out', description: 'Drink 8+ glasses of water daily and use a hydrating moisturizer. Dehydrated skin overproduces oil.', priority: 'high' });
  tips.push({ icon: '🧼', title: 'Double Cleanse at Night', description: 'Use an oil-based cleanser first to remove sunscreen/makeup, then a water-based cleanser for deep cleaning.', priority: 'high' });
  tips.push({ icon: '☀️', title: 'Never Skip Sunscreen', description: 'UV rays worsen acne marks and cause inflammation. Use SPF 30+ daily, even indoors.', priority: 'high' });

  if (habits.stressLevel === 'high' || habits.stressLevel === 'extreme') {
    tips.push({ icon: '🧘', title: 'Manage Stress', description: 'High cortisol = more oil = more acne. Try meditation, deep breathing, or regular exercise.', priority: 'high' });
  }
  if (habits.sleepHours < 7) {
    tips.push({ icon: '😴', title: 'Prioritize Sleep', description: 'Your skin repairs itself during sleep. Aim for 7-8 hours for clearer skin.', priority: 'high' });
  }
  if (habits.dietType === 'high-sugar' || habits.dietType === 'junk-food') {
    tips.push({ icon: '🥗', title: 'Clean Up Your Diet', description: 'Reduce sugar and processed foods. Eat more zinc-rich foods (nuts, seeds), omega-3s (fish), and antioxidants.', priority: 'high' });
  }
  if (habits.dietType === 'high-dairy') {
    tips.push({ icon: '🥛', title: 'Reduce Dairy Intake', description: 'Dairy hormones can trigger acne. Try almond milk, oat milk, or coconut milk alternatives.', priority: 'medium' });
  }
  if (habits.touchingFace === 'often' || habits.touchingFace === 'sometimes') {
    tips.push({ icon: '🤚', title: 'Stop Touching Your Face', description: 'Your hands carry bacteria. Keep them away from your face to prevent transferring germs to pores.', priority: 'medium' });
  }
  if (habits.pillowcaseChange === 'rarely' || habits.pillowcaseChange === 'monthly') {
    tips.push({ icon: '🛏️', title: 'Change Pillowcases Regularly', description: 'Change pillowcases 2x/week. Bacteria and oil buildup is a hidden acne cause.', priority: 'medium' });
  }
  if (habits.makeupRemoval === 'sometimes' || habits.makeupRemoval === 'never') {
    tips.push({ icon: '🧴', title: 'Always Remove Makeup', description: 'Sleeping with makeup is the #1 cause of overnight breakouts. Use micellar water or cleansing oil.', priority: 'high' });
  }
  if (skinType === 'oily') {
    tips.push({ icon: '🫧', title: 'Use Oil-Free Products', description: 'Choose "non-comedogenic" and "oil-free" labeled products. Gel moisturizers work best for oily skin.', priority: 'medium' });
  }
  if (skinType === 'sensitive') {
    tips.push({ icon: '🌿', title: 'Go Fragrance-Free', description: 'Fragrance is a major irritant for sensitive skin. Choose products labeled "fragrance-free".', priority: 'high' });
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  tips.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  return tips.slice(0, 8);
}

// MAIN EXPORTED FUNCTION
function predictAcneRisk(habits, products, skinType) {
  const habitResult = scoreHabits(habits);
  const productResult = scoreProducts(products);
  const routineResult = scoreRoutine(products, skinType);

  let skinTypeScore = 0;
  if (skinType === 'oily') skinTypeScore = 15;
  else if (skinType === 'combination') skinTypeScore = 8;
  else if (skinType === 'sensitive') skinTypeScore = 10;
  else if (skinType === 'dry') skinTypeScore = 3;

  const totalScore = Math.min(100, Math.round(
    habitResult.score * 0.35 +
    productResult.score * 0.30 +
    routineResult.score * 0.25 +
    skinTypeScore * 0.10
  ));

  let riskLevel;
  if (totalScore >= 70) riskLevel = 'severe';
  else if (totalScore >= 50) riskLevel = 'high';
  else if (totalScore >= 30) riskLevel = 'moderate';
  else riskLevel = 'low';

  const allTriggers = [...habitResult.triggers, ...productResult.triggers, ...routineResult.triggers];
  const tips = generateTips(habits, skinType);

  let summary;
  if (riskLevel === 'low') {
    summary = "🟢 Your acne risk is LOW. Your habits and products are generally skin-friendly. Keep up the good routine!";
  } else if (riskLevel === 'moderate') {
    summary = "🟡 Your acne risk is MODERATE. A few habits and product choices could be improved to prevent breakouts.";
  } else if (riskLevel === 'high') {
    summary = "🟠 Your acne risk is HIGH. Several factors in your routine and habits are likely contributing to breakouts.";
  } else {
    summary = "🔴 Your acne risk is SEVERE. Multiple high-risk factors detected. Immediate changes to your routine are strongly recommended.";
  }

  return {
    riskLevel,
    riskScore: totalScore,
    breakdown: {
      ingredientScore: productResult.score,
      habitScore: habitResult.score,
      productScore: productResult.score,
      routineScore: routineResult.score,
      skinTypeScore,
    },
    triggers: allTriggers,
    safeProducts: productResult.safeProducts,
    riskyProducts: productResult.riskyProducts,
    tips,
    summary,
    routineChanges: routineResult.changes,
  };
}

export { predictAcneRisk };
