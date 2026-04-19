// ─────────────────────────────────────────────────────────────
// PERSONALIZED DAILY ROUTINE GENERATOR (TASK 6)
// Generates morning & night routines based on skin profile
// ─────────────────────────────────────────────────────────────

import type {
  SkinType, SkinConcern, SkinGoal, BudgetLevel,
  RoutineInput, RoutineStep, RoutineResult, DayRoutine,
  RoutineExplanation
} from '../types';
import { getRecommendedProducts } from './productRecommender';
import { getBudgetAlternatives } from './budgetAlternatives';

// ── Morning Routine Templates by Skin Type ──
const morningTemplates: Record<string, RoutineStep[]> = {
  oily: [
    { order: 1, name: 'Gel Cleanser', timeOfDay: 'morning', productType: 'cleanser', emoji: '🧴', description: 'Start with a gentle gel or foaming cleanser to remove overnight oil buildup without stripping your skin.', ingredientFocus: ['salicylic acid', 'niacinamide', 'tea tree'], whyIncluded: 'Oily skin produces excess sebum overnight. A gel cleanser dissolves oil while maintaining hydration balance.', optional: false, durationTip: 'Massage for 60 seconds in circular motions' },
    { order: 2, name: 'Oil-Control Toner', timeOfDay: 'morning', productType: 'toner', emoji: '💧', description: 'An alcohol-free toner that balances pH and controls oil production throughout the day.', ingredientFocus: ['niacinamide', 'witch hazel', 'green tea'], whyIncluded: 'Restores skin pH after cleansing and provides an extra layer of oil control before treatments.', optional: false, durationTip: 'Pat gently, do not rub' },
    { order: 3, name: 'Treatment Serum', timeOfDay: 'morning', productType: 'serum', emoji: '✨', description: 'A lightweight serum targeting your specific skin concerns with active ingredients.', ingredientFocus: ['niacinamide', 'vitamin c', 'hyaluronic acid'], whyIncluded: 'Delivers concentrated active ingredients directly to the skin for maximum effectiveness.', optional: false, durationTip: 'Wait 2 minutes before next step' },
    { order: 4, name: 'Lightweight Moisturizer', timeOfDay: 'morning', productType: 'moisturizer', emoji: '🌿', description: 'A gel-based or water-based moisturizer that hydrates without adding greasiness.', ingredientFocus: ['hyaluronic acid', 'ceramides', 'glycerin'], whyIncluded: 'Even oily skin needs hydration. Skipping moisturizer causes skin to produce MORE oil to compensate.', optional: false, durationTip: 'Use a pea-sized amount' },
    { order: 5, name: 'Sunscreen SPF 50+', timeOfDay: 'morning', productType: 'sunscreen', emoji: '☀️', description: 'A matte-finish, non-comedogenic sunscreen that protects without clogging pores.', ingredientFocus: ['zinc oxide', 'titanium dioxide', 'niacinamide'], whyIncluded: 'Sun damage worsens oil production, dark spots, and premature aging. The MOST important step in any routine.', optional: false, durationTip: 'Apply 2 finger-lengths, reapply every 2-3 hours' },
  ],
  dry: [
    { order: 1, name: 'Cream Cleanser', timeOfDay: 'morning', productType: 'cleanser', emoji: '🧴', description: 'A hydrating cream or milk cleanser that cleans without stripping natural oils.', ingredientFocus: ['ceramides', 'glycerin', 'hyaluronic acid'], whyIncluded: 'Dry skin lacks lipids. A cream cleanser preserves the natural moisture barrier while removing impurities.', optional: false, durationTip: 'Use lukewarm water, never hot' },
    { order: 2, name: 'Hydrating Toner', timeOfDay: 'morning', productType: 'toner', emoji: '💧', description: 'An essence-like toner that floods skin with hydration and preps for better product absorption.', ingredientFocus: ['hyaluronic acid', 'glycerin', 'centella asiatica'], whyIncluded: 'Acts as a hydration primer, allowing subsequent serums and moisturizers to penetrate deeper.', optional: false, durationTip: 'Apply multiple layers for extra hydration' },
    { order: 3, name: 'Hydrating Serum', timeOfDay: 'morning', productType: 'serum', emoji: '✨', description: 'A serum rich in humectants that attract and bind moisture to the skin.', ingredientFocus: ['hyaluronic acid', 'vitamin b5', 'ceramides'], whyIncluded: 'Dry skin needs intense hydration. A serum delivers active ingredients deeper than moisturizer alone.', optional: false, durationTip: 'Apply on slightly damp skin for maximum absorption' },
    { order: 4, name: 'Rich Moisturizer', timeOfDay: 'morning', productType: 'moisturizer', emoji: '🧊', description: 'A creamy, barrier-repairing moisturizer that locks in hydration all day.', ingredientFocus: ['ceramides', 'shea butter', 'squalane'], whyIncluded: 'Creates a protective seal over serums, preventing water loss through the skin barrier throughout the day.', optional: false, durationTip: 'Warm between palms before pressing into skin' },
    { order: 5, name: 'Sunscreen SPF 50+', timeOfDay: 'morning', productType: 'sunscreen', emoji: '☀️', description: 'A hydrating sunscreen that protects while adding moisture — never drying.', ingredientFocus: ['zinc oxide', 'hyaluronic acid', 'vitamin e'], whyIncluded: 'UV rays damage the already-weak moisture barrier. Hydrating sunscreens protect AND nourish.', optional: false, durationTip: 'Apply generously — 2 finger-lengths minimum' },
  ],
  combination: [
    { order: 1, name: 'Gentle Foaming Cleanser', timeOfDay: 'morning', productType: 'cleanser', emoji: '🧴', description: 'A balanced cleanser that removes oil from the T-zone without drying the cheeks.', ingredientFocus: ['niacinamide', 'glycerin', 'aloe vera'], whyIncluded: 'Combination skin has both oily and dry zones. A gentle foaming cleanser balances both without over-stripping.', optional: false, durationTip: 'Focus on T-zone, be gentle on cheeks' },
    { order: 2, name: 'Balancing Toner', timeOfDay: 'morning', productType: 'toner', emoji: '💧', description: 'A pH-balancing toner that hydrates dry areas while controlling oil in the T-zone.', ingredientFocus: ['niacinamide', 'hyaluronic acid', 'green tea'], whyIncluded: 'Multi-zone skin needs a multi-action toner: hydrating for cheeks, oil-controlling for forehead and nose.', optional: true, durationTip: 'Use a cotton pad for T-zone, hands for cheeks' },
    { order: 3, name: 'Multi-Action Serum', timeOfDay: 'morning', productType: 'serum', emoji: '✨', description: 'A serum that hydrates dry areas and controls oil — niacinamide is your best friend.', ingredientFocus: ['niacinamide', 'hyaluronic acid', 'zinc'], whyIncluded: 'Niacinamide regulates sebum in oily zones while boosting ceramide production in dry areas. Perfect for combination skin.', optional: false, durationTip: 'Allow 1-2 minutes to absorb fully' },
    { order: 4, name: 'Lightweight Moisturizer', timeOfDay: 'morning', productType: 'moisturizer', emoji: '🌿', description: 'A lightweight lotion that hydrates without making the T-zone greasy.', ingredientFocus: ['hyaluronic acid', 'ceramides', 'glycerin'], whyIncluded: 'Balances hydration across all face zones. Gel-cream textures work best for combination skin.', optional: false, durationTip: 'Apply less on T-zone, more on cheeks' },
    { order: 5, name: 'Sunscreen SPF 50+', timeOfDay: 'morning', productType: 'sunscreen', emoji: '☀️', description: 'A non-greasy, non-comedogenic sunscreen suitable for combination skin.', ingredientFocus: ['zinc oxide', 'niacinamide', 'vitamin e'], whyIncluded: 'Essential for all skin types. Prevents dark spots, premature aging, and skin cancer.', optional: false, durationTip: 'Apply evenly, reapply every 2-3 hours when outdoors' },
  ],
  sensitive: [
    { order: 1, name: 'Micellar Water / Cream Cleanser', timeOfDay: 'morning', productType: 'cleanser', emoji: '🧴', description: 'An ultra-gentle, fragrance-free cleanser that soothes while cleaning.', ingredientFocus: ['centella asiatica', 'ceramides', 'aloe vera'], whyIncluded: 'Sensitive skin reacts to harsh surfactants. Micellar water or cream cleansers use the gentlest cleansing agents.', optional: false, durationTip: 'No rubbing — gentle circular motions only' },
    { order: 2, name: 'Soothing Toner', timeOfDay: 'morning', productType: 'toner', emoji: '💧', description: 'An alcohol-free, calming toner that reduces redness and strengthens the barrier.', ingredientFocus: ['centella asiatica', 'chamomile', 'panthenol'], whyIncluded: 'Preps sensitive skin for products while calming irritation and reinforcing the protective barrier.', optional: true, durationTip: 'Skip if skin feels irritated' },
    { order: 3, name: 'Barrier-Repair Serum', timeOfDay: 'morning', productType: 'serum', emoji: '✨', description: 'A calming serum that strengthens the skin barrier and reduces reactivity.', ingredientFocus: ['ceramides', 'centella asiatica', 'niacinamide'], whyIncluded: 'The core issue in sensitive skin is a damaged barrier. Ceramides and centella repair and strengthen it.', optional: false, durationTip: 'Patch test any new serum first' },
    { order: 4, name: 'Fragrance-Free Moisturizer', timeOfDay: 'morning', productType: 'moisturizer', emoji: '🧊', description: 'A hypoallergenic moisturizer with zero fragrance and minimal ingredients.', ingredientFocus: ['ceramides', 'squalane', 'shea butter'], whyIncluded: 'Sensitive skin needs barrier support without irritants. Fragrance-free formulas minimize reaction risk.', optional: false, durationTip: 'Apply while skin is still damp' },
    { order: 5, name: 'Mineral Sunscreen SPF 50+', timeOfDay: 'morning', productType: 'sunscreen', emoji: '☀️', description: 'A mineral (physical) sunscreen with zinc oxide — the gentlest UV protection available.', ingredientFocus: ['zinc oxide', 'titanium dioxide'], whyIncluded: 'Chemical sunscreens can irritate sensitive skin. Mineral sunscreens sit on the surface and reflect UV rays — zero irritation.', optional: false, durationTip: 'Mineral sunscreens may leave white cast — blend well' },
  ],
};

// ── Night Routine Templates ──
const nightTemplates: Record<string, RoutineStep[]> = {
  oily: [
    { order: 1, name: 'Double Cleanse (Oil + Gel)', timeOfDay: 'night', productType: 'cleanser', emoji: '🧴', description: 'First use a cleansing oil to dissolve sunscreen and sebum, then a gel cleanser to deep-clean pores.', ingredientFocus: ['salicylic acid', 'tea tree', 'niacinamide'], whyIncluded: 'Double cleansing ensures ALL oil, sunscreen, and pollution particles are removed. Single cleansing leaves residue in oily skin.', optional: false, durationTip: 'Oil cleanser for 60s, then gel cleanser for 60s' },
    { order: 2, name: 'Exfoliating Treatment', timeOfDay: 'night', productType: 'treatment', emoji: '🔬', description: 'A BHA (salicylic acid) treatment that penetrates pores and dissolves oil buildup overnight.', ingredientFocus: ['salicylic acid', 'glycolic acid', 'niacinamide'], whyIncluded: 'Night is when skin repairs itself. BHA works overnight to clear pores and prevent tomorrow\'s breakouts.', optional: false, durationTip: 'Start 2-3x/week, build to every night' },
    { order: 3, name: 'Treatment Serum', timeOfDay: 'night', productType: 'serum', emoji: '✨', description: 'A serum targeting oil control, acne scars, or hyperpigmentation.', ingredientFocus: ['niacinamide', 'retinol', 'azelaic acid'], whyIncluded: 'Night serums work with the skin\'s natural repair cycle (10pm-2am peak). Active ingredients penetrate deeper at night.', optional: false, durationTip: 'Alternate between actives — don\'t layer all at once' },
    { order: 4, name: 'Lightweight Night Gel', timeOfDay: 'night', productType: 'moisturizer', emoji: '🌙', description: 'A gel-based night moisturizer that hydrates without clogging pores while you sleep.', ingredientFocus: ['hyaluronic acid', 'ceramides', 'centella asiatica'], whyIncluded: 'Night hydration is essential even for oily skin. Gel formulas won\'t clog pores but will prevent overnight water loss.', optional: false, durationTip: 'A thin layer is enough — don\'t over-apply' },
  ],
  dry: [
    { order: 1, name: 'Cream Cleanser / Cleansing Balm', timeOfDay: 'night', productType: 'cleanser', emoji: '🧴', description: 'A rich cleansing balm that melts away makeup and sunscreen while nourishing dry skin.', ingredientFocus: ['ceramides', 'shea butter', 'squalane'], whyIncluded: 'Dry skin must avoid foaming cleansers at night. Cleansing balms dissolve impurities while depositing lipids.', optional: false, durationTip: 'Massage balm for 90 seconds, then rinse' },
    { order: 2, name: 'Hydrating Treatment', timeOfDay: 'night', productType: 'treatment', emoji: '🔬', description: 'An overnight hydrating treatment or gentle chemical exfoliant for dry skin.', ingredientFocus: ['lactic acid', 'hyaluronic acid', 'glycerin'], whyIncluded: 'Lactic acid is the gentlest AHA — it exfoliates while hydrating. Perfect for dry skin that needs turnover without drying.', optional: true, durationTip: 'Use 2-3x/week, not every night' },
    { order: 3, name: 'Nourishing Serum', timeOfDay: 'night', productType: 'serum', emoji: '✨', description: 'A rich serum with ceramides and peptides that repair the barrier while you sleep.', ingredientFocus: ['ceramides', 'peptides', 'hyaluronic acid'], whyIncluded: 'Night is peak repair time. Ceramide serums rebuild the damaged barrier that causes dryness.', optional: false, durationTip: 'Apply on damp skin, press gently' },
    { order: 4, name: 'Rich Night Cream', timeOfDay: 'night', productType: 'moisturizer', emoji: '🌙', description: 'A thick, occlusive night cream that seals everything in and prevents overnight water loss.', ingredientFocus: ['ceramides', 'shea butter', 'squalane', 'petrolatum'], whyIncluded: 'The final occlusive layer is CRUCIAL for dry skin. Without it, all your serums evaporate while you sleep.', optional: false, durationTip: 'Apply a generous layer as the last step' },
  ],
  combination: [
    { order: 1, name: 'Gentle Cleanser', timeOfDay: 'night', productType: 'cleanser', emoji: '🧴', description: 'A gentle cleanser that removes the day\'s buildup without over-drying or over-stripping.', ingredientFocus: ['glycerin', 'niacinamide', 'aloe vera'], whyIncluded: 'Combination skin needs a middle-ground cleanser — effective enough to remove oil, gentle enough to not dry cheeks.', optional: false, durationTip: 'Massage for 60 seconds, rinse with lukewarm water' },
    { order: 2, name: 'Targeted Treatment', timeOfDay: 'night', productType: 'treatment', emoji: '🔬', description: 'A treatment targeting specific concerns — BHA for T-zone, hydrating actives for cheeks.', ingredientFocus: ['salicylic acid', 'niacinamide', 'hyaluronic acid'], whyIncluded: 'Night treatments can be more focused. Apply BHA on T-zone, HA on cheeks for zone-specific care.', optional: false, durationTip: 'Apply treatment to specific zones, not whole face' },
    { order: 3, name: 'Balancing Serum', timeOfDay: 'night', productType: 'serum', emoji: '✨', description: 'A serum that supports skin repair and balances oil production overnight.', ingredientFocus: ['niacinamide', 'retinol', 'peptides'], whyIncluded: 'Niacinamide at night regulates sebum for the next day. Optional retinol accelerates cell turnover.', optional: false, durationTip: 'If using retinol, start 2x/week only' },
    { order: 4, name: 'Night Moisturizer', timeOfDay: 'night', productType: 'moisturizer', emoji: '🌙', description: 'A medium-weight night cream that hydrates dry areas without overwhelming oily zones.', ingredientFocus: ['ceramides', 'hyaluronic acid', 'glycerin'], whyIncluded: 'Seals in all treatments and provides overnight hydration. Lighter than dry-skin creams but richer than gels.', optional: false, durationTip: 'Apply more on cheeks, less on T-zone' },
  ],
  sensitive: [
    { order: 1, name: 'Gentle Cream Cleanser', timeOfDay: 'night', productType: 'cleanser', emoji: '🧴', description: 'An ultra-gentle cleanser that removes the day\'s products without any irritation.', ingredientFocus: ['ceramides', 'centella asiatica', 'glycerin'], whyIncluded: 'Sensitive skin must use the gentlest possible cleanser at night. No surfactants, no fragrance, no harsh ingredients.', optional: false, durationTip: 'Use minimal pressure — let the product do the work' },
    { order: 2, name: 'Calming Treatment (Optional)', timeOfDay: 'night', productType: 'treatment', emoji: '🔬', description: 'A very gentle treatment — azelaic acid or centella — that soothes without irritating.', ingredientFocus: ['azelaic acid', 'centella asiatica', 'panthenol'], whyIncluded: 'If the skin tolerates it, a gentle treatment can help reduce redness. Azelaic acid is one of the few actives safe for sensitive skin.', optional: true, durationTip: 'Skip entirely if skin is reactive today' },
    { order: 3, name: 'Barrier Repair Serum', timeOfDay: 'night', productType: 'serum', emoji: '✨', description: 'A concentrated ceramide serum that rebuilds the skin barrier during peak repair hours.', ingredientFocus: ['ceramides', 'centella asiatica', 'niacinamide'], whyIncluded: 'The #1 fix for sensitive skin is a stronger barrier. Ceramides + centella work overnight to reduce reactivity.', optional: false, durationTip: 'Layer under moisturizer while skin is damp' },
    { order: 4, name: 'Rich Barrier Cream', timeOfDay: 'night', productType: 'moisturizer', emoji: '🌙', description: 'A thick, fragrance-free night cream with zero irritants that protects and repairs.', ingredientFocus: ['ceramides', 'squalane', 'shea butter', 'colloidal oatmeal'], whyIncluded: 'The night cream seals everything in and provides a protective cocoon. Colloidal oatmeal is nature\'s anti-inflammatory.', optional: false, durationTip: 'Apply generously — this is your protective layer' },
  ],
};

// ── Concern-based step modifications ──
function modifyStepsForConcerns(steps: RoutineStep[], concerns: SkinConcern[], skinType: SkinType | ''): RoutineStep[] {
  const modified = [...steps];

  for (const concern of concerns) {
    switch (concern) {
      case 'acne':
        // Enhance treatment step for acne
        const treatStep = modified.find(s => s.productType === 'treatment');
        if (treatStep) {
          treatStep.ingredientFocus = [...new Set([...treatStep.ingredientFocus, 'salicylic acid', 'benzoyl peroxide', 'niacinamide'])];
          treatStep.description += ' Includes acne-fighting actives to clear and prevent breakouts.';
        }
        break;

      case 'pigmentation':
        // Enhance serum for brightening
        const serumStep = modified.find(s => s.productType === 'serum');
        if (serumStep) {
          serumStep.ingredientFocus = [...new Set([...serumStep.ingredientFocus, 'vitamin c', 'niacinamide', 'alpha arbutin'])];
          serumStep.whyIncluded += ' Vitamin C and niacinamide work together to fade dark spots and even skin tone.';
        }
        break;

      case 'dryness':
        // Enhance moisturizer for extra hydration
        const moistStep = modified.find(s => s.productType === 'moisturizer');
        if (moistStep) {
          moistStep.ingredientFocus = [...new Set([...moistStep.ingredientFocus, 'hyaluronic acid', 'ceramides', 'squalane'])];
          moistStep.description += ' Extra hydration boost with humectants and occlusives for dry skin relief.';
        }
        break;

      case 'aging':
        // Add retinol to night routine
        const nightSerum = modified.find(s => s.timeOfDay === 'night' && s.productType === 'serum');
        if (nightSerum) {
          nightSerum.ingredientFocus = [...new Set([...nightSerum.ingredientFocus, 'retinol', 'peptides', 'vitamin c'])];
          nightSerum.whyIncluded += ' Retinol is the gold standard for anti-aging — it accelerates cell turnover and boosts collagen while you sleep.';
        }
        break;

      case 'oiliness':
        // Add oil control
        const tonerStep = modified.find(s => s.productType === 'toner');
        if (tonerStep) {
          tonerStep.ingredientFocus = [...new Set([...tonerStep.ingredientFocus, 'niacinamide', 'clay', 'witch hazel'])];
          tonerStep.description += ' Oil-absorbing ingredients help control shine throughout the day.';
        }
        break;

      case 'blackheads':
        // Add BHA focus
        const bhaStep = modified.find(s => s.timeOfDay === 'night' && s.productType === 'treatment');
        if (bhaStep) {
          bhaStep.ingredientFocus = [...new Set([...bhaStep.ingredientFocus, 'salicylic acid', 'bha'])];
          bhaStep.whyIncluded += ' Salicylic acid is oil-soluble and can penetrate into pores to dissolve blackhead-causing debris.';
        }
        break;

      case 'sensitivity':
        // Soothe everything
        modified.forEach(step => {
          if (step.productType === 'serum' || step.productType === 'treatment') {
            step.ingredientFocus = [...new Set([...step.ingredientFocus, 'centella asiatica', 'ceramides', 'panthenol'])];
          }
        });
        break;
    }
  }

  return modified;
}

// ── Goal-based step modifications ──
function modifyStepsForGoals(steps: RoutineStep[], goals: SkinGoal[], skinType: SkinType | ''): RoutineStep[] {
  const modified = [...steps];

  for (const goal of goals) {
    switch (goal) {
      case 'glow':
        const amSerum = modified.find(s => s.timeOfDay === 'morning' && s.productType === 'serum');
        if (amSerum) {
          amSerum.ingredientFocus = [...new Set([...amSerum.ingredientFocus, 'vitamin c', 'niacinamide', 'glycolic acid'])];
          amSerum.whyIncluded += ' Vitamin C is the #1 glow-boosting ingredient — it brightens and protects simultaneously.';
        }
        break;

      case 'acne-free':
        const pmTreat = modified.find(s => s.timeOfDay === 'night' && s.productType === 'treatment');
        if (pmTreat) {
          pmTreat.ingredientFocus = [...new Set([...pmTreat.ingredientFocus, 'salicylic acid', 'benzoyl peroxide', 'azelaic acid'])];
          pmTreat.whyIncluded += ' This targeted acne treatment fights bacteria and unclogs pores overnight.';
        }
        break;

      case 'hydration':
        const moStep = modified.find(s => s.productType === 'moisturizer');
        if (moStep) {
          moStep.ingredientFocus = [...new Set([...moStep.ingredientFocus, 'hyaluronic acid', 'ceramides', 'glycerin', 'squalane'])];
          moStep.description += ' Enhanced with triple-action hydration: humectants attract water, ceramides seal it in.';
        }
        break;

      case 'anti-aging':
        const pmSerum = modified.find(s => s.timeOfDay === 'night' && s.productType === 'serum');
        if (pmSerum) {
          pmSerum.ingredientFocus = [...new Set([...pmSerum.ingredientFocus, 'retinol', 'peptides', 'bakuchiol'])];
          pmSerum.whyIncluded += ' Retinol + peptides are the most powerful anti-aging combo — they stimulate collagen and smooth wrinkles while you sleep.';
        }
        break;

      case 'brightening':
        const brSerum = modified.find(s => s.productType === 'serum');
        if (brSerum) {
          brSerum.ingredientFocus = [...new Set([...brSerum.ingredientFocus, 'vitamin c', 'alpha arbutin', 'niacinamide', 'licorice root'])];
          brSerum.whyIncluded += ' This brightening complex targets melanin production from multiple pathways for faster, visible results.';
        }
        break;

      case 'oil-control':
        const oToner = modified.find(s => s.productType === 'toner');
        if (oToner) {
          oToner.ingredientFocus = [...new Set([...oToner.ingredientFocus, 'niacinamide', 'zinc', 'green tea', 'witch hazel'])];
          oToner.description += ' Advanced oil-control with niacinamide (reduces sebum by 23%) and zinc.';
        }
        break;

      case 'sensitive-care':
        modified.forEach(step => {
          if (step.productType === 'treatment') {
            step.optional = true;
            step.whyIncluded += ' Marked optional because sensitive skin should only treat when fully calm.';
          }
        });
        break;

      case 'even-tone':
        const evSerum = modified.find(s => s.productType === 'serum');
        if (evSerum) {
          evSerum.ingredientFocus = [...new Set([...evSerum.ingredientFocus, 'niacinamide', 'vitamin c', 'alpha arbutin', 'kojic acid'])];
          evSerum.whyIncluded += ' Even-tone routine uses multiple melanin inhibitors for comprehensive dark spot correction.';
        }
        break;
    }
  }

  return modified;
}

// ── Generate explanation text ──
function generateRoutineExplanation(
  skinType: SkinType | '',
  concerns: SkinConcern[],
  goals: SkinGoal[],
  morningSteps: RoutineStep[],
  nightSteps: RoutineStep[]
): RoutineExplanation {
  const skinLabel = skinType || 'your';

  // Overall explanation
  let overall = `This personalized routine is designed for ${skinLabel} skin`;
  if (concerns.length > 0) {
    overall += ` targeting ${concerns.join(', ')}`;
  }
  if (goals.length > 0) {
    overall += ` with the goal of achieving ${goals.join(' & ')}`;
  }
  overall += '. ';

  overall += 'The morning routine focuses on protection (sunscreen is non-negotiable) while the night routine focuses on repair and treatment. ';

  // Why it works
  let whyItWorks = `For ${skinLabel} skin, `;
  switch (skinType) {
    case 'oily':
      whyItWorks += 'the routine prioritizes lightweight, oil-free textures with BHA and niacinamide to control sebum while maintaining essential hydration. The biggest mistake oily skin types make is skipping moisturizer — this actually causes MORE oil production.';
      break;
    case 'dry':
      whyItWorks += 'the routine layers hydration using the "thinnest to thickest" rule: toner → serum → rich moisturizer. Ceramides and hyaluronic acid are the backbone ingredients that repair the moisture barrier and attract water into the skin.';
      break;
    case 'combination':
      whyItWorks += 'the routine uses balanced, adaptive products that hydrate dry zones (cheeks) while controlling oil in the T-zone. Niacinamide is the hero ingredient here — it regulates sebum AND boosts hydration simultaneously.';
      break;
    case 'sensitive':
      whyItWorks += 'the routine uses the gentlest possible formulations with zero fragrance, zero harsh actives, and maximum barrier-repair ingredients like ceramides and centella asiatica. The philosophy is "less is more" — minimal products, maximum soothing.';
      break;
    default:
      whyItWorks += 'the routine is balanced for general skin health with a focus on protection, hydration, and gentle treatment.';
  }

  // Morning focus
  const morningFocus = `Morning routine (${morningSteps.length} steps): Focus on PROTECTION. ${morningSteps.map(s => s.emoji + ' ' + s.name).join(' → ')}. Sunscreen is the most anti-aging product you will ever use.`;

  // Night focus
  const nightFocus = `Night routine (${nightSteps.length} steps): Focus on REPAIR. ${nightSteps.map(s => s.emoji + ' ' + s.name).join(' → ')}. Your skin does 80% of its repair work while you sleep.`;

  // Key ingredients
  const allIngredients = [...morningSteps, ...nightSteps]
    .flatMap(s => s.ingredientFocus)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 8);

  // Expected results
  const expectedResults: string[] = [];
  if (goals.includes('glow') || goals.includes('brightening')) expectedResults.push('Visible brightness and glow within 2-4 weeks');
  if (goals.includes('acne-free') || concerns.includes('acne')) expectedResults.push('Reduced breakouts within 4-6 weeks');
  if (goals.includes('hydration') || concerns.includes('dryness')) expectedResults.push('Improved hydration and softness within 1-2 weeks');
  if (goals.includes('anti-aging') || concerns.includes('aging')) expectedResults.push('Smoother fine lines within 8-12 weeks');
  if (goals.includes('oil-control') || concerns.includes('oiliness')) expectedResults.push('Less shine and smaller-looking pores within 2-4 weeks');
  if (expectedResults.length === 0) {
    expectedResults.push('More balanced and healthier-looking skin within 2-4 weeks');
    expectedResults.push('Fewer breakouts and less irritation within 4-6 weeks');
  }
  expectedResults.push('Consistent sunscreen use prevents 90% of premature aging');

  return {
    overall,
    whyItWorks,
    morningFocus,
    nightFocus,
    keyIngredients: allIngredients,
    expectedResults,
  };
}

// ── Generate tips ──
function generateTips(skinType: SkinType | '', concerns: SkinConcern[], goals: SkinGoal[]): string[] {
  const tips: string[] = [
    '⏰ Consistency beats intensity — follow your routine daily rather than doing intense treatments occasionally.',
    '💧 Always apply products from thinnest to thickest consistency.',
    '🧴 Patch test any new product on your inner arm for 24 hours before applying to face.',
  ];

  if (skinType === 'oily') {
    tips.push('🚿 Never over-wash — twice daily maximum. Over-washing triggers MORE oil production.');
    tips.push('🧊 Use cold water as a final rinse to temporarily tighten pores.');
  }
  if (skinType === 'dry') {
    tips.push('💧 Apply hyaluronic acid on DAMP skin — it needs water to work properly.');
    tips.push('🚿 Never use hot water on your face — it strips natural oils.');
  }
  if (skinType === 'sensitive') {
    tips.push('🌿 Introduce only ONE new product per week to identify irritants.');
    tips.push('📋 Keep a skin diary to track what causes reactions.');
  }
  if (concerns.includes('acne')) {
    tips.push('🧼 Change pillowcases every 3-4 days — they harbor acne-causing bacteria.');
    tips.push('🤚 Stop touching your face! Each touch transfers bacteria to pores.');
  }
  if (goals.includes('anti-aging')) {
    tips.push('☀️ Sunscreen is the #1 anti-aging product. No cream can undo what UV damage does.');
    tips.push('😴 Sleep on your back to prevent "sleep lines" that become permanent wrinkles.');
  }
  if (goals.includes('glow')) {
    tips.push('🍋 Vitamin C in the morning + SPF gives the ultimate glow combo.');
  }

  tips.push('📅 Take progress photos every 2 weeks in the same lighting to track improvement.');

  return tips;
}

// ── Generate weekly variations ──
function generateWeeklyVariations(concerns: SkinConcern[], skinType: SkinType | ''): string[] {
  const variations: string[] = [
    '📅 Monday & Thursday: Regular routine (no active treatments)',
  ];

  if (concerns.includes('acne') || skinType === 'oily') {
    variations.push('📅 Tuesday & Friday: BHA night — focus on pore clearing');
    variations.push('📅 Saturday: Clay mask day — deep cleanse and oil absorption');
  }
  if (concerns.includes('pigmentation') || concerns.includes('aging')) {
    variations.push('📅 Wednesday: AHA night — gentle surface exfoliation for brightening');
  }
  if (skinType === 'dry' || skinType === 'sensitive') {
    variations.push('📅 Sunday: Recovery day — skip all actives, focus on hydration only');
  } else {
    variations.push('📅 Sunday: Rest day — minimal routine, let skin recover');
  }

  if (concerns.includes('acne') && concerns.includes('aging')) {
    variations.push('💡 Alternate nights: Retinol on odd days, BHA on even days (never together)');
  }

  return variations;
}

// ── Generate seasonal notes ──
function generateSeasonalNotes(skinType: SkinType | ''): string[] {
  const notes: string[] = [];

  switch (skinType) {
    case 'oily':
      notes.push('🌞 Summer: Switch to ultra-light gel moisturizer. Clay masks 2x/week. Matte sunscreen.');
      notes.push('❄️ Winter: Add a hydrating serum. Switch to gel-cream moisturizer. Skin may feel tighter.');
      break;
    case 'dry':
      notes.push('🌞 Summer: Switch to lighter lotion. Hydrating sunscreen. Extra HA in the morning.');
      notes.push('❄️ Winter: Use a balm or sleeping mask. Humidifier in bedroom. Layer face oils.');
      break;
    case 'combination':
      notes.push('🌞 Summer: Gel moisturizer, matte SPF. Clay mask on T-zone weekly.');
      notes.push('❄️ Winter: Gel-cream moisturizer. More hydrating serum on cheeks. Richer night cream.');
      break;
    case 'sensitive':
      notes.push('🌞 Summer: Mineral SPF only. Avoid exfoliation during high UV periods. Extra soothing agents.');
      notes.push('❄️ Winter: Thicker barrier cream. Avoid extreme temperature changes. Extra ceramides.');
      break;
  }

  notes.push('🌧️ Monsoon: Increase exfoliation to prevent fungal acne. Use water-based products only.');
  notes.push('🔄 Re-evaluate your routine every 3 months as your skin changes with seasons and age.');

  return notes;
}

// ── Calculate routine quality score ──
function calculateRoutineScore(
  skinType: SkinType | '',
  concerns: SkinConcern[],
  goals: SkinGoal[],
  morningSteps: RoutineStep[],
  nightSteps: RoutineStep[]
): number {
  let score = 60; // baseline

  // Has both routines
  if (morningSteps.length >= 4 && nightSteps.length >= 3) score += 10;

  // Has sunscreen
  if (morningSteps.some(s => s.productType === 'sunscreen')) score += 10;

  // Has treatment
  if (nightSteps.some(s => s.productType === 'treatment')) score += 5;

  // Matches skin type
  if (skinType) score += 5;

  // Matches concerns
  if (concerns.length > 0) score += 5;

  // Matches goals
  if (goals.length > 0) score += 5;

  return Math.min(100, score);
}

// ── Estimate monthly cost ──
function estimateMonthlyCost(morningProducts: any[], nightProducts: any[], budget: BudgetLevel): string {
  const allProducts = [...morningProducts, ...nightProducts];
  const uniqueProducts = allProducts.filter((p, i, a) => a.findIndex(x => x.id === p.id) === i);

  const totalCost = uniqueProducts.reduce((sum, p) => sum + (p.actualPrice || 0), 0);
  const monthlyEstimate = Math.round(totalCost * 0.15); // products last ~6-7 months on average

  switch (budget) {
    case 'low': return `₹${monthlyEstimate}-${monthlyEstimate + 200}/month`;
    case 'medium': return `₹${monthlyEstimate}-${monthlyEstimate + 400}/month`;
    case 'high': return `₹${monthlyEstimate}-${monthlyEstimate + 700}/month`;
    default: return `₹${monthlyEstimate}/month`;
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN EXPORT: Generate complete personalized routine
// ═══════════════════════════════════════════════════════════
export function generateRoutine(input: RoutineInput): RoutineResult {
  const { skinType, concerns, goals, budget } = input;

  // Default to combination if no skin type
  const effectiveType = (skinType || 'combination') as string;

  // Get base templates
  const baseMorning = morningTemplates[effectiveType] || morningTemplates['combination'];
  const baseNight = nightTemplates[effectiveType] || nightTemplates['combination'];

  // Deep clone to avoid mutation
  let morningSteps = JSON.parse(JSON.stringify(baseMorning)) as RoutineStep[];
  let nightSteps = JSON.parse(JSON.stringify(baseNight)) as RoutineStep[];

  // Apply concern modifications
  morningSteps = modifyStepsForConcerns(morningSteps, concerns, skinType);
  nightSteps = modifyStepsForConcerns(nightSteps, concerns, skinType);

  // Apply goal modifications
  morningSteps = modifyStepsForGoals(morningSteps, goals, skinType);
  nightSteps = modifyStepsForGoals(nightSteps, goals, skinType);

  // Get products for each routine
  const morningProducts = getRecommendedProducts(morningSteps, budget, skinType, concerns, goals);
  const nightProducts = getRecommendedProducts(nightSteps, budget, skinType, concerns, goals);

  // Get budget alternatives
  const morningAlternatives = getBudgetAlternatives(morningProducts);
  const nightAlternatives = getBudgetAlternatives(nightProducts);

  // Build day routines
  const morningRoutine: DayRoutine = {
    timeOfDay: 'morning',
    emoji: '🌞',
    title: 'Morning Routine',
    subtitle: 'Focus: Protection & Prevention',
    steps: morningSteps,
    products: morningProducts,
    alternatives: morningAlternatives,
  };

  const nightRoutine: DayRoutine = {
    timeOfDay: 'night',
    emoji: '🌙',
    title: 'Night Routine',
    subtitle: 'Focus: Repair & Treatment',
    steps: nightSteps,
    products: nightProducts,
    alternatives: nightAlternatives,
  };

  // Generate explanation
  const explanation = generateRoutineExplanation(skinType, concerns, goals, morningSteps, nightSteps);

  // Generate tips
  const tips = generateTips(skinType, concerns, goals);

  // Generate weekly variations
  const weeklyVariations = generateWeeklyVariations(concerns, skinType);

  // Generate seasonal notes
  const seasonalNotes = generateSeasonalNotes(skinType);

  // Calculate score
  const routineScore = calculateRoutineScore(skinType, concerns, goals, morningSteps, nightSteps);

  // Estimate cost
  const estimatedMonthlyCost = estimateMonthlyCost(morningProducts, nightProducts, budget);

  // Total unique products
  const allProducts = [...morningProducts, ...nightProducts];
  const uniqueProducts = allProducts.filter((p, i, a) => a.findIndex(x => x.id === p.id) === i);

  return {
    morningRoutine,
    nightRoutine,
    explanation,
    tips,
    weeklyVariations,
    seasonalNotes,
    routineScore,
    totalProducts: uniqueProducts.length,
    estimatedMonthlyCost,
  };
}
