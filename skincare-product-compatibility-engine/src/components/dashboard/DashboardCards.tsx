// ─────────────────────────────────────────────────────────────
// DASHBOARD RESULT CARDS (TASK 7)
// Reusable cards for displaying unified analysis results
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  CheckCircle2, AlertTriangle, XCircle, Shield, Droplets, Moon,
  Utensils, Activity, Sun, Zap, Heart, Sparkles, ChevronRight,
  AlertCircle, Info, Camera, Hand, TrendingUp, Star,
} from 'lucide-react';
import type {
  SkinTypeSection, AcneRiskSection, IngredientSafetySection,
  LifestyleSection, RoutinePreviewSection, UnifiedExplanation,
  HarmfulCombination, AcneRiskLevel,
} from '../../types';

// ─────────────────────────────────────────────────────────────
// OVERALL SCORE BANNER
// ─────────────────────────────────────────────────────────────
interface OverallScoreProps {
  score: number;
  grade: string;
  confidence: number;
}

export const OverallScoreBanner: React.FC<OverallScoreProps> = ({ score, grade, confidence }) => {
  const getColor = () => {
    if (score >= 75) return { bg: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-200', text: 'text-emerald-600' };
    if (score >= 50) return { bg: 'from-amber-500 to-yellow-600', ring: 'ring-amber-200', text: 'text-amber-600' };
    return { bg: 'from-rose-500 to-red-600', ring: 'ring-rose-200', text: 'text-rose-600' };
  };
  const c = getColor();

  return (
    <div className={`bg-gradient-to-br ${c.bg} rounded-3xl p-8 text-white relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      <div className="relative flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          <div className={`w-32 h-32 rounded-full ${c.ring} ring-8 bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center`}>
            <span className="text-4xl font-black">{score}</span>
            <span className="text-sm font-medium text-white/80">/100</span>
          </div>
        </div>
        <div className="text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <span className="text-3xl font-black">Grade: {grade}</span>
            <Sparkles size={24} className="text-yellow-300" />
          </div>
          <p className="text-white/80 text-lg mb-3">
            {score >= 75 ? 'Your skin profile looks great! Minor tweaks can make it perfect.' :
             score >= 50 ? 'Your skin needs some attention. Follow the recommendations below.' :
             'Your skin needs immediate care. Review all findings carefully.'}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
            <span className="flex items-center gap-1 bg-white/15 rounded-full px-3 py-1">
              <Zap size={14} /> Confidence: {confidence}%
            </span>
            <span className="flex items-center gap-1 bg-white/15 rounded-full px-3 py-1">
              <Activity size={14} /> 6 modules analyzed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SKIN TYPE CARD
// ─────────────────────────────────────────────────────────────
interface SkinTypeCardProps {
  data: SkinTypeSection;
}

export const SkinTypeCard: React.FC<SkinTypeCardProps> = ({ data }) => {
  const typeEmoji: Record<string, string> = {
    dry: '🏜️', oily: '💧', combination: '🔄', sensitive: '🌸',
  };
  const typeColor: Record<string, string> = {
    dry: 'bg-amber-100 text-amber-700 border-amber-200',
    oily: 'bg-blue-100 text-blue-700 border-blue-200',
    combination: 'bg-purple-100 text-purple-700 border-purple-200',
    sensitive: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
          <Camera size={20} className="text-violet-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Skin Type</h3>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl">{typeEmoji[data.skinType] || '🔬'}</div>
        <div>
          <div className={`inline-flex items-center px-4 py-2 rounded-2xl font-bold text-lg border ${typeColor[data.skinType] || ''}`}>
            {data.skinType.charAt(0).toUpperCase() + data.skinType.slice(1)}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            via {data.method === 'image' ? '📷 Image Analysis' : data.method === 'questionnaire' ? '📝 Quiz' : '👆 Manual Selection'}
          </p>
        </div>
      </div>
      {/* Confidence bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Confidence</span>
          <span className="font-bold text-gray-700">{Math.round(data.confidence * 100)}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full transition-all duration-1000"
            style={{ width: `${data.confidence * 100}%` }}
          ></div>
        </div>
      </div>
      {/* Image indicators */}
      {data.indicators && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {data.indicators.brightness !== undefined && (
            <div className="bg-gray-50 rounded-xl p-2 text-center">
              <Sun size={14} className="mx-auto text-amber-500 mb-1" />
              <div className="text-xs text-gray-500">Brightness</div>
              <div className="font-bold text-gray-700 text-sm">{data.indicators.brightness}</div>
            </div>
          )}
          {data.indicators.redness !== undefined && (
            <div className="bg-gray-50 rounded-xl p-2 text-center">
              <Activity size={14} className="mx-auto text-rose-500 mb-1" />
              <div className="text-xs text-gray-500">Redness</div>
              <div className="font-bold text-gray-700 text-sm">{data.indicators.redness}</div>
            </div>
          )}
          {data.indicators.saturation !== undefined && (
            <div className="bg-gray-50 rounded-xl p-2 text-center">
              <Droplets size={14} className="mx-auto text-blue-500 mb-1" />
              <div className="text-xs text-gray-500">Saturation</div>
              <div className="font-bold text-gray-700 text-sm">{data.indicators.saturation}</div>
            </div>
          )}
        </div>
      )}
      <p className="text-sm text-gray-600 leading-relaxed">{data.explanation}</p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ACNE RISK CARD
// ─────────────────────────────────────────────────────────────
interface AcneRiskCardProps {
  data: AcneRiskSection;
}

export const AcneRiskCard: React.FC<AcneRiskCardProps> = ({ data }) => {
  const riskConfig: Record<AcneRiskLevel, { color: string; bg: string; emoji: string; label: string }> = {
    low: { color: 'text-emerald-600', bg: 'bg-emerald-100', emoji: '✅', label: 'Low Risk' },
    moderate: { color: 'text-amber-600', bg: 'bg-amber-100', emoji: '⚠️', label: 'Moderate Risk' },
    high: { color: 'text-orange-600', bg: 'bg-orange-100', emoji: '🔶', label: 'High Risk' },
    severe: { color: 'text-rose-600', bg: 'bg-rose-100', emoji: '🔴', label: 'Severe Risk' },
  };
  const rc = riskConfig[data.riskLevel];

  return (
    <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
          <AlertTriangle size={20} className="text-rose-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Acne Risk</h3>
      </div>

      {/* Risk level badge */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{rc.emoji}</span>
        <div>
          <span className={`px-4 py-2 rounded-2xl font-bold text-lg ${rc.bg} ${rc.color}`}>
            {rc.label}
          </span>
          <p className="text-sm text-gray-500 mt-1">Score: {data.riskScore}/100</p>
        </div>
      </div>

      {/* Risk score bar */}
      <div className="mb-4">
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              data.riskScore < 30 ? 'bg-emerald-500' :
              data.riskScore < 60 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${data.riskScore}%` }}
          ></div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 mb-4">
        {[
          { label: 'Ingredient Risk', value: data.breakdown.ingredientScore },
          { label: 'Habit Risk', value: data.breakdown.habitScore },
          { label: 'Product Risk', value: data.breakdown.productScore },
          { label: 'Skin Type Factor', value: data.breakdown.skinTypeScore },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{item.label}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.value < 30 ? 'bg-emerald-400' : item.value < 60 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${item.value}%` }}></div>
              </div>
              <span className="font-medium text-gray-700 w-8 text-right">{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Top triggers */}
      {data.topTriggers.length > 0 && (
        <div className="bg-rose-50 rounded-2xl p-3">
          <p className="text-xs font-semibold text-rose-700 mb-2">Top Triggers</p>
          {data.topTriggers.slice(0, 3).map((t, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-rose-600 mb-1">
              <ChevronRight size={14} className="mt-0.5 flex-shrink-0" />
              <span>{t.name}: {t.suggestion}</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-600 mt-3">{data.summary}</p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// INGREDIENT SAFETY CARD
// ─────────────────────────────────────────────────────────────
interface IngredientSafetyCardProps {
  data: IngredientSafetySection;
}

export const IngredientSafetyCard: React.FC<IngredientSafetyCardProps> = ({ data }) => {
  const safetyConfig = {
    safe: { icon: <CheckCircle2 size={24} className="text-emerald-500" />, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Safe' },
    caution: { icon: <AlertCircle size={24} className="text-amber-500" />, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Caution' },
    avoid: { icon: <XCircle size={24} className="text-rose-500" />, color: 'text-rose-600', bg: 'bg-rose-50', label: 'Avoid' },
  };
  const sc = safetyConfig[data.overallSafety];

  return (
    <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <Shield size={20} className="text-amber-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Ingredient Safety</h3>
      </div>

      {/* Safety badge */}
      <div className={`flex items-center gap-3 ${sc.bg} rounded-2xl p-4 mb-4`}>
        {sc.icon}
        <div>
          <span className={`font-bold text-lg ${sc.color}`}>{sc.label}</span>
          <p className="text-sm text-gray-600">Score: {data.overallScore}/100</p>
        </div>
      </div>

      {/* Safe ingredients */}
      {data.safeProducts.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-1">
            <CheckCircle2 size={14} /> Safe Ingredients
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.safeProducts.map((p, i) => (
              <span key={i} className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">{p}</span>
            ))}
          </div>
        </div>
      )}

      {/* Risky ingredients */}
      {data.riskyProducts.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-rose-700 mb-2 flex items-center gap-1">
            <AlertTriangle size={14} /> Risky Ingredients
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.riskyProducts.map((p, i) => (
              <span key={i} className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-lg text-xs font-medium">{p}</span>
            ))}
          </div>
        </div>
      )}

      {/* Harmful combinations */}
      {data.harmfulCombinations.length > 0 && (
        <div className="bg-rose-50 rounded-2xl p-3 mb-3">
          <p className="text-xs font-semibold text-rose-700 mb-2">⚠️ Harmful Combinations</p>
          {data.harmfulCombinations.map((combo: HarmfulCombination, i: number) => (
            <div key={i} className="text-sm text-rose-600 mb-1">
              <span className="font-medium">{combo.ingredient1}</span> + <span className="font-medium">{combo.ingredient2}</span>
              <p className="text-xs text-rose-500 ml-4">{combo.reason}</p>
            </div>
          ))}
        </div>
      )}

      {/* Best/Worst */}
      <div className="grid grid-cols-2 gap-2">
        {data.bestIngredient && (
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <Star size={16} className="mx-auto text-emerald-500 mb-1" />
            <div className="text-xs text-gray-500">Best Match</div>
            <div className="font-bold text-emerald-700 text-sm">{data.bestIngredient}</div>
          </div>
        )}
        {data.worstIngredient && (
          <div className="bg-rose-50 rounded-xl p-3 text-center">
            <XCircle size={16} className="mx-auto text-rose-500 mb-1" />
            <div className="text-xs text-gray-500">Worst Match</div>
            <div className="font-bold text-rose-700 text-sm">{data.worstIngredient}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// LIFESTYLE IMPACT CARD
// ─────────────────────────────────────────────────────────────
interface LifestyleCardProps {
  data: LifestyleSection;
}

export const LifestyleImpactCard: React.FC<LifestyleCardProps> = ({ data }) => {
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600 bg-emerald-100';
    if (score >= 50) return 'text-amber-600 bg-amber-100';
    return 'text-rose-600 bg-rose-100';
  };

  const getBarColor = (score: number) => {
    if (score >= 75) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Heart size={20} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Lifestyle Impact</h3>
        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
          data.impact === 'positive' ? 'bg-emerald-100 text-emerald-700' :
          data.impact === 'neutral' ? 'bg-amber-100 text-amber-700' :
          'bg-rose-100 text-rose-700'
        }`}>
          {data.impact === 'positive' ? '👍 Positive' : data.impact === 'neutral' ? '⚡ Neutral' : '👎 Negative'}
        </span>
      </div>

      {/* Overall score */}
      <div className="text-center mb-4">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreColor(data.overallScore)}`}>
          <span className="text-xl font-black">{data.overallScore}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Overall Lifestyle Score</p>
      </div>

      {/* Individual scores */}
      <div className="space-y-3">
        {[
          { label: 'Sleep', icon: <Moon size={16} />, score: data.sleepScore },
          { label: 'Hydration', icon: <Droplets size={16} />, score: data.hydrationScore },
          { label: 'Diet', icon: <Utensils size={16} />, score: data.dietScore },
          { label: 'Stress Mgmt', icon: <Activity size={16} />, score: data.stressScore },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="text-gray-400">{item.icon}</div>
            <span className="text-sm text-gray-600 w-24">{item.label}</span>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${getBarColor(item.score)} transition-all duration-1000`} style={{ width: `${item.score}%` }}></div>
            </div>
            <span className={`text-sm font-bold w-8 text-right ${item.score >= 75 ? 'text-emerald-600' : item.score >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
              {item.score}
            </span>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <div className="mt-4 bg-blue-50 rounded-2xl p-3">
          <p className="text-xs font-semibold text-blue-700 mb-2">Recommendations</p>
          {data.recommendations.slice(0, 3).map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-blue-600 mb-1">
              <ChevronRight size={14} className="mt-0.5 flex-shrink-0" />
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ROUTINE PREVIEW CARD
// ─────────────────────────────────────────────────────────────
interface RoutinePreviewCardProps {
  data: RoutinePreviewSection;
}

export const RoutinePreviewCard: React.FC<RoutinePreviewCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
          <Hand size={20} className="text-teal-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Routine Preview</h3>
        <span className="ml-auto px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">
          Score: {data.routineScore}/100
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Morning */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-100">
          <div className="flex items-center gap-2 mb-3">
            <Sun size={18} className="text-amber-500" />
            <span className="font-bold text-amber-700">Morning Routine</span>
          </div>
          <div className="space-y-1.5">
            {data.morningSteps.map((step, i) => (
              <div key={i} className="text-sm text-gray-700 flex items-center gap-2">
                <ChevronRight size={12} className="text-amber-400" />
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Night */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
          <div className="flex items-center gap-2 mb-3">
            <Moon size={18} className="text-indigo-500" />
            <span className="font-bold text-indigo-700">Night Routine</span>
          </div>
          <div className="space-y-1.5">
            {data.nightSteps.map((step, i) => (
              <div key={i} className="text-sm text-gray-700 flex items-center gap-2">
                <ChevronRight size={12} className="text-indigo-400" />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key ingredients */}
      {data.keyIngredients.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">Key Ingredients</p>
          <div className="flex flex-wrap gap-1.5">
            {data.keyIngredients.map((ing, i) => (
              <span key={i} className="px-2.5 py-1 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium">{ing}</span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-gray-500">Est. Monthly Cost</span>
        <span className="font-bold text-teal-600">{data.estimatedCost}</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// EXPLANATION BOX — "Why This Works For You" (MAIN FEATURE)
// ─────────────────────────────────────────────────────────────
interface ExplanationBoxProps {
  data: UnifiedExplanation;
}

export const ExplanationBox: React.FC<ExplanationBoxProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-200 p-6 hover:shadow-lg transition-shadow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-800">Why This Works For You</h3>
            <p className="text-sm text-gray-500">Explainable AI — transparent reasoning</p>
          </div>
        </div>

        {/* Overall Summary */}
        <div className="bg-emerald-50 rounded-2xl p-4 mb-4 border border-emerald-100">
          <div className="flex items-start gap-2">
            <Info size={18} className="text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-700 mb-1">Overall Summary</p>
              <p className="text-sm text-gray-700 leading-relaxed">{data.overallSummary}</p>
            </div>
          </div>
        </div>

        {/* Why It Works */}
        <div className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-100">
          <div className="flex items-start gap-2">
            <TrendingUp size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-700 mb-1">Why This Routine Works</p>
              <p className="text-sm text-gray-700 leading-relaxed">{data.whyItWorks}</p>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="mb-4">
          <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Zap size={16} className="text-amber-500" /> Key Insights
          </p>
          <div className="space-y-2">
            {data.keyInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-amber-700">{i + 1}</span>
                </div>
                <span className="text-sm text-gray-700">{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" /> Recommended Actions
          </p>
          <div className="space-y-2">
            {data.actionItems.map((action, i) => (
              <div key={i} className="flex items-start gap-3 bg-emerald-50 rounded-xl p-3">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
