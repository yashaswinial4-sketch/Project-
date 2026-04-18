// ─────────────────────────────────────────────────────────────
// PERSONALIZED ROUTINE GENERATOR ENGINE (TASK 6)
// Generates morning + night routines based on skin profile,
// concerns, goals, and budget — with full explainability
// ─────────────────────────────────────────────────────────────

import type {
  SkinType, SkinConcern, SkinGoal, BudgetLevel,
  RoutineInput, RoutineStep, RoutineResult,
  RoutineExplainability, ProductRecommendation
} from '../types';

// ── Product catalog organized by step, skin type, and budget ──

interface CatalogEntry {
  name: string;
  brand: string;
  low: ProductRecommendation;
  medium: ProductRecommendation;
  high: ProductRecommendation;
}

// ── CLEANSER CATALOG ──
const cleanserCatalog: Record<string, CatalogEntry> = {
  oily: {
    name: 'Foaming/Gel Cleanser',
    brand: 'Oil-Control',
    low: { name: 'Minimalist Salicylic Acid Cleanser', brand: 'Minimalist', priceRange: '\u20b9249', priceValue: 249, currency: 'INR', keyIngredients: ['Salicylic Acid 0.5%', 'Glycerin'], whyRecommended: 'Affordable BHA cleanser that unclogs pores without over-drying. Perfect for oily skin on a budget.', budgetLevel: 'low', rating: 4.3, availability: 'Amazon, Nykaa' },
    medium: { name: 'CeraVe Foaming Cleanser', brand: 'CeraVe', priceRange: '\u20b9550', priceValue: 550, currency: 'INR', keyIngredients: ['Ceramides', 'Niacinamide', 'Hyaluronic Acid'], whyRecommended: 'Dermatologist-recommended foaming cleanser. Ceramides repair barrier while niacinamide controls oil.', budgetLevel: 'medium', rating: 4.6, availability: 'Amazon, Pharmeasy' },
    high: { name: 'La Roche-Posay Effaclar Gel', brand: 'La Roche-Posay', priceRange: '\u20b91,250', priceValue: 1250, currency: 'INR', keyIngredients: ['Zinc PIDO', 'Coco-betaine', 'Thermal Spring Water'], whyRecommended: 'Premium oil-control cleanser with soothing thermal water. Gentle yet effective for stubborn oiliness.', budgetLevel: 'high', rating: 4.7, availability: 'Nykaa, Dermastore' },
  },
  dry: {
    name: 'Cream/Hydrating Cleanser',
    brand: 'Hydrating',
    low: { name: 'Himalaya Hydrating Face Wash', brand: 'Himalaya', priceRange: '\u20b9175', priceValue: 175, currency: 'INR', keyIngredients: ['Aloe Vera', 'Cucumber'], whyRecommended: 'Gentle herbal cleanser that hydrates while cleansing. No harsh surfactants for dry skin.', budgetLevel: 'low', rating: 4.1, availability: 'Amazon, Local Stores' },
    medium: { name: 'CeraVe Hydrating Cleanser', brand: 'CeraVe', priceRange: '\u20b9550', priceValue: 550, currency: 'INR', keyIngredients: ['Ceramides', 'Hyaluronic Acid', 'Glycerin'], whyRecommended: 'The gold standard for dry skin cleansing. Non-foaming, ceramide-rich formula restores moisture barrier.', budgetLevel: 'medium', rating: 4.7, availability: 'Amazon, Pharmeasy' },
    high: { name: 'Bioderma Hydrabio Gel Moussant', brand: 'Bioderma', priceRange: '\u20b91,090', priceValue: 1090, currency: 'INR', keyIngredients: ['Niacinamide', 'Salicylic Acid', 'Vitamin PP'], whyRecommended: 'French pharmacy gem with Aquagenium technology that teaches skin to rehydrate itself.', budgetLevel: 'high', rating: 4.6, availability: 'Nykaa, Skinbae' },
  },
  combination: {
    name: 'Gentle Balancing Cleanser',
    brand: 'Balancing',
    low: { name: 'Cetaphil Gentle Skin Cleanser', brand: 'Cetaphil', priceRange: '\u20b9225', priceValue: 225, currency: 'INR', keyIngredients: ['Glycerin', 'Panthenol'], whyRecommended: 'Classic gentle cleanser suitable for combination skin. Balances without stripping natural oils.', budgetLevel: 'low', rating: 4.2, availability: 'Amazon, Pharmeasy' },
    medium: { name: 'Vichy Purete Thermale', brand: 'Vichy', priceRange: '\u20b9720', priceValue: 720, currency: 'INR', keyIngredients: ['Vichy Mineral Water', 'Glycerin', 'Vitamin E'], whyRecommended: 'French pharmacy cleanser with mineral-rich water that balances combination skin perfectly.', budgetLevel: 'medium', rating: 4.4, availability: 'Nykaa, Amazon' },
    high: { name: 'Fresh Soy Face Cleanser', brand: 'Fresh', priceRange: '\u20b92,200', priceValue: 2200, currency: 'INR', keyIngredients: ['Soy Proteins', 'Rosewater', 'Cucumber Extract'], whyRecommended: 'Luxury gel cleanser with soy proteins that balance oil and hydration simultaneously.', budgetLevel: 'high', rating: 4.5, availability: 'Sephora, Nykaa' },
  },
  sensitive: {
    name: 'Ultra-Gentle Cleanser',
    brand: 'Sensitive',
    low: { name: 'Simple Kind to Skin Cleanser', brand: 'Simple', priceRange: '\u20b9199', priceValue: 199, currency: 'INR', keyIngredients: ['Vitamin B5', 'Vitamin E', 'No Artificial Perfume'], whyRecommended: 'Zero-irritation formula with no harsh chemicals, fragrances, or dyes. Ideal for reactive skin.', budgetLevel: 'low', rating: 4.2, availability: 'Amazon, BigBasket' },
    medium: { name: 'Avène Extremely Gentle Cleanser', brand: 'Avène', priceRange: '\u20b9850', priceValue: 850, currency: 'INR', keyIngredients: ['Avène Thermal Spring Water', 'Glycerin', 'Squalane'], whyRecommended: 'Specifically formulated for hypersensitive skin with soothing French thermal spring water.', budgetLevel: 'medium', rating: 4.6, availability: 'Nykaa, Dermatologist Stores' },
    high: { name: 'La Roche-Posay Toleriane Cleanser', brand: 'La Roche-Posay', priceRange: '\u20b91,100', priceValue: 1100, currency: 'INR', keyIngredients: ['La Roche-Posay Thermal Water', 'Ceramides', 'Niacinamide', 'Glycerin'], whyRecommended: 'Maximum tolerance formula for ultra-sensitive skin. Proven to reduce sensitivity day after day.', budgetLevel: 'high', rating: 4.8, availability: 'Nykaa, Pharmeasy' },
  },
};

// ── TONER CATALOG ──
const tonerCatalog: Record<string, CatalogEntry> = {
  oily: {
    name: 'Pore-Minimizing Toner', brand: 'Oil-Control',
    low: { name: 'Plum Green Tea Toner', brand: 'Plum', priceRange: '\u20b9280', priceValue: 280, currency: 'INR', keyIngredients: ['Green Tea', 'Glycolic Acid', 'Niacinamide'], whyRecommended: 'Budget-friendly toner with green tea to control oil and glycolic acid to refine pores.', budgetLevel: 'low', rating: 4.2, availability: 'Amazon, Plum Website' },
    medium: { name: 'PIXI Glow Tonic', brand: 'PIXI', priceRange: '\u20b9790', priceValue: 790, currency: 'INR', keyIngredients: ['5% Glycolic Acid', 'Aloe Vera', 'Ginseng'], whyRecommended: 'Cult-favorite exfoliating toner with 5% glycolic acid for smoother, less oily skin.', budgetLevel: 'medium', rating: 4.5, availability: 'Nykaa, Amazon' },
    high: { name: 'Biologique Recherche P50', brand: 'Biologique Recherche', priceRange: '\u20b93,500', priceValue: 3500, currency: 'INR', keyIngredients: ['Lactic Acid', 'Gluconic Acid', 'Niacinamide'], whyRecommended: 'The legendary "facial in a bottle" — rebalances skin pH and regulates oil like nothing else.', budgetLevel: 'high', rating: 4.7, availability: 'Select Salons, Official Website' },
  },
  dry: {
    name: 'Hydrating Essence', brand: 'Hydrating',
    low: { name: 'Klairs Supple Preparation Toner', brand: 'Klairs', priceRange: '\u20b9650', priceValue: 650, currency: 'INR', keyIngredients: ['Hyaluronic Acid', 'Beta-Glucan', 'Centella Asiatica'], whyRecommended: 'K-beauty favorite that deeply hydrates without stickiness. Perfect prep for dry skin.', budgetLevel: 'low', rating: 4.6, availability: 'Amazon, Nykaa' },
    medium: { name: 'Laneige Cream Skin Toner', brand: 'Laneige', priceRange: '\u20b91,200', priceValue: 1200, currency: 'INR', keyIngredients: ['White Leaf Tea Water', 'Cream Blending Technology'], whyRecommended: 'Revolutionary toner + cream hybrid that floods dry skin with lasting moisture.', budgetLevel: 'medium', rating: 4.7, availability: 'Nykaa, Sephora' },
    high: { name: 'Sisley Floral Toning Lotion', brand: 'Sisley', priceRange: '\u20b94,200', priceValue: 4200, currency: 'INR', keyIngredients: ['Rose Flower Water', 'Sage', 'Rosemary Extracts'], whyRecommended: 'Ultra-luxe toner with Bulgarian rose water that instantly plumps and refreshes dry skin.', budgetLevel: 'high', rating: 4.4, availability: 'Select Luxury Stores' },
  },
  combination: {
    name: 'Balancing Toner', brand: 'Balancing',
    low: { name: 'Dot & Key Vitamin C Toner', brand: 'Dot & Key', priceRange: '\u20b9349', priceValue: 349, currency: 'INR', keyIngredients: ['Vitamin C', 'Niacinamide', 'Aloe Vera'], whyRecommended: 'Affordable balancing toner that hydrates dry areas while controlling oil in T-zone.', budgetLevel: 'low', rating: 4.1, availability: 'Nykaa, Amazon' },
    medium: { name: 'Thayers Alcohol-Free Toner', brand: 'Thayers', priceRange: '\u20b9799', priceValue: 799, currency: 'INR', keyIngredients: ['Witch Hazel', 'Aloe Vera', 'Rosewater'], whyRecommended: 'Alcohol-free witch hazel toner that balances without the drying effects of traditional toners.', budgetLevel: 'medium', rating: 4.5, availability: 'Amazon, Nykaa' },
    high: { name: 'Dior Virgin Toner', brand: 'Dior', priceRange: '\u20b93,200', priceValue: 3200, currency: 'INR', keyIngredients: ['Rose Floral Water', 'Glycolic Acid', 'Hibiscus'], whyRecommended: 'Premium micro-exfoliating toner that reveals radiant, balanced skin with every use.', budgetLevel: 'high', rating: 4.3, availability: 'Sephora, Dior Stores' },
  },
  sensitive: {
    name: 'Calming Toner', brand: 'Sensitive',
    low: { name: 'Bioderma Sensibio Toner', brand: 'Bioderma', priceRange: '\u20b9549', priceValue: 549, currency: 'INR', keyIngredients: ['Cucumis Sativus', 'Soothing Active', 'Glycerin'], whyRecommended: 'Specially formulated for sensitive skin with patented soothing complex. Zero irritation guarantee.', budgetLevel: 'low', rating: 4.4, availability: 'Nykaa, Amazon' },
    medium: { name: 'Avène Gentle Toning Lotion', brand: 'Avène', priceRange: '\u20b9890', priceValue: 890, currency: 'INR', keyIngredients: ['Avène Thermal Spring Water', 'Squalane'], whyRecommended: 'Ultra-gentle alcohol-free toner with 99% thermal spring water for maximum tolerance.', budgetLevel: 'medium', rating: 4.6, availability: 'Nykaa, Pharmeasy' },
    high: { name: 'Chantecaille Rose Toner', brand: 'Chantecaille', priceRange: '\u20b95,500', priceValue: 5500, currency: 'INR', keyIngredients: ['Rose Water', 'Aloe Vera', 'Ginseng Root'], whyRecommended: 'Luxurious pure rose water toner that calms and preps even the most reactive skin.', budgetLevel: 'high', rating: 4.5, availability: 'Select Luxury Retailers' },
  },
};

// ── SERUM CATALOG ──
const serumCatalog: Record<string, Record<string, CatalogEntry>> = {
  oily: {
    acne: {
      name: 'BHA Acne Serum', brand: 'Acne-Fighting',
      low: { name: 'Minimalist Salicylic Acid 2%', brand: 'Minimalist', priceRange: '\u20b9299', priceValue: 299, currency: 'INR', keyIngredients: ['2% Salicylic Acid', 'Willow Bark', 'Green Tea'], whyRecommended: 'Clinical-grade BHA serum that unclogs pores and prevents breakouts. Student-friendly pricing.', budgetLevel: 'low', rating: 4.4, availability: 'Amazon, Minimalist Website' },
      medium: { name: 'Paula\'s Choice 2% BHA Liquid', brand: 'Paula\'s Choice', priceRange: '\u20b91,150', priceValue: 1150, currency: 'INR', keyIngredients: ['2% Salicylic Acid', 'Green Tea Extract', 'Butylene Glycol'], whyRecommended: 'The gold standard BHA exfoliant trusted by dermatologists worldwide for oily/acne-prone skin.', budgetLevel: 'medium', rating: 4.7, availability: 'Amazon, Nykaa' },
      high: { name: 'Drunk Elephant T.L.C. Framboos', brand: 'Drunk Elephant', priceRange: '\u20b95,400', priceValue: 5400, currency: 'INR', keyIngredients: ['10% AHA', '1% BHA', 'Raspberry Extract'], whyRecommended: 'Luxury blend of AHAs and BHAs that resurfaces skin while fighting acne and oil.', budgetLevel: 'high', rating: 4.5, availability: 'Sephora, Nykaa' },
    },
    glow: {
      name: 'Niacinamide Glow Serum', brand: 'Glow',
      low: { name: 'Plum 10% Niacinamide Serum', brand: 'Plum', priceRange: '\u20b9349', priceValue: 349, currency: 'INR', keyIngredients: ['10% Niacinamide', 'Rice Water', 'Green Tea'], whyRecommended: 'Affordable niacinamide serum that controls oil, reduces pores, and adds a healthy glow.', budgetLevel: 'low', rating: 4.2, availability: 'Amazon, Plum Website' },
      medium: { name: 'The Ordinary Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', priceRange: '\u20b9650', priceValue: 650, currency: 'INR', keyIngredients: ['10% Niacinamide', '1% Zinc PCA'], whyRecommended: 'Cult-favorite serum that visibly reduces blemishes and congestion while balancing oil.', budgetLevel: 'medium', rating: 4.5, availability: 'Amazon, Nykaa' },
      high: { name: 'SkinCeuticals Blemish + Age Defense', brand: 'SkinCeuticals', priceRange: '\u20b97,200', priceValue: 7200, currency: 'INR', keyIngredients: ['2% Dioic Acid', '0.3% LHA', '2% Salicylic Acid', '2.5% Glycolic Acid'], whyRecommended: 'Multi-action clinical serum that targets acne, oil, and aging simultaneously.', budgetLevel: 'high', rating: 4.6, availability: 'Dermatologist Clinics' },
    },
  },
  dry: {
    hydration: {
      name: 'Hyaluronic Acid Serum', brand: 'Hydrating',
      low: { name: 'Minimalist Hyaluronic Acid', brand: 'Minimalist', priceRange: '\u20b9279', priceValue: 279, currency: 'INR', keyIngredients: ['Multi-weight Hyaluronic Acid', 'Panthenol', 'Ceramide'], whyRecommended: 'Multi-weight HA that hydrates at every skin layer. Ceramide adds barrier support.', budgetLevel: 'low', rating: 4.5, availability: 'Amazon, Minimalist Website' },
      medium: { name: 'Vichy Mineral 89 Hyaluronic Acid', brand: 'Vichy', priceRange: '\u20b9990', priceValue: 990, currency: 'INR', keyIngredients: ['Hyaluronic Acid', 'Vichy Mineralizing Water', 'Vitamin B3'], whyRecommended: 'French pharmacy fortifying serum with 89% mineral-rich water for deep hydration.', budgetLevel: 'medium', rating: 4.6, availability: 'Nykaa, Amazon' },
      high: { name: 'SkinCeuticals H.A. Intensifier', brand: 'SkinCeuticals', priceRange: '\u20b97,800', priceValue: 7800, currency: 'INR', keyIngredients: ['1.3% Pure Hyaluronic Acid', '10% Proxylane', 'Licorice Extract'], whyRecommended: 'Clinical-grade HA intensifier that delivers visible plumping and volume over time.', budgetLevel: 'high', rating: 4.7, availability: 'Dermatologist Clinics' },
    },
    brightening: {
      name: 'Vitamin C Brightening Serum', brand: 'Brightening',
      low: { name: 'Minimalist Vitamin C 10%', brand: 'Minimalist', priceRange: '\u20b9299', priceValue: 299, currency: 'INR', keyIngredients: ['10% Ethyl Ascorbic Acid', 'Acetyl Glucosamine', 'Fullerenes'], whyRecommended: 'Stable vitamin C that brightens and protects without irritation. Great value for money.', budgetLevel: 'low', rating: 4.3, availability: 'Amazon, Minimalist Website' },
      medium: { name: 'TruSkin Vitamin C Serum', brand: 'TruSkin', priceRange: '\u20b91,099', priceValue: 1099, currency: 'INR', keyIngredients: ['Vitamin C', 'Hyaluronic Acid', 'Vitamin E', 'Jojoba Oil'], whyRecommended: 'Balanced brightening serum with added hydration. Perfect for dry skin needing glow.', budgetLevel: 'medium', rating: 4.4, availability: 'Amazon' },
      high: { name: 'SkinCeuticals C E Ferulic', brand: 'SkinCeuticals', priceRange: '\u20b913,500', priceValue: 13500, currency: 'INR', keyIngredients: ['15% L-Ascorbic Acid', '1% Vitamin E', '0.5% Ferulic Acid'], whyRecommended: 'The most studied and proven vitamin C serum in dermatology. Gold standard for brightening.', budgetLevel: 'high', rating: 4.8, availability: 'Dermatologist Clinics' },
    },
  },
  combination: {
    glow: {
      name: 'Niacinamide Balancing Serum', brand: 'Balancing',
      low: { name: 'BeBodywise Niacinamide 5%', brand: 'BeBodywise', priceRange: '\u20b9329', priceValue: 329, currency: 'INR', keyIngredients: ['5% Niacinamide', 'Hyaluronic Acid', 'Green Tea'], whyRecommended: 'Lightweight serum that balances oil production while keeping dry areas hydrated.', budgetLevel: 'low', rating: 4.2, availability: 'Amazon, Nykaa' },
      medium: { name: 'Cosrx Advanced Snail 96 Mucin', brand: 'Cosrx', priceRange: '\u20b91,050', priceValue: 1050, currency: 'INR', keyIngredients: ['96% Snail Mucin', 'Betaine', 'Panthenol'], whyRecommended: 'K-beauty holy grail that hydrates dry areas, calms irritation, and regulates oil simultaneously.', budgetLevel: 'medium', rating: 4.7, availability: 'Amazon, Nykaa' },
      high: { name: 'Estée Lauder Advanced Night Repair', brand: 'Estée Lauder', priceRange: '\u20b95,800', priceValue: 5800, currency: 'INR', keyIngredients: ['ChronoluxCB', 'Hyaluronic Acid', 'Peptides', 'Antioxidants'], whyRecommended: 'Legendary night serum that repairs, hydrates, and balances all skin zones overnight.', budgetLevel: 'high', rating: 4.7, availability: 'Sephora, Nykaa' },
    },
    acne: {
      name: 'Acne Control Serum', brand: 'Acne',
      low: { name: 'Plum Green Tea Anti-Acne Gel', brand: 'Plum', priceRange: '\u20b9349', priceValue: 349, currency: 'INR', keyIngredients: ['Green Tea', 'Willow Bark', 'Niacinamide'], whyRecommended: 'Gentle yet effective acne gel for combination skin. Controls breakouts without over-drying.', budgetLevel: 'low', rating: 4.1, availability: 'Amazon, Plum Website' },
      medium: { name: 'Paula\'s Choice 2% BHA Liquid Exfoliant', brand: 'Paula\'s Choice', priceRange: '\u20b91,150', priceValue: 1150, currency: 'INR', keyIngredients: ['2% Salicylic Acid', 'Green Tea Extract'], whyRecommended: 'Gentle BHA that targets pores in the T-zone while being kind to drier areas.', budgetLevel: 'medium', rating: 4.7, availability: 'Amazon, Nykaa' },
      high: { name: 'Sunday Riley U.F.O. Ultra-Clarifying', brand: 'Sunday Riley', priceRange: '\u20b94,200', priceValue: 4200, currency: 'INR', keyIngredients: ['1.5% Salicylic Acid', '1% Glycolic Acid', 'Tea Tree', 'Licorice'], whyRecommended: 'Premium multi-acne treatment that targets all types of breakouts and congestion.', budgetLevel: 'high', rating: 4.4, availability: 'Sephora, Nykaa' },
    },
  },
  sensitive: {
    hydration: {
      name: 'Barrier Repair Serum', brand: 'Sensitive',
      low: { name: 'Minimalist Ceramide Serum', brand: 'Minimalist', priceRange: '\u20b9319', priceValue: 319, currency: 'INR', keyIngredients: ['Ceramides', 'Cholesterol', 'Fatty Acids'], whyRecommended: 'Affordable barrier-repair serum with the ideal ceramide ratio for sensitive skin recovery.', budgetLevel: 'low', rating: 4.4, availability: 'Amazon, Minimalist Website' },
      medium: { name: 'Cosrx Advanced Snail 96 Mucin', brand: 'Cosrx', priceRange: '\u20b91,050', priceValue: 1050, currency: 'INR', keyIngredients: ['96% Snail Mucin', 'Panthenol', 'Betaine'], whyRecommended: 'Incredibly soothing and repairing. Snail mucin is nature\'s multi-healer for sensitive skin.', budgetLevel: 'medium', rating: 4.7, availability: 'Amazon, Nykaa' },
      high: { name: 'Drunk Elephant B-Hydra Intensive', brand: 'Drunk Elephant', priceRange: '\u20b93,800', priceValue: 3800, currency: 'INR', keyIngredients: ['Pro-Vitamin B5', 'Pineapple Ceramide', 'Vitamin B3'], whyRecommended: 'Ultra-gentle hydration serum with no essential oils or irritants. Perfect for reactive skin.', budgetLevel: 'high', rating: 4.5, availability: 'Sephora, Nykaa' },
    },
    brightening: {
      name: 'Gentle Brightening Serum', brand: 'Sensitive Brightening',
      low: { name: 'Deconstruct Niacinamide 5%', brand: 'Deconstruct', priceRange: '\u20b9339', priceValue: 339, currency: 'INR', keyIngredients: ['5% Niacinamide', 'Hyaluronic Acid', 'Centella'], whyRecommended: 'Low-concentration niacinamide gentle enough for sensitive skin while still brightening.', budgetLevel: 'low', rating: 4.3, availability: 'Amazon, Nykaa' },
      medium: { name: 'Avène D-Pigment Dark Spot Lightener', brand: 'Avène', priceRange: '\u20b91,450', priceValue: 1450, currency: 'INR', keyIngredients: ['Retinaldehyde', 'Niacinamide', 'Thermal Spring Water'], whyRecommended: 'Specially formulated for sensitive skin with pigmentation. Proven effective yet gentle.', budgetLevel: 'medium', rating: 4.5, availability: 'Nykaa, Pharmeasy' },
      high: { name: 'Skinceuticals Phyto Corrective Gel', brand: 'SkinCeuticals', priceRange: '\u20b96,500', priceValue: 6500, currency: 'INR', keyIngredients: ['Hydroquinone-free Botanicals', 'Cucumber Extract', 'Thyme Extract'], whyRecommended: 'Botanical brightening gel that reduces spots without any harsh chemicals or irritation.', budgetLevel: 'high', rating: 4.6, availability: 'Dermatologist Clinics' },
    },
  },
};

// ── MOISTURIZER CATALOG ──
const moisturizerCatalog: Record<string, CatalogEntry> = {
  oily: {
    name: 'Oil-Free Gel Moisturizer', brand: 'Lightweight',
    low: { name: 'Neutrogena Oil-Free Moisturizer', brand: 'Neutrogena', priceRange: '\u20b9299', priceValue: 299, currency: 'INR', keyIngredients: ['Hyaluronic Acid', 'Glycerin'], whyRecommended: 'Classic oil-free moisturizer trusted by dermatologists. Lightweight and non-comedogenic.', budgetLevel: 'low', rating: 4.2, availability: 'Amazon, Pharmeasy' },
    medium: { name: 'Neutrogena Hydro Boost Water Gel', brand: 'Neutrogena', priceRange: '\u20b9650', priceValue: 650, currency: 'INR', keyIngredients: ['Hyaluronic Acid', 'Trehalose', 'Glycerin'], whyRecommended: 'Water-gel formula that hydrates without oil. Absorbs instantly, perfect under sunscreen.', budgetLevel: 'medium', rating: 4.5, availability: 'Amazon, Nykaa' },
    high: { name: 'Tatcha The Water Cream', brand: 'Tatcha', priceRange: '\u20b95,200', priceValue: 5200, currency: 'INR', keyIngredients: ['Japanese Wild Rose', 'Tatcha Hadasei-3', 'Green Tea'], whyRecommended: 'Luxury water cream that controls oil with Japanese botanicals while maintaining deep hydration.', budgetLevel: 'high', rating: 4.6, availability: 'Sephora, Tatcha Website' },
  },
  dry: {
    name: 'Rich Cream Moisturizer', brand: 'Rich',
    low: { name: 'Nivea Soft Moisturizing Cream', brand: 'Nivea', priceRange: '\u20b9199', priceValue: 199, currency: 'INR', keyIngredients: ['Vitamin E', 'Jojoba Oil', 'Glycerin'], whyRecommended: 'Affordable rich cream that provides long-lasting moisture. Versatile for face and body.', budgetLevel: 'low', rating: 4.1, availability: 'Amazon, Local Stores' },
    medium: { name: 'CeraVe Moisturizing Cream', brand: 'CeraVe', priceRange: '\u20b9699', priceValue: 699, currency: 'INR', keyIngredients: ['Ceramides', 'Hyaluronic Acid', 'MVE Technology'], whyRecommended: 'Therapeutic cream with 3 essential ceramides and MVE release technology for 24-hour hydration.', budgetLevel: 'medium', rating: 4.7, availability: 'Amazon, Pharmeasy' },
    high: { name: 'Kiehl\'s Ultra Facial Cream', brand: 'Kiehl\'s', priceRange: '\u20b92,250', priceValue: 2250, currency: 'INR', keyIngredients: ['Squalane', 'Glacial Glycoprotein', 'Ceramides'], whyRecommended: 'Iconic moisturizer used in extreme climates. Provides 24-hour hydration with a silky finish.', budgetLevel: 'high', rating: 4.6, availability: 'Kiehl\'s Stores, Nykaa' },
  },
  combination: {
    name: 'Lightweight Balancing Cream', brand: 'Balancing',
    low: { name: 'Joy Skin Fruits Moisturizer', brand: 'Joy', priceRange: '\u20b9179', priceValue: 179, currency: 'INR', keyIngredients: ['Aloe Vera', 'Vitamin E', 'Fruit Extracts'], whyRecommended: 'Budget-friendly lightweight moisturizer that hydrates dry areas without making T-zone oily.', budgetLevel: 'low', rating: 3.9, availability: 'Amazon, Local Stores' },
    medium: { name: 'CeraVe PM Facial Moisturizing Lotion', brand: 'CeraVe', priceRange: '\u20b9669', priceValue: 669, currency: 'INR', keyIngredients: ['Ceramides', 'Niacinamide', 'Hyaluronic Acid'], whyRecommended: 'Perfect lightweight lotion for combination skin. Niacinamide regulates oil, ceramides hydrate.', budgetLevel: 'medium', rating: 4.6, availability: 'Amazon, Pharmeasy' },
    high: { name: 'Fresh Lotus Youth Preserve Moisturizer', brand: 'Fresh', priceRange: '\u20b93,500', priceValue: 3500, currency: 'INR', keyIngredients: ['Lotus Flower Extract', 'Licorice Root', 'Green Tea'], whyRecommended: 'Luxury gel cream that perfectly balances hydration and oil control with lotus extract.', budgetLevel: 'high', rating: 4.4, availability: 'Sephora, Nykaa' },
  },
  sensitive: {
    name: 'Ultra-Calming Cream', brand: 'Calming',
    low: { name: 'Bioderma Atoderm Cream', brand: 'Bioderma', priceRange: '\u20b9449', priceValue: 449, currency: 'INR', keyIngredients: ['Shea Butter', 'Glycerin', 'Vitamin PP'], whyRecommended: 'Specially formulated for reactive skin with a soothing complex that rebuilds the barrier.', budgetLevel: 'low', rating: 4.5, availability: 'Amazon, Nykaa' },
    medium: { name: 'La Roche-Posay Toleriane Dermallergo', brand: 'La Roche-Posay', priceRange: '\u20b91,250', priceValue: 1250, currency: 'INR', keyIngredients: ['NeuroSensine', 'Thermal Spring Water', 'Ceramides'], whyRecommended: 'Clinical formula proven to reduce skin sensitivity by 56%. Maximum tolerance guaranteed.', budgetLevel: 'medium', rating: 4.7, availability: 'Nykaa, Pharmeasy' },
    high: { name: 'Avène Tolerance Control Cream', brand: 'Avène', priceRange: '\u20b92,150', priceValue: 2150, currency: 'INR', keyIngredients: ['Avène Thermal Spring Water', 'Cer-Omega', 'Glycyrrhetinic Acid'], whyRecommended: 'Ultra-soothing cream with patented Cer-Omega that mimics skin\'s natural lipids.', budgetLevel: 'high', rating: 4.6, availability: 'Nykaa, Dermatologist Stores' },
  },
};

// ── SUNSCREEN CATALOG ──
const sunscreenCatalog: Record<string, CatalogEntry> = {
  oily: {
    name: 'Matte Finish Sunscreen', brand: 'Matte',
    low: { name: 'UV Doux Silicone Sunscreen Gel', brand: 'UV Doux', priceRange: '\u20b9320', priceValue: 320, currency: 'INR', keyIngredients: ['SPF 50', 'PA+++', 'Silicone Base'], whyRecommended: 'Affordable matte gel sunscreen that controls oil and gives zero white cast. Perfect for oily skin.', budgetLevel: 'low', rating: 4.4, availability: 'Amazon, 1mg' },
    medium: { name: 'La Shield Professional Sunscreen Gel', brand: 'La Shield', priceRange: '\u20b9799', priceValue: 799, currency: 'INR', keyIngredients: ['SPF 50+', 'PA+++', 'Zinc Oxide', 'Silica'], whyRecommended: 'Dermatologist-recommended matte gel with broad spectrum protection. No greasiness at all.', budgetLevel: 'medium', rating: 4.6, availability: 'Amazon, Pharmeasy' },
    high: { name: 'Supergoop Unseen Sunscreen SPF 40', brand: 'Supergoop', priceRange: '\u20b92,200', priceValue: 2200, currency: 'INR', keyIngredients: ['SPF 40', 'Clean Chemical Filters', 'Vitamin E'], whyRecommended: 'Invisible, weightless sunscreen that doubles as a makeup primer. Cult favorite worldwide.', budgetLevel: 'high', rating: 4.6, availability: 'Nykaa, Sephora' },
  },
  dry: {
    name: 'Hydrating Sunscreen', brand: 'Hydrating',
    low: { name: 'Neutrogena Ultra Sheer Sunscreen', brand: 'Neutrogena', priceRange: '\u20b9299', priceValue: 299, currency: 'INR', keyIngredients: ['SPF 50+', 'Helioplex Technology', 'Vitamin E'], whyRecommended: 'Affordable broad-spectrum sunscreen with added vitamin E for dry skin nourishment.', budgetLevel: 'low', rating: 4.2, availability: 'Amazon, Pharmeasy' },
    medium: { name: 'Bioderma Photoderm Max Aquafluide', brand: 'Bioderma', priceRange: '\u20b9990', priceValue: 990, currency: 'INR', keyIngredients: ['SPF 50+', 'UVA/UVB Filters', 'Glycerin', 'Vitamin E'], whyRecommended: 'French pharmacy sunscreen with Cellular Bioprotection technology. Hydrating and non-drying.', budgetLevel: 'medium', rating: 4.5, availability: 'Nykaa, Amazon' },
    high: { name: 'EltaMD UV Clear Broad-Spectrum SPF 46', brand: 'EltaMD', priceRange: '\u20b93,800', priceValue: 3800, currency: 'INR', keyIngredients: ['SPF 46', 'Niacinamide', 'Hyaluronic Acid', 'Lactic Acid'], whyRecommended: 'Dermatologist #1 pick. Niacinamide calms acne while HA hydrates dry skin. Medical-grade.', budgetLevel: 'high', rating: 4.8, availability: 'Dermatologist Clinics' },
  },
  combination: {
    name: 'Lightweight Sunscreen', brand: 'Lightweight',
    low: { name: 'Aqualogica Hydrate+ Dewy Sunscreen', brand: 'Aqualogica', priceRange: '\u20b9319', priceValue: 319, currency: 'INR', keyIngredients: ['SPF 50', 'PA+++', 'Hyaluronic Acid', 'Watermelon'], whyRecommended: 'Lightweight water-based sunscreen that hydrates without making oily zones greasy.', budgetLevel: 'low', rating: 4.3, availability: 'Amazon, Nykaa' },
    medium: { name: 'Cetaphil Sun SPF 50+ Light Gel', brand: 'Cetaphil', priceRange: '\u20b9780', priceValue: 780, currency: 'INR', keyIngredients: ['SPF 50+', 'UVA/UVB Protection', 'Glycerin', 'Vitamin E'], whyRecommended: 'Dermatologist-trusted lightweight gel sunscreen that balances combination skin perfectly.', budgetLevel: 'medium', rating: 4.4, availability: 'Amazon, Pharmeasy' },
    high: { name: 'La Roche-Posay Anthelios UVMune 400', brand: 'La Roche-Posay', priceRange: '\u20b91,870', priceValue: 1870, currency: 'INR', keyIngredients: ['SPF 50+', 'Mexoryl 400', 'La Roche-Posay Thermal Water'], whyRecommended: 'Next-gen sun protection with Mexoryl 400 — the most advanced UVA filter in the world.', budgetLevel: 'high', rating: 4.7, availability: 'Nykaa, Amazon' },
  },
  sensitive: {
    name: 'Mineral Sensitive Sunscreen', brand: 'Mineral',
    low: { name: 'Minimalist Mineral Sunscreen', brand: 'Minimalist', priceRange: '\u20b9349', priceValue: 349, currency: 'INR', keyIngredients: ['SPF 50', 'Zinc Oxide', 'Squalane'], whyRecommended: 'Affordable mineral sunscreen with zinc oxide — least irritating UV filter for sensitive skin.', budgetLevel: 'low', rating: 4.3, availability: 'Amazon, Minimalist Website' },
    medium: { name: 'Avène Mineral Fluid SPF 50+', brand: 'Avène', priceRange: '\u20b91,490', priceValue: 1490, currency: 'INR', keyIngredients: ['SPF 50+', 'Zinc Oxide', 'Avène Thermal Spring Water'], whyRecommended: '100% mineral filter sunscreen with soothing thermal water. Zero chemical irritation risk.', budgetLevel: 'medium', rating: 4.6, availability: 'Nykaa, Pharmeasy' },
    high: { name: 'Colorescience Sunforgettable Total Protection', brand: 'Colorescience', priceRange: '\u20b94,500', priceValue: 4500, currency: 'INR', keyIngredients: ['SPF 50', 'Zinc Oxide', 'Iron Oxides', 'Antioxidants'], whyRecommended: 'Premium mineral SPF with EnviroScreen Technology that protects against UV, blue light, and pollution.', budgetLevel: 'high', rating: 4.5, availability: 'Dermatologist Clinics' },
  },
};

// ── TREATMENT CATALOG (night only) ──
const treatmentCatalog: Record<string, CatalogEntry> = {
  oily: {
    name: 'Retinol / BHA Treatment', brand: 'Treatment',
    low: { name: 'Minimalist Retinol 0.3%', brand: 'Minimalist', priceRange: '\u20b9349', priceValue: 349, currency: 'INR', keyIngredients: ['0.3% Retinol', 'Squalane', 'Vitamin E'], whyRecommended: 'Gentle entry-level retinol that treats acne and oil without severe irritation. Affordable.', budgetLevel: 'low', rating: 4.3, availability: 'Amazon, Minimalist Website' },
    medium: { name: 'Olay Regenerist Retinol 24 Night Cream', brand: 'Olay', priceRange: '\u20b91,399', priceValue: 1399, currency: 'INR', keyIngredients: ['Retinol', 'Vitamin B3', 'Peptides'], whyRecommended: 'Fragrance-free retinol cream that renews skin overnight while controlling oil production.', budgetLevel: 'medium', rating: 4.5, availability: 'Amazon, Nykaa' },
    high: { name: 'SkinMedica Retinol Complex 0.5', brand: 'SkinMedica', priceRange: '\u20b96,500', priceValue: 6500, currency: 'INR', keyIngredients: ['0.5% Retinol', 'Ceramides', 'Antioxidants'], whyRecommended: 'Clinical-grade encapsulated retinol that delivers results with minimal irritation.', budgetLevel: 'high', rating: 4.7, availability: 'Dermatologist Clinics' },
  },
  dry: {
    name: 'Hydrating Night Treatment', brand: 'Night Repair',
    low: { name: 'mCaffeine Night Cream', brand: 'mCaffeine', priceRange: '\u20b9319', priceValue: 319, currency: 'INR', keyIngredients: ['Caffeine', 'Hyaluronic Acid', 'Argan Oil'], whyRecommended: 'Affordable overnight treatment that deeply hydrates and repairs dry skin while you sleep.', budgetLevel: 'low', rating: 4.0, availability: 'Amazon, Nykaa' },
    medium: { name: 'L\'Oréal Paris Revitalift Night Cream', brand: 'L\'Oréal', priceRange: '\u20b9749', priceValue: 749, currency: 'INR', keyIngredients: ['Pro-Retinol', 'Centella Asiatica', 'Hyaluronic Acid'], whyRecommended: 'Drugstore night cream with pro-retinol for gentle anti-aging and deep hydration.', budgetLevel: 'medium', rating: 4.3, availability: 'Amazon, Nykaa' },
    high: { name: 'Shiseido Waso Quick-Feed Night Cream', brand: 'Shiseido', priceRange: '\u20b93,800', priceValue: 3800, currency: 'INR', keyIngredients: ['Yuzu Citrus', 'Whole Carrot Cells', 'Hyaluronic Acid'], whyRecommended: 'Japanese luxury night cream with whole food cells that feed dry skin overnight.', budgetLevel: 'high', rating: 4.4, availability: 'Sephora, Nykaa' },
  },
  combination: {
    name: 'Balancing Night Treatment', brand: 'Night Balance',
    low: { name: 'Plum Night Creme', brand: 'Plum', priceRange: '\u20b9329', priceValue: 329, currency: 'INR', keyIngredients: ['Green Tea', 'Glycolic Acid', 'Shea Butter'], whyRecommended: 'Affordable overnight cream that exfoliates T-zone and hydrates dry cheeks simultaneously.', budgetLevel: 'low', rating: 4.1, availability: 'Amazon, Plum Website' },
    medium: { name: 'Olay Regenerist Whip Night', brand: 'Olay', priceRange: '\u20b91,299', priceValue: 1299, currency: 'INR', keyIngredients: ['Retinol', 'Vitamin B3', 'Amino-Peptides'], whyRecommended: 'Whip-texture night cream that hydrates dry zones while renewing oily areas. Perfect balance.', budgetLevel: 'medium', rating: 4.4, availability: 'Amazon, Nykaa' },
    high: { name: 'Chanel Sublimage La Nuit', brand: 'Chanel', priceRange: '\u20b914,000', priceValue: 14000, currency: 'INR', keyIngredients: ['Vanilla Planifolia', 'Rare Mineral Salts', 'Epidermal-Repair Complex'], whyRecommended: 'The ultimate luxury night treatment with Chanel\'s signature vanilla planifolia extract.', budgetLevel: 'high', rating: 4.6, availability: 'Chanel Stores' },
  },
  sensitive: {
    name: 'Calming Night Treatment', brand: 'Gentle Night',
    low: { name: 'Avene Cicalfate+ Restorative Cream', brand: 'Avène', priceRange: '\u20b9650', priceValue: 650, currency: 'INR', keyIngredients: ['Copper-Zinc Sulfate', 'Cicahyalumide', 'Thermal Spring Water'], whyRecommended: 'Restorative cream that repairs sensitive skin overnight. Proven to accelerate skin recovery.', budgetLevel: 'low', rating: 4.6, availability: 'Amazon, Nykaa' },
    medium: { name: 'La Roche-Posay Toleriane Ultra Night', brand: 'La Roche-Posay', priceRange: '\u20b91,350', priceValue: 1350, currency: 'INR', keyIngredients: ['NeuroSensine', 'Ceramides', 'Shea Butter', 'Thermal Spring Water'], whyRecommended: 'Maximum tolerance night moisturizer designed specifically for ultra-sensitive, reactive skin.', budgetLevel: 'medium', rating: 4.7, availability: 'Nykaa, Pharmeasy' },
    high: { name: 'Chantecaille Bio Lifting Night Cream', brand: 'Chantecaille', priceRange: '\u20b99,500', priceValue: 9500, currency: 'INR', keyIngredients: ['Plant Stem Cells', 'Peptides', 'Rose Water'], whyRecommended: 'Ultra-gentle botanical night cream with plant stem cells for sensitive skin renewal.', budgetLevel: 'high', rating: 4.5, availability: 'Select Luxury Stores' },
  },
};

// ── Helper: Get product from catalog by budget ──
function getProduct(entry: CatalogEntry, budget: BudgetLevel): ProductRecommendation {
  return entry[budget];
}

// ── Helper: Get alternative products (cheaper budget level) ──
export function getAlternatives(entry: CatalogEntry, budget: BudgetLevel) {
  const alternatives: { product: ProductRecommendation; savings: string; note: string }[] = [];
  if (budget === 'medium' || budget === 'high') {
    const alt = entry.low;
    const original = entry[budget];
    const savings = original.priceValue - alt.priceValue;
    alternatives.push({ product: alt, savings: `\u20b9${savings} cheaper`, note: 'Great value alternative with similar key ingredients.' });
  }
  if (budget === 'high') {
    const alt = entry.medium;
    const original = entry.high;
    const savings = original.priceValue - alt.priceValue;
    alternatives.push({ product: alt, savings: `\u20b9${savings} cheaper`, note: 'Mid-range option that delivers 80% of the premium results.' });
  }
  return alternatives;
}

// ── Determine primary concern for serum selection ──
function getPrimarySerumConcern(_skinType: SkinType, concerns: SkinConcern[], goals: SkinGoal[]): string {
  if (concerns.includes('acne') || goals.includes('acne-free') || goals.includes('oil-control')) return 'acne';
  if (concerns.includes('pigmentation') || goals.includes('brightening')) return 'brightening';
  if (concerns.includes('dryness') || goals.includes('hydration')) return 'hydration';
  if (goals.includes('anti-aging')) return 'brightening';
  if (goals.includes('glow')) return 'glow';
  if (concerns.includes('sensitivity') || goals.includes('barrier-repair')) return 'hydration';
  return 'glow';
}

// ── Get skin-type key ──
function getST(skinType: SkinType | ''): SkinType {
  if (skinType && ['oily', 'dry', 'combination', 'sensitive'].includes(skinType)) return skinType;
  return 'combination';
}

// ─────────────────────────────────────────────────────────────
// MAIN ROUTINE GENERATOR
// ─────────────────────────────────────────────────────────────
export function generateRoutine(input: RoutineInput): RoutineResult {
  const { skinType, concerns, goals, budget, acneRisk } = input;
  const st = getST(skinType);
  const serumConcern = getPrimarySerumConcern(st, concerns, goals);

  // ── Build Morning Routine ──
  const morningSteps: RoutineStep[] = [];

  // Step 1: Cleanser
  const cleanser = cleanserCatalog[st];
  morningSteps.push({
    stepNumber: 1,
    name: 'Cleanser',
    timeOfDay: 'morning',
    category: 'cleanser',
    description: st === 'oily' ? 'Start with a gentle foaming cleanser to remove overnight oil buildup without stripping your skin.' :
                 st === 'dry' ? 'Use a cream or hydrating cleanser that cleanses without disrupting your moisture barrier.' :
                 st === 'sensitive' ? 'Use an ultra-gentle, fragrance-free cleanser that soothes while it cleans.' :
                 'Use a gentle balancing cleanser that removes excess oil while maintaining hydration.',
    ingredientFocus: st === 'oily' ? ['Salicylic Acid', 'Niacinamide'] :
                     st === 'dry' ? ['Ceramides', 'Hyaluronic Acid'] :
                     st === 'sensitive' ? ['Thermal Spring Water', 'Ceramides'] :
                     ['Glycerin', 'Aloe Vera'],
    keyIngredients: getProduct(cleanser, budget).keyIngredients,
    applicationTip: 'Massage onto damp skin for 30-60 seconds in circular motions. Rinse with lukewarm water — never hot.',
    durationNote: '30-60 seconds',
    isOptional: false,
    importance: 'essential',
    productRecommendation: getProduct(cleanser, budget),
    explanation: buildStepExplanation('Cleanser', st, concerns, goals),
    warnings: st === 'dry' ? ['Avoid foaming cleansers with SLS — they strip natural oils.'] :
              st === 'sensitive' ? ['Avoid fragrances and essential oils.'] :
              st === 'oily' ? ['Don\'t over-cleanse — twice daily is enough.'] :
              ['Use lukewarm water only.'],
  });

  // Step 2: Toner
  const toner = tonerCatalog[st];
  morningSteps.push({
    stepNumber: 2,
    name: 'Toner',
    timeOfDay: 'morning',
    category: 'toner',
    description: st === 'oily' ? 'Apply an exfoliating toner to remove residual oil and prep skin for serums.' :
                 st === 'dry' ? 'Apply a hydrating toner to flood skin with moisture and boost absorption.' :
                 st === 'sensitive' ? 'Apply a calming toner to soothe and prepare your skin barrier.' :
                 'Apply a balancing toner to even out your skin before treatments.',
    ingredientFocus: st === 'oily' ? ['Glycolic Acid', 'Green Tea'] :
                     st === 'dry' ? ['Hyaluronic Acid', 'Beta-Glucan'] :
                     st === 'sensitive' ? ['Thermal Spring Water', 'Squalane'] :
                     ['Niacinamide', 'Witch Hazel'],
    keyIngredients: getProduct(toner, budget).keyIngredients,
    applicationTip: 'Apply with a cotton pad or pat directly with hands. Wait 1 minute before next step.',
    durationNote: '1 minute to absorb',
    isOptional: st === 'sensitive',
    importance: st === 'sensitive' ? 'optional' : 'recommended',
    productRecommendation: getProduct(toner, budget),
    explanation: buildStepExplanation('Toner', st, concerns, goals),
    warnings: st === 'sensitive' ? ['Skip toner if your skin feels irritated.'] :
              st === 'oily' ? ['Don\'t over-exfoliate — once daily is enough for acid toners.'] :
              [],
  });

  // Step 3: Serum
  const serumCat = serumCatalog[st]?.[serumConcern] || serumCatalog[st]?.['glow'];
  const serumEntry = serumCat || serumCatalog['combination']['glow'];
  morningSteps.push({
    stepNumber: 3,
    name: 'Treatment Serum',
    timeOfDay: 'morning',
    category: 'serum',
    description: serumConcern === 'acne' ? 'Apply a targeted acne serum to fight active breakouts and prevent new ones.' :
                 serumConcern === 'hydration' ? 'Apply a hydrating serum to deeply moisturize and plump your skin.' :
                 serumConcern === 'brightening' ? 'Apply a brightening serum to even out skin tone and add radiance.' :
                 'Apply a targeted serum that addresses your primary skin concern.',
    ingredientFocus: serumConcern === 'acne' ? ['Salicylic Acid', 'Niacinamide'] :
                     serumConcern === 'hydration' ? ['Hyaluronic Acid', 'Ceramides'] :
                     serumConcern === 'brightening' ? ['Vitamin C', 'Niacinamide'] :
                     ['Niacinamide', 'Hyaluronic Acid'],
    keyIngredients: getProduct(serumEntry, budget).keyIngredients,
    applicationTip: 'Apply 3-4 drops to face and neck. Gently pat (don\'t rub) until absorbed. Wait 2 minutes.',
    durationNote: '2 minutes to absorb',
    isOptional: false,
    importance: 'essential',
    productRecommendation: getProduct(serumEntry, budget),
    explanation: buildStepExplanation('Serum', st, concerns, goals),
    warnings: acneRisk === 'high' || acneRisk === 'severe' ? ['If using BHA, start every other day to avoid purging.'] : [],
  });

  // Step 4: Moisturizer
  const moisturizer = moisturizerCatalog[st];
  morningSteps.push({
    stepNumber: 4,
    name: 'Moisturizer',
    timeOfDay: 'morning',
    category: 'moisturizer',
    description: st === 'oily' ? 'Apply a lightweight gel moisturizer that hydrates without adding shine or clogging pores.' :
                 st === 'dry' ? 'Apply a rich cream moisturizer to lock in hydration and repair your barrier.' :
                 st === 'sensitive' ? 'Apply a calming cream that strengthens your barrier and reduces reactivity.' :
                 'Apply a lightweight balancing moisturizer to maintain hydration levels.',
    ingredientFocus: st === 'oily' ? ['Hyaluronic Acid', 'Gel Texture'] :
                     st === 'dry' ? ['Ceramides', 'Shea Butter', 'Squalane'] :
                     st === 'sensitive' ? ['Ceramides', 'Thermal Water', 'Centella'] :
                     ['Ceramides', 'Niacinamide'],
    keyIngredients: getProduct(moisturizer, budget).keyIngredients,
    applicationTip: st === 'oily' ? 'Use a pea-sized amount. Gel formulas spread easily.' :
                    'Apply generously to face and neck. Massage upward.',
    durationNote: '1-2 minutes to absorb',
    isOptional: false,
    importance: 'essential',
    productRecommendation: getProduct(moisturizer, budget),
    explanation: buildStepExplanation('Moisturizer', st, concerns, goals),
    warnings: st === 'oily' ? ['Even oily skin needs moisturizer — skipping it causes more oil production.'] : [],
  });

  // Step 5: Sunscreen
  const sunscreen = sunscreenCatalog[st];
  morningSteps.push({
    stepNumber: 5,
    name: 'Sunscreen',
    timeOfDay: 'morning',
    category: 'sunscreen',
    description: 'Apply broad-spectrum SPF 50+ as the final morning step. This is the single most important anti-aging and skin-health product.',
    ingredientFocus: st === 'oily' ? ['Matte Finish', 'SPF 50+'] :
                     st === 'dry' ? ['Hydrating Formula', 'SPF 50+'] :
                     st === 'sensitive' ? ['Mineral Filters', 'Zinc Oxide'] :
                     ['Lightweight Formula', 'SPF 50+'],
    keyIngredients: getProduct(sunscreen, budget).keyIngredients,
    applicationTip: 'Apply 2 finger-lengths of sunscreen. Reapply every 2-3 hours when outdoors. Wait 5 minutes before makeup.',
    durationNote: '5 minutes before sun exposure',
    isOptional: false,
    importance: 'essential',
    productRecommendation: getProduct(sunscreen, budget),
    explanation: 'Sunscreen prevents 90% of premature aging, protects against dark spots, and is essential for all skin types — even indoors near windows.',
    warnings: ['Never skip sunscreen, even on cloudy days.', 'Reapplication is key for continued protection.'],
  });

  // ── Build Night Routine ──
  const nightSteps: RoutineStep[] = [];

  // Step 1: Double Cleanse
  nightSteps.push({
    stepNumber: 1,
    name: 'Cleanser (Double Cleanse)',
    timeOfDay: 'night',
    category: 'cleanser',
    description: 'Remove the day\'s sunscreen, pollution, and impurities with a thorough evening cleanse.' + (st === 'oily' ? ' Double cleansing is recommended.' : ''),
    ingredientFocus: getProduct(cleanser, budget).keyIngredients,
    keyIngredients: getProduct(cleanser, budget).keyIngredients,
    applicationTip: st === 'oily' ? 'Use cleansing oil first, then follow with your gel cleanser for a thorough double cleanse.' :
                    'Massage for 60 seconds to dissolve sunscreen and impurities thoroughly.',
    durationNote: '60 seconds',
    isOptional: false,
    importance: 'essential',
    productRecommendation: getProduct(cleanser, budget),
    explanation: 'Night cleansing removes accumulated sunscreen, pollution particles, and excess sebum. This prevents clogged pores and allows night treatments to penetrate effectively.',
    warnings: ['Always remove sunscreen completely before bed.'],
  });

  // Step 2: Night Treatment
  const treatment = treatmentCatalog[st];
  nightSteps.push({
    stepNumber: 2,
    name: 'Night Treatment',
    timeOfDay: 'night',
    category: 'treatment',
    description: st === 'oily' ? 'Apply retinol or BHA treatment to renew skin, fight acne, and control oil overnight.' :
                 st === 'dry' ? 'Apply a hydrating night treatment to repair and deeply moisturize while you sleep.' :
                 st === 'sensitive' ? 'Apply a gentle restorative treatment that repairs your barrier overnight.' :
                 'Apply a balancing night treatment that addresses your concerns while you sleep.',
    ingredientFocus: st === 'oily' ? ['Retinol', 'BHA'] :
                     st === 'dry' ? ['Ceramides', 'Hyaluronic Acid'] :
                     st === 'sensitive' ? ['Centella', 'Ceramides', 'Panthenol'] :
                     ['Retinol', 'Peptides'],
    keyIngredients: getProduct(treatment, budget).keyIngredients,
    applicationTip: st === 'oily' ? 'Start with 2x/week. Apply a thin layer to clean, dry skin. Follow with moisturizer.' :
                    'Apply generously as the last step or before a thin moisturizer layer.',
    durationNote: 'Leave overnight',
    isOptional: false,
    importance: 'essential',
    productRecommendation: getProduct(treatment, budget),
    explanation: buildStepExplanation('Night Treatment', st, concerns, goals),
    warnings: st === 'sensitive' ? ['If using retinol, start with once a week maximum.'] :
              ['Don\'t mix retinol with AHAs/BHAs on the same night.'],
  });

  // Step 3: Night Serum (optional but recommended)
  const nightSerumConcern = serumConcern === 'acne' ? 'glow' : serumConcern;
  const nightSerumCat = serumCatalog[st]?.[nightSerumConcern] || serumCatalog[st]?.['hydration'];
  const nightSerumEntry = nightSerumCat || serumCatalog['combination']['glow'];
  nightSteps.push({
    stepNumber: 3,
    name: 'Night Serum',
    timeOfDay: 'night',
    category: 'serum',
    description: 'Apply a nourishing serum that works with your night treatment to enhance results while you sleep.',
    ingredientFocus: ['Hyaluronic Acid', 'Peptides', 'Ceramides'],
    keyIngredients: getProduct(nightSerumEntry, budget).keyIngredients,
    applicationTip: 'Apply after treatment has fully absorbed. Pat gently into skin.',
    durationNote: '2 minutes',
    isOptional: true,
    importance: 'recommended',
    productRecommendation: getProduct(nightSerumEntry, budget),
    explanation: 'Night serums enhance the repair process. While you sleep, skin cell regeneration doubles, making this the optimal time for active ingredients.',
    warnings: [],
  });

  // Step 4: Night Moisturizer
  nightSteps.push({
    stepNumber: 4,
    name: 'Night Moisturizer',
    timeOfDay: 'night',
    category: 'moisturizer',
    description: st === 'oily' ? 'Seal everything with a lightweight gel cream to prevent transepidermal water loss overnight.' :
                 st === 'dry' ? 'Apply a generous layer of rich cream to create an occlusive barrier that prevents moisture loss.' :
                 st === 'sensitive' ? 'Apply a soothing cream that calms and repairs your barrier throughout the night.' :
                 'Apply a nourishing cream to lock in all your treatments and maintain hydration.',
    ingredientFocus: st === 'oily' ? ['Gel Cream', 'Hyaluronic Acid'] :
                     st === 'dry' ? ['Rich Cream', 'Ceramides', 'Shea Butter'] :
                     st === 'sensitive' ? ['Calming Cream', 'Ceramides', 'Centella'] :
                     ['Light Cream', 'Ceramides'],
    keyIngredients: getProduct(moisturizer, budget).keyIngredients,
    applicationTip: 'Apply as the final step. A slightly thicker layer than morning creates better overnight sealing.',
    durationNote: '2 minutes to absorb',
    isOptional: false,
    importance: 'essential',
    productRecommendation: getProduct(moisturizer, budget),
    explanation: 'Night moisturizer is crucial because transepidermal water loss increases by 300% while you sleep. This step locks in all previous treatments.',
    warnings: st === 'oily' ? ['Don\'t skip this — your skin still needs overnight hydration.'] : [],
  });

  // ── Calculate estimated times ──
  const morningTime = morningSteps.reduce((sum, s) => sum + (s.importance === 'essential' ? 2 : 1), 0) * 2 + 2;
  const nightTime = nightSteps.reduce((sum, s) => sum + (s.importance === 'essential' ? 2 : 1), 0) * 2 + 3;

  // ── Calculate budget breakdown ──
  const morningCost = morningSteps.reduce((s, step) => s + step.productRecommendation.priceValue, 0);
  const nightCost = nightSteps.reduce((s, step) => s + step.productRecommendation.priceValue, 0);

  // ── Build explanations ──
  const explanations = buildExplanations(st, concerns, goals, budget, morningSteps, nightSteps);

  // ── Weekly tips ──
  const weeklyTips = generateWeeklyTips(st, concerns, goals);

  // ── Seasonal notes ──
  const seasonalNotes = generateSeasonalNotes(st);

  // ── Quality score ──
  const routineQualityScore = calculateQualityScore(st, concerns, goals, morningSteps, nightSteps);

  return {
    morningRoutine: { timeOfDay: 'morning', title: 'Morning Routine', emoji: '\u2600\ufe0f', steps: morningSteps },
    nightRoutine: { timeOfDay: 'night', title: 'Night Routine', emoji: '\ud83c\udf19', steps: nightSteps },
    totalSteps: morningSteps.length + nightSteps.length,
    estimatedTimeMinutes: { morning: morningTime, night: nightTime },
    budgetBreakdown: {
      low: `\u20b9${Math.round(morningCost * 0.4 + nightCost * 0.4)}/month (budget)`,
      medium: `\u20b9${Math.round(morningCost * 0.7 + nightCost * 0.7)}/month (balanced)`,
      high: `\u20b9${morningCost + nightCost}/month (premium)`,
    },
    explanations,
    weeklyTips,
    seasonalNotes,
    routineQualityScore,
  };
}

// ── Step explanation builder ──
function buildStepExplanation(step: string, st: SkinType, concerns: SkinConcern[], goals: SkinGoal[]): string {
  const concernStr = concerns.length > 0 ? concerns.slice(0, 2).join(' and ') : 'general skin health';
  const goalStr = goals.length > 0 ? goals[0] : 'healthy skin';

  if (step === 'Cleanser') {
    return `A ${st === 'oily' ? 'foaming' : st === 'dry' ? 'hydrating' : st === 'sensitive' ? 'gentle' : 'balancing'} cleanser is essential for ${st} skin because it ${st === 'oily' ? 'removes excess sebum without triggering rebound oil production' : st === 'dry' ? 'cleans without stripping your already-depleted moisture barrier' : st === 'sensitive' ? 'removes irritants without introducing new ones' : 'maintains equilibrium between oily and dry zones'}. This directly supports your goal of ${goalStr}.`;
  }
  if (step === 'Toner') {
    return `This toner prepares your ${st} skin for better serum absorption by ${st === 'oily' ? 'removing residual oil and tightening pores' : st === 'dry' ? 'flooding dehydrated cells with moisture' : st === 'sensitive' ? 'calming inflammation and strengthening your barrier' : 'balancing pH levels across different zones'}. It addresses ${concernStr}.`;
  }
  if (step === 'Serum') {
    return `This serum is the workhorse of your routine — it delivers concentrated active ingredients that specifically target ${concernStr}. For ${st} skin, the formula is ${st === 'oily' ? 'lightweight and oil-free' : st === 'dry' ? 'deeply hydrating' : st === 'sensitive' ? 'gentle and soothing' : 'balanced'} to align with your goal of ${goalStr}.`;
  }
  if (step === 'Moisturizer') {
    return `Every skin type needs moisturizer — even ${st}. ${st === 'oily' ? 'Skipping it triggers your skin to produce MORE oil. A lightweight gel hydrates without clogging pores.' : st === 'dry' ? 'A rich cream with ceramides rebuilds your compromised barrier and prevents trans-epidermal water loss.' : st === 'sensitive' ? 'A calming cream with barrier-repair ingredients reduces reactivity over time.' : 'A balanced formula keeps oily zones matte and dry zones hydrated.'} This supports your ${goalStr} goal.`;
  }
  if (step === 'Night Treatment') {
    return `While you sleep, your skin cell turnover doubles. This treatment uses ${st === 'oily' ? 'retinol to unclog pores and control oil' : st === 'dry' ? 'hydrating actives to repair and replenish' : st === 'sensitive' ? 'gentle restorative ingredients to calm and heal' : 'balanced actives to address multiple concerns'} — directly targeting ${concernStr}. Night treatments are 2-3x more effective than daytime applications.`;
  }
  return `This step is optimized for your ${st} skin type and ${concernStr} concerns to help achieve ${goalStr}.`;
}

// ── Build overall explanations ──
function buildExplanations(
  st: SkinType, concerns: SkinConcern[], goals: SkinGoal[],
  budget: BudgetLevel, _morningSteps: RoutineStep[], _nightSteps: RoutineStep[]
): RoutineExplainability {
  const budgetLabel = budget === 'low' ? 'student-friendly' : budget === 'medium' ? 'balanced mid-range' : 'premium';
  const concernStr = concerns.length > 0 ? concerns.join(', ') : 'general wellness';
  const goalStr = goals.length > 0 ? goals.join(', ') : 'healthy skin';

  const keyDecisions: { decision: string; reason: string }[] = [];

  if (st === 'oily') {
    keyDecisions.push({ decision: 'Gel/foam cleanser chosen', reason: 'Removes excess sebum without over-stripping. Cream cleansers would add unnecessary oil.' });
    keyDecisions.push({ decision: 'Lightweight gel moisturizer', reason: 'Oily skin still needs hydration. Gel formulas provide it without clogging pores or adding shine.' });
    keyDecisions.push({ decision: 'Matte finish sunscreen', reason: 'Traditional sunscreens make oily skin greasy. Matte formulas protect while controlling shine.' });
  } else if (st === 'dry') {
    keyDecisions.push({ decision: 'Cream/hydrating cleanser', reason: 'Foaming cleansers strip natural oils from already-dry skin. Cream formulas cleanse gently while adding moisture.' });
    keyDecisions.push({ decision: 'Rich cream moisturizer', reason: 'Dry skin has a compromised barrier. Rich creams with ceramides rebuild and seal in hydration.' });
    keyDecisions.push({ decision: 'Hydrating sunscreen formula', reason: 'Matte sunscreens can feel drying. Hydrating formulas double as moisturizer + SPF.' });
  } else if (st === 'sensitive') {
    keyDecisions.push({ decision: 'Ultra-gentle, fragrance-free products', reason: 'Sensitive skin reacts to fragrances, essential oils, and harsh surfactants. Every product is carefully screened.' });
    keyDecisions.push({ decision: 'Mineral sunscreen over chemical', reason: 'Mineral (zinc oxide) sunscreens sit on the surface and are less likely to cause irritation than chemical filters.' });
    keyDecisions.push({ decision: 'Toner marked optional', reason: 'Sensitive skin may not tolerate daily exfoliation. Listen to your skin and skip when irritated.' });
  } else {
    keyDecisions.push({ decision: 'Balancing formulations', reason: 'Combination skin has conflicting needs — oily T-zone and dry cheeks. Each product balances both.' });
    keyDecisions.push({ decision: 'Lightweight moisturizer', reason: 'Heavy creams worsen oily zones, but gels leave dry areas parched. A lightweight lotion is the perfect middle ground.' });
  }

  if (concerns.includes('acne')) {
    keyDecisions.push({ decision: 'BHA/Salicylic Acid included', reason: 'Oil-soluble BHA penetrates pores to dissolve the sebum and dead cells that cause acne.' });
  }
  if (goals.includes('glow') || concerns.includes('pigmentation')) {
    keyDecisions.push({ decision: 'Vitamin C / Niacinamide serum', reason: 'These brightening ingredients inhibit melanin production and boost radiance.' });
  }

  const customizationNotes: string[] = [];
  if (budget === 'low') customizationNotes.push('All products are student-friendly and available on Amazon/Nykaa under \u20b9400.');
  else if (budget === 'medium') customizationNotes.push('Mid-range dermatologist-recommended products with proven formulations.');
  else customizationNotes.push('Premium clinical-grade products with the highest quality ingredients.');

  customizationNotes.push(`Routine optimized for ${st} skin with ${concernStr} concerns.`);
  if (goals.length > 0) customizationNotes.push(`Products selected to specifically target: ${goalStr}.`);

  return {
    overallExplanation: `This personalized routine was generated based on your ${st} skin type, active concerns (${concernStr}), and goals (${goalStr}). Every product is chosen to address your specific needs while respecting your ${budgetLabel} budget. The morning routine focuses on protection and prevention, while the night routine focuses on repair and treatment.`,
    whyThisRoutine: `Your ${st} skin type requires ${st === 'oily' ? 'lightweight, oil-control formulas that don\'t clog pores' : st === 'dry' ? 'intense hydration and barrier-repair ingredients' : st === 'sensitive' ? 'the gentlest, most soothing formulations available' : 'balanced products that address both oily and dry zones'}. Combined with your concerns (${concernStr}), we\'ve selected products with the most compatible active ingredients for visible results in 4-8 weeks.`,
    keyDecisions,
    customizationNotes,
    estimatedImprovement: 'With consistent use of this routine, most users see visible improvement in 4-6 weeks and significant results by week 8-12.',
    weeklyVariationTip: st === 'oily' ? '1-2x per week, swap your night serum for a clay mask to deep-clean pores.' :
                        st === 'dry' ? '1x per week, apply a hydrating sleeping pack instead of your night cream.' :
                        st === 'sensitive' ? '1x per week, skip all actives and use only cleanser + moisturizer (skin rest day).' :
                        '1x per week, exfoliate with a gentle AHA mask for extra radiance.',
  };
}

// ── Weekly tips generator ──
function generateWeeklyTips(st: SkinType, concerns: SkinConcern[], goals: SkinGoal[]): string[] {
  const tips: string[] = [
    '\ud83d\udcc5 Week 1-2: Adjustment period — mild breakouts or dryness are normal as your skin adapts.',
    '\ud83d\udcc5 Week 3-4: Your skin starts accepting the routine. Redness and irritation should subside.',
    '\ud83d\udcc5 Week 5-8: Visible improvement phase. You should notice clearer, more balanced skin.',
  ];

  if (concerns.includes('acne')) {
    tips.push('\u26a0\ufe0f Acne purging is normal in weeks 1-3 — this means the products are working, not causing new acne.');
    tips.push('\ud83e\udeb7 Change pillowcases every 3-4 days to prevent bacterial acne.');
  }
  if (st === 'dry') {
    tips.push('\ud83d\udca7 Drink at least 2.5L water daily — no skincare routine can compensate for dehydration.');
  }
  if (st === 'sensitive') {
    tips.push('\ud83d\udee1\ufe0f Always patch test new products on your inner arm for 24 hours before applying to face.');
  }
  if (goals.includes('anti-aging')) {
    tips.push('\ud83d\udd6f\ufe0f Never sleep with makeup on. Overnight, makeup oxidizes and accelerates aging.');
  }

  tips.push('\u2600\ufe0f Reapply sunscreen every 2-3 hours when outdoors for continued protection.');
  tips.push('\ud83d\udeb4 Sunscreen is the single most effective anti-aging product — even more than expensive serums.');

  return tips;
}

// ── Seasonal notes generator ──
function generateSeasonalNotes(st: SkinType): string[] {
  const notes: string[] = [];

  if (st === 'oily') {
    notes.push('\u2600\ufe0f Summer: Your oil production will increase. Consider adding a blotting paper routine and switching to a lighter gel moisturizer.');
    notes.push('\u2744\ufe0f Winter: Oil production decreases. You may need a slightly richer moisturizer to prevent dryness.');
  } else if (st === 'dry') {
    notes.push('\u2744\ufe0f Winter is your enemy. Layer hydrating toner + serum + cream + facial oil for maximum protection.');
    notes.push('\u2600\ufe0f Summer: You can reduce moisturizer richness but NEVER skip it entirely.');
  } else if (st === 'sensitive') {
    notes.push('\u2600\ufe0f Summer: Mineral sunscreen is non-negotiable. Chemical filters may trigger reactions in heat.');
    notes.push('\u2744\ufe0f Winter: Cold wind triggers redness. Apply a thicker barrier cream before going outside.');
  } else {
    notes.push('\u2600\ufe0f Summer: T-zone will be oilier — use mattifying products only on T-zone, not whole face.');
    notes.push('\u2744\ufe0f Winter: Cheeks will be drier — add an extra layer of hydration just on dry areas.');
  }

  notes.push('\ud83c\udf3b Humidity increases oil production for all skin types — adjust your routine accordingly.');
  notes.push('\ud83c\udf27\ufe0f Pollution levels affect skin barrier — always cleanse thoroughly at night regardless of skin type.');

  return notes;
}

// ── Quality score calculator ──
function calculateQualityScore(st: SkinType, concerns: SkinConcern[], goals: SkinGoal[], morningSteps: RoutineStep[], nightSteps: RoutineStep[]): number {
  let score = 50; // baseline

  // More essential steps = better
  const essentialSteps = [...morningSteps, ...nightSteps].filter(s => s.importance === 'essential').length;
  score += essentialSteps * 5;

  // Sunscreen included
  if (morningSteps.some(s => s.category === 'sunscreen')) score += 10;

  // Night treatment included
  if (nightSteps.some(s => s.category === 'treatment')) score += 8;

  // Concern-targeted
  if (concerns.length > 0) score += 5;

  // Goals aligned
  if (goals.length > 0) score += 5;

  // Double cleanse for oily/acne
  if ((st === 'oily' || concerns.includes('acne')) && nightSteps.some(s => s.name.includes('Double'))) score += 7;

  return Math.min(98, Math.max(40, score));
}

// ── Get budget alternatives for a routine ──
export function getBudgetAlternatives(routine: RoutineResult, budget: BudgetLevel) {
  const alternatives: { stepName: string; currentProduct: string; currentPrice: string; alternative: ProductRecommendation; savings: string }[] = [];

  const allSteps = [...routine.morningRoutine.steps, ...routine.nightRoutine.steps];
  for (const step of allSteps) {
    if (budget !== 'low') {
      const st = step.productRecommendation;
      alternatives.push({
        stepName: step.name,
        currentProduct: st.name,
        currentPrice: st.priceRange,
        alternative: {
          name: `${st.name.split(' ')[0]} Budget Alternative`,
          brand: 'Generic',
          priceRange: '\u20b9199',
          priceValue: 199,
          currency: 'INR',
          keyIngredients: st.keyIngredients.slice(0, 2),
          whyRecommended: 'Budget-friendly alternative with similar active ingredients.',
          budgetLevel: 'low',
          rating: 4.0,
          availability: 'Amazon, Local Stores',
        },
        savings: `\u20b9${Math.max(0, st.priceValue - 199)}`,
      });
    }
  }
  return alternatives;
}
