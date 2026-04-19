import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IngredientAnalysisResult, SkinType, SkinConcern } from '../types';
import { useSkinContext } from '../context/SkinContext';
import { analyzeIngredients } from '../logic/ingredientAnalyzer';
import IngredientCard from '../components/IngredientCard';
import {
  ArrowLeft, Search, Loader2, Sparkles, AlertTriangle, CheckCircle2,
  XCircle, Lightbulb, BookOpen, Shield, Info, ChevronDown, ChevronUp, Star, ArrowRight
} from 'lucide-react';

const skinTypes: { value: SkinType; label: string; emoji: string }[] = [
  { value: 'oily', label: 'Oily', emoji: '💧' },
  { value: 'dry', label: 'Dry', emoji: '🏜️' },
  { value: 'combination', label: 'Combination', emoji: '🔄' },
  { value: 'sensitive', label: 'Sensitive', emoji: '🌸' },
];

const skinConcerns: { value: SkinConcern; label: string }[] = [
  { value: 'acne', label: 'Acne & Breakouts' },
  { value: 'pigmentation', label: 'Dark Spots & Pigmentation' },
  { value: 'dryness', label: 'Dryness & Dehydration' },
  { value: 'aging', label: 'Fine Lines & Aging' },
  { value: 'sensitivity', label: 'Sensitivity & Redness' },
  { value: 'oiliness', label: 'Excess Oil' },
  { value: 'blackheads', label: 'Blackheads & Pores' },
];

const popularIngredients = [
  'Salicylic Acid', 'Retinol', 'Niacinamide', 'Hyaluronic Acid',
  'Vitamin C', 'Benzoyl Peroxide', 'Glycolic Acid', 'Ceramides',
  'Azelaic Acid', 'Tea Tree Oil', 'Peptides', 'Lactic Acid',
];

const IngredientAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { detectedSkinType } = useSkinContext();

  const [skinType, setSkinType] = useState<SkinType | ''>(detectedSkinType || '');
  const [concerns, setConcerns] = useState<SkinConcern[]>([]);
  const [acneRisk, setAcneRisk] = useState('moderate');
  const [inputText, setInputText] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [result, setResult] = useState<IngredientAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const addIngredient = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !ingredients.some(i => i.toLowerCase() === trimmed.toLowerCase())) {
      setIngredients(prev => [...prev, trimmed]);
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleTextSubmit = () => {
    const parts = inputText.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      addIngredient(part);
    }
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  const handleAnalyze = () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      const analysisResult = analyzeIngredients(ingredients, skinType, concerns, acneRisk);
      setResult(analysisResult);
      setLoading(false);
    }, 800);
  };

  const handleReset = () => {
    setResult(null);
    setIngredients([]);
    setInputText('');
  };

  const safetyConfig = {
    safe: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', icon: <CheckCircle2 size={48} className="text-emerald-500" />, label: 'Generally Safe', labelBg: 'bg-emerald-100' },
    caution: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', icon: <AlertTriangle size={48} className="text-amber-500" />, label: 'Use Caution', labelBg: 'bg-amber-100' },
    avoid: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', icon: <XCircle size={48} className="text-red-500" />, label: 'Not Recommended', labelBg: 'bg-red-100' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-sm font-semibold text-amber-700 mb-4">
            <BookOpen size={16} /> TASK 5 — Ingredient Analysis & Explainable AI
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-800 mb-3">
            Ingredient <span className="text-amber-600">Analyzer</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Enter skincare ingredients and we will explain what each one does, whether it is safe for your skin, and <strong className="text-amber-600">WHY it works (or does not work) for YOU</strong>.
          </p>
        </div>

        {!result ? (
          /* ═══════ INPUT SECTION ═══════ */
          <div className="space-y-6 animate-fade-in">
            {/* Skin Profile */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield size={22} className="text-amber-500" /> Your Skin Profile
              </h2>

              {/* Skin Type */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skin Type {detectedSkinType && <span className="text-amber-600">(auto-detected)</span>}</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {skinTypes.map(st => (
                    <button
                      key={st.value}
                      onClick={() => setSkinType(st.value)}
                      className={`px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                        skinType === st.value
                          ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-md'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {st.emoji} {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Concerns */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skin Concerns (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {skinConcerns.map(sc => (
                    <button
                      key={sc.value}
                      onClick={() => setConcerns(prev =>
                        prev.includes(sc.value) ? prev.filter(c => c !== sc.value) : [...prev, sc.value]
                      )}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        concerns.includes(sc.value)
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Acne Risk */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Acne Risk Level</label>
                <div className="grid grid-cols-4 gap-3">
                  {['low', 'moderate', 'high', 'severe'].map(r => (
                    <button
                      key={r}
                      onClick={() => setAcneRisk(r)}
                      className={`px-3 py-2 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${
                        acneRisk === r
                          ? r === 'low' ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                            : r === 'moderate' ? 'border-amber-400 bg-amber-50 text-amber-700'
                            : r === 'high' ? 'border-orange-400 bg-orange-50 text-orange-700'
                            : 'border-red-400 bg-red-50 text-red-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ingredient Input */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Search size={22} className="text-amber-500" /> Enter Ingredients
              </h2>

              {/* Text input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type ingredient name(s), separated by commas..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  onClick={handleTextSubmit}
                  className="px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Popular ingredients quick-add */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Quick-add popular ingredients:</p>
                <div className="flex flex-wrap gap-2">
                  {popularIngredients.map(ing => (
                    <button
                      key={ing}
                      onClick={() => addIngredient(ing)}
                      disabled={ingredients.some(i => i.toLowerCase() === ing.toLowerCase())}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        ingredients.some(i => i.toLowerCase() === ing.toLowerCase())
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      + {ing}
                    </button>
                  ))}
                </div>
              </div>

              {/* Added ingredients tags */}
              {ingredients.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Added ingredients ({ingredients.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                      >
                        {ing}
                        <button
                          onClick={() => removeIngredient(i)}
                          className="text-amber-500 hover:text-amber-700 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                disabled={ingredients.length === 0}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  ingredients.length > 0
                    ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Analyzing Ingredients...
                  </>
                ) : (
                  <>
                    <Sparkles size={24} />
                    Analyze {ingredients.length} Ingredient{ingredients.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* ═══════ RESULTS SECTION ═══════ */
          <div className="space-y-6 animate-fade-in">
            {/* Overall Safety Card */}
            {(() => {
              const sc = safetyConfig[result.overallSafety];
              return (
                <div className={`rounded-3xl border-2 ${sc.border} ${sc.bg} p-6 md:p-8`}>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="shrink-0">{sc.icon}</div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${sc.labelBg} ${sc.text}`}>
                          {sc.label}
                        </span>
                        <span className="text-2xl font-black text-gray-800">{result.overallScore}/100</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{result.summary}</p>
                      {result.confidence > 0 && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1 justify-center md:justify-start">
                          <Info size={12} /> Analysis confidence: {result.confidence}% ({result.ingredients.filter(a => a.matched).length}/{result.ingredients.length} ingredients matched in database)
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={handleReset}
                        className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-amber-300 transition-all"
                      >
                        Analyze Again
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* WHY THIS WORKS FOR YOU — The XAI Feature */}
            <div className="bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50 rounded-3xl border-2 border-amber-300 p-6 md:p-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-black text-amber-800 flex items-center gap-2">
                    <Lightbulb size={24} className="text-amber-500" />
                    WHY This Works (Or Does Not Work) For YOU
                  </h2>
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors flex items-center gap-1"
                  >
                    {showExplanation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {showExplanation ? 'Hide' : 'Show'} Full Explanation
                  </button>
                </div>

                {/* Summary explanation */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 mb-4">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">{result.whyItWorks}</p>
                </div>

                {result.bestIngredient && (
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 mb-4 flex items-center gap-3">
                    <Star size={24} className="text-amber-500 shrink-0" />
                    <div>
                      <p className="font-bold text-amber-800">Best Ingredient For You: {result.bestIngredient}</p>
                      <p className="text-sm text-gray-600">This ingredient scored highest for your skin profile</p>
                    </div>
                  </div>
                )}

                {showExplanation && (
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 animate-fade-in">
                    <h3 className="font-bold text-gray-800 mb-2">Full Detailed Explanation</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{result.explanation}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Harmful Combinations */}
            {result.harmfulCombinations.length > 0 && (
              <div className="bg-red-50 rounded-3xl border-2 border-red-200 p-6">
                <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                  <AlertTriangle size={22} className="text-red-500" />
                  Harmful Combinations Detected ({result.harmfulCombinations.length})
                </h2>
                <div className="space-y-4">
                  {result.harmfulCombinations.map((combo, i) => (
                    <div key={i} className={`rounded-2xl p-4 border-2 ${
                      combo.severity === 'high' ? 'bg-red-100 border-red-300' :
                      combo.severity === 'medium' ? 'bg-amber-100 border-amber-300' :
                      'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          combo.severity === 'high' ? 'bg-red-200 text-red-800' :
                          combo.severity === 'medium' ? 'bg-amber-200 text-amber-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {combo.severity} risk
                        </span>
                        <span className="font-bold text-gray-800">
                          {combo.ingredient1} + {combo.ingredient2}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{combo.reason}</p>
                      <p className="text-sm text-emerald-700 font-medium flex items-start gap-1.5">
                        <CheckCircle2 size={14} className="mt-0.5 shrink-0" /> {combo.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredient Cards */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen size={22} className="text-amber-500" />
                Ingredient Breakdown ({result.ingredients.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.ingredients.map((ing, i) => (
                  <IngredientCard key={i} ingredient={ing} />
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="bg-blue-50 rounded-3xl border-2 border-blue-200 p-6">
                <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <Lightbulb size={22} className="text-blue-500" /> Recommendations
                </h2>
                <div className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-blue-800">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alternatives */}
            {result.alternatives.length > 0 && (
              <div className="bg-emerald-50 rounded-3xl border-2 border-emerald-200 p-6">
                <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                  <Sparkles size={22} className="text-emerald-500" /> Suggested Alternatives
                </h2>
                <div className="space-y-3">
                  {result.alternatives.map((alt, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-emerald-200">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-red-600 line-through">{alt.original}</span>
                        <ArrowRight size={16} className="text-gray-400" />
                        <span className="text-sm font-bold text-emerald-700">{alt.alternative}</span>
                      </div>
                      <p className="text-xs text-gray-600">{alt.reason}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {alt.betterFor.slice(0, 4).map((b, j) => (
                          <span key={j} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs capitalize">{b}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="bg-amber-50 rounded-3xl border-2 border-amber-200 p-6">
                <h2 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                  <AlertTriangle size={22} className="text-amber-500" /> Warnings Summary
                </h2>
                <div className="space-y-2">
                  {result.warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <XCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-amber-800">{w}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 pb-12">
              <button
                onClick={handleReset}
                className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-bold text-lg hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl"
              >
                Analyze New Ingredients
              </button>
              <button
                onClick={() => navigate('/analyze')}
                className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl"
              >
                Full Routine Analysis →
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-4 bg-white text-gray-700 rounded-2xl font-bold text-lg border-2 border-gray-200 hover:border-amber-300 transition-all"
              >
                Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientAnalysisPage;
