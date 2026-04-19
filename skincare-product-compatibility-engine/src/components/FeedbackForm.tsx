// ─────────────────────────────────────────────────────────────
// TASK 9: FEEDBACK FORM COMPONENT
// Star rating + comment + category feedback with auto-analysis
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Send, CheckCircle2, Sparkles } from 'lucide-react';
import type { FeedbackRating, FeedbackCategory, SkinType, FeedbackAnalysis } from '../types';
import {
  saveFeedback,
  analyzeFeedbackEntry,
  MODULE_LABELS,
  CATEGORY_LABELS,
} from '../logic/feedbackEngine';
import { getConsent, saveConsent, canStoreData } from '../logic/privacyEngine';

interface FeedbackFormProps {
  /** Which module this feedback is about */
  module: string;
  /** User's skin type (auto-detected) */
  userSkinType?: SkinType | '';
  /** Called after feedback is submitted */
  onSubmit?: (analysis: FeedbackAnalysis) => void;
  /** Compact mode — smaller UI */
  compact?: boolean;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  module,
  userSkinType = '',
  onSubmit,
  compact = false,
}) => {
  const [rating, setRating] = useState<FeedbackRating | 0>(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState<FeedbackCategory>('overall');
  const [comment, setComment] = useState('');
  const [foundAccurate, setFoundAccurate] = useState<boolean | null>(null);
  const [likedMost, setLikedMost] = useState('');
  const [improve, setImprove] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [analysis, setAnalysis] = useState<FeedbackAnalysis | null>(null);

  const moduleInfo = MODULE_LABELS[module] || { label: module, emoji: '📋' };

  const handleSubmit = () => {
    if (rating === 0) return;

    // Check if feedback storage is consented
    if (!canStoreData('feedback')) {
      // Auto-enable consent for feedback
      const consent = getConsent();
      if (!consent.storeFeedback) {
        saveConsent({ storeFeedback: true });
      }
    }

    const entry = saveFeedback({
      module,
      rating: rating as FeedbackRating,
      category,
      comment,
      userSkinType: userSkinType || undefined,
      foundAccurate: foundAccurate ?? undefined,
      likedMost: likedMost || undefined,
      improve: improve || undefined,
    });

    if (entry) {
      const feedbackAnalysis = analyzeFeedbackEntry(entry);
      setAnalysis(feedbackAnalysis);
      setSubmitted(true);
      onSubmit?.(feedbackAnalysis);
    }
  };

  const handleReset = () => {
    setRating(0);
    setComment('');
    setFoundAccurate(null);
    setLikedMost('');
    setImprove('');
    setSubmitted(false);
    setAnalysis(null);
    setCategory('overall');
  };

  // Compact submitted state
  if (submitted && compact) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-200">
        <CheckCircle2 size={18} className="text-emerald-600" />
        <span className="text-sm font-medium text-emerald-700">Thanks for your feedback!</span>
      </div>
    );
  }

  // Submitted state
  if (submitted && analysis) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={28} />
            <div>
              <h3 className="font-bold text-lg">Thank You for Your Feedback!</h3>
              <p className="text-sm text-white/80">Your input helps us improve our skincare tools.</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {/* Auto-response */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Our Response</span>
            </div>
            <p className="text-sm text-blue-700">{analysis.autoResponse}</p>
          </div>

          {/* Sentiment */}
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              analysis.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700' :
              analysis.sentiment === 'negative' ? 'bg-rose-100 text-rose-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {analysis.sentiment === 'positive' ? '😊 Positive' :
               analysis.sentiment === 'negative' ? '😞 Negative' : '😐 Neutral'}
              <span className="ml-1 text-xs opacity-75">
                ({Math.round(analysis.sentimentConfidence * 100)}% confidence)
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={18}
                  className={star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                />
              ))}
            </div>
          </div>

          {/* Key Phrases */}
          {analysis.keyPhrases.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Key phrases detected:</p>
              <div className="flex flex-wrap gap-2">
                {analysis.keyPhrases.map((phrase, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {phrase}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
          >
            Submit More Feedback
          </button>
        </div>
      </div>
    );
  }

  // Compact form
  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Rate your experience:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star as FeedbackRating)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={22}
                  className={`transition-colors ${
                    star <= (hoverRating || rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                  }`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              </button>
            ))}
          </div>
        </div>
        {rating > 0 && (
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Quick comment (optional)..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 outline-none"
            />
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Full form
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <MessageSquare size={24} />
          <div>
            <h3 className="font-bold text-lg">Share Your Feedback</h3>
            <p className="text-sm text-white/70">
              Rating for: {moduleInfo.emoji} {moduleInfo.label}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            How would you rate your experience? <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star as FeedbackRating)}
                className="transition-transform hover:scale-125 active:scale-95"
              >
                <Star
                  size={36}
                  className={`transition-all duration-200 ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-500 fill-yellow-500 drop-shadow-md'
                      : 'text-gray-300 hover:text-yellow-300'
                  }`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-3 text-sm font-medium text-gray-500">
                {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
              </span>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">What aspect are you reviewing?</label>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(CATEGORY_LABELS) as [FeedbackCategory, typeof CATEGORY_LABELS[FeedbackCategory]][]).map(([key, cat]) => (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === key
                    ? 'bg-violet-100 text-violet-700 border-2 border-violet-300'
                    : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">{CATEGORY_LABELS[category].description}</p>
        </div>

        {/* Accuracy */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Did you find the results accurate?
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFoundAccurate(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                foundAccurate === true
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                  : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <ThumbsUp size={16} /> Yes, Accurate
            </button>
            <button
              type="button"
              onClick={() => setFoundAccurate(false)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                foundAccurate === false
                  ? 'bg-rose-100 text-rose-700 border-2 border-rose-300'
                  : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <ThumbsDown size={16} /> Not Really
            </button>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your feedback <span className="text-xs text-gray-400">(optional, max 500 chars)</span>
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value.slice(0, 500))}
            placeholder="Tell us about your experience... What worked? What didn't? Any suggestions?"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none resize-none"
          />
          <div className="text-right text-xs text-gray-400 mt-1">{comment.length}/500</div>
        </div>

        {/* What they liked */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            What did you like most? <span className="text-xs text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={likedMost}
            onChange={e => setLikedMost(e.target.value.slice(0, 200))}
            placeholder="e.g., The personalized routine suggestions..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none"
          />
        </div>

        {/* What to improve */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            What should we improve? <span className="text-xs text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={improve}
            onChange={e => setImprove(e.target.value.slice(0, 200))}
            placeholder="e.g., Add more product options for dry skin..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all ${
            rating === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
          }`}
        >
          <Send size={22} />
          Submit Feedback
        </button>

        <p className="text-center text-xs text-gray-400">
          Your feedback is stored locally and helps improve our recommendations.
        </p>
      </div>
    </div>
  );
};

export default FeedbackForm;
