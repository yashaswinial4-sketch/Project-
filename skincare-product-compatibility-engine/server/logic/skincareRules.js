// ============================================================
// 🧠 AI PERSONALIZED SKINCARE ADVISOR — SKINCARE RULES ENGINE
// ============================================================
// This is the CORE rule-based engine that powers all analysis.
// It contains: skin-type rules, ingredient conflicts,
// allergy filters, overuse detection, and validation functions.
// ============================================================

// ─────────────────────────────────────────────────────────────
// 1. SKIN TYPE COMPATIBILITY RULES
// ─────────────────────────────────────────────────────────────
export const skinTypeRules = {
  dry: {
    avoid: [
      "alcohol", "alcohol denat", "sd alcohol", "denatured alcohol",
      "salicylic acid", "benzoyl peroxide", "clay", "charcoal",
      "sulfates", "sodium lauryl sulfate"
    ],
    prefer: [
      "hyaluronic acid", "ceramides", "glycerin", "squalane",
      "shea butter", "jojoba oil", "vitamin e", "aloe vera",
      "niacinamide", "panthenol"
    ],
    description: "Dry skin needs hydration and moisture barrier support."
  },
  oily: {
    avoid: [
      "mineral oil", "coconut oil", "cocoa butter", "lanolin",
      "petroleum", "isopropyl myristate", "heavy oils",
      "silicone", "dimethicone"
    ],
    prefer: [
      "salicylic acid", "niacinamide", "hyaluronic acid",
      "tea tree oil", "zinc", "glycolic acid", "retinol",
      "clay", "charcoal"
    ],
    description: "Oily skin benefits from oil control and pore cleansing."
  },
  combination: {
    avoid: [
      "heavy oils", "alcohol denat", "sodium lauryl sulfate",
      "mineral oil", "cocoa butter"
    ],
    prefer: [
      "niacinamide", "hyaluronic acid", "glycerin", "ceramides",
      "aloe vera", "green tea", "vitamin e"
    ],
    description: "Combination skin needs balanced hydration."
  },
  sensitive: {
    avoid: [
      "fragrance", "parfum", "alcohol", "alcohol denat",
      "retinol", "glycolic acid", "lactic acid", "salicylic acid",
      "benzoyl peroxide", "essential oils", "sodium lauryl sulfate",
      "parabens", "formaldehyde", "dmdm hydantoin"
    ],
    prefer: [
      "aloe vera", "centella asiatica", "ceramides", "panthenol",
      "oat extract", "allantoin", "niacinamide", "hyaluronic acid",
      "glycerin", "squalane", "chamomile"
    ],
    description: "Sensitive skin requires gentle, non-irritating ingredients."
  }
};

// ─────────────────────────────────────────────────────────────
// 2. INGREDIENT CONFLICT RULES
// ─────────────────────────────────────────────────────────────
export const ingredientConflicts = [
  {
    ingredient1: "retinol",
    ingredient2: "vitamin c",
    severity: "high",
    reason: "Using Retinol and Vitamin C together can cause irritation and reduce effectiveness. Use Vitamin C in the morning and Retinol at night.",
    suggestion: "Separate usage: Vitamin C (AM), Retinol (PM)"
  },
  {
    ingredient1: "retinol",
    ingredient2: "glycolic acid",
    severity: "high",
    reason: "Retinol and Glycolic Acid (AHA) together cause excessive exfoliation and severe irritation.",
    suggestion: "Alternate days: Retinol one night, AHA another night"
  },
  {
    ingredient1: "retinol",
    ingredient2: "lactic acid",
    severity: "high",
    reason: "Retinol and Lactic Acid (AHA) together cause excessive exfoliation and irritation.",
    suggestion: "Alternate days: Retinol one night, AHA another night"
  },
  {
    ingredient1: "retinol",
    ingredient2: "salicylic acid",
    severity: "high",
    reason: "Retinol and Salicylic Acid (BHA) together cause over-drying and severe irritation.",
    suggestion: "Alternate days or use at different times"
  },
  {
    ingredient1: "retinol",
    ingredient2: "benzoyl peroxide",
    severity: "high",
    reason: "Benzoyl Peroxide deactivates Retinol, making both ineffective.",
    suggestion: "Use at different times of day or alternate days"
  },
  {
    ingredient1: "salicylic acid",
    ingredient2: "benzoyl peroxide",
    severity: "medium",
    reason: "Salicylic Acid and Benzoyl Peroxide together cause over-drying and irritation.",
    suggestion: "Use one in AM and one in PM, or alternate days"
  },
  {
    ingredient1: "glycolic acid",
    ingredient2: "salicylic acid",
    severity: "medium",
    reason: "AHA (Glycolic) + BHA (Salicylic) together cause strong exfoliation that can damage the skin barrier.",
    suggestion: "Don't use together — alternate days"
  },
  {
    ingredient1: "lactic acid",
    ingredient2: "salicylic acid",
    severity: "medium",
    reason: "AHA (Lactic) + BHA (Salicylic) together cause strong exfoliation that can damage the skin barrier.",
    suggestion: "Don't use together — alternate days"
  },
  {
    ingredient1: "glycolic acid",
    ingredient2: "lactic acid",
    severity: "medium",
    reason: "Using multiple AHAs together causes over-exfoliation.",
    suggestion: "Choose one AHA, not both"
  },
  {
    ingredient1: "vitamin c",
    ingredient2: "niacinamide",
    severity: "low",
    reason: "Vitamin C and Niacinamide at high concentrations together may cause flushing. Modern formulations are generally safe, but caution is advised.",
    suggestion: "Use at different times or choose lower concentrations"
  },
  {
    ingredient1: "vitamin c",
    ingredient2: "glycolic acid",
    severity: "medium",
    reason: "Vitamin C and AHA together may cause irritation due to combined acidity.",
    suggestion: "Use Vitamin C in AM, AHA in PM"
  },
  {
    ingredient1: "retinol",
    ingredient2: "aha",
    severity: "high",
    reason: "Retinol and AHAs together cause excessive exfoliation and irritation.",
    suggestion: "Alternate nights"
  },
  {
    ingredient1: "retinol",
    ingredient2: "bha",
    severity: "high",
    reason: "Retinol and BHAs together cause over-drying and irritation.",
    suggestion: "Alternate nights"
  },
  {
    ingredient1: "aha",
    ingredient2: "bha",
    severity: "medium",
    reason: "Using AHA and BHA together can cause over-exfoliation and damage the skin barrier.",
    suggestion: "Alternate days or use in different routines"
  }
];

// ─────────────────────────────────────────────────────────────
// 3. INGREDIENT DATABASE
// ─────────────────────────────────────────────────────────────
export const ingredientDatabase = {
  "retinol": {
    type: "active",
    category: "retinoid",
    safeFor: ["oily", "combination"],
    unsafeFor: ["sensitive", "dry"],
    benefits: ["anti-aging", "acne", "pigmentation"],
    strength: "strong"
  },
  "vitamin c": {
    type: "active",
    category: "antioxidant",
    safeFor: ["oily", "dry", "combination", "sensitive"],
    unsafeFor: [],
    benefits: ["pigmentation", "anti-aging", "brightening"],
    strength: "medium"
  },
  "salicylic acid": {
    type: "active",
    category: "bha",
    safeFor: ["oily", "combination"],
    unsafeFor: ["sensitive", "dry"],
    benefits: ["acne", "blackheads", "pores"],
    strength: "strong"
  },
  "glycolic acid": {
    type: "active",
    category: "aha",
    safeFor: ["oily", "combination"],
    unsafeFor: ["sensitive", "dry"],
    benefits: ["pigmentation", "anti-aging", "texture"],
    strength: "strong"
  },
  "lactic acid": {
    type: "active",
    category: "aha",
    safeFor: ["oily", "dry", "combination"],
    unsafeFor: ["sensitive"],
    benefits: ["pigmentation", "hydration", "texture"],
    strength: "medium"
  },
  "benzoyl peroxide": {
    type: "active",
    category: "antibacterial",
    safeFor: ["oily", "combination"],
    unsafeFor: ["sensitive", "dry"],
    benefits: ["acne"],
    strength: "strong"
  },
  "niacinamide": {
    type: "active",
    category: "vitamin",
    safeFor: ["oily", "dry", "combination", "sensitive"],
    unsafeFor: [],
    benefits: ["acne", "pigmentation", "pores", "barrier"],
    strength: "gentle"
  },
  "hyaluronic acid": {
    type: "hydrator",
    category: "humectant",
    safeFor: ["oily", "dry", "combination", "sensitive"],
    unsafeFor: [],
    benefits: ["hydration", "dryness", "anti-aging"],
    strength: "gentle"
  },
  "ceramides": {
    type: "barrier",
    category: "lipid",
    safeFor: ["oily", "dry", "combination", "sensitive"],
    unsafeFor: [],
    benefits: ["barrier", "dryness", "sensitivity"],
    strength: "gentle"
  },
  "fragrance": {
    type: "additive",
    category: "fragrance",
    safeFor: ["oily"],
    unsafeFor: ["sensitive", "dry"],
    benefits: [],
    strength: "irritant"
  },
  "parfum": {
    type: "additive",
    category: "fragrance",
    safeFor: ["oily"],
    unsafeFor: ["sensitive", "dry"],
    benefits: [],
    strength: "irritant"
  },
  "alcohol": {
    type: "additive",
    category: "solvent",
    safeFor: ["oily"],
    unsafeFor: ["sensitive", "dry"],
    benefits: [],
    strength: "irritant"
  },
  "alcohol denat": {
    type: "additive",
    category: "solvent",
    safeFor: ["oily"],
    unsafeFor: ["sensitive", "dry"],
    benefits: [],
    strength: "irritant"
  },
  "tea tree oil": {
    type: "active",
    category: "antibacterial",
    safeFor: ["oily", "combination"],
    unsafeFor: ["sensitive"],
    benefits: ["acne"],
    strength: "medium"
  },
  "squalane": {
    type: "hydrator",
    category: "oil",
    safeFor: ["oily", "dry", "combination", "sensitive"],
    unsafeFor: [],
    benefits: ["hydration", "dryness"],
    strength: "gentle"
  },
  "shea butter": {
    type: "hydrator",
    category: "oil",
    safeFor: ["dry", "combination"],
    unsafeFor: ["oily"],
    benefits: ["hydration", "dryness"],
    strength: "gentle"
  },
  "aloe vera": {
    type: "soothing",
    category: "botanical",
    safeFor: ["oily", "dry", "combination", "sensitive"],
    unsafeFor: [],
    benefits: ["soothing", "hydration", "sensitivity"],
    strength: "gentle"
  },
  "centella asiatica": {
    type: "soothing",
    category: "botanical",
    safeFor: ["oily", "dry", "combination", "sensitive"],
    unsafeFor: [],
    benefits: ["soothing", "barrier", "sensitivity"],
    strength: "gentle"
  },
  "zinc": {
    type: "active",
    category: "mineral",
    safeFor: ["oily", "combination", "sensitive"],
    unsafeFor: [],
    benefits: ["acne", "oil control"],
    strength: "gentle"
  },
  "panthenol": {
    type: "soothing",
    category: "vitamin",
    safeFor: ["oily", "dry", "combination", "sensitive"],
    unsafeFor: [],
    benefits: ["hydration", "soothing", "barrier"],
    strength: "gentle"
  },
  "glycerin": {
    type: "hydrator",
    category: "humectant",
    safeFor: ["oily", "dry", "combination", "sensitive"],
    unsafeFor: [],
    benefits: ["hydration", "dryness"],
    strength: "gentle"
  },
  "vitamin e": {
    type: "active",
    category: "antioxidant",
    safeFor: ["oily", "dry", "combination", "sensitive"],
    unsafeFor: [],
    benefits: ["anti-aging", "barrier"],
    strength: "gentle"
  },
  "green tea": {
    type: "soothing",
    category: "botanical",
    safeFor: ["oily", "dry", "combination", "sensitive"],
    unsafeFor: [],
    benefits: ["antioxidant", "soothing", "acne"],
    strength: "gentle"
  },
  "clay": {
    type: "active",
    category: "absorbent",
    safeFor: ["oily", "combination"],
    unsafeFor: ["dry", "sensitive"],
    benefits: ["oil control", "pores"],
    strength: "medium"
  },
  "charcoal": {
    type: "active",
    category: "absorbent",
    safeFor: ["oily", "combination"],
    unsafeFor: ["dry", "sensitive"],
    benefits: ["oil control", "pores", "detox"],
    strength: "medium"
  },
  "coconut oil": {
    type: "hydrator",
    category: "oil",
    safeFor: ["dry"],
    unsafeFor: ["oily", "combination"],
    benefits: ["hydration"],
    strength: "gentle"
  },
  "jojoba oil": {
    type: "hydrator",
    category: "oil",
    safeFor: ["oily", "dry", "combination", "sensitive"],
    unsafeFor: [],
    benefits: ["hydration", "barrier"],
    strength: "gentle"
  },
  "mineral oil": {
    type: "hydrator",
    category: "occlusive",
    safeFor: ["dry"],
    unsafeFor: ["oily", "combination"],
    benefits: ["hydration"],
    strength: "gentle"
  }
};

// ─────────────────────────────────────────────────────────────
// 4. SAMPLE PRODUCTS DATABASE
// ─────────────────────────────────────────────────────────────
export const sampleProducts = [
  {
    _id: "1",
    name: "Salicylic Acid Cleanser",
    type: "cleanser",
    ingredients: "salicylic acid, glycerin, tea tree oil, aloe vera",
    suitableSkinTypes: ["oily", "combination"]
  },
  {
    _id: "2",
    name: "Vitamin C Brightening Serum",
    type: "serum",
    ingredients: "vitamin c, hyaluronic acid, vitamin e, ferulic acid",
    suitableSkinTypes: ["oily", "dry", "combination", "sensitive"]
  },
  {
    _id: "3",
    name: "Retinol Night Cream",
    type: "moisturizer",
    ingredients: "retinol, ceramides, squalane, niacinamide",
    suitableSkinTypes: ["oily", "combination"]
  },
  {
    _id: "4",
    name: "Hyaluronic Acid Moisturizer",
    type: "moisturizer",
    ingredients: "hyaluronic acid, glycerin, ceramides, panthenol",
    suitableSkinTypes: ["oily", "dry", "combination", "sensitive"]
  },
  {
    _id: "5",
    name: "Glycolic Acid Toner",
    type: "toner",
    ingredients: "glycolic acid, aloe vera, green tea, witch hazel",
    suitableSkinTypes: ["oily", "combination"]
  },
  {
    _id: "6",
    name: "Benzoyl Peroxide Gel",
    type: "serum",
    ingredients: "benzoyl peroxide, aloe vera, glycerin",
    suitableSkinTypes: ["oily", "combination"]
  },
  {
    _id: "7",
    name: "Niacinamide Serum",
    type: "serum",
    ingredients: "niacinamide, zinc, hyaluronic acid, panthenol",
    suitableSkinTypes: ["oily", "dry", "combination", "sensitive"]
  },
  {
    _id: "8",
    name: "Gentle Foaming Cleanser",
    type: "cleanser",
    ingredients: "glycerin, aloe vera, centella asiatica, panthenol",
    suitableSkinTypes: ["oily", "dry", "combination", "sensitive"]
  },
  {
    _id: "9",
    name: "SPF 50 Sunscreen",
    type: "sunscreen",
    ingredients: "zinc oxide, niacinamide, hyaluronic acid, vitamin e",
    suitableSkinTypes: ["oily", "dry", "combination", "sensitive"]
  },
  {
    _id: "10",
    name: "AHA/BHA Exfoliating Toner",
    type: "toner",
    ingredients: "glycolic acid, salicylic acid, lactic acid, green tea",
    suitableSkinTypes: ["oily", "combination"]
  },
  {
    _id: "11",
    name: "Ceramide Repair Cream",
    type: "moisturizer",
    ingredients: "ceramides, squalane, shea butter, vitamin e",
    suitableSkinTypes: ["dry", "sensitive"]
  },
  {
    _id: "12",
    name: "Clay Purifying Mask",
    type: "cleanser",
    ingredients: "clay, charcoal, tea tree oil, salicylic acid",
    suitableSkinTypes: ["oily", "combination"]
  }
];

// ─────────────────────────────────────────────────────────────
// 5. HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Normalize ingredient string for comparison
 */
export function normalizeIngredient(ingredient) {
  return ingredient.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Parse comma-separated ingredients into normalized array
 */
export function parseIngredients(ingredientsStr) {
  if (!ingredientsStr || typeof ingredientsStr !== 'string') return [];
  return ingredientsStr
    .split(',')
    .map(i => normalizeIngredient(i))
    .filter(i => i.length > 0);
}

/**
 * Check if an ingredient matches a known ingredient (fuzzy match)
 */
export function findIngredientMatch(ingredient) {
  const normalized = normalizeIngredient(ingredient);
  const knownIngredients = Object.keys(ingredientDatabase);

  // Exact match
  if (knownIngredients.includes(normalized)) return normalized;

  // Partial match
  for (const known of knownIngredients) {
    if (normalized.includes(known) || known.includes(normalized)) {
      return known;
    }
  }

  return null;
}

/**
 * Check if two ingredients conflict
 */
export function checkIngredientConflict(ing1, ing2) {
  const match1 = findIngredientMatch(ing1);
  const match2 = findIngredientMatch(ing2);

  if (!match1 || !match2) return null;

  const conflict = ingredientConflicts.find(
    c =>
      (normalizeIngredient(c.ingredient1) === match1 && normalizeIngredient(c.ingredient2) === match2) ||
      (normalizeIngredient(c.ingredient1) === match2 && normalizeIngredient(c.ingredient2) === match1)
  );

  return conflict || null;
}

/**
 * Check if an ingredient is safe for a skin type
 */
export function isIngredientSafeForSkinType(ingredient, skinType) {
  const match = findIngredientMatch(ingredient);
  if (!match) return { safe: true, reason: "Unknown ingredient — proceed with caution" };

  const data = ingredientDatabase[match];
  if (data.unsafeFor.includes(skinType)) {
    return {
      safe: false,
      reason: `${match} is not recommended for ${skinType} skin`
    };
  }

  return { safe: true, reason: `${match} is safe for ${skinType} skin` };
}

/**
 * Detect overuse of strong active ingredients
 */
export function detectOveruse(allIngredients) {
  const strongIngredients = allIngredients.filter(ing => {
    const match = findIngredientMatch(ing);
    return match && ingredientDatabase[match]?.strength === 'strong';
  });

  const warnings = [];

  if (strongIngredients.length >= 3) {
    warnings.push({
      type: "overuse",
      severity: "high",
      message: `⚠️ OVERUSE DETECTED: You have ${strongIngredients.length} strong active ingredients (${strongIngredients.join(', ')}). This can severely damage your skin barrier.`,
      suggestion: "Reduce to 1-2 strong actives in your routine. Space them out across different days."
    });
  } else if (strongIngredients.length === 2) {
    warnings.push({
      type: "overuse",
      severity: "medium",
      message: `⚠️ CAUTION: You have 2 strong active ingredients (${strongIngredients.join(', ')}). Use at different times of day.`,
      suggestion: "Use one in AM and one in PM, or alternate days."
    });
  }

  return warnings;
}

/**
 * Check if a product is suitable for the user's skin type
 */
export function checkProductSkinCompatibility(product, skinType) {
  const issues = [];
  const ingredients = parseIngredients(product.ingredients);

  for (const ing of ingredients) {
    const safety = isIngredientSafeForSkinType(ing, skinType);
    if (!safety.safe) {
      issues.push({
        product: product.name,
        ingredient: ing,
        reason: safety.reason,
        severity: "medium"
      });
    }
  }

  return issues;
}

/**
 * Check all ingredient conflicts across all products
 */
export function checkAllConflicts(products) {
  const conflicts = [];
  const allIngredients = [];

  // Collect all ingredients with their product sources
  for (const product of products) {
    const ingredients = parseIngredients(product.ingredients);
    for (const ing of ingredients) {
      allIngredients.push({ ingredient: ing, product: product.name });
    }
  }

  // Check every pair
  for (let i = 0; i < allIngredients.length; i++) {
    for (let j = i + 1; j < allIngredients.length; j++) {
      const conflict = checkIngredientConflict(
        allIngredients[i].ingredient,
        allIngredients[j].ingredient
      );

      if (conflict) {
        // Avoid duplicate conflicts
        const exists = conflicts.find(
          c =>
            (c.ingredient1 === conflict.ingredient1 && c.ingredient2 === conflict.ingredient2) ||
            (c.ingredient1 === conflict.ingredient2 && c.ingredient2 === conflict.ingredient1)
        );

        if (!exists) {
          conflicts.push({
            ...conflict,
            product1: allIngredients[i].product,
            product2: allIngredients[j].product
          });
        }
      }
    }
  }

  return conflicts;
}

/**
 * Generate safe product recommendations based on skin type and concerns
 */
export function generateRecommendations(skinType, concerns, currentProducts) {
  const rules = skinTypeRules[skinType];
  if (!rules) return [];

  const recommendations = [];

  // Recommend preferred ingredients
  for (const prefIng of rules.prefer) {
    const data = ingredientDatabase[prefIng];
    if (data) {
      // Check if user already has this ingredient
      const hasIngredient = currentProducts.some(p =>
        parseIngredients(p.ingredients).some(i => findIngredientMatch(i) === prefIng)
      );

      if (!hasIngredient) {
        // Match concerns
        const matchingConcerns = data.benefits.filter(b =>
          concerns.some(c => c.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(c.toLowerCase()))
        );

        recommendations.push({
          ingredient: prefIng,
          benefits: data.benefits,
          matchingConcerns,
          type: data.category,
          reason: `${prefIng} is excellent for ${skinType} skin${matchingConcerns.length ? ` and addresses: ${matchingConcerns.join(', ')}` : ''}`
        });
      }
    }
  }

  return recommendations.slice(0, 5);
}

/**
 * Find safer alternatives for problematic products
 */
export function findAlternatives(problematicProduct, skinType) {
  const alternatives = [];

  for (const sample of sampleProducts) {
    if (sample.name === problematicProduct.name) continue;

    const issues = checkProductSkinCompatibility(sample, skinType);
    if (issues.length === 0 && sample.type === problematicProduct.type) {
      alternatives.push({
        name: sample.name,
        type: sample.type,
        ingredients: sample.ingredients,
        reason: `Safe for ${skinType} skin and serves as a ${sample.type} replacement`
      });
    }
  }

  return alternatives.slice(0, 3);
}

// ─────────────────────────────────────────────────────────────
// 6. MAIN ANALYSIS FUNCTION (THE CORE ENGINE)
// ─────────────────────────────────────────────────────────────
export function analyzeSkincareRoutine(userData) {
  const { skinType, concerns, products } = userData;
  const result = {
    warnings: [],
    conflicts: [],
    skinTypeIssues: [],
    safeProducts: [],
    unsafeProducts: [],
    suggestions: [],
    recommendations: [],
    overallScore: 100,
    summary: ""
  };

  // ── STEP 1: Check skin type compatibility for each product ──
  for (const product of products) {
    const issues = checkProductSkinCompatibility(product, skinType);
    if (issues.length > 0) {
      result.unsafeProducts.push({
        product: product.name,
        issues
      });
      for (const issue of issues) {
        result.skinTypeIssues.push(issue);
        result.warnings.push({
          type: "skin_mismatch",
          severity: "medium",
          message: `⚠️ ${product.name} contains ${issue.ingredient} which is not ideal for ${skinType} skin.`,
          product: product.name,
          ingredient: issue.ingredient
        });
      }
    } else {
      result.safeProducts.push(product.name);
    }
  }

  // ── STEP 2: Check ingredient conflicts across all products ──
  const conflicts = checkAllConflicts(products);
  result.conflicts = conflicts;

  for (const conflict of conflicts) {
    result.warnings.push({
      type: "ingredient_conflict",
      severity: conflict.severity,
      message: `❌ CONFLICT: ${conflict.ingredient1} and ${conflict.ingredient2} should not be used together. ${conflict.reason}`,
      suggestion: conflict.suggestion,
      product1: conflict.product1,
      product2: conflict.product2
    });
  }

  // ── STEP 3: Check for overuse of strong actives ──
  const allIngredients = [];
  for (const product of products) {
    allIngredients.push(...parseIngredients(product.ingredients));
  }

  const overuseWarnings = detectOveruse(allIngredients);
  result.warnings.push(...overuseWarnings);

  // ── STEP 4: Generate recommendations ──
  result.recommendations = generateRecommendations(skinType, concerns, products);

  // ── STEP 5: Find alternatives for unsafe products ──
  for (const unsafe of result.unsafeProducts) {
    const product = products.find(p => p.name === unsafe.product);
    if (product) {
      const alternatives = findAlternatives(product, skinType);
      result.suggestions.push({
        product: unsafe.product,
        alternatives,
        reason: `Replace ${unsafe.product} with a safer option for ${skinType} skin`
      });
    }
  }

  // ── STEP 6: Calculate overall safety score ──
  let score = 100;
  score -= result.conflicts.length * 15;
  score -= result.skinTypeIssues.length * 10;
  score -= overuseWarnings.length * 20;
  result.overallScore = Math.max(0, Math.min(100, score));

  // ── STEP 7: Generate summary ──
  if (result.overallScore >= 80) {
    result.summary = "✅ Your routine is mostly safe! A few minor adjustments could make it even better.";
  } else if (result.overallScore >= 50) {
    result.summary = "⚠️ Your routine has some issues that need attention. Please review the warnings below.";
  } else {
    result.summary = "❌ Your routine has significant issues. Several products may be harmful for your skin type. Please review carefully.";
  }

  return result;
}

// ─────────────────────────────────────────────────────────────
// 7. VALIDATION FUNCTION
// ─────────────────────────────────────────────────────────────
export function validateInput(userData) {
  const errors = [];

  if (!userData.skinType || !["dry", "oily", "combination", "sensitive"].includes(userData.skinType)) {
    errors.push("Please select a valid skin type (dry, oily, combination, or sensitive).");
  }

  if (!userData.concerns || !Array.isArray(userData.concerns) || userData.concerns.length === 0) {
    errors.push("Please select at least one skin concern.");
  }

  if (!userData.products || !Array.isArray(userData.products) || userData.products.length === 0) {
    errors.push("Please add at least one product to analyze.");
  } else {
    for (let i = 0; i < userData.products.length; i++) {
      const p = userData.products[i];
      if (!p.name || p.name.trim() === '') {
        errors.push(`Product #${i + 1}: Name is required.`);
      }
      if (!p.type || !["cleanser", "serum", "moisturizer", "sunscreen", "toner", "mask", "other"].includes(p.type)) {
        errors.push(`Product #${i + 1}: Please select a valid product type.`);
      }
      if (!p.ingredients || p.ingredients.trim() === '') {
        errors.push(`Product #${i + 1}: Ingredients are required.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ============================================================
// 🧠 TASK 2: SKIN TYPE DETECTION — QUESTIONNAIRE ENGINE
// ============================================================
// Scoring system: each answer contributes points to skin type scores.
// Highest score wins. If sensitive flag is triggered, override to "sensitive".
// ============================================================

/**
 * Detect skin type from questionnaire answers.
 * @param {Array<{questionId: number, answer: string}>} answers
 * @returns {{skinType: string, confidence: number, breakdown: object, explanation: string}}
 */
export function detectSkinTypeFromAnswers(answers) {
  const scores = { dry: 0, oily: 0, combination: 0, normal: 0 };
  let sensitiveFlag = false;
  const explanations = [];

  for (const qa of answers) {
    const { questionId, answer } = qa;

    switch (questionId) {
      // Q1: How does your skin feel after washing?
      case 1:
        if (answer === 'tight') {
          scores.dry += 3;
          explanations.push('Skin feels tight after washing → indicates dryness');
        } else if (answer === 'normal') {
          scores.normal += 2;
          scores.combination += 1;
          explanations.push('Skin feels normal after washing → balanced');
        } else if (answer === 'oily') {
          scores.oily += 3;
          explanations.push('Skin feels oily after washing → excess sebum production');
        } else if (answer === 'comfortable') {
          scores.normal += 3;
          explanations.push('Skin feels comfortable → likely normal skin');
        }
        break;

      // Q2: How often does your face get shiny?
      case 2:
        if (answer === 'rarely') {
          scores.dry += 3;
          explanations.push('Rarely shiny → low sebum production (dry skin)');
        } else if (answer === 'sometimes') {
          scores.combination += 3;
          explanations.push('Sometimes shiny → mixed sebum production (combination skin)');
        } else if (answer === 'often') {
          scores.oily += 3;
          explanations.push('Often shiny → high sebum production (oily skin)');
        } else if (answer === 'never') {
          scores.dry += 2;
          explanations.push('Never shiny → very low oil production');
        }
        break;

      // Q3: Do you experience acne?
      case 3:
        if (answer === 'never') {
          scores.dry += 1;
          scores.normal += 2;
          explanations.push('No acne → likely dry or normal skin');
        } else if (answer === 'sometimes') {
          scores.combination += 3;
          explanations.push('Occasional acne → combination skin pattern');
        } else if (answer === 'frequently') {
          scores.oily += 3;
          explanations.push('Frequent acne → excess oil production (oily skin)');
        } else if (answer === 'rarely') {
          scores.normal += 2;
          scores.combination += 1;
          explanations.push('Rare acne → near-normal skin');
        }
        break;

      // Q4: Are your pores visible?
      case 4:
        if (answer === 'no') {
          scores.dry += 3;
          explanations.push('Invisible pores → small pores typical of dry skin');
        } else if (answer === 't-zone') {
          scores.combination += 3;
          explanations.push('Visible pores only in T-zone → classic combination skin');
        } else if (answer === 'yes') {
          scores.oily += 3;
          explanations.push('Visible pores everywhere → enlarged pores from excess oil');
        } else if (answer === 'slightly') {
          scores.normal += 2;
          scores.combination += 1;
          explanations.push('Slightly visible pores → near-normal skin');
        }
        break;

      // Q5: Does your skin react easily to products or environment?
      case 5:
        if (answer === 'yes') {
          sensitiveFlag = true;
          scores.sensitive = 5; // Override score
          explanations.push('Easily reactive skin → SENSITIVE skin type detected');
        } else if (answer === 'sometimes') {
          scores.sensitive = 3;
          scores.combination += 1;
          explanations.push('Sometimes reactive → mildly sensitive');
        } else if (answer === 'no') {
          explanations.push('Not easily reactive → resilient skin');
        } else if (answer === 'rarely') {
          scores.normal += 1;
          explanations.push('Rarely reactive → generally resilient');
        }
        break;

      // Q6: How does your skin feel by midday?
      case 6:
        if (answer === 'tight-dry') {
          scores.dry += 3;
          explanations.push('Tight/dry by midday → insufficient oil production');
        } else if (answer === 'comfortable') {
          scores.normal += 3;
          explanations.push('Comfortable by midday → balanced skin');
        } else if (answer === 'oily-all-over') {
          scores.oily += 3;
          explanations.push('Oily all over by midday → excess sebum');
        } else if (answer === 'oily-tzone') {
          scores.combination += 3;
          explanations.push('Oily T-zone only → combination skin pattern');
        }
        break;

      // Q7: How does your skin look in photos (flash)?
      case 7:
        if (answer === 'dull-flat') {
          scores.dry += 2;
          explanations.push('Dull in photos → lack of natural glow (dry skin)');
        } else if (answer === 'glowy') {
          scores.normal += 2;
          explanations.push('Natural glow in photos → healthy balanced skin');
        } else if (answer === 'very-shiny') {
          scores.oily += 3;
          explanations.push('Very shiny in flash photos → excess oil reflection');
        } else if (answer === 'mixed') {
          scores.combination += 3;
          explanations.push('Mixed shine in photos → T-zone oily, cheeks dry');
        }
        break;

      // Q8: Do you get flaky or peeling skin?
      case 8:
        if (answer === 'often') {
          scores.dry += 3;
          scores.sensitive = Math.max(scores.sensitive || 0, 2);
          explanations.push('Frequent flaking → dry, possibly sensitive skin');
        } else if (answer === 'sometimes') {
          scores.dry += 1;
          scores.combination += 1;
          explanations.push('Occasional flaking → mild dryness');
        } else if (answer === 'rarely') {
          scores.normal += 2;
          scores.oily += 1;
          explanations.push('Rarely flaky → adequate moisture');
        } else if (answer === 'never') {
          scores.oily += 2;
          scores.normal += 1;
          explanations.push('Never flaky → well-hydrated or oily skin');
        }
        break;

      default:
        break;
    }
  }

  // ── Determine Result ──
  // If sensitive flag is set, override to sensitive
  if (sensitiveFlag) {
    return {
      skinType: 'sensitive',
      confidence: 0.88,
      method: 'questionnaire',
      breakdown: { dry: scores.dry, oily: scores.oily, combination: scores.combination, sensitive: 5, normal: scores.normal },
      explanation: 'Based on your answers, you have SENSITIVE skin. Your skin reacts easily to products and environmental factors. Use gentle, fragrance-free products and avoid strong actives.'
    };
  }

  // Find highest scoring type
  let maxScore = 0;
  let detectedType = 'combination';
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedType = type;
    }
  }

  // Map normal to combination for our 4-type system
  const typeMap = { dry: 'dry', oily: 'oily', combination: 'combination', normal: 'combination', sensitive: 'sensitive' };
  const finalType = typeMap[detectedType] || 'combination';

  // Calculate confidence based on score margin
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? Math.min(0.95, 0.6 + (maxScore / totalScore) * 0.35) : 0.6;

  const typeDescriptions = {
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
    explanation: typeDescriptions[finalType] || typeDescriptions.combination
  };
}
