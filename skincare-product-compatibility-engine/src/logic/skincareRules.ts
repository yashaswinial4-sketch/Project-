// ─────────────────────────────────────────────────────────────
// CLIENT-SIDE SKINCARE RULES ENGINE (IMPROVED v2)
// ─────────────────────────────────────────────────────────────

import type {
  Product, AnalysisResult, Warning, Conflict, SkinTypeIssue,
  Recommendation, Alternative, SampleProduct,
} from '../types';

// ── Skin Type Rules (ENHANCED) ──
const skinTypeRules: Record<string, { avoid: string[]; prefer: string[]; description: string }> = {
  dry: {
    avoid: ['alcohol', 'alcohol denat', 'sd alcohol', 'denatured alcohol', 'salicylic acid', 'benzoyl peroxide', 'clay', 'charcoal', 'sulfates', 'sodium lauryl sulfate', 'witch hazel', 'retinol', 'glycolic acid', 'tea tree oil'],
    prefer: ['hyaluronic acid', 'ceramides', 'glycerin', 'squalane', 'shea butter', 'jojoba oil', 'vitamin e', 'aloe vera', 'niacinamide', 'panthenol', 'rosehip oil', 'snail mucin', 'oat extract', 'allantoin'],
    description: 'Dry skin lacks natural oils and moisture. Focus on hydration, ceramides, and gentle cleansing.'
  },
  oily: {
    avoid: ['mineral oil', 'coconut oil', 'cocoa butter', 'lanolin', 'petroleum', 'isopropyl myristate', 'isopropyl palmitate', 'heavy oils', 'silicone', 'dimethicone', 'shea butter', 'olive oil'],
    prefer: ['salicylic acid', 'niacinamide', 'hyaluronic acid', 'tea tree oil', 'zinc', 'glycolic acid', 'retinol', 'clay', 'charcoal', 'witch hazel', 'green tea'],
    description: 'Oily skin produces excess sebum. Focus on oil control, salicylic acid, and lightweight hydration.'
  },
  combination: {
    avoid: ['heavy oils', 'alcohol denat', 'sodium lauryl sulfate', 'mineral oil', 'cocoa butter', 'isopropyl myristate', 'coconut oil'],
    prefer: ['niacinamide', 'hyaluronic acid', 'glycerin', 'ceramides', 'aloe vera', 'green tea', 'vitamin e', 'squalane', 'centella asiatica', 'panthenol'],
    description: 'Combination skin has oily T-zone and dry cheeks. Use balanced, lightweight products.'
  },
  sensitive: {
    avoid: ['fragrance', 'parfum', 'alcohol', 'alcohol denat', 'retinol', 'glycolic acid', 'lactic acid', 'salicylic acid', 'benzoyl peroxide', 'essential oils', 'sodium lauryl sulfate', 'parabens', 'formaldehyde', 'dmdm hydantoin', 'witch hazel', 'tea tree oil', 'citric acid', 'menthol'],
    prefer: ['aloe vera', 'centella asiatica', 'ceramides', 'panthenol', 'oat extract', 'allantoin', 'niacinamide', 'hyaluronic acid', 'glycerin', 'squalane', 'chamomile', 'madecassoside', 'bisabolol'],
    description: 'Sensitive skin reacts easily. Use gentle, fragrance-free products and avoid strong actives.'
  }
};

// ── Ingredient Conflicts (ENHANCED — 22 rules) ──
const ingredientConflicts: { ingredient1: string; ingredient2: string; severity: 'low' | 'medium' | 'high'; reason: string; suggestion: string }[] = [
  { ingredient1: 'retinol', ingredient2: 'vitamin c', severity: 'high', reason: 'Retinol and Vitamin C have different pH requirements. Together they cause irritation and reduce effectiveness of both.', suggestion: 'Separate usage: Vitamin C in AM, Retinol in PM.' },
  { ingredient1: 'retinol', ingredient2: 'glycolic acid', severity: 'high', reason: 'Retinol + AHA causes excessive exfoliation, severe irritation, and skin barrier damage.', suggestion: 'Alternate nights: Retinol one night, AHA another. Never same day.' },
  { ingredient1: 'retinol', ingredient2: 'lactic acid', severity: 'high', reason: 'Retinol + Lactic Acid (AHA) causes excessive exfoliation, redness, and peeling.', suggestion: 'Alternate nights. Use AHA 2-3x/week max, Retinol on other nights.' },
  { ingredient1: 'retinol', ingredient2: 'salicylic acid', severity: 'high', reason: 'Retinol + BHA causes severe over-drying, irritation, and compromised skin barrier.', suggestion: 'Alternate days. BHA in AM, Retinol in PM — never together.' },
  { ingredient1: 'retinol', ingredient2: 'benzoyl peroxide', severity: 'high', reason: 'Benzoyl Peroxide oxidizes and deactivates Retinol, making both products useless.', suggestion: 'Use at different times. BP in AM, Retinol in PM.' },
  { ingredient1: 'salicylic acid', ingredient2: 'benzoyl peroxide', severity: 'medium', reason: 'Both are drying agents. Together they cause extreme dryness, peeling, and irritation.', suggestion: 'Use one in AM and one in PM, or alternate days.' },
  { ingredient1: 'glycolic acid', ingredient2: 'salicylic acid', severity: 'medium', reason: 'AHA + BHA together is too aggressive for most skin types. Destroys the moisture barrier.', suggestion: "Don't use together — alternate days or use a pre-formulated combo product." },
  { ingredient1: 'lactic acid', ingredient2: 'salicylic acid', severity: 'medium', reason: 'AHA + BHA together causes strong exfoliation that damages the skin barrier.', suggestion: "Don't use together — alternate days." },
  { ingredient1: 'glycolic acid', ingredient2: 'lactic acid', severity: 'medium', reason: 'Using multiple AHAs together causes over-exfoliation, redness, and sensitivity.', suggestion: 'Choose ONE AHA, not both. Glycolic for stronger exfoliation, Lactic for gentler.' },
  { ingredient1: 'vitamin c', ingredient2: 'niacinamide', severity: 'low', reason: 'At high concentrations and low pH, Vitamin C can convert Niacinamide to niacin causing flushing.', suggestion: 'Use at different times or choose lower concentrations. Modern formulations are often compatible.' },
  { ingredient1: 'vitamin c', ingredient2: 'glycolic acid', severity: 'medium', reason: 'Both are acidic. Combined low pH causes irritation and may destabilize Vitamin C.', suggestion: 'Use Vitamin C in AM, AHA in PM.' },
  { ingredient1: 'vitamin c', ingredient2: 'retinol', severity: 'high', reason: 'Different optimal pH levels. Together they cause irritation and reduce effectiveness.', suggestion: 'Vitamin C in AM (antioxidant protection), Retinol in PM (repair).' },
  { ingredient1: 'retinol', ingredient2: 'aha', severity: 'high', reason: 'Retinol + any AHA causes excessive exfoliation and barrier damage.', suggestion: 'Alternate nights. Never layer.' },
  { ingredient1: 'retinol', ingredient2: 'bha', severity: 'high', reason: 'Retinol + any BHA causes over-drying and severe irritation.', suggestion: 'Alternate nights.' },
  { ingredient1: 'aha', ingredient2: 'bha', severity: 'medium', reason: 'Combined AHA + BHA is too aggressive for daily use and damages the skin barrier.', suggestion: 'Alternate days or use only 1-2x/week combined.' },
  { ingredient1: 'benzoyl peroxide', ingredient2: 'vitamin c', severity: 'medium', reason: 'Benzoyl Peroxide is an oxidizing agent that can deactivate Vitamin C.', suggestion: 'Use Vitamin C in AM, Benzoyl Peroxide in PM.' },
  { ingredient1: 'retinol', ingredient2: 'tea tree oil', severity: 'low', reason: 'Both can be drying. Together may cause excessive dryness for sensitive skin.', suggestion: 'Monitor skin response. Use tea tree oil in AM, Retinol in PM.' },
  { ingredient1: 'salicylic acid', ingredient2: 'glycolic acid', severity: 'medium', reason: 'BHA + AHA is a strong chemical exfoliation combo that can damage skin if overused.', suggestion: 'Use max 2-3x/week combined, or alternate days.' },
  { ingredient1: 'niacinamide', ingredient2: 'vitamin c', severity: 'low', reason: 'High-concentration Vitamin C (L-ascorbic acid) with Niacinamide may cause temporary flushing.', suggestion: 'Space them 15 min apart or use at different times of day.' },
  { ingredient1: 'retinol', ingredient2: 'citric acid', severity: 'medium', reason: 'Citric acid (AHA) + Retinol increases irritation and photosensitivity.', suggestion: 'Alternate nights. Use Citric Acid in AM, Retinol in PM.' },
  { ingredient1: 'benzoyl peroxide', ingredient2: 'retinol', severity: 'high', reason: 'BP oxidizes retinol rendering it ineffective. Both together cause extreme dryness.', suggestion: 'BP in AM, Retinol in PM. Or alternate days.' },
  { ingredient1: 'glycolic acid', ingredient2: 'vitamin c', severity: 'medium', reason: 'Both require low pH. Together they can cause stinging and irritation.', suggestion: 'Vitamin C in AM, Glycolic Acid in PM.' },
];

// ── Ingredient Database (ENHANCED — 40+ ingredients) ──
const ingredientDatabase: Record<string, { type: string; category: string; safeFor: string[]; unsafeFor: string[]; benefits: string[]; strength: string }> = {
  'retinol': { type: 'active', category: 'retinoid', safeFor: ['oily', 'combination'], unsafeFor: ['sensitive', 'dry'], benefits: ['anti-aging', 'acne', 'pigmentation'], strength: 'strong' },
  'vitamin c': { type: 'active', category: 'antioxidant', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['pigmentation', 'anti-aging', 'brightening'], strength: 'medium' },
  'salicylic acid': { type: 'active', category: 'bha', safeFor: ['oily', 'combination'], unsafeFor: ['sensitive', 'dry'], benefits: ['acne', 'blackheads', 'pores'], strength: 'strong' },
  'glycolic acid': { type: 'active', category: 'aha', safeFor: ['oily', 'combination'], unsafeFor: ['sensitive', 'dry'], benefits: ['pigmentation', 'anti-aging', 'texture'], strength: 'strong' },
  'lactic acid': { type: 'active', category: 'aha', safeFor: ['oily', 'dry', 'combination'], unsafeFor: ['sensitive'], benefits: ['pigmentation', 'hydration', 'texture'], strength: 'medium' },
  'benzoyl peroxide': { type: 'active', category: 'antibacterial', safeFor: ['oily', 'combination'], unsafeFor: ['sensitive', 'dry'], benefits: ['acne'], strength: 'strong' },
  'niacinamide': { type: 'active', category: 'vitamin', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['acne', 'pigmentation', 'pores', 'barrier'], strength: 'gentle' },
  'hyaluronic acid': { type: 'hydrator', category: 'humectant', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['hydration', 'dryness', 'anti-aging'], strength: 'gentle' },
  'ceramides': { type: 'barrier', category: 'lipid', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['barrier', 'dryness', 'sensitivity'], strength: 'gentle' },
  'fragrance': { type: 'additive', category: 'fragrance', safeFor: ['oily'], unsafeFor: ['sensitive', 'dry'], benefits: [], strength: 'irritant' },
  'parfum': { type: 'additive', category: 'fragrance', safeFor: ['oily'], unsafeFor: ['sensitive', 'dry'], benefits: [], strength: 'irritant' },
  'alcohol': { type: 'additive', category: 'solvent', safeFor: ['oily'], unsafeFor: ['sensitive', 'dry'], benefits: [], strength: 'irritant' },
  'alcohol denat': { type: 'additive', category: 'solvent', safeFor: ['oily'], unsafeFor: ['sensitive', 'dry'], benefits: [], strength: 'irritant' },
  'tea tree oil': { type: 'active', category: 'antibacterial', safeFor: ['oily', 'combination'], unsafeFor: ['sensitive'], benefits: ['acne'], strength: 'medium' },
  'squalane': { type: 'hydrator', category: 'oil', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['hydration', 'dryness'], strength: 'gentle' },
  'shea butter': { type: 'hydrator', category: 'oil', safeFor: ['dry', 'combination'], unsafeFor: ['oily'], benefits: ['hydration', 'dryness'], strength: 'gentle' },
  'aloe vera': { type: 'soothing', category: 'botanical', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['soothing', 'hydration', 'sensitivity'], strength: 'gentle' },
  'centella asiatica': { type: 'soothing', category: 'botanical', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['soothing', 'barrier', 'sensitivity'], strength: 'gentle' },
  'zinc': { type: 'active', category: 'mineral', safeFor: ['oily', 'combination', 'sensitive'], unsafeFor: [], benefits: ['acne', 'oil control'], strength: 'gentle' },
  'panthenol': { type: 'soothing', category: 'vitamin', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['hydration', 'soothing', 'barrier'], strength: 'gentle' },
  'glycerin': { type: 'hydrator', category: 'humectant', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['hydration', 'dryness'], strength: 'gentle' },
  'vitamin e': { type: 'active', category: 'antioxidant', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['anti-aging', 'barrier'], strength: 'gentle' },
  'green tea': { type: 'soothing', category: 'botanical', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['antioxidant', 'soothing', 'acne'], strength: 'gentle' },
  'clay': { type: 'active', category: 'absorbent', safeFor: ['oily', 'combination'], unsafeFor: ['dry', 'sensitive'], benefits: ['oil control', 'pores'], strength: 'medium' },
  'charcoal': { type: 'active', category: 'absorbent', safeFor: ['oily', 'combination'], unsafeFor: ['dry', 'sensitive'], benefits: ['oil control', 'pores', 'detox'], strength: 'medium' },
  'coconut oil': { type: 'hydrator', category: 'oil', safeFor: ['dry'], unsafeFor: ['oily', 'combination'], benefits: ['hydration'], strength: 'gentle' },
  'jojoba oil': { type: 'hydrator', category: 'oil', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['hydration', 'barrier'], strength: 'gentle' },
  'mineral oil': { type: 'hydrator', category: 'occlusive', safeFor: ['dry'], unsafeFor: ['oily', 'combination'], benefits: ['hydration'], strength: 'gentle' },
  'witch hazel': { type: 'active', category: 'astringent', safeFor: ['oily', 'combination'], unsafeFor: ['sensitive', 'dry'], benefits: ['oil control', 'pores'], strength: 'medium' },
  'rosehip oil': { type: 'hydrator', category: 'oil', safeFor: ['dry', 'combination', 'sensitive'], unsafeFor: ['oily'], benefits: ['anti-aging', 'pigmentation', 'hydration'], strength: 'gentle' },
  'snail mucin': { type: 'soothing', category: 'botanical', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['hydration', 'anti-aging', 'barrier'], strength: 'gentle' },
  'oat extract': { type: 'soothing', category: 'botanical', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['soothing', 'barrier', 'sensitivity'], strength: 'gentle' },
  'allantoin': { type: 'soothing', category: 'botanical', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['soothing', 'hydration'], strength: 'gentle' },
  'chamomile': { type: 'soothing', category: 'botanical', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['soothing', 'sensitivity'], strength: 'gentle' },
  'citric acid': { type: 'active', category: 'aha', safeFor: ['oily', 'combination'], unsafeFor: ['sensitive', 'dry'], benefits: ['brightening', 'texture'], strength: 'medium' },
  'mandelic acid': { type: 'active', category: 'aha', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['pigmentation', 'acne', 'texture'], strength: 'medium' },
  'azelaic acid': { type: 'active', category: 'acid', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['acne', 'pigmentation', 'redness'], strength: 'medium' },
  'peptides': { type: 'active', category: 'protein', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['anti-aging', 'barrier'], strength: 'gentle' },
  'ferulic acid': { type: 'active', category: 'antioxidant', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['antioxidant', 'anti-aging'], strength: 'gentle' },
  'madecassoside': { type: 'soothing', category: 'botanical', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['soothing', 'barrier', 'sensitivity'], strength: 'gentle' },
  'bisabolol': { type: 'soothing', category: 'botanical', safeFor: ['oily', 'dry', 'combination', 'sensitive'], unsafeFor: [], benefits: ['soothing', 'sensitivity'], strength: 'gentle' },
};

// ── Sample Products ──
export const sampleProducts: SampleProduct[] = [
  { _id: '1', name: 'Salicylic Acid Cleanser', type: 'cleanser', ingredients: 'salicylic acid, glycerin, tea tree oil, aloe vera', suitableSkinTypes: ['oily', 'combination'] },
  { _id: '2', name: 'Vitamin C Brightening Serum', type: 'serum', ingredients: 'vitamin c, hyaluronic acid, vitamin e, ferulic acid', suitableSkinTypes: ['oily', 'dry', 'combination', 'sensitive'] },
  { _id: '3', name: 'Retinol Night Cream', type: 'moisturizer', ingredients: 'retinol, ceramides, squalane, niacinamide', suitableSkinTypes: ['oily', 'combination'] },
  { _id: '4', name: 'Hyaluronic Acid Moisturizer', type: 'moisturizer', ingredients: 'hyaluronic acid, glycerin, ceramides, panthenol', suitableSkinTypes: ['oily', 'dry', 'combination', 'sensitive'] },
  { _id: '5', name: 'Glycolic Acid Toner', type: 'toner', ingredients: 'glycolic acid, aloe vera, green tea, witch hazel', suitableSkinTypes: ['oily', 'combination'] },
  { _id: '6', name: 'Benzoyl Peroxide Gel', type: 'serum', ingredients: 'benzoyl peroxide, aloe vera, glycerin', suitableSkinTypes: ['oily', 'combination'] },
  { _id: '7', name: 'Niacinamide Serum', type: 'serum', ingredients: 'niacinamide, zinc, hyaluronic acid, panthenol', suitableSkinTypes: ['oily', 'dry', 'combination', 'sensitive'] },
  { _id: '8', name: 'Gentle Foaming Cleanser', type: 'cleanser', ingredients: 'glycerin, aloe vera, centella asiatica, panthenol', suitableSkinTypes: ['oily', 'dry', 'combination', 'sensitive'] },
  { _id: '9', name: 'SPF 50 Sunscreen', type: 'sunscreen', ingredients: 'zinc oxide, niacinamide, hyaluronic acid, vitamin e', suitableSkinTypes: ['oily', 'dry', 'combination', 'sensitive'] },
  { _id: '10', name: 'AHA/BHA Exfoliating Toner', type: 'toner', ingredients: 'glycolic acid, salicylic acid, lactic acid, green tea', suitableSkinTypes: ['oily', 'combination'] },
  { _id: '11', name: 'Ceramide Repair Cream', type: 'moisturizer', ingredients: 'ceramides, squalane, shea butter, vitamin e', suitableSkinTypes: ['dry', 'sensitive'] },
  { _id: '12', name: 'Clay Purifying Mask', type: 'mask', ingredients: 'clay, charcoal, tea tree oil, salicylic acid', suitableSkinTypes: ['oily', 'combination'] },
  { _id: '13', name: 'Azelaic Acid Serum', type: 'serum', ingredients: 'azelaic acid, niacinamide, hyaluronic acid, panthenol', suitableSkinTypes: ['oily', 'dry', 'combination', 'sensitive'] },
  { _id: '14', name: 'Mandelic Acid Toner', type: 'toner', ingredients: 'mandelic acid, green tea, aloe vera, glycerin', suitableSkinTypes: ['oily', 'dry', 'combination', 'sensitive'] },
  { _id: '15', name: 'Peptide Anti-Aging Cream', type: 'moisturizer', ingredients: 'peptides, ceramides, squalane, vitamin e', suitableSkinTypes: ['oily', 'dry', 'combination', 'sensitive'] },
];

// ── Helpers ──
function normalizeIngredient(ingredient: string): string {
  return ingredient.trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseIngredients(ingredientsStr: string): string[] {
  if (!ingredientsStr || typeof ingredientsStr !== 'string') return [];
  return ingredientsStr.split(',').map(i => normalizeIngredient(i)).filter(i => i.length > 0);
}

function findIngredientMatch(ingredient: string): string | null {
  const normalized = normalizeIngredient(ingredient);
  const knownIngredients = Object.keys(ingredientDatabase);
  // Exact match first
  if (knownIngredients.includes(normalized)) return normalized;
  // Partial match — check if known ingredient is contained in the input
  for (const known of knownIngredients) {
    if (normalized.includes(known) || known.includes(normalized)) return known;
  }
  // Check category-level matches
  if (normalized.includes('aha') || normalized.includes('alpha hydroxy')) return 'aha';
  if (normalized.includes('bha') || normalized.includes('beta hydroxy')) return 'bha';
  return null;
}

function checkIngredientConflict(ing1: string, ing2: string) {
  const match1 = findIngredientMatch(ing1);
  const match2 = findIngredientMatch(ing2);
  if (!match1 || !match2) return null;
  return ingredientConflicts.find(
    c => (normalizeIngredient(c.ingredient1) === match1 && normalizeIngredient(c.ingredient2) === match2) ||
         (normalizeIngredient(c.ingredient1) === match2 && normalizeIngredient(c.ingredient2) === match1)
  ) || null;
}

function isIngredientSafeForSkinType(ingredient: string, skinType: string) {
  const match = findIngredientMatch(ingredient);
  if (!match) return { safe: true, reason: 'Unknown ingredient — proceed with caution' };
  const data = ingredientDatabase[match];
  if (data.unsafeFor.includes(skinType)) {
    return { safe: false, reason: `${match} is not recommended for ${skinType} skin` };
  }
  return { safe: true, reason: `${match} is safe for ${skinType} skin` };
}

function detectOveruse(allIngredients: string[]): Warning[] {
  const strongIngredients = allIngredients.filter(ing => {
    const match = findIngredientMatch(ing);
    return match && ingredientDatabase[match]?.strength === 'strong';
  });
  const mediumIngredients = allIngredients.filter(ing => {
    const match = findIngredientMatch(ing);
    return match && ingredientDatabase[match]?.strength === 'medium';
  });
  const warnings: Warning[] = [];
  
  if (strongIngredients.length >= 3) {
    warnings.push({
      type: 'overuse', severity: 'high',
      message: `🔴 OVERUSE DETECTED: You have ${strongIngredients.length} strong active ingredients (${strongIngredients.join(', ')}). This can severely damage your skin barrier, cause breakouts, and increase sensitivity.`,
      suggestion: 'Reduce to 1-2 strong actives maximum. Space them across different days. Your skin needs time to recover.'
    });
  } else if (strongIngredients.length === 2) {
    warnings.push({
      type: 'overuse', severity: 'medium',
      message: `🟡 CAUTION: You have 2 strong active ingredients (${strongIngredients.join(', ')}). Using them together may cause irritation.`,
      suggestion: 'Use one in AM and one in PM, or alternate days. Never layer strong actives.'
    });
  }
  
  // Check for too many medium-strength actives
  if (mediumIngredients.length >= 4) {
    warnings.push({
      type: 'overuse', severity: 'medium',
      message: `🟡 MULTIPLE MEDIUM ACTIVES: You have ${mediumIngredients.length} medium-strength ingredients. This can accumulate irritation over time.`,
      suggestion: 'Consider reducing to 2-3 medium actives. Monitor your skin for signs of irritation.'
    });
  }
  
  return warnings;
}

function checkProductSkinCompatibility(product: Product, skinType: string): SkinTypeIssue[] {
  const issues: SkinTypeIssue[] = [];
  const ingredients = parseIngredients(product.ingredients);
  for (const ing of ingredients) {
    const safety = isIngredientSafeForSkinType(ing, skinType);
    if (!safety.safe) {
      issues.push({ product: product.name, ingredient: ing, reason: safety.reason, severity: 'medium' });
    }
  }
  return issues;
}

function checkAllConflicts(products: Product[]): Conflict[] {
  const conflicts: Conflict[] = [];
  const allIngredients: { ingredient: string; product: string }[] = [];
  for (const product of products) {
    const ingredients = parseIngredients(product.ingredients);
    for (const ing of ingredients) {
      allIngredients.push({ ingredient: ing, product: product.name });
    }
  }
  for (let i = 0; i < allIngredients.length; i++) {
    for (let j = i + 1; j < allIngredients.length; j++) {
      const conflict = checkIngredientConflict(allIngredients[i].ingredient, allIngredients[j].ingredient);
      if (conflict) {
        const exists = conflicts.find(
          c => (c.ingredient1 === conflict.ingredient1 && c.ingredient2 === conflict.ingredient2) ||
               (c.ingredient1 === conflict.ingredient2 && c.ingredient2 === conflict.ingredient1)
        );
        if (!exists) {
          conflicts.push({ ...conflict, product1: allIngredients[i].product, product2: allIngredients[j].product });
        }
      }
    }
  }
  return conflicts;
}

function generateRecommendations(skinType: string, concerns: string[], currentProducts: Product[]): Recommendation[] {
  const rules = skinTypeRules[skinType];
  if (!rules) return [];
  const recommendations: Recommendation[] = [];
  for (const prefIng of rules.prefer) {
    const data = ingredientDatabase[prefIng];
    if (data) {
      const hasIngredient = currentProducts.some(p =>
        parseIngredients(p.ingredients).some(i => findIngredientMatch(i) === prefIng)
      );
      if (!hasIngredient) {
        const matchingConcerns = data.benefits.filter(b =>
          concerns.some(c => c.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(c.toLowerCase()))
        );
        recommendations.push({
          ingredient: prefIng, benefits: data.benefits, matchingConcerns, type: data.category,
          reason: `${prefIng} is excellent for ${skinType} skin${matchingConcerns.length ? ` and addresses: ${matchingConcerns.join(', ')}` : ''}`
        });
      }
    }
  }
  return recommendations.slice(0, 5);
}

function findAlternatives(problematicProduct: Product, skinType: string): Alternative[] {
  const alternatives: Alternative[] = [];
  for (const sample of sampleProducts) {
    if (sample.name === problematicProduct.name) continue;
    const issues = checkProductSkinCompatibility({ id: sample._id, name: sample.name, type: sample.type, ingredients: sample.ingredients }, skinType);
    if (issues.length === 0 && sample.type === problematicProduct.type) {
      alternatives.push({ name: sample.name, type: sample.type, ingredients: sample.ingredients, reason: `Safe for ${skinType} skin and serves as a ${sample.type} replacement` });
    }
  }
  return alternatives.slice(0, 3);
}

// ── MAIN ANALYSIS FUNCTION ──
export function analyzeSkincareRoutine(userData: { skinType: string; concerns: string[]; products: Product[] }): AnalysisResult {
  const { skinType, concerns, products } = userData;
  const result: AnalysisResult = {
    warnings: [], conflicts: [], skinTypeIssues: [], safeProducts: [], unsafeProducts: [],
    suggestions: [], recommendations: [], overallScore: 100, summary: ''
  };

  // STEP 1: Skin type compatibility
  for (const product of products) {
    const issues = checkProductSkinCompatibility(product, skinType);
    if (issues.length > 0) {
      result.unsafeProducts.push({ product: product.name, issues });
      for (const issue of issues) {
        result.skinTypeIssues.push(issue);
        result.warnings.push({ type: 'skin_mismatch', severity: 'medium' as const, message: `⚠️ ${product.name} contains ${issue.ingredient} which is not ideal for ${skinType} skin.`, product: product.name, ingredient: issue.ingredient });
      }
    } else {
      result.safeProducts.push(product.name);
    }
  }

  // STEP 2: Ingredient conflicts
  const conflicts = checkAllConflicts(products);
  result.conflicts = conflicts;
  for (const conflict of conflicts) {
    result.warnings.push({
      type: 'ingredient_conflict', severity: conflict.severity,
      message: `❌ CONFLICT: ${conflict.ingredient1} and ${conflict.ingredient2} should not be used together. ${conflict.reason}`,
      suggestion: conflict.suggestion, product1: conflict.product1, product2: conflict.product2
    });
  }

  // STEP 3: Overuse detection
  const allIngredients: string[] = [];
  for (const product of products) {
    allIngredients.push(...parseIngredients(product.ingredients));
  }
  const overuseWarnings = detectOveruse(allIngredients);
  result.warnings.push(...overuseWarnings);

  // STEP 4: Recommendations
  result.recommendations = generateRecommendations(skinType, concerns, products);

  // STEP 5: Alternatives
  for (const unsafe of result.unsafeProducts) {
    const product = products.find(p => p.name === unsafe.product);
    if (product) {
      const alternatives = findAlternatives(product, skinType);
      result.suggestions.push({ product: unsafe.product, alternatives, reason: `Replace ${unsafe.product} with a safer option for ${skinType} skin` });
    }
  }

  // STEP 6: Score (IMPROVED weighting)
  let score = 100;
  score -= result.conflicts.filter(c => c.severity === 'high').length * 20;
  score -= result.conflicts.filter(c => c.severity === 'medium').length * 12;
  score -= result.conflicts.filter(c => c.severity === 'low').length * 5;
  score -= result.skinTypeIssues.length * 10;
  score -= overuseWarnings.filter(w => w.severity === 'high').length * 20;
  score -= overuseWarnings.filter(w => w.severity === 'medium').length * 10;
  result.overallScore = Math.max(0, Math.min(100, score));

  // STEP 7: Summary
  if (result.overallScore >= 80) {
    result.summary = "✅ Your routine is mostly safe! A few minor adjustments could make it even better.";
  } else if (result.overallScore >= 50) {
    result.summary = "⚠️ Your routine has some issues that need attention. Please review the warnings below.";
  } else {
    result.summary = "❌ Your routine has significant issues. Several products may be harmful for your skin type.";
  }

  return result;
}

// ── Validation ──
export function validateInput(userData: { skinType: string; concerns: string[]; products: Product[] }) {
  const errors: string[] = [];
  if (!userData.skinType || !['dry', 'oily', 'combination', 'sensitive'].includes(userData.skinType)) {
    errors.push('Please select a valid skin type.');
  }
  if (!userData.concerns || !Array.isArray(userData.concerns) || userData.concerns.length === 0) {
    errors.push('Please select at least one skin concern.');
  }
  if (!userData.products || !Array.isArray(userData.products) || userData.products.length === 0) {
    errors.push('Please add at least one product to analyze.');
  } else {
    for (let i = 0; i < userData.products.length; i++) {
      const p = userData.products[i];
      if (!p.name || p.name.trim() === '') errors.push(`Product #${i + 1}: Name is required.`);
      if (!p.type) errors.push(`Product #${i + 1}: Please select a product type.`);
      if (!p.ingredients || p.ingredients.trim() === '') errors.push(`Product #${i + 1}: Ingredients are required.`);
    }
  }
  return { valid: errors.length === 0, errors };
}
