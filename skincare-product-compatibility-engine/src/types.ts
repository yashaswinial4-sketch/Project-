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
