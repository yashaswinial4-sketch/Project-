// ─────────────────────────────────────────────────────────────
// ROUTINE GENERATOR ROUTE (TASK 6)
// POST /api/routine/generate
// ─────────────────────────────────────────────────────────────

import express from 'express';
const router = express.Router();

// ── In-file routine generation logic (mirrors frontend) ──

const cleanserProducts = {
  oily: { low: { name: 'Minimalist Salicylic Acid Cleanser', brand: 'Minimalist', price: 249, ingredients: ['Salicylic Acid', 'Glycerin'] }, medium: { name: 'CeraVe Foaming Cleanser', brand: 'CeraVe', price: 550, ingredients: ['Ceramides', 'Niacinamide'] }, high: { name: 'La Roche-Posay Effaclar Gel', brand: 'LRP', price: 1250, ingredients: ['Zinc PIDO', 'Thermal Water'] } },
  dry: { low: { name: 'Himalaya Hydrating Face Wash', brand: 'Himalaya', price: 175, ingredients: ['Aloe Vera', 'Cucumber'] }, medium: { name: 'CeraVe Hydrating Cleanser', brand: 'CeraVe', price: 550, ingredients: ['Ceramides', 'Hyaluronic Acid'] }, high: { name: 'Bioderma Hydrabio Gel', brand: 'Bioderma', price: 1090, ingredients: ['Niacinamide', 'Vitamin PP'] } },
  combination: { low: { name: 'Cetaphil Gentle Skin Cleanser', brand: 'Cetaphil', price: 225, ingredients: ['Glycerin', 'Panthenol'] }, medium: { name: 'Vichy Purete Thermale', brand: 'Vichy', price: 720, ingredients: ['Mineral Water', 'Vitamin E'] }, high: { name: 'Fresh Soy Face Cleanser', brand: 'Fresh', price: 2200, ingredients: ['Soy Proteins', 'Rosewater'] } },
  sensitive: { low: { name: 'Simple Kind to Skin Cleanser', brand: 'Simple', price: 199, ingredients: ['Vitamin B5', 'Vitamin E'] }, medium: { name: 'Avène Gentle Cleanser', brand: 'Avène', price: 850, ingredients: ['Thermal Spring Water', 'Squalane'] }, high: { name: 'LRP Toleriane Cleanser', brand: 'LRP', price: 1100, ingredients: ['Thermal Water', 'Ceramides'] } },
};

function getProduct(catalog, skinType, budget) {
  const st = skinType || 'combination';
  const b = budget || 'medium';
  const entry = catalog[st] || catalog['combination'];
  return entry[b] || entry['medium'];
}

router.post('/generate', (req, res) => {
  try {
    const { skinType, concerns = [], goals = [], budget = 'medium' } = req.body;

    if (!skinType) {
      return res.status(400).json({ success: false, error: 'Skin type is required' });
    }

    const st = ['oily', 'dry', 'combination', 'sensitive'].includes(skinType) ? skinType : 'combination';
    const b = ['low', 'medium', 'high'].includes(budget) ? budget : 'medium';

    // Generate routine steps
    const morningRoutine = {
      timeOfDay: 'morning',
      title: 'Morning Routine',
      emoji: '\u2600\ufe0f',
      steps: [
        { stepNumber: 1, name: 'Cleanser', category: 'cleanser', product: getProduct(cleanserProducts, st, b), importance: 'essential' },
        { stepNumber: 2, name: 'Toner', category: 'toner', product: { name: 'Balancing Toner', price: 300, ingredients: ['Niacinamide', 'Aloe'] }, importance: 'recommended' },
        { stepNumber: 3, name: 'Serum', category: 'serum', product: { name: 'Targeted Serum', price: 500, ingredients: concerns.includes('acne') ? ['Salicylic Acid', 'Niacinamide'] : ['Hyaluronic Acid', 'Vitamin C'] }, importance: 'essential' },
        { stepNumber: 4, name: 'Moisturizer', category: 'moisturizer', product: getProduct(cleanserProducts, st, b), importance: 'essential' },
        { stepNumber: 5, name: 'Sunscreen', category: 'sunscreen', product: { name: 'SPF 50 Sunscreen', price: 400, ingredients: ['SPF 50+', 'UVA/UVB'] }, importance: 'essential' },
      ],
    };

    const nightRoutine = {
      timeOfDay: 'night',
      title: 'Night Routine',
      emoji: '\ud83c\udf19',
      steps: [
        { stepNumber: 1, name: 'Cleanser (Double Cleanse)', category: 'cleanser', product: getProduct(cleanserProducts, st, b), importance: 'essential' },
        { stepNumber: 2, name: 'Night Treatment', category: 'treatment', product: { name: 'Night Treatment', price: 600, ingredients: st === 'oily' ? ['Retinol', 'BHA'] : ['Ceramides', 'Peptides'] }, importance: 'essential' },
        { stepNumber: 3, name: 'Night Serum', category: 'serum', product: { name: 'Repair Serum', price: 500, ingredients: ['Hyaluronic Acid', 'Peptides'] }, importance: 'recommended' },
        { stepNumber: 4, name: 'Night Moisturizer', category: 'moisturizer', product: getProduct(cleanserProducts, st, b), importance: 'essential' },
      ],
    };

    const totalSteps = morningRoutine.steps.length + nightRoutine.steps.length;

    res.json({
      success: true,
      data: {
        morningRoutine,
        nightRoutine,
        totalSteps,
        estimatedTimeMinutes: { morning: 10, night: 12 },
        budgetBreakdown: {
          low: '\u20b91,200/month',
          medium: '\u20b92,800/month',
          high: '\u20b95,500/month',
        },
        explanations: {
          overallExplanation: `This routine is personalized for ${st} skin with ${concerns.join(', ') || 'general'} concerns targeting ${goals.join(', ') || 'healthy skin'} goals.`,
          whyThisRoutine: `Your ${st} skin type requires specific formulations that we've carefully selected based on dermatological best practices.`,
          keyDecisions: [
            { decision: `${st === 'oily' ? 'Foaming' : st === 'dry' ? 'Hydrating' : 'Gentle'} cleanser chosen`, reason: `Optimal for ${st} skin type` },
            { decision: 'SPF 50+ included', reason: 'Essential for all skin types to prevent premature aging' },
          ],
          customizationNotes: [`Budget level: ${b}`, `Concerns addressed: ${concerns.join(', ')}`],
          estimatedImprovement: '4-8 weeks of consistent use',
          weeklyVariationTip: '1x per week, add an exfoliating mask.',
        },
        weeklyTips: ['Week 1-2: Adjustment period', 'Week 3-4: Skin adapting', 'Week 5-8: Visible improvement'],
        seasonalNotes: ['Adjust richness based on humidity and temperature.'],
        routineQualityScore: 82,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate routine' });
  }
});

export default router;
