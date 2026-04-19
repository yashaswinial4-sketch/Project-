// ─────────────────────────────────────────────────────────────
// TASK 9: FEEDBACK ENGINE
// Collects, analyzes, and manages user feedback
// with sentiment analysis and statistics
// ─────────────────────────────────────────────────────────────

import type {
  FeedbackEntry,
  FeedbackRating,
  FeedbackCategory,
  FeedbackStats,
  FeedbackAnalysis,
} from '@/types';
import { sanitizeTextInput, sanitizeRating, canStoreData } from './privacyEngine';

// ── Local Storage Key ──
const FEEDBACK_KEY = 'skincare_feedback';

// ── Positive/Negative Word Lists for Sentiment Analysis ──

const POSITIVE_WORDS = new Set([
  'great', 'amazing', 'excellent', 'good', 'love', 'helpful', 'accurate',
  'perfect', 'awesome', 'fantastic', 'wonderful', 'best', 'impressive',
  'recommend', 'useful', 'easy', 'clear', 'informative', 'detailed',
  'insightful', 'improved', 'better', 'happy', 'satisfied', 'nice',
  'brilliant', 'superb', 'reliable', 'trustworthy', 'professional',
  'personalized', 'relevant', 'spot-on', 'correct', 'right', 'precise',
  'thorough', 'comprehensive', 'valuable', 'practical', 'actionable',
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'awful', 'poor', 'wrong', 'inaccurate', 'confusing',
  'useless', 'hate', 'worst', 'disappointed', 'waste', 'broken', 'error',
  'bug', 'crash', 'slow', 'ugly', 'complicated', 'unclear', 'misleading',
  'irrelevant', 'generic', 'repetitive', 'boring', 'frustrating', 'annoying',
  'incorrect', 'false', 'unhelpful', 'vague', 'missing', 'incomplete',
  'not working', 'useless', 'fake', 'wrong skin type', 'off',
]);

// ── Save Feedback ──

export function saveFeedback(entry: Omit<FeedbackEntry, '_id' | 'timestamp'>): FeedbackEntry | null {
  if (!canStoreData('feedback')) {
    console.warn('Feedback storage not consented. Feedback will not be saved.');
    return null;
  }

  const sanitizedComment = sanitizeTextInput(entry.comment, 500);
  const sanitizedRating = sanitizeRating(entry.rating) as FeedbackRating;

  const newEntry: FeedbackEntry = {
    _id: 'fb_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
    module: sanitizeTextInput(entry.module, 50),
    rating: sanitizedRating,
    category: entry.category,
    comment: sanitizedComment,
    userSkinType: entry.userSkinType,
    timestamp: new Date().toISOString(),
    foundAccurate: entry.foundAccurate,
    likedMost: entry.likedMost ? sanitizeTextInput(entry.likedMost, 200) : undefined,
    improve: entry.improve ? sanitizeTextInput(entry.improve, 200) : undefined,
  };

  const feedback = getAllFeedback();
  feedback.push(newEntry);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));

  return newEntry;
}

// ── Get All Feedback ──

export function getAllFeedback(): FeedbackEntry[] {
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
  } catch {
    return [];
  }
}

// ── Delete Feedback ──

export function deleteFeedback(id: string): void {
  const feedback = getAllFeedback().filter(f => f._id !== id);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
}

export function deleteAllFeedback(): void {
  localStorage.removeItem(FEEDBACK_KEY);
}

// ── Sentiment Analysis (Simple Rule-Based) ──

export function analyzeSentiment(text: string): {
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  keyPhrases: string[];
} {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);

  let positiveCount = 0;
  let negativeCount = 0;
  const keyPhrases: string[] = [];

  for (const word of words) {
    const clean = word.replace(/[^a-z-]/g, '');
    if (POSITIVE_WORDS.has(clean)) {
      positiveCount++;
      keyPhrases.push(clean);
    }
    if (NEGATIVE_WORDS.has(clean)) {
      negativeCount++;
      keyPhrases.push(clean);
    }
  }

  // Also check for multi-word phrases
  const bigrams = words.slice(0, -1).map((w, i) => `${w} ${words[i + 1]}`);
  for (const bigram of bigrams) {
    const clean = bigram.replace(/[^a-z\s-]/g, '').trim();
    if (NEGATIVE_WORDS.has(clean)) {
      negativeCount++;
      keyPhrases.push(clean);
    }
  }

  const total = positiveCount + negativeCount;
  const sentiment = positiveCount > negativeCount ? 'positive'
    : negativeCount > positiveCount ? 'negative'
    : 'neutral';

  const confidence = total === 0 ? 0.5 : Math.abs(positiveCount - negativeCount) / total;

  return {
    sentiment,
    confidence: Math.round(confidence * 100) / 100,
    keyPhrases: [...new Set(keyPhrases)].slice(0, 5),
  };
}

// ── Auto-Response Generator ──

export function generateAutoResponse(entry: FeedbackEntry, sentiment: 'positive' | 'neutral' | 'negative'): string {
  const moduleLabels: Record<string, string> = {
    'routine-analysis': 'Routine Analysis',
    'skin-type': 'Skin Type Detection',
    'acne-risk': 'Acne Risk Prediction',
    'ingredient-analysis': 'Ingredient Analysis',
    'routine-generator': 'Routine Generator',
    'dashboard': 'Unified Dashboard',
    'simple-analysis': 'Smart Analysis',
    'progress': 'Progress Tracking',
  };

  const moduleName = moduleLabels[entry.module] || entry.module;

  if (sentiment === 'positive') {
    const responses = [
      `Thank you for your positive feedback on ${moduleName}! We're glad it was helpful (rating: ${entry.rating}/5). Your input helps us improve.`,
      `Great to hear you had a good experience with ${moduleName}! Your ${entry.rating}-star rating motivates us to keep improving.`,
      `Thanks for the ${entry.rating}-star review! We're thrilled ${moduleName} met your expectations.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (sentiment === 'negative') {
    const responses = [
      `We're sorry ${moduleName} didn't meet your expectations. Your ${entry.rating}-star feedback is valuable and we'll work on improving this area.`,
      `Thank you for your honest feedback on ${moduleName}. We take ${entry.rating}-star ratings seriously and will review the issues you mentioned.`,
      `We appreciate you sharing your concerns about ${moduleName}. This helps us identify areas for improvement.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  return `Thank you for your feedback on ${moduleName}! Your ${entry.rating}-star rating and comments help us improve our skincare analysis tools.`;
}

// ── Suggest Actions Based on Feedback ──

export function suggestActions(entry: FeedbackEntry, sentiment: 'positive' | 'neutral' | 'negative'): string[] {
  const actions: string[] = [];

  if (sentiment === 'negative') {
    actions.push('Review the analysis logic for this module');
    if (entry.category === 'accuracy') {
      actions.push('Cross-verify with additional data points');
      actions.push('Add more skin type detection methods');
    }
    if (entry.category === 'recommendations') {
      actions.push('Expand the product database');
      actions.push('Improve skin type matching algorithm');
    }
    if (entry.category === 'routine') {
      actions.push('Add more routine templates');
      actions.push('Include seasonal adjustments');
    }
  }

  if (entry.rating <= 2) {
    actions.push('Flag for priority review');
    actions.push('Consider adding disclaimer about accuracy');
  }

  if (entry.rating >= 4) {
    actions.push('Mark as positive training example');
    actions.push('Feature in testimonials (with consent)');
  }

  if (entry.improve) {
    actions.push(`Address user suggestion: "${entry.improve.slice(0, 50)}..."`);
  }

  return actions.length > 0 ? actions : ['Continue monitoring feedback'];
}

// ── Analyze Single Feedback Entry ──

export function analyzeFeedbackEntry(entry: FeedbackEntry): FeedbackAnalysis {
  const sentimentResult = analyzeSentiment(entry.comment);
  const autoResponse = generateAutoResponse(entry, sentimentResult.sentiment);
  const suggestedActions = suggestActions(entry, sentimentResult.sentiment);

  return {
    entry,
    sentiment: sentimentResult.sentiment,
    sentimentConfidence: sentimentResult.confidence,
    autoResponse,
    suggestedActions,
    keyPhrases: sentimentResult.keyPhrases,
  };
}

// ── Calculate Feedback Statistics ──

export function calculateFeedbackStats(): FeedbackStats {
  const feedback = getAllFeedback();

  if (feedback.length === 0) {
    return {
      totalFeedback: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
      bestModule: 'N/A',
      topImprovement: 'N/A',
      categoryBreakdown: {
        accuracy: 0, helpfulness: 0, recommendations: 0, routine: 0,
        ingredients: 0, overall: 0, bug: 0,
      },
      trendDirection: 'stable',
    };
  }

  // Rating distribution
  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;

  // Sentiment counts
  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;

  // Module ratings
  const moduleRatings: Record<string, { total: number; count: number }> = {};

  // Category counts
  const categoryBreakdown: Record<FeedbackCategory, number> = {
    accuracy: 0, helpfulness: 0, recommendations: 0, routine: 0,
    ingredients: 0, overall: 0, bug: 0,
  };

  // Improvement tracking
  const improvementRequests: string[] = [];

  // Trend tracking
  const recentRatings: number[] = [];
  const olderRatings: number[] = [];
  const midpoint = Math.floor(feedback.length / 2);

  feedback.forEach((entry, index) => {
    totalRating += entry.rating;
    ratingDistribution[entry.rating] = (ratingDistribution[entry.rating] || 0) + 1;

    // Sentiment
    const sentiment = analyzeSentiment(entry.comment).sentiment;
    if (sentiment === 'positive') positiveCount++;
    else if (sentiment === 'negative') negativeCount++;
    else neutralCount++;

    // Module tracking
    if (!moduleRatings[entry.module]) {
      moduleRatings[entry.module] = { total: 0, count: 0 };
    }
    moduleRatings[entry.module].total += entry.rating;
    moduleRatings[entry.module].count++;

    // Category
    categoryBreakdown[entry.category]++;

    // Improvements
    if (entry.improve) improvementRequests.push(entry.improve);

    // Trend data
    if (index < midpoint) olderRatings.push(entry.rating);
    else recentRatings.push(entry.rating);
  });

  // Best module
  let bestModule = 'N/A';
  let bestAvg = 0;
  for (const [module, data] of Object.entries(moduleRatings)) {
    const avg = data.total / data.count;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestModule = module;
    }
  }

  // Top improvement request
  const topImprovement = improvementRequests.length > 0
    ? improvementRequests[improvementRequests.length - 1]
    : 'N/A';

  // Trend direction
  const olderAvg = olderRatings.length > 0 ? olderRatings.reduce((a, b) => a + b, 0) / olderRatings.length : 0;
  const recentAvg = recentRatings.length > 0 ? recentRatings.reduce((a, b) => a + b, 0) / recentRatings.length : 0;
  const trendDirection: 'improving' | 'stable' | 'declining' =
    recentAvg > olderAvg + 0.3 ? 'improving' :
    recentAvg < olderAvg - 0.3 ? 'declining' : 'stable';

  return {
    totalFeedback: feedback.length,
    averageRating: Math.round((totalRating / feedback.length) * 10) / 10,
    ratingDistribution,
    positiveCount,
    neutralCount,
    negativeCount,
    bestModule,
    topImprovement,
    categoryBreakdown,
    trendDirection,
  };
}

// ── Feedback Module Labels for UI ──

export const MODULE_LABELS: Record<string, { label: string; emoji: string }> = {
  'routine-analysis': { label: 'Routine Analysis', emoji: '🔍' },
  'skin-type': { label: 'Skin Type Detection', emoji: '🎯' },
  'acne-risk': { label: 'Acne Risk Prediction', emoji: '⚠️' },
  'ingredient-analysis': { label: 'Ingredient Analysis', emoji: '🧪' },
  'routine-generator': { label: 'Routine Generator', emoji: '📋' },
  'dashboard': { label: 'Unified Dashboard', emoji: '✨' },
  'simple-analysis': { label: 'Smart Analysis', emoji: '🪄' },
  'progress': { label: 'Progress Tracking', emoji: '📈' },
  'privacy': { label: 'Privacy Center', emoji: '🔒' },
};

export const CATEGORY_LABELS: Record<FeedbackCategory, { label: string; emoji: string; description: string }> = {
  accuracy: { label: 'Accuracy', emoji: '🎯', description: 'How accurate were the results?' },
  helpfulness: { label: 'Helpfulness', emoji: '💡', description: 'How helpful were the suggestions?' },
  recommendations: { label: 'Recommendations', emoji: '🛍️', description: 'How good were product recommendations?' },
  routine: { label: 'Routine Quality', emoji: '📋', description: 'How useful was the routine?' },
  ingredients: { label: 'Ingredient Info', emoji: '🧪', description: 'How clear were ingredient explanations?' },
  overall: { label: 'Overall Experience', emoji: '⭐', description: 'Your overall experience' },
  bug: { label: 'Bug Report', emoji: '🐛', description: 'Report a problem or error' },
};
