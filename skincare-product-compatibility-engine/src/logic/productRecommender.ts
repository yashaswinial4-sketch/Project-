// ─────────────────────────────────────────────────────────────
// PRODUCT RECOMMENDATION ENGINE (TASK 6)
// Database of real products at 3 budget tiers + scoring logic
// ─────────────────────────────────────────────────────────────

import type {
  SkinType, SkinConcern, SkinGoal, BudgetLevel,
  RoutineStep, RecommendedProduct
} from '../types';

// ── Complete Product Database (Indian Market) ──
const productDatabase: RecommendedProduct[] = [
  // ═══ CLEANSERS ═══
  // Low Budget
  { id: 'cl-low-1', name: 'Himalaya Purifying Neem Face Wash', brand: 'Himalaya', priceCategory: 'low', priceRange: '₹120-180', actualPrice: 150, keyIngredients: ['neem', 'turmeric'], whyRecommended: 'Affordable antibacterial cleanser that fights acne-causing bacteria without stripping skin.', suitableFor: ['oily', 'combination', 'acne-prone'], rating: 4.1, stepType: 'cleanser' },
  { id: 'cl-low-2', name: 'Cetaphil Gentle Skin Cleanser (Travel)', brand: 'Cetaphil', priceCategory: 'low', priceRange: '₹120-180', actualPrice: 150, keyIngredients: ['glycerin', 'cetyl alcohol'], whyRecommended: 'Dermatologist-recommended gentle formula. Does not disrupt the skin barrier.', suitableFor: ['dry', 'sensitive', 'all'], rating: 4.3, stepType: 'cleanser' },
  { id: 'cl-low-3', name: 'Himalaya Moisturizing Aloe Vera Face Wash', brand: 'Himalaya', priceCategory: 'low', priceRange: '₹110-160', actualPrice: 135, keyIngredients: ['aloe vera', 'cucumber'], whyRecommended: 'Gentle, hydrating cleanser with soothing aloe. Great for dry and sensitive skin on a budget.', suitableFor: ['dry', 'sensitive'], rating: 4.0, stepType: 'cleanser' },
  // Medium Budget
  { id: 'cl-med-1', name: 'CeraVe Foaming Facial Cleanser', brand: 'CeraVe', priceCategory: 'medium', priceRange: '₹450-600', actualPrice: 550, keyIngredients: ['ceramides', 'niacinamide', 'hyaluronic acid'], whyRecommended: 'Gold standard for oily/combination skin. Ceramides repair barrier while niacinamide controls oil. pH-balanced formula.', suitableFor: ['oily', 'combination', 'acne-prone'], rating: 4.6, stepType: 'cleanser' },
  { id: 'cl-med-2', name: 'CeraVe Hydrating Facial Cleanser', brand: 'CeraVe', priceCategory: 'medium', priceRange: '₹450-600', actualPrice: 550, keyIngredients: ['ceramides', 'hyaluronic acid', 'glycerin'], whyRecommended: 'Cream-based cleanser that cleans without stripping. The #1 dermatologist pick for dry/sensitive skin.', suitableFor: ['dry', 'sensitive'], rating: 4.7, stepType: 'cleanser' },
  { id: 'cl-med-3', name: 'La Roche-Posay Toleriane Creme Cleanser', brand: 'La Roche-Posay', priceCategory: 'medium', priceRange: '₹500-700', actualPrice: 600, keyIngredients: ['ceramides', 'niacinamide', 'shea butter'], whyRecommended: 'Ultra-gentle formula specifically designed for sensitive and reactive skin. French pharmacy favorite.', suitableFor: ['sensitive', 'dry'], rating: 4.5, stepType: 'cleanser' },
  // High Budget
  { id: 'cl-high-1', name: 'Fresh Soy Face Cleanser', brand: 'Fresh', priceCategory: 'high', priceRange: '₹1000-1400', actualPrice: 1200, keyIngredients: ['soy proteins', 'cucumber', 'rosewater'], whyRecommended: 'Luxury gel cleanser with real soy proteins that maintain elasticity while gently cleansing. A-list favorite.', suitableFor: ['all', 'dry', 'sensitive'], rating: 4.5, stepType: 'cleanser' },
  { id: 'cl-high-2', name: 'Dermalogica Special Cleansing Gel', brand: 'Dermalogica', priceCategory: 'high', priceRange: '₹1200-1800', actualPrice: 1500, keyIngredients: ['quillaja saponaria', 'licorice', 'lavender'], whyRecommended: 'Professional-grade soap-free cleanser used in dermatology clinics. Balances without stripping.', suitableFor: ['oily', 'combination'], rating: 4.4, stepType: 'cleanser' },

  // ═══ TONERS ═══
  // Low Budget
  { id: 'tn-low-1', name: 'Plum Green Tea Alcohol-Free Toner', brand: 'Plum', priceCategory: 'low', priceRange: '₹200-280', actualPrice: 240, keyIngredients: ['green tea', 'glycolic acid', 'niacinamide'], whyRecommended: 'Budget-friendly toner with green tea for oil control and gentle exfoliation. Alcohol-free.', suitableFor: ['oily', 'combination', 'acne-prone'], rating: 4.2, stepType: 'toner' },
  { id: 'tn-low-2', name: 'Biotique Bio Cucumber Toner', brand: 'Biotique', priceCategory: 'low', priceRange: '₹150-220', actualPrice: 185, keyIngredients: ['cucumber', 'mint', 'honey'], whyRecommended: 'Ayurvedic formula with cucumber for soothing and hydrating. Very affordable.', suitableFor: ['dry', 'sensitive', 'all'], rating: 3.9, stepType: 'toner' },
  { id: 'tn-low-3', name: 'Mamaearth Vitamin C Toner', brand: 'Mamaearth', priceCategory: 'low', priceRange: '₹200-300', actualPrice: 250, keyIngredients: ['vitamin c', 'glycerin', 'aloe vera'], whyRecommended: 'Brightening toner with Vitamin C for glow. Good entry-level option for students.', suitableFor: ['combination', 'oily', 'dull skin'], rating: 4.0, stepType: 'toner' },
  // Medium Budget
  { id: 'tn-med-1', name: 'Pixi Glow Tonic', brand: 'Pixi', priceCategory: 'medium', priceRange: '₹400-600', actualPrice: 500, keyIngredients: ['glycolic acid', 'aloe vera', 'ginseng'], whyRecommended: 'Cult-favorite exfoliating toner with 5% glycolic acid. Brightens, smooths, and preps skin for treatments.', suitableFor: ['oily', 'combination', 'aging', 'dull skin'], rating: 4.4, stepType: 'toner' },
  { id: 'tn-med-2', name: 'Thayers Alcohol-Free Witch Hazel Toner', brand: 'Thayers', priceCategory: 'medium', priceRange: '₹350-500', actualPrice: 400, keyIngredients: ['witch hazel', 'aloe vera', 'rosewater'], whyRecommended: 'Gentle, alcohol-free formula. Witch hazel tightens pores naturally without drying. Universal favorite.', suitableFor: ['all', 'sensitive', 'oily'], rating: 4.5, stepType: 'toner' },
  { id: 'tn-med-3', name: 'Klairs Supple Preparation Toner', brand: 'Klairs', priceCategory: 'medium', priceRange: '₹500-700', actualPrice: 600, keyIngredients: ['hyaluronic acid', 'centella asiatica', 'licorice'], whyRecommended: 'K-beauty holy grail. Deeply hydrating, balances pH, and soothes irritation. Perfect for sensitive skin.', suitableFor: ['dry', 'sensitive', 'all'], rating: 4.7, stepType: 'toner' },
  // High Budget
  { id: 'tn-high-1', name: 'SK-II Facial Treatment Essence', brand: 'SK-II', priceCategory: 'high', priceRange: '₹2500-4000', actualPrice: 3200, keyIngredients: ['pitera', 'vitamins', 'amino acids'], whyRecommended: 'Iconic Japanese essence with 90% PITERA™ — a fermented blend that transforms skin texture and radiance.', suitableFor: ['all', 'aging'], rating: 4.6, stepType: 'toner' },
  { id: 'tn-high-2', name: 'Sisley Floral Toning Lotion', brand: 'Sisley', priceCategory: 'high', priceRange: '₹2000-3000', actualPrice: 2500, keyIngredients: ['rose', 'cornflower', 'sage'], whyRecommended: 'Luxury botanical toner with real flower extracts. Alcohol-free and supremely gentle.', suitableFor: ['sensitive', 'dry'], rating: 4.3, stepType: 'toner' },

  // ═══ SERUMS ═══
  // Low Budget
  { id: 'sr-low-1', name: 'Minimalist 10% Niacinamide Face Serum', brand: 'Minimalist', priceCategory: 'low', priceRange: '₹220-300', actualPrice: 260, keyIngredients: ['niacinamide', 'zinc'], whyRecommended: 'Best budget niacinamide serum. Controls oil, reduces pores, fades dark spots. Clean ingredients.', suitableFor: ['oily', 'combination', 'acne-prone', 'pigmentation'], rating: 4.4, stepType: 'serum' },
  { id: 'sr-low-2', name: 'Minimalist Hyaluronic Acid 2% + Vitamin B5', brand: 'Minimalist', priceCategory: 'low', priceRange: '₹200-280', actualPrice: 240, keyIngredients: ['hyaluronic acid', 'vitamin b5', 'glycerin'], whyRecommended: 'Multi-weight HA for deep hydration at a fraction of the price. Clean, transparent labeling.', suitableFor: ['dry', 'dehydrated', 'all'], rating: 4.3, stepType: 'serum' },
  { id: 'sr-low-3', name: 'Dot & Key Watermelon Vitamin C Serum', brand: 'Dot & Key', priceCategory: 'low', priceRange: '₹300-400', actualPrice: 350, keyIngredients: ['vitamin c', 'hyaluronic acid', 'watermelon'], whyRecommended: 'Brightening serum with stable Vitamin C derivative. Fun branding, effective formula.', suitableFor: ['dull skin', 'pigmentation', 'oily'], rating: 4.1, stepType: 'serum' },
  { id: 'sr-low-4', name: 'Plum 10% Niacinamide Serum', brand: 'Plum', priceCategory: 'low', priceRange: '₹250-350', actualPrice: 300, keyIngredients: ['niacinamide', 'rice water', 'glycerin'], whyRecommended: 'Affordable niacinamide serum with added rice water for brightening. Vegan and cruelty-free.', suitableFor: ['oily', 'combination', 'pigmentation'], rating: 4.0, stepType: 'serum' },
  // Medium Budget
  { id: 'sr-med-1', name: 'The Ordinary Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', priceCategory: 'medium', priceRange: '₹300-450', actualPrice: 380, keyIngredients: ['niacinamide', 'zinc pca'], whyRecommended: 'The world\'s most popular serum. High-strength niacinamide + zinc for oil control and pore reduction at an incredible price.', suitableFor: ['oily', 'combination', 'acne-prone'], rating: 4.3, stepType: 'serum' },
  { id: 'sr-med-2', name: 'The Ordinary Hyaluronic Acid 2% + B5', brand: 'The Ordinary', priceCategory: 'medium', priceRange: '₹300-450', actualPrice: 350, keyIngredients: ['hyaluronic acid', 'vitamin b5', 'crosspolymer'], whyRecommended: 'Multi-depth hydration with three HA molecular weights. Vitamin B5 enhances surface healing.', suitableFor: ['dry', 'dehydrated', 'all'], rating: 4.4, stepType: 'serum' },
  { id: 'sr-med-3', name: 'Paula\'s Choice C15 Super Booster', brand: 'Paula\'s Choice', priceCategory: 'medium', priceRange: '₹600-900', actualPrice: 750, keyIngredients: ['vitamin c', 'vitamin e', 'ferulic acid'], whyRecommended: 'Stabilized 15% Vitamin C with Vitamin E + Ferulic Acid. The gold standard antioxidant combo for brightening.', suitableFor: ['dull skin', 'aging', 'pigmentation'], rating: 4.5, stepType: 'serum' },
  { id: 'sr-med-4', name: 'Cosrx Advanced Snail 96 Mucin Power Essence', brand: 'Cosrx', priceCategory: 'medium', priceRange: '₹500-700', actualPrice: 600, keyIngredients: ['snail mucin', 'hyaluronic acid', 'glycerin'], whyRecommended: 'K-beauty sensation. 96% snail mucin repairs, hydrates, and soothes. The most versatile serum for any skin type.', suitableFor: ['all', 'acne-prone', 'sensitive', 'aging'], rating: 4.7, stepType: 'serum' },
  // High Budget
  { id: 'sr-high-1', name: 'Drunk Elephant C-Firma Fresh Day Serum', brand: 'Drunk Elephant', priceCategory: 'high', priceRange: '₹2200-3000', actualPrice: 2600, keyIngredients: ['vitamin c', 'ferulic acid', 'vitamin e'], whyRecommended: 'Fresh-mixed 15% L-ascorbic acid serum. Maximum potency antioxidant protection. Celebrity favorite.', suitableFor: ['aging', 'pigmentation', 'dull skin'], rating: 4.4, stepType: 'serum' },
  { id: 'sr-high-2', name: 'SkinCeuticals C E Ferulic', brand: 'SkinCeuticals', priceCategory: 'high', priceRange: '₹4500-6000', actualPrice: 5200, keyIngredients: ['vitamin c', 'vitamin e', 'ferulic acid'], whyRecommended: 'The most scientifically-backed Vitamin C serum in existence. Provides 8x environmental protection. Used by dermatologists worldwide.', suitableFor: ['aging', 'pigmentation', 'all'], rating: 4.6, stepType: 'serum' },

  // ═══ MOISTURIZERS ═══
  // Low Budget
  { id: 'mo-low-1', name: 'Neutrogena Hydro Boost Water Gel', brand: 'Neutrogena', priceCategory: 'low', priceRange: '₹200-300', actualPrice: 250, keyIngredients: ['hyaluronic acid', 'glycerin', 'dimethicone'], whyRecommended: 'Lightweight water-gel formula perfect for oily skin. Hydrates without greasiness. Widely available.', suitableFor: ['oily', 'combination'], rating: 4.2, stepType: 'moisturizer' },
  { id: 'mo-low-2', name: 'Pond\'s Super Light Gel Moisturizer', brand: 'Pond\'s', priceCategory: 'low', priceRange: '₹150-250', actualPrice: 200, keyIngredients: ['hyaluronic acid', 'vitamin e'], whyRecommended: 'Ultra-affordable gel moisturizer. Lightweight, non-greasy, perfect for Indian weather.', suitableFor: ['oily', 'combination', 'all'], rating: 4.0, stepType: 'moisturizer' },
  { id: 'mo-low-3', name: 'Himalaya Nourishing Skin Cream', brand: 'Himalaya', priceCategory: 'low', priceRange: '₹100-180', actualPrice: 140, keyIngredients: ['aloe vera', 'winter cherry', 'glycerin'], whyRecommended: 'Classic affordable cream with natural ingredients. Good for basic dry skin hydration.', suitableFor: ['dry', 'sensitive'], rating: 3.9, stepType: 'moisturizer' },
  { id: 'mo-low-4', name: 'Joy Skin Fruits Moisturiser', brand: 'Joy', priceCategory: 'low', priceRange: '₹100-150', actualPrice: 120, keyIngredients: ['fruit extracts', 'glycerin', 'aloe vera'], whyRecommended: 'Budget-friendly moisturizer with fruit extracts. Lightweight for daily use.', suitableFor: ['combination', 'normal'], rating: 3.7, stepType: 'moisturizer' },
  // Medium Budget
  { id: 'mo-med-1', name: 'CeraVe Moisturizing Cream', brand: 'CeraVe', priceCategory: 'medium', priceRange: '₹450-650', actualPrice: 550, keyIngredients: ['ceramides', 'hyaluronic acid', 'petrolatum'], whyRecommended: 'The most recommended moisturizer by dermatologists worldwide. MVE technology releases ceramides over 24 hours. Barrier repair gold standard.', suitableFor: ['dry', 'sensitive', 'all'], rating: 4.7, stepType: 'moisturizer' },
  { id: 'mo-med-2', name: 'CeraVe PM Facial Moisturizing Lotion', brand: 'CeraVe', priceCategory: 'medium', priceRange: '₹400-550', actualPrice: 480, keyIngredients: ['ceramides', 'niacinamide', 'hyaluronic acid'], whyRecommended: 'Lightweight night lotion with niacinamide for oil control + ceramides for barrier repair. Perfect all-rounder.', suitableFor: ['oily', 'combination', 'acne-prone'], rating: 4.5, stepType: 'moisturizer' },
  { id: 'mo-med-3', name: 'La Roche-Posay Toleriane Double Repair', brand: 'La Roche-Posay', priceCategory: 'medium', priceRange: '₹500-700', actualPrice: 600, keyIngredients: ['ceramides', 'niacinamide', 'la roche-posay thermal water'], whyRecommended: 'French pharmacy excellence. Double-action formula repairs barrier + soothes. Thermal water reduces irritation.', suitableFor: ['sensitive', 'dry', 'all'], rating: 4.6, stepType: 'moisturizer' },
  // High Budget
  { id: 'mo-high-1', name: 'Kiehl\'s Ultra Facial Cream', brand: 'Kiehl\'s', priceCategory: 'high', priceRange: '₹1000-1500', actualPrice: 1200, keyIngredients: ['squalane', 'glacial glycoprotein', 'ceramides'], whyRecommended: 'Iconic moisturizer used on Everest expeditions. 24-hour hydration with unique glacial proteins. Beloved worldwide.', suitableFor: ['all', 'dry', 'sensitive'], rating: 4.5, stepType: 'moisturizer' },
  { id: 'mo-high-2', name: 'Drunk Elephant Lala Retro Whipped Cream', brand: 'Drunk Elephant', priceCategory: 'high', priceRange: '₹1500-2200', actualPrice: 1800, keyIngredients: ['ceramides', 'marula oil', 'squalane'], whyRecommended: 'Clean-beauty luxury. Six African oils + ceramides in a whipped texture. Repairs barrier while you sleep.', suitableFor: ['dry', 'aging', 'sensitive'], rating: 4.4, stepType: 'moisturizer' },

  // ═══ SUNSCREENS ═══
  // Low Budget
  { id: 'sp-low-1', name: 'Lotus Herbals Safe Sun SPF 50', brand: 'Lotus Herbals', priceCategory: 'low', priceRange: '₹180-280', actualPrice: 220, keyIngredients: ['zinc oxide', 'green tea', 'comfrey'], whyRecommended: 'Affordable SPF 50 with no white cast. One of the best budget sunscreens in India.', suitableFor: ['oily', 'combination', 'all'], rating: 4.0, stepType: 'sunscreen' },
  { id: 'sp-low-2', name: 'Lakme Sun Expert SPF 50 PA+++ ', brand: 'Lakme', priceCategory: 'low', priceRange: '₹150-250', actualPrice: 200, keyIngredients: ['titanium dioxide', 'niacinamide', 'aloe vera'], whyRecommended: 'India\'s most popular sunscreen. Affordable, widely available, lightweight formula.', suitableFor: ['all', 'combination'], rating: 3.9, stepType: 'sunscreen' },
  { id: 'sp-low-3', name: 'Re\'equil UV Shield Matte Sunscreen Gel', brand: 'Re\'equil', priceCategory: 'low', priceRange: '₹300-450', actualPrice: 380, keyIngredients: ['tinosorb s', 'tinosorb m', 'zinc oxide'], whyRecommended: 'Best budget matte sunscreen. Advanced UV filters, no white cast, non-greasy gel formula. Indian brand favorite.', suitableFor: ['oily', 'combination', 'acne-prone'], rating: 4.5, stepType: 'sunscreen' },
  // Medium Budget
  { id: 'sp-med-1', name: 'Bioderma Photoderm Aquafluide SPF 50+', brand: 'Bioderma', priceCategory: 'medium', priceRange: '₹450-650', actualPrice: 550, keyIngredients: ['tinosorb s', 'glycerin', 'ectoin'], whyRecommended: 'French pharmacy sunscreen. Ultra-light fluid texture, zero white cast, photostable UV filters. Dermatologist gold standard.', suitableFor: ['all', 'oily', 'sensitive'], rating: 4.6, stepType: 'sunscreen' },
  { id: 'sp-med-2', name: 'La Roche-Posay Anthelios SPF 50+', brand: 'La Roche-Posay', priceCategory: 'medium', priceRange: '₹550-750', actualPrice: 650, keyIngredients: ['mexoryl sx', 'tinosorb', 'thermal water'], whyRecommended: 'World\'s most tested sunscreen formula. Advanced Mexoryl filters provide broad-spectrum protection. Non-comedogenic.', suitableFor: ['sensitive', 'all'], rating: 4.7, stepType: 'sunscreen' },
  { id: 'sp-med-3', name: 'Neutrogena Ultra Sheer Dry-Touch SPF 50+', brand: 'Neutrogena', priceCategory: 'medium', priceRange: '₹300-450', actualPrice: 380, keyIngredients: ['avobenzone', 'helioplex', 'oxybenzone'], whyRecommended: 'Classic dry-touch sunscreen. Lightweight, non-greasy, water-resistant. Great for daily wear under makeup.', suitableFor: ['oily', 'combination', 'all'], rating: 4.2, stepType: 'sunscreen' },
  // High Budget
  { id: 'sp-high-1', name: 'Supergoop! Unseen Sunscreen SPF 40', brand: 'Supergoop!', priceCategory: 'high', priceRange: '₹1200-1800', actualPrice: 1500, keyIngredients: ['avobenzone', 'homosalate', 'vitamin e'], whyRecommended: 'The viral clear-gel sunscreen. Invisible, weightless, doubles as primer. SPF 40 with clean formula.', suitableFor: ['all', 'oily'], rating: 4.5, stepType: 'sunscreen' },
  { id: 'sp-high-2', name: 'EltaMD UV Clear Broad-Spectrum SPF 46', brand: 'EltaMD', priceCategory: 'high', priceRange: '₹1500-2200', actualPrice: 1800, keyIngredients: ['zinc oxide', 'niacinamide', 'hyaluronic acid'], whyRecommended: 'Dermatologist\'s #1 recommendation. Niacinamide calms acne while zinc oxide protects. Medical-grade formula.', suitableFor: ['acne-prone', 'sensitive', 'all'], rating: 4.7, stepType: 'sunscreen' },

  // ═══ TREATMENTS (Night) ═══
  // Low Budget
  { id: 'tr-low-1', name: 'Minimalist 2% Salicylic Acid Serum', brand: 'Minimalist', priceCategory: 'low', priceRange: '₹220-300', actualPrice: 260, keyIngredients: ['salicylic acid', 'willow bark', 'green tea'], whyRecommended: 'Best budget BHA treatment. 2% salicylic acid unclogs pores, reduces acne. Clean, transparent formula.', suitableFor: ['oily', 'acne-prone', 'blackheads'], rating: 4.3, stepType: 'treatment' },
  { id: 'tr-low-2', name: 'Salyzap Face Gel (Benzoyl Peroxide)', brand: 'Salyzap', priceCategory: 'low', priceRange: '₹150-250', actualPrice: 200, keyIngredients: ['benzoyl peroxide', 'tea tree', 'aloe vera'], whyRecommended: 'Affordable benzoyl peroxide spot treatment. Kills acne bacteria directly. Pharmacy staple.', suitableFor: ['acne-prone', 'oily'], rating: 4.0, stepType: 'treatment' },
  { id: 'tr-low-3', name: 'Saffire Nomarks Cream', brand: 'Saffire', priceCategory: 'low', priceRange: '₹100-180', actualPrice: 140, keyIngredients: ['turmeric', 'saffron', 'aloe vera'], whyRecommended: 'Ayurvedic dark spot treatment. Natural ingredients for gentle pigmentation reduction.', suitableFor: ['pigmentation', 'sensitive'], rating: 3.8, stepType: 'treatment' },
  // Medium Budget
  { id: 'tr-med-1', name: 'Paula\'s Choice 2% BHA Liquid Exfoliant', brand: 'Paula\'s Choice', priceCategory: 'medium', priceRange: '₹700-1000', actualPrice: 850, keyIngredients: ['salicylic acid', 'green tea', 'butylene glycol'], whyRecommended: 'The internet\'s most loved exfoliant. 2% BHA in a lightweight liquid that visibly reduces pores and blackheads in 2 weeks.', suitableFor: ['oily', 'combination', 'acne-prone', 'blackheads'], rating: 4.6, stepType: 'treatment' },
  { id: 'tr-med-2', name: 'The Ordinary Retinol 0.5% in Squalane', brand: 'The Ordinary', priceCategory: 'medium', priceRange: '₹350-500', actualPrice: 420, keyIngredients: ['retinol', 'squalane', 'vitamin e'], whyRecommended: 'Entry-level retinol in hydrating squalane. Best value anti-aging treatment. Builds collagen and smooths texture.', suitableFor: ['aging', 'acne-prone', 'pigmentation'], rating: 4.3, stepType: 'treatment' },
  { id: 'tr-med-3', name: 'Aziderm 10% Gel (Azelaic Acid)', brand: 'Micro Labs', priceCategory: 'medium', priceRange: '₹200-350', actualPrice: 280, keyIngredients: ['azelaic acid'], whyRecommended: 'Prescription-strength azelaic acid at OTC price. Reduces redness, acne, and pigmentation. Dermatologist recommended.', suitableFor: ['rosacea', 'acne-prone', 'pigmentation', 'sensitive'], rating: 4.4, stepType: 'treatment' },
  // High Budget
  { id: 'tr-high-1', name: 'SkinCeuticals Retinol 0.5 Night Cream', brand: 'SkinCeuticals', priceCategory: 'high', priceRange: '₹2500-3500', actualPrice: 3000, keyIngredients: ['retinol', 'shea butter', 'bisabolol'], whyRecommended: 'Medical-grade retinol with soothing bisabolol. Maximum anti-aging results with minimal irritation. Worth the investment.', suitableFor: ['aging', 'pigmentation', 'acne-prone'], rating: 4.5, stepType: 'treatment' },
  { id: 'tr-high-2', name: 'Differin Gel (Adapalene 0.1%)', brand: 'Differin', priceCategory: 'high', priceRange: '₹600-900', actualPrice: 750, keyIngredients: ['adapalene'], whyRecommended: 'FDA-approved retinoid for acne. Stronger than retinol, specifically formulated for acne treatment. Once-daily application.', suitableFor: ['acne-prone', 'oily', 'blackheads'], rating: 4.6, stepType: 'treatment' },
];

// ── Score a product for user profile ──
function scoreProduct(product: RecommendedProduct, skinType: SkinType | '', concerns: SkinConcern[], goals: SkinGoal[]): number {
  let score = 50;

  // Skin type match (+20)
  if (product.suitableFor.some(s =>
    s.toLowerCase() === skinType.toLowerCase() ||
    s === 'all' ||
    (skinType === '' && s === 'all')
  )) {
    score += 20;
  }

  // Concern match (+15 per matching concern)
  for (const concern of concerns) {
    if (product.suitableFor.some(s =>
      s.toLowerCase().includes(concern.toLowerCase()) ||
      concern.toLowerCase().includes(s.toLowerCase())
    )) {
      score += 15;
    }
    // Ingredient match for concern
    if (product.keyIngredients.some(ing => isIngredientGoodForConcern(ing, concern))) {
      score += 5;
    }
  }

  // Goal match (+10)
  for (const goal of goals) {
    if (product.suitableFor.some(s =>
      isGoalIngredientMatch(product.keyIngredients, goal)
    )) {
      score += 10;
    }
  }

  // Rating bonus
  score += (product.rating - 3.5) * 5;

  return score;
}

function isIngredientGoodForConcern(ingredient: string, concern: SkinConcern): boolean {
  const map: Record<string, string[]> = {
    acne: ['salicylic acid', 'benzoyl peroxide', 'niacinamide', 'tea tree', 'zinc', 'adapalene', 'azelaic acid'],
    pigmentation: ['vitamin c', 'niacinamide', 'alpha arbutin', 'licorice', 'kojic acid', 'glycolic acid'],
    dryness: ['hyaluronic acid', 'ceramides', 'squalane', 'glycerin', 'shea butter', 'petrolatum'],
    aging: ['retinol', 'peptides', 'vitamin c', 'glycolic acid', 'niacinamide', 'bakuchiol'],
    oiliness: ['niacinamide', 'salicylic acid', 'zinc', 'clay', 'witch hazel', 'green tea'],
    blackheads: ['salicylic acid', 'bha', 'glycolic acid', 'niacinamide', 'clay'],
    sensitivity: ['centella asiatica', 'ceramides', 'panthenol', 'aloe vera', 'squalane', 'colloidal oatmeal'],
  };
  return (map[concern] || []).some(i => ingredient.toLowerCase().includes(i));
}

function isGoalIngredientMatch(ingredients: string[], goal: SkinGoal): boolean {
  const map: Record<string, string[]> = {
    glow: ['vitamin c', 'glycolic acid', 'niacinamide', 'hyaluronic acid'],
    'acne-free': ['salicylic acid', 'benzoyl peroxide', 'niacinamide', 'adapalene', 'azelaic acid'],
    hydration: ['hyaluronic acid', 'ceramides', 'glycerin', 'squalane'],
    'anti-aging': ['retinol', 'peptides', 'vitamin c', 'niacinamide'],
    brightening: ['vitamin c', 'niacinamide', 'alpha arbutin', 'glycolic acid'],
    'oil-control': ['niacinamide', 'salicylic acid', 'zinc', 'witch hazel'],
    'sensitive-care': ['centella asiatica', 'ceramides', 'panthenol', 'aloe vera'],
    'even-tone': ['niacinamide', 'vitamin c', 'alpha arbutin', 'azelaic acid'],
  };
  const goalIngredients = map[goal] || [];
  return ingredients.some(i => goalIngredients.some(gi => i.toLowerCase().includes(gi)));
}

// ═══════════════════════════════════════════════════════════
// MAIN EXPORT: Get recommended products for routine steps
// ═══════════════════════════════════════════════════════════
export function getRecommendedProducts(
  steps: RoutineStep[],
  budget: BudgetLevel,
  skinType: SkinType | '',
  concerns: SkinConcern[],
  goals: SkinGoal[]
): import('../types').RecommendedProduct[] {
  const results: import('../types').RecommendedProduct[] = [];

  for (const step of steps) {
    // Filter products by step type
    let candidates = productDatabase.filter(p => p.stepType === step.productType);

    // Filter by budget (also include lower budgets)
    if (budget === 'low') {
      // Prefer low, but allow medium as alternative
      candidates = candidates.filter(p => p.priceCategory === 'low');
      if (candidates.length === 0) candidates = productDatabase.filter(p => p.stepType === step.productType);
    } else if (budget === 'medium') {
      candidates = candidates.filter(p => p.priceCategory === 'low' || p.priceCategory === 'medium');
      if (candidates.length === 0) candidates = productDatabase.filter(p => p.stepType === step.productType);
    }
    // High budget: all products available

    if (candidates.length === 0) {
      candidates = productDatabase.filter(p => p.stepType === step.productType);
    }

    // Score each product
    const scored = candidates.map(p => ({
      product: p,
      score: scoreProduct(p, skinType, concerns, goals)
    }));

    // Sort by score (highest first)
    scored.sort((a, b) => b.score - a.score);

    // Take the best match
    if (scored.length > 0) {
      results.push(scored[0].product);
    }
  }

  return results;
}

export { productDatabase };
