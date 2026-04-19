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

// ─────────────────────────────────────────────────────────────
// TASK 8: SMART SIMPLE ANALYSIS (REAL-WORLD HANDLING)
// ─────────────────────────────────────────────────────────────

export interface SimpleAnalysisInput {
  /** Optional — user can skip image upload entirely */
  imageData?: string;
  /** Optional — auto-detected or manually selected */
  skinType?: SkinType | '';
  /** Optional — estimated if not provided */
  acneLevel?: 'none' | 'mild' | 'moderate' | 'severe';
  /** Optional — minimal lifestyle info */
  sleepHours?: number;
  waterGlasses?: number;
  stressLevel?: 'low' | 'moderate' | 'high';
}

export interface ImageQualityReport {
  /** Overall quality verdict */
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'not_provided';
  /** 0-100 score */
  qualityScore: number;
  /** Specific issues detected */
  issues: string[];
  /** Suggestions to improve */
  suggestions: string[];
  /** Whether results may be less accurate */
  affectsAccuracy: boolean;
  /** Friendly user-facing message */
  message: string;
}

export interface DataCompletenessReport {
  /** 0-100 how complete the input was */
  completenessScore: number;
  /** Which fields were provided vs missing */
  provided: string[];
  missing: string[];
  /** What defaults were applied */
  defaultsApplied: { field: string; defaultValue: string; reason: string }[];
  /** Friendly message about data quality */
  message: string;
}

export interface SimpleRoutineStep {
  step: number;
  name: string;
  emoji: string;
  productType: string;
  description: string;
  /** Beginner-friendly explanation */
  whyNeeded: string;
  /** Example product at the right budget */
  exampleProduct: string;
  /** Key ingredient to look for */
  keyIngredient: string;
  /** How long to leave on / use */
  usageTip: string;
  /** Whether this step can be skipped */
  optional: boolean;
}

export interface SimpleRoutine {
  morning: SimpleRoutineStep[];
  night: SimpleRoutineStep[];
}

export interface SimpleProductSuggestion {
  category: string;
  emoji: string;
  productName: string;
  keyIngredient: string;
  whySafe: string;
  budgetTip: string;
  suitableFor: string[];
}

export interface SimpleExplanation {
  /** One-sentence summary for the user */
  headline: string;
  /** "Why this routine works for you" */
  whyItWorks: string;
  /** Step-by-step simple reasoning */
  reasoning: string[];
  /** Things to watch out for */
  cautions: string[];
  /** Encouraging note */
  encouragement: string;
}

export interface SimpleAnalysisResult {
  /** Detected or assumed skin type */
  skinType: SkinType;
  /** How the skin type was determined */
  skinTypeMethod: 'image' | 'manual' | 'default';
  /** Estimated acne risk level */
  acneRisk: 'low' | 'moderate' | 'high';
  /** The personalized routine */
  routine: SimpleRoutine;
  /** Safe product suggestions */
  safeProducts: SimpleProductSuggestion[];
  /** Simple explanations */
  explanation: SimpleExplanation;
  /** Image quality report */
  imageQuality: ImageQualityReport;
  /** Data completeness report */
  dataCompleteness: DataCompletenessReport;
  /** Any warnings about the analysis */
  warnings: string[];
  /** Overall confidence in the result (0-100) */
  confidence: number;
  /** Timestamp */
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────
// TASK 9: PRIVACY, FEEDBACK & PROGRESS TRACKING
// ─────────────────────────────────────────────────────────────

// ── Consent System ──

export interface ConsentPreferences {
  /** Allow storing skin analysis results */
  storeAnalysisResults: boolean;
  /** Allow storing uploaded images */
  storeImages: boolean;
  /** Allow storing lifestyle data */
  storeLifestyleData: boolean;
  /** Allow storing feedback */
  storeFeedback: boolean;
  /** Allow progress tracking across sessions */
  enableProgressTracking: boolean;
  /** User has read and accepted privacy policy */
  acceptedPrivacyPolicy: boolean;
  /** Timestamp of last consent update */
  consentDate: string;
  /** Unique session ID for anonymous tracking */
  sessionId: string;
}

export interface DataExport {
  records: SkinRecord[];
  feedback: FeedbackEntry[];
  consent: ConsentPreferences;
  exportDate: string;
  totalEntries: number;
}

export interface PrivacyReport {
  /** What data is stored */
  dataStored: { type: string; count: number; size: string }[];
  /** How long data is retained */
  retentionPolicy: string;
  /** User rights summary */
  userRights: string[];
  /** Last data access */
  lastAccess: string;
  /** Overall privacy score (0-100) */
  privacyScore: number;
  /** Recommendations for better privacy */
  recommendations: string[];
}

// ── Feedback System ──

export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

export type FeedbackCategory =
  | 'accuracy'
  | 'helpfulness'
  | 'recommendations'
  | 'routine'
  | 'ingredients'
  | 'overall'
  | 'bug';

export interface FeedbackEntry {
  _id: string;
  /** Which module was used */
  module: string;
  /** Star rating 1-5 */
  rating: FeedbackRating;
  /** What aspect is being reviewed */
  category: FeedbackCategory;
  /** User comment */
  comment: string;
  /** Which skin type the user had */
  userSkinType?: SkinType;
  /** Timestamp */
  timestamp: string;
  /** Whether the user found results accurate */
  foundAccurate?: boolean;
  /** What they liked most */
  likedMost?: string;
  /** What to improve */
  improve?: string;
}

export interface FeedbackStats {
  /** Total feedback count */
  totalFeedback: number;
  /** Average rating */
  averageRating: number;
  /** Rating distribution */
  ratingDistribution: Record<number, number>;
  /** Sentiment breakdown */
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  /** Most praised module */
  bestModule: string;
  /** Most common improvement request */
  topImprovement: string;
  /** Category breakdown */
  categoryBreakdown: Record<FeedbackCategory, number>;
  /** Trend: is feedback improving over time */
  trendDirection: 'improving' | 'stable' | 'declining';
}

export interface FeedbackAnalysis {
  /** The feedback entry */
  entry: FeedbackEntry;
  /** Auto-detected sentiment */
  sentiment: 'positive' | 'neutral' | 'negative';
  /** Sentiment confidence (0-1) */
  sentimentConfidence: number;
  /** Auto-generated response */
  autoResponse: string;
  /** Suggested actions based on feedback */
  suggestedActions: string[];
  /** Key phrases detected */
  keyPhrases: string[];
}

// ── Enhanced Progress Tracking ──

export interface ProgressTrend {
  /** Metric being tracked */
  metric: string;
  /** Current value */
  current: number;
  /** Previous value */
  previous: number;
  /** Percentage change */
  changePercent: number;
  /** Direction of change */
  direction: 'improving' | 'stable' | 'declining';
  /** Trend over last N records */
  trend: number[];
  /** Label for display */
  label: string;
  /** Emoji for display */
  emoji: string;
  /** Color for display */
  color: string;
}

export interface ProgressMilestone {
  _id: string;
  /** Achievement type */
  type: 'first_scan' | 'week_streak' | 'improvement_10' | 'improvement_25' | 'improvement_50' | 'consistent_tracker' | 'healthy_lifestyle';
  /** Title */
  title: string;
  /** Description */
  description: string;
  /** Emoji */
  emoji: string;
  /** Date achieved */
  achievedDate: string;
  /** Whether it's been seen */
  isNew: boolean;
}

export interface ProgressInsight {
  /** Insight type */
  type: 'positive' | 'warning' | 'info' | 'milestone';
  /** The insight text */
  text: string;
  /** Related metric */
  metric?: string;
  /** Priority (higher = more important) */
  priority: number;
  /** Emoji */
  emoji: string;
}

export interface WeeklySummary {
  /** Week label */
  weekLabel: string;
  /** Number of scans this week */
  scanCount: number;
  /** Average skin score */
  avgScore: number;
  /** Best day */
  bestDay: string;
  /** Key changes */
  changes: string[];
  /** Rating for the week (auto-calculated) */
  weekRating: 'excellent' | 'good' | 'fair' | 'needs_work';
  /** Tips for next week */
  tips: string[];
}

export interface ProgressDashboard {
  /** Overall progress score (0-100) */
  overallProgress: number;
  /** Progress direction */
  direction: 'improving' | 'stable' | 'declining';
  /** Trends for each metric */
  trends: ProgressTrend[];
  /** Achievements unlocked */
  milestones: ProgressMilestone[];
  /** Auto-generated insights */
  insights: ProgressInsight[];
  /** Weekly summaries */
  weeklySummaries: WeeklySummary[];
  /** Total records tracked */
  totalRecords: number;
  /** Tracking streak (consecutive weeks) */
  streakWeeks: number;
  /** Estimated skin age (fun metric) */
  skinAgeEstimate: number;
  /** Confidence of the tracking data */
  trackingConfidence: number;
}
