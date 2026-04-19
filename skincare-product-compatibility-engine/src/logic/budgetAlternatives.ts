// ─────────────────────────────────────────────────────────────
// BUDGET-FRIENDLY ALTERNATIVES ENGINE (TASK 6)
// Finds cheaper alternatives for every recommended product
// ─────────────────────────────────────────────────────────────

import type { RecommendedProduct, BudgetAlternative } from '../types';
import { productDatabase } from './productRecommender';

// ── Value-for-money assessment ──
function assessValue(cheaper: RecommendedProduct, original: RecommendedProduct): 'excellent' | 'good' | 'fair' {
  const priceRatio = cheaper.actualPrice / original.actualPrice;

  if (priceRatio <= 0.4) return 'excellent'; // Less than 40% of price
  if (priceRatio <= 0.7) return 'good';      // Less than 70% of price
  return 'fair';
}

// ── Generate comparison notes ──
function generateComparisonNotes(cheaper: RecommendedProduct, expensive: RecommendedProduct): string {
  const sharedIngredients = cheaper.keyIngredients.filter(i =>
    expensive.keyIngredients.some(ei => ei.toLowerCase() === i.toLowerCase())
  );
  const savingsPercent = Math.round((1 - cheaper.actualPrice / expensive.actualPrice) * 100);

  let notes = '';

  if (sharedIngredients.length > 0) {
    notes += `Shares key ingredients: ${sharedIngredients.join(', ')}. `;
  }

  notes += `${cheaper.brand} ${cheaper.name} is ${savingsPercent}% cheaper than ${expensive.brand} ${expensive.name}. `;

  if (cheaper.rating >= 4.3) {
    notes += 'Excellent rating for the price — great value for money.';
  } else if (cheaper.rating >= 4.0) {
    notes += 'Good rating for the price — solid budget option.';
  } else {
    notes += 'Decent option for tight budgets.';
  }

  return notes;
}

// ═══════════════════════════════════════════════════════════
// MAIN EXPORT: Get budget alternatives for a list of products
// ═══════════════════════════════════════════════════════════
export function getBudgetAlternatives(products: RecommendedProduct[]): BudgetAlternative[] {
  const alternatives: BudgetAlternative[] = [];

  for (const product of products) {
    // Find cheaper alternatives in the same step category
    const cheaperOptions = productDatabase
      .filter(p =>
        p.stepType === product.stepType &&
        p.id !== product.id &&
        p.actualPrice < product.actualPrice
      )
      .sort((a, b) => {
        // Prefer products with best rating-to-price ratio
        const aRatio = a.rating / (a.actualPrice / 100);
        const bRatio = b.rating / (b.actualPrice / 100);
        return bRatio - aRatio;
      });

    if (cheaperOptions.length > 0) {
      const cheapest = cheaperOptions[0];
      const savings = product.actualPrice - cheapest.actualPrice;

      alternatives.push({
        originalProduct: product,
        alternative: cheapest,
        savingsAmount: savings,
        savings: `₹${savings} cheaper`,
        comparisonNotes: generateComparisonNotes(cheapest, product),
        valueForMoney: assessValue(cheapest, product),
      });
    }
  }

  return alternatives;
}

// ── Get total savings if user switches all products to alternatives ──
export function calculateTotalSavings(alternatives: BudgetAlternative[]): {
  totalSavings: number;
  percentage: number;
  breakdown: { productName: string; originalPrice: number; altPrice: number; savings: number }[];
} {
  const breakdown = alternatives.map(alt => ({
    productName: alt.originalProduct.name,
    originalPrice: alt.originalProduct.actualPrice,
    altPrice: alt.alternative.actualPrice,
    savings: alt.savingsAmount,
  }));

  const totalSavings = breakdown.reduce((sum, b) => sum + b.savings, 0);
  const totalOriginal = breakdown.reduce((sum, b) => sum + b.originalPrice, 0);
  const percentage = totalOriginal > 0 ? Math.round((totalSavings / totalOriginal) * 100) : 0;

  return { totalSavings, percentage, breakdown };
}
