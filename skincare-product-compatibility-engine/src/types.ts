// ─────────────────────────────────────────────────────────────
// TYPES FOR AI PERSONALIZED SKINCARE ADVISOR
// ─────────────────────────────────────────────────────────────

export type SkinType = 'dry' | 'oily' | 'combination' | 'sensitive';

export type SkinConcern = 'acne' | 'pigmentation' | 'dryness' | 'aging' | 'sensitivity' | 'oiliness' | 'blackheads';

export type ProductType = 'cleanser' | 'serum' | 'moisturizer' | 'sunscreen' | 'toner' | 'mask' | 'other';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  ingredients: string;
}

export interface UserData {
  skinType: SkinType | '';
  concerns: SkinConcern[];
  products: Product[];
}

export interface Warning {
  type: 'skin_mismatch' | 'ingredient_conflict' | 'overuse';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion?: string;
  product?: string;
  ingredient?: string;
  product1?: string;
  product2?: string;
}

export interface Conflict {
  ingredient1: string;
  ingredient2: string;
  severity: 'low' | 'medium' | 'high';
  reason: string;
  suggestion: string;
  product1: string;
  product2: string;
}

export interface SkinTypeIssue {
  product: string;
  ingredient: string;
  reason: string;
  severity: string;
}

export interface Recommendation {
  ingredient: string;
  benefits: string[];
  matchingConcerns: string[];
  type: string;
  reason: string;
}

export interface Alternative {
  name: string;
  type: string;
  ingredients: string;
  reason: string;
}

export interface Suggestion {
  product: string;
  alternatives: Alternative[];
  reason: string;
}

export interface AnalysisResult {
  warnings: Warning[];
  conflicts: Conflict[];
  skinTypeIssues: SkinTypeIssue[];
  safeProducts: string[];
  unsafeProducts: { product: string; issues: SkinTypeIssue[] }[];
  suggestions: Suggestion[];
  recommendations: Recommendation[];
  overallScore: number;
  summary: string;
}

export interface SampleProduct {
  _id: string;
  name: string;
  type: ProductType;
  ingredients: string;
  suitableSkinTypes: SkinType[];
}

// ─────────────────────────────────────────────────────────────
// TASK 2: SKIN TYPE DETECTION TYPES
// ─────────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: number;
  question: string;
  options: { value: string; label: string; emoji: string }[];
}

export interface QuizAnswer {
  questionId: number;
  answer: string;
}

export interface SkinDetectionResult {
  skinType: SkinType;
  confidence: number;
  method: 'questionnaire' | 'image';
  breakdown?: Record<string, number>;
  explanation: string;
  indicators?: {
    brightness?: number;
    redness?: number;
    saturation?: number;
    scores?: Record<string, number>;
  };
}

export interface SkinContextType {
  detectedSkinType: SkinType | '';
  detectionMethod: 'questionnaire' | 'image' | '';
  detectionConfidence: number;
  setDetectedSkinType: (type: SkinType, method: 'questionnaire' | 'image', confidence: number) => void;
  clearDetection: () => void;
}

// ─────────────────────────────────────────────────────────────
// TASK 3: ACNE RISK PREDICTION TYPES
// ─────────────────────────────────────────────────────────────

export type AcneRiskLevel = 'low' | 'moderate' | 'high' | 'severe';

export type AcneSeverity = 'none' | 'mild' | 'moderate' | 'severe';

export interface AcneHabits {
  currentAcne: AcneSeverity;
  sleepHours: number;
  waterIntake: number;
  dietType: 'balanced' | 'high-sugar' | 'high-dairy' | 'junk-food' | 'healthy';
  stressLevel: 'low' | 'moderate' | 'high' | 'extreme';
  exerciseFrequency: 'none' | '1-2x' | '3-4x' | 'daily';
  faceWashFrequency: 'once' | 'twice' | 'thrice' | 'rarely';
  makeupRemoval: 'always' | 'sometimes' | 'never';
  pillowcaseChange: 'weekly' | 'biweekly' | 'monthly' | 'rarely';
  sunscreenUse: 'always' | 'sometimes' | 'never';
  touchingFace: 'often' | 'sometimes' | 'rarely' | 'never';
  currentBreakouts: 'none' | 'few' | 'moderate' | 'many';
}

export interface AcneTrigger {
  type: 'ingredient' | 'habit' | 'product' | 'routine';
  name: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
}

export interface AcneRiskBreakdown {
  ingredientScore: number;
  habitScore: number;
  productScore: number;
  routineScore: number;
  skinTypeScore: number;
}

export interface AcneTip {
  icon: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AcneRiskResult {
  riskLevel: AcneRiskLevel;
  riskScore: number;
  breakdown: AcneRiskBreakdown;
  triggers: AcneTrigger[];
  safeProducts: string[];
  riskyProducts: { name: string; triggers: string[] }[];
  tips: AcneTip[];
  summary: string;
  routineChanges: string[];
}

// ─────────────────────────────────────────────────────────────
// TASK 4: PROGRESS TRACKING & LIFESTYLE TYPES
// ─────────────────────────────────────────────────────────────

export interface LifestyleData {
  sleepHours: number;
  waterIntake: number;
  dietQuality: 'poor' | 'average' | 'good' | 'excellent';
  stressLevel: 'low' | 'moderate' | 'high';
  exerciseDays: number; // per week
  alcoholConsumption: 'none' | 'light' | 'moderate' | 'heavy';
  smokingStatus: 'non-smoker' | 'occasional' | 'regular';
  screenTime: number; // hours per day
}

export interface LifestyleImpact {
  overallScore: number; // 0-100, higher = better for skin
  sleepImpact: { score: number; label: string; description: string };
  hydrationImpact: { score: number; label: string; description: string };
  dietImpact: { score: number; label: string; description: string };
  stressImpact: { score: number; label: string; description: string };
  exerciseImpact: { score: number; label: string; description: string };
  recommendations: string[];
}

export interface SkinRecord {
  _id?: string;
  userId?: string;
  date: string;
  skinType: SkinType;
  imageUrl?: string;
  analysisResult?: Partial<AnalysisResult>;
  acneRisk?: AcneRiskResult;
  lifestyleData?: LifestyleData;
  notes?: string;
  imageMetrics?: ImageMetrics;
}

export interface ImageMetrics {
  brightness: number;
  redness: number;
  saturation: number;
  uniformity: number;
  oiliness: number;
  dryness: number;
}

export interface ProgressComparison {
  before: SkinRecord;
  after: SkinRecord;
  improvementScore: number;
  acneReduction: string;
  oilChange: string;
  drynessChange: string;
  overallChange: string;
  insights: string[];
  metricsComparison: {
    brightness: { before: number; after: number; change: number };
    redness: { before: number; after: number; change: number };
    oiliness: { before: number; after: number; change: number };
    uniformity: { before: number; after: number; change: number };
  };
}

export interface ImagePreprocessingResult {
  originalUrl: string;
  processedUrl: string;
  metrics: ImageMetrics;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  qualityIssues: string[];
  preprocessingSteps: string[];
}

// ─────────────────────────────────────────────────────────────
// TASK 5: INGREDIENT ANALYSIS & EXPLAINABLE AI (XAI) TYPES
// ─────────────────────────────────────────────────────────────

export interface IngredientInfo {
  name: string;
  alternativeNames: string[];
  category: string;
  purpose: string;
  howItWorks: string;
  benefits: string[];
  sideEffects: string[];
  bestFor: string[];
  avoidFor: string[];
  usageTips: string;
  strength: 'gentle' | 'mild' | 'moderate' | 'strong';
  comedogenicRating: number;
}

export interface HarmfulCombination {
  ingredient1: string;
  ingredient2: string;
  severity: 'low' | 'medium' | 'high';
  reason: string;
  suggestion: string;
}

export interface AnalyzedIngredient {
  name: string;
  matched: boolean;
  info?: IngredientInfo;
  suitability: 'excellent' | 'good' | 'caution' | 'avoid' | 'unknown';
  personalScore: number;
  reasons: string[];
  benefits: string[];
  warnings: string[];
}

export interface IngredientAlternative {
  original: string;
  alternative: string;
  reason: string;
  betterFor: string[];
}

export interface IngredientAnalysisResult {
  ingredients: AnalyzedIngredient[];
  overallSafety: 'safe' | 'caution' | 'avoid';
  overallScore: number;
  harmfulCombinations: HarmfulCombination[];
  explanation: string;
  whyItWorks: string;
  warnings: string[];
  recommendations: string[];
  confidence: number;
  alternatives: IngredientAlternative[];
  bestIngredient: string | null;
  summary: string;
}

// ─────────────────────────────────────────────────────────────
// TASK 6: PERSONALIZED DAILY ROUTINE GENERATOR
// ─────────────────────────────────────────────────────────────

export type BudgetLevel = 'low' | 'medium' | 'high';

export type SkinGoal = 'glow' | 'acne-free' | 'hydration' | 'anti-aging' | 'brightening' | 'oil-control' | 'sensitive-care' | 'even-tone';

export interface RoutineInput {
  skinType: SkinType | '';
  concerns: SkinConcern[];
  goals: SkinGoal[];
  budget: BudgetLevel;
  acneRisk?: string;
  sleepHours?: number;
  waterIntake?: number;
}

export interface RoutineStep {
  order: number;
  name: string;
  timeOfDay: 'morning' | 'night';
  productType: string;
  emoji: string;
  description: string;
  ingredientFocus: string[];
  whyIncluded: string;
  optional: boolean;
  durationTip: string;
}

export interface RecommendedProduct {
  id: string;
  name: string;
  brand: string;
  priceCategory: BudgetLevel;
  priceRange: string;
  actualPrice: number;
  keyIngredients: string[];
  whyRecommended: string;
  suitableFor: string[];
  rating: number;
  stepType: string;
  imageUrl?: string;
}

export interface BudgetAlternative {
  originalProduct: RecommendedProduct;
  alternative: RecommendedProduct;
  savingsAmount: number;
  savings: string;
  comparisonNotes: string;
  valueForMoney: 'excellent' | 'good' | 'fair';
}

export interface DayRoutine {
  timeOfDay: 'morning' | 'night';
  emoji: string;
  title: string;
  subtitle: string;
  steps: RoutineStep[];
  products: RecommendedProduct[];
  alternatives: BudgetAlternative[];
}

export interface RoutineExplanation {
  overall: string;
  whyItWorks: string;
  morningFocus: string;
  nightFocus: string;
  keyIngredients: string[];
  expectedResults: string[];
}

export interface RoutineResult {
  morningRoutine: DayRoutine;
  nightRoutine: DayRoutine;
  explanation: RoutineExplanation;
  tips: string[];
  weeklyVariations: string[];
  seasonalNotes: string[];
  routineScore: number;
  totalProducts: number;
  estimatedMonthlyCost: string;
}

// ─────────────────────────────────────────────────────────────
// TASK 7: UNIFIED ANALYSIS DASHBOARD (INTEGRATION OF ALL MODULES)
// ─────────────────────────────────────────────────────────────

export interface UnifiedAnalysisInput {
  skinType?: SkinType | '';
  imageData?: string; // base64 data URL for image analysis
  sleepHours: number;
  waterIntake: number;
  dietQuality: 'poor' | 'average' | 'good' | 'excellent';
  stressLevel: 'low' | 'moderate' | 'high';
  exerciseDays: number;
  products: { name: string; ingredients: string }[];
  concerns: SkinConcern[];
  goals: SkinGoal[];
  budget: BudgetLevel;
}

export interface SkinTypeSection {
  skinType: SkinType;
  confidence: number;
  method: 'image' | 'manual' | 'questionnaire';
  explanation: string;
  indicators?: {
    brightness?: number;
    redness?: number;
    saturation?: number;
  };
  breakdown?: Record<string, number>;
}

export interface AcneRiskSection {
  riskLevel: AcneRiskLevel;
  riskScore: number;
  breakdown: AcneRiskBreakdown;
  topTriggers: AcneTrigger[];
  summary: string;
  routineChanges: string[];
}

export interface IngredientSafetySection {
  overallSafety: 'safe' | 'caution' | 'avoid';
  overallScore: number;
  safeProducts: string[];
  riskyProducts: string[];
  harmfulCombinations: HarmfulCombination[];
  bestIngredient: string | null;
  worstIngredient: string | null;
  recommendations: string[];
}

export interface LifestyleSection {
  overallScore: number;
  sleepScore: number;
  hydrationScore: number;
  dietScore: number;
  stressScore: number;
  recommendations: string[];
  impact: 'positive' | 'neutral' | 'negative';
}

export interface RoutinePreviewSection {
  morningSteps: string[];
  nightSteps: string[];
  keyIngredients: string[];
  estimatedCost: string;
  routineScore: number;
}

export interface UnifiedExplanation {
  overallSummary: string;
  whyItWorks: string;
  keyInsights: string[];
  actionItems: string[];
  confidence: number;
}

export interface UnifiedAnalysisResult {
  overallScore: number;
  overallGrade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  skinType: SkinTypeSection;
  acneRisk: AcneRiskSection;
  ingredientSafety: IngredientSafetySection;
  lifestyle: LifestyleSection;
  routinePreview: RoutinePreviewSection;
  explanation: UnifiedExplanation;
  timestamp: string;
}
