// ─────────────────────────────────────────────────────────────
// ACNE RISK PREDICTION ENGINE (IMPROVED v2)
// Multi-dimensional scoring with weighted factors
// ─────────────────────────────────────────────────────────────

import type {
  AcneHabits, AcneRiskResult, AcneTrigger, AcneTip,
  Product, SkinType,
} from '../types';

// ── Comedogenic Ingredients Database (ENHANCED — 35+ ingredients) ──
const comedogenicIngredients: Record<string, { rating: number; description: string; category: string }> = {
  'coconut oil': { rating: 5, description: 'Extremely comedogenic — one of the most pore-clogging oils available', category: 'oil' },
  'cocoa butter': { rating: 4, description: 'Very pore-clogging, especially for oily and acne-prone skin', category: 'oil' },
  'isopropyl myristate': { rating: 5, description: 'Extremely comedogenic — one of the worst pore-clogging ingredients', category: 'ester' },
  'isopropyl palmitate': { rating: 4, description: 'Highly comedogenic ester used as emollient', category: 'ester' },
  'isopropyl isostearate': { rating: 4, description: 'Highly comedogenic fatty acid ester', category: 'ester' },
  'lanolin': { rating: 3, description: 'Moderately comedogenic — can clog pores in acne-prone skin', category: 'wax' },
  'acetylated lanolin': { rating: 3, description: 'Modified lanolin — still comedogenic', category: 'wax' },
  'mineral oil': { rating: 2, description: 'Can trap bacteria and sebum in pores, especially in heavy formulations', category: 'occlusive' },
  'petrolatum': { rating: 1, description: 'Occlusive — may trap bacteria if skin is not clean underneath', category: 'occlusive' },
  'petroleum': { rating: 1, description: 'Occlusive — can trap sebum and bacteria', category: 'occlusive' },
  'butyl stearate': { rating: 4, description: 'Highly comedogenic fatty acid ester', category: 'ester' },
  'myristyl myristate': { rating: 5, description: 'Extremely pore-clogging — avoid if acne-prone', category: 'ester' },
  'oleic acid': { rating: 3, description: 'Moderately comedogenic fatty acid found in many oils', category: 'fatty acid' },
  'linoleic acid': { rating: 1, description: 'Generally safe and beneficial for acne-prone skin', category: 'fatty acid' },
  'algae extract': { rating: 3, description: 'Can trigger breakouts in acne-prone and sensitive skin', category: 'botanical' },
  'carrageenan': { rating: 3, description: 'May cause inflammation and breakouts', category: 'botanical' },
  'red algae': { rating: 3, description: 'Can be comedogenic for acne-prone skin', category: 'botanical' },
  'seaweed extract': { rating: 3, description: 'May trigger acne in some skin types', category: 'botanical' },
  'fragrance': { rating: 2, description: 'Can cause irritation leading to inflammatory breakouts', category: 'additive' },
  'parfum': { rating: 2, description: 'Synthetic fragrance — common irritant that triggers acne', category: 'additive' },
  'sodium lauryl sulfate': { rating: 3, description: 'Harsh surfactant — strips skin barrier, causes rebound oil production', category: 'surfactant' },
  'sodium laureth sulfate': { rating: 2, description: 'Milder than SLS but can still disrupt skin barrier', category: 'surfactant' },
  'sulfates': { rating: 3, description: 'Can disrupt skin barrier, leading to breakouts and irritation', category: 'surfactant' },
  'alcohol': { rating: 3, description: 'Drying alcohol causes rebound oil production and barrier damage', category: 'solvent' },
  'alcohol denat': { rating: 3, description: 'Denatured alcohol — very drying, triggers oil overproduction', category: 'solvent' },
  'silicone': { rating: 2, description: 'Can trap sebum and bacteria under the skin surface', category: 'occlusive' },
  'dimethicone': { rating: 2, description: 'Heavy silicone — may clog pores for acne-prone individuals', category: 'occlusive' },
  'wheat germ oil': { rating: 5, description: 'Extremely comedogenic — one of the worst oils for acne', category: 'oil' },
  'flaxseed oil': { rating: 3, description: 'Moderately comedogenic', category: 'oil' },
  'corn oil': { rating: 3, description: 'Can clog pores in acne-prone skin', category: 'oil' },
  'soybean oil': { rating: 3, description: 'Moderately comedogenic oil', category: 'oil' },
  'laureth-4': { rating: 4, description: 'Highly comedogenic emulsifier', category: 'emulsifier' },
  'olive oil': { rating: 2, description: 'Contains oleic acid which can be comedogenic for some', category: 'oil' },
  'palm oil': { rating: 3, description: 'Moderately comedogenic', category: 'oil' },
  'ethylhexyl palmitate': { rating: 4, description: 'Highly comedogenic ester', category: 'ester' },
};

// ── Acne-Triggering Active Ingredients ──
const acneTriggeringActives: Record<string, { condition: string; description: string; severity: number }> = {
  'retinol': { condition: 'overuse', description: 'Overusing retinol causes purging, irritation breakouts, and barrier damage', severity: 8 },
  'glycolic acid': { condition: 'overuse', description: 'Over-exfoliation with AHA damages barrier, causes inflammatory breakouts', severity: 7 },
  'salicylic acid': { condition: 'overuse', description: 'Overuse over-dries skin, triggering rebound oil and acne', severity: 6 },
  'benzoyl peroxide': { condition: 'overuse', description: 'Overuse causes severe dryness, peeling, and irritation breakouts', severity: 7 },
  'physical scrub': { condition: 'sensitive', description: 'Physical scrubs cause micro-tears, leading to bacterial infection and acne', severity: 8 },
  'walnut shell': { condition: 'sensitive', description: 'Harsh physical exfoliant — causes micro-tears and bacterial acne', severity: 9 },
  'apricot kernel': { condition: 'sensitive', description: 'Harsh physical exfoliant — causes micro-tears and breakouts', severity: 9 },
  'sugar scrub': { condition: 'sensitive', description: 'Physical sugar scrubs can cause micro-tears on facial skin', severity: 6 },
};

// ── Habit Risk Scoring (IMPROVED with granular scoring) ──
function scoreHabits(habits: AcneHabits): { score: number; triggers: AcneTrigger[]; categoryScores: Record<string, number> } {
  let score = 0;
  const triggers: AcneTrigger[] = [];
  const categoryScores: Record<string, number> = {
    sleep: 0, hydration: 0, diet: 0, stress: 0, hygiene: 0, lifestyle: 0
  };

  // ── Sleep (max 20 points) ──
  if (habits.sleepHours < 4) {
    score += 20; categoryScores.sleep = 20;
    triggers.push({ type: 'habit', name: 'Critical Sleep Deprivation', severity: 'high', description: `Only ${habits.sleepHours} hours — cortisol is 45% higher, dramatically increasing sebum production and inflammation.`, suggestion: 'Aim for 7-8 hours minimum. Sleep is when your skin repairs and regenerates.' });
  } else if (habits.sleepHours < 6) {
    score += 14; categoryScores.sleep = 14;
    triggers.push({ type: 'habit', name: 'Severe Sleep Deficit', severity: 'high', description: `${habits.sleepHours} hours is critically low. Your skin cannot repair itself adequately.`, suggestion: 'Gradually increase to 7+ hours. Even 1 extra hour makes a difference.' });
  } else if (habits.sleepHours < 7) {
    score += 8; categoryScores.sleep = 8;
    triggers.push({ type: 'habit', name: 'Insufficient Sleep', severity: 'medium', description: `${habits.sleepHours} hours is below the 7-8 hours needed for optimal skin health.`, suggestion: 'Try to get at least 7 hours of quality sleep.' });
  } else if (habits.sleepHours > 10) {
    score += 3; categoryScores.sleep = 3;
    triggers.push({ type: 'habit', name: 'Excessive Sleep', severity: 'low', description: 'Oversleeping can indicate underlying health issues that may affect skin.', suggestion: 'Aim for 7-9 hours. Consistent sleep schedule matters more than duration.' });
  }

  // ── Hydration (max 15 points) ──
  if (habits.waterIntake < 3) {
    score += 15; categoryScores.hydration = 15;
    triggers.push({ type: 'habit', name: 'Critical Dehydration', severity: 'high', description: `Only ${habits.waterIntake} glasses — severely dehydrated skin overproduces oil and cannot flush toxins.`, suggestion: 'Drink at least 8 glasses daily. Start your day with a full glass of water.' });
  } else if (habits.waterIntake < 5) {
    score += 10; categoryScores.hydration = 10;
    triggers.push({ type: 'habit', name: 'Severe Dehydration', severity: 'high', description: `${habits.waterIntake} glasses is far below the recommended 8. Dehydrated skin compensates with excess oil.`, suggestion: 'Increase to 8+ glasses. Set reminders on your phone.' });
  } else if (habits.waterIntake < 7) {
    score += 5; categoryScores.hydration = 5;
    triggers.push({ type: 'habit', name: 'Low Water Intake', severity: 'medium', description: `${habits.waterIntake} glasses is below the recommended 8 glasses.`, suggestion: 'Increase water intake to at least 8 glasses per day.' });
  }

  // ── Diet (max 20 points) ──
  const dietRiskMap: Record<string, { score: number; name: string; desc: string; suggestion: string }> = {
    'high-sugar': { score: 16, name: 'High Sugar Diet', desc: 'High sugar spikes insulin → IGF-1 increases → sebum production surges → acne. Sugar also causes glycation that ages skin.', suggestion: 'Reduce refined sugars. Switch to fruits for sweetness. Avoid sugary drinks.' },
    'high-dairy': { score: 12, name: 'High Dairy Intake', desc: 'Dairy contains IGF-1 and hormones (especially skim milk) that trigger acne. Whey protein is particularly problematic.', suggestion: 'Reduce dairy, especially skim milk. Try almond, oat, or coconut milk alternatives.' },
    'junk-food': { score: 20, name: 'Junk Food Diet', desc: 'Processed foods cause systemic inflammation, hormonal imbalance, and nutrient deficiencies — the perfect storm for acne.', suggestion: 'Switch to whole foods. Eat zinc-rich foods (nuts, seeds), omega-3s (fish), and colorful vegetables.' },
    'balanced': { score: 0, name: '', desc: '', suggestion: '' },
    'healthy': { score: 0, name: '', desc: '', suggestion: '' },
  };
  const dietRisk = dietRiskMap[habits.dietType];
  if (dietRisk && dietRisk.score > 0) {
    score += dietRisk.score; categoryScores.diet = dietRisk.score;
    triggers.push({ type: 'habit', name: dietRisk.name, severity: dietRisk.score > 14 ? 'high' : 'medium', description: dietRisk.desc, suggestion: dietRisk.suggestion });
  }

  // ── Stress (max 20 points) ──
  const stressMap: Record<string, { score: number; name: string; desc: string; suggestion: string }> = {
    'low': { score: 0, name: '', desc: '', suggestion: '' },
    'moderate': { score: 8, name: 'Moderate Stress', desc: 'Moderate stress elevates cortisol, which increases sebum production and slows skin healing.', suggestion: 'Practice stress management: meditation, exercise, or hobbies.' },
    'high': { score: 15, name: 'High Stress', desc: 'High stress significantly increases cortisol and androgen levels — two of the biggest acne triggers.', suggestion: 'Prioritize stress reduction: yoga, meditation, therapy, or regular exercise.' },
    'extreme': { score: 20, name: 'Extreme Stress', desc: 'Extreme stress causes hormonal chaos — elevated cortisol, disrupted sleep, poor diet choices. This is a major acne driver.', suggestion: 'Seek professional help for stress management. Your skin health depends on it.' },
  };
  const stressRisk = stressMap[habits.stressLevel];
  if (stressRisk.score > 0) {
    score += stressRisk.score; categoryScores.stress = stressRisk.score;
    triggers.push({ type: 'habit', name: stressRisk.name, severity: stressRisk.score > 14 ? 'high' : 'medium', description: stressRisk.desc, suggestion: stressRisk.suggestion });
  }

  // ── Exercise (max 8 points) ──
  if (habits.exerciseFrequency === 'none') {
    score += 8; categoryScores.lifestyle = (categoryScores.lifestyle || 0) + 8;
    triggers.push({ type: 'habit', name: 'No Exercise', severity: 'medium', description: 'Lack of exercise reduces blood circulation, stress management, and hormone regulation — all affect skin health.', suggestion: 'Start with 20-30 minutes of moderate exercise 3-4 times per week.' });
  }

  // ── Face Wash Frequency (max 18 points) ──
  if (habits.faceWashFrequency === 'rarely') {
    score += 18; categoryScores.hygiene = 18;
    triggers.push({ type: 'habit', name: 'Rarely Washing Face', severity: 'high', description: 'Not washing your face allows oil, dirt, dead skin cells, and bacteria to accumulate — the #1 direct cause of acne.', suggestion: 'Wash your face twice daily with a gentle cleanser suitable for your skin type.' });
  } else if (habits.faceWashFrequency === 'once') {
    score += 6; categoryScores.hygiene = 6;
    triggers.push({ type: 'habit', name: 'Washing Face Only Once', severity: 'low', description: 'Washing only once may not remove accumulated oil, sweat, and environmental pollutants.', suggestion: 'Wash your face twice daily — morning and night.' });
  } else if (habits.faceWashFrequency === 'thrice') {
    score += 6; categoryScores.hygiene = 6;
    triggers.push({ type: 'habit', name: 'Over-washing Face', severity: 'low', description: 'Washing 3+ times strips natural oils, causing rebound oil production and barrier damage.', suggestion: 'Limit face washing to twice daily. Over-washing can worsen acne.' });
  }

  // ── Makeup Removal (max 20 points) ──
  if (habits.makeupRemoval === 'never') {
    score += 20; categoryScores.hygiene = Math.max(categoryScores.hygiene, 20);
    triggers.push({ type: 'habit', name: 'Never Removing Makeup', severity: 'high', description: 'Sleeping with makeup clogs pores for 6-8 hours nightly. This is one of the #1 causes of persistent acne.', suggestion: 'Always remove makeup before bed. Use micellar water or cleansing oil as first step.' });
  } else if (habits.makeupRemoval === 'sometimes') {
    score += 10; categoryScores.hygiene = Math.max(categoryScores.hygiene, 10);
    triggers.push({ type: 'habit', name: 'Inconsistent Makeup Removal', severity: 'medium', description: 'Even occasional nights with makeup clogs pores and causes breakouts the next day.', suggestion: 'Make makeup removal a non-negotiable nightly habit.' });
  }

  // ── Pillowcase Change (max 14 points) ──
  if (habits.pillowcaseChange === 'rarely') {
    score += 14; categoryScores.hygiene = Math.max(categoryScores.hygiene, 14);
    triggers.push({ type: 'habit', name: 'Rarely Changing Pillowcase', severity: 'high', description: 'Dirty pillowcases harbor bacteria, oil, dead skin, and detergent residue — pressing them against your face for hours nightly.', suggestion: 'Change pillowcases at least twice a week.' });
  } else if (habits.pillowcaseChange === 'monthly') {
    score += 8; categoryScores.hygiene = Math.max(categoryScores.hygiene, 8);
    triggers.push({ type: 'habit', name: 'Infrequent Pillowcase Changes', severity: 'medium', description: 'Monthly changes allow significant bacteria and oil buildup.', suggestion: 'Change pillowcases at least weekly for clearer skin.' });
  }

  // ── Sunscreen Use (max 10 points) ──
  if (habits.sunscreenUse === 'never') {
    score += 10; categoryScores.lifestyle = (categoryScores.lifestyle || 0) + 10;
    triggers.push({ type: 'habit', name: 'No Sunscreen Use', severity: 'medium', description: 'UV damage causes inflammation, worsens acne marks (PIH), and damages the skin barrier.', suggestion: 'Use SPF 30+ daily. Look for non-comedogenic, oil-free sunscreens.' });
  } else if (habits.sunscreenUse === 'sometimes') {
    score += 4; categoryScores.lifestyle = (categoryScores.lifestyle || 0) + 4;
    triggers.push({ type: 'habit', name: 'Inconsistent Sunscreen Use', severity: 'low', description: 'Inconsistent sun protection allows UV damage that worsens acne scarring and hyperpigmentation.', suggestion: 'Make sunscreen a daily habit, even on cloudy days and indoors.' });
  }

  // ── Touching Face (max 14 points) ──
  if (habits.touchingFace === 'often') {
    score += 14; categoryScores.hygiene = Math.max(categoryScores.hygiene, 14);
    triggers.push({ type: 'habit', name: 'Frequently Touching Face', severity: 'high', description: 'Hands carry thousands of bacteria. Touching your face transfers them directly to pores, causing bacterial acne.', suggestion: 'Be mindful of face-touching. Keep hands away from your face.' });
  } else if (habits.touchingFace === 'sometimes') {
    score += 5; categoryScores.hygiene = Math.max(categoryScores.hygiene, 5);
    triggers.push({ type: 'habit', name: 'Sometimes Touching Face', severity: 'low', description: 'Even occasional face touching transfers bacteria to pores.', suggestion: 'Try to minimize face touching throughout the day.' });
  }

  // ── Current Breakouts (baseline indicator) ──
  const breakoutMap: Record<string, number> = { none: 0, few: 5, moderate: 12, many: 20 };
  score += breakoutMap[habits.currentBreakouts] || 0;

  return { score: Math.min(score, 100), triggers, categoryScores };
}

// ── Product Acne Risk Scoring (IMPROVED) ──
function scoreProducts(products: Product[]): { score: number; triggers: AcneTrigger[]; riskyProducts: { name: string; triggers: string[] }[]; safeProducts: string[] } {
  let score = 0;
  const triggers: AcneTrigger[] = [];
  const riskyProducts: { name: string; triggers: string[] }[] = [];
  const safeProducts: string[] = [];

  for (const product of products) {
    const ingredients = product.ingredients.split(',').map(i => i.trim().toLowerCase()).filter(Boolean);
    const productTriggers: string[] = [];
    let productScore = 0;

    for (const ing of ingredients) {
      // Check comedogenic ingredients
      for (const [key, data] of Object.entries(comedogenicIngredients)) {
        if (ing.includes(key) || key.includes(ing)) {
          productScore += data.rating * 5;
          productTriggers.push(`${key} (comedogenic: ${data.rating}/5)`);
          triggers.push({
            type: 'ingredient', name: `${key} in ${product.name}`,
            severity: data.rating >= 4 ? 'high' : data.rating >= 3 ? 'medium' : 'low',
            description: data.description,
            suggestion: `Replace ${product.name} with a non-comedogenic alternative.`
          });
        }
      }

      // Check acne-triggering actives
      for (const [key, data] of Object.entries(acneTriggeringActives)) {
        if (ing.includes(key) || key.includes(ing)) {
          productScore += data.severity;
          productTriggers.push(`${key} (${data.condition})`);
          triggers.push({
            type: 'ingredient', name: `${key} in ${product.name}`,
            severity: data.severity >= 7 ? 'high' : 'medium',
            description: data.description,
            suggestion: `Use ${key} sparingly and monitor your skin's reaction.`
          });
        }
      }
    }

    score += productScore;

    if (productTriggers.length > 0) {
      riskyProducts.push({ name: product.name, triggers: productTriggers });
    } else {
      safeProducts.push(product.name);
    }
  }

  return { score: Math.min(score, 100), triggers, riskyProducts, safeProducts };
}

// ── Routine Gap Scoring (IMPROVED) ──
function scoreRoutine(products: Product[], skinType: SkinType | ''): { score: number; triggers: AcneTrigger[]; changes: string[] } {
  let score = 0;
  const triggers: AcneTrigger[] = [];
  const changes: string[] = [];
  const types = products.map(p => p.type);

  // Missing essential steps
  if (!types.includes('cleanser')) {
    score += 18;
    triggers.push({ type: 'routine', name: 'No Cleanser', severity: 'high', description: 'Without a cleanser, oil, dirt, bacteria, and dead skin cells accumulate — direct cause of acne.', suggestion: 'Add a gentle cleanser suitable for your skin type.' });
    changes.push('Add a gentle cleanser to your daily routine');
  }

  if (!types.includes('moisturizer')) {
    score += 12;
    triggers.push({ type: 'routine', name: 'No Moisturizer', severity: 'medium', description: 'Skipping moisturizer causes your skin to overproduce oil to compensate, leading to breakouts.', suggestion: 'Add a lightweight, non-comedogenic moisturizer.' });
    changes.push('Add a non-comedogenic moisturizer to prevent rebound oil');
  }

  if (!types.includes('sunscreen')) {
    score += 14;
    triggers.push({ type: 'routine', name: 'No Sunscreen', severity: 'high', description: 'UV exposure causes inflammation, worsens acne marks (PIH), and damages the skin barrier.', suggestion: 'Use SPF 30+ daily. Choose a non-comedogenic, oil-free sunscreen.' });
    changes.push('Add SPF 30+ sunscreen to protect against UV-induced inflammation');
  }

  // Too many actives
  const activeCount = products.filter(p => ['serum', 'toner'].includes(p.type)).length;
  if (activeCount > 3) {
    score += 14;
    triggers.push({ type: 'routine', name: 'Too Many Active Products', severity: 'high', description: `Using ${activeCount} serums/toners overwhelms your skin and causes breakouts.`, suggestion: 'Limit to 1-2 active products. Less is more for acne-prone skin.' });
    changes.push('Reduce active products to 1-2 maximum');
  }

  // Overlapping exfoliants
  const exfoliantKeywords = ['salicylic acid', 'glycolic acid', 'lactic acid', 'aha', 'bha', 'exfoliat', 'mandelic acid'];
  const exfoliantProducts = products.filter(p =>
    exfoliantKeywords.some(k => p.ingredients.toLowerCase().includes(k))
  );
  if (exfoliantProducts.length > 2) {
    score += 16;
    triggers.push({ type: 'routine', name: 'Over-Exfoliation', severity: 'high', description: `${exfoliantProducts.length} products contain exfoliating ingredients. Over-exfoliation destroys the skin barrier and causes inflammatory breakouts.`, suggestion: 'Use only ONE exfoliating product, 2-3 times per week maximum.' });
    changes.push('Limit exfoliation to ONE product, 2-3 times per week');
  }

  // Skin type mismatch for acne
  if (skinType === 'oily' && products.some(p => {
    const ings = p.ingredients.toLowerCase();
    return ings.includes('coconut oil') || ings.includes('cocoa butter') || ings.includes('mineral oil') || ings.includes('shea butter');
  })) {
    score += 12;
    triggers.push({ type: 'product', name: 'Heavy Oils on Oily Skin', severity: 'high', description: 'Using heavy oils on oily skin is a guaranteed acne trigger.', suggestion: 'Switch to lightweight, oil-free, non-comedogenic products.' });
    changes.push('Replace heavy oils with lightweight, oil-free alternatives');
  }

  if (skinType === 'sensitive' && products.some(p => {
    const ings = p.ingredients.toLowerCase();
    return ings.includes('fragrance') || ings.includes('parfum') || ings.includes('alcohol denat');
  })) {
    score += 14;
    triggers.push({ type: 'product', name: 'Irritants on Sensitive Skin', severity: 'high', description: 'Fragrance and alcohol on sensitive skin causes inflammation that leads to breakouts.', suggestion: 'Switch to fragrance-free, alcohol-free products.' });
    changes.push('Eliminate fragrance and alcohol from your routine');
  }

  // Missing acne-specific treatment if acne is a concern
  const hasAcneTreatment = products.some(p => {
    const ings = p.ingredients.toLowerCase();
    return ings.includes('salicylic acid') || ings.includes('benzoyl peroxide') || ings.includes('tea tree') || ings.includes('niacinamide') || ings.includes('azelaic acid');
  });
  if (!hasAcneTreatment && skinType === 'oily') {
    score += 5;
    triggers.push({ type: 'routine', name: 'No Acne-Fighting Ingredients', severity: 'low', description: 'Your routine lacks ingredients that specifically target acne-causing bacteria and excess oil.', suggestion: 'Consider adding a product with salicylic acid, niacinamide, or benzoyl peroxide.' });
    changes.push('Add an acne-fighting ingredient like salicylic acid or niacinamide');
  }

  return { score: Math.min(score, 100), triggers, changes };
}

// ── Generate Personalized Tips ──
function generateTips(habits: AcneHabits, skinType: SkinType | '', _triggers: AcneTrigger[]): AcneTip[] {
  const tips: AcneTip[] = [];

  // Always include these basics
  tips.push({ icon: '💧', title: 'Hydrate Inside & Out', description: 'Drink 8+ glasses of water daily and use a hydrating moisturizer. Dehydrated skin overproduces oil to compensate.', priority: 'high' });
  tips.push({ icon: '🧼', title: 'Double Cleanse at Night', description: 'Use an oil-based cleanser first to remove sunscreen/makeup, then a water-based cleanser for deep cleaning.', priority: 'high' });
  tips.push({ icon: '☀️', title: 'Never Skip Sunscreen', description: 'UV rays worsen acne marks and cause inflammation. Use SPF 30+ daily, even indoors.', priority: 'high' });

  // Habit-specific tips
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
  if (habits.waterIntake < 6) {
    tips.push({ icon: '🫗', title: 'Increase Water Intake', description: 'Dehydration causes your skin to overproduce oil. Aim for 8+ glasses daily.', priority: 'high' });
  }

  // Skin type specific
  if (skinType === 'oily') {
    tips.push({ icon: '🫧', title: 'Use Oil-Free Products', description: 'Choose "non-comedogenic" and "oil-free" labeled products. Gel moisturizers work best for oily skin.', priority: 'medium' });
  }
  if (skinType === 'sensitive') {
    tips.push({ icon: '🌿', title: 'Go Fragrance-Free', description: 'Fragrance is a major irritant for sensitive skin. Choose products labeled "fragrance-free" (not "unscented").', priority: 'high' });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  tips.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return tips.slice(0, 8);
}

// ── MAIN ACNE RISK PREDICTION FUNCTION ──
export function predictAcneRisk(
  habits: AcneHabits,
  products: Product[],
  skinType: SkinType | ''
): AcneRiskResult {
  // Step 1: Score habits
  const habitResult = scoreHabits(habits);

  // Step 2: Score products
  const productResult = scoreProducts(products);

  // Step 3: Score routine
  const routineResult = scoreRoutine(products, skinType);

  // Step 4: Calculate skin type predisposition
  let skinTypeScore = 0;
  if (skinType === 'oily') skinTypeScore = 15;
  else if (skinType === 'combination') skinTypeScore = 8;
  else if (skinType === 'sensitive') skinTypeScore = 10;
  else if (skinType === 'dry') skinTypeScore = 3;

  // Step 5: Combine scores (IMPROVED weighting)
  const totalScore = Math.min(100, Math.round(
    habitResult.score * 0.35 +
    productResult.score * 0.30 +
    routineResult.score * 0.25 +
    skinTypeScore * 0.10
  ));

  // Step 6: Determine risk level
  let riskLevel: AcneRiskResult['riskLevel'];
  if (totalScore >= 70) riskLevel = 'severe';
  else if (totalScore >= 50) riskLevel = 'high';
  else if (totalScore >= 30) riskLevel = 'moderate';
  else riskLevel = 'low';

  // Step 7: Combine all triggers
  const allTriggers = [...habitResult.triggers, ...productResult.triggers, ...routineResult.triggers];

  // Step 8: Generate tips
  const tips = generateTips(habits, skinType, allTriggers);

  // Step 9: Generate summary
  let summary = '';
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
