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
  waterIntake: number; // glasses per day
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
  riskScore: number; // 0-100, higher = more risk
  breakdown: AcneRiskBreakdown;
  triggers: AcneTrigger[];
  safeProducts: string[];
  riskyProducts: { name: string; triggers: string[] }[];
  tips: AcneTip[];
  summary: string;
  routineChanges: string[];
}
