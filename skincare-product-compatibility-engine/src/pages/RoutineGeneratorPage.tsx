// ─────────────────────────────────────────────────────────────
// PERSONALIZED ROUTINE GENERATOR PAGE (TASK 6)
// Complete UI: Input Form → Generated Routine → Products → XAI
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkinContext } from '../context/SkinContext';
import type { SkinType, SkinConcern, SkinGoal, BudgetLevel, RoutineResult } from '../types';
import { generateRoutine } from '../logic/routineGenerator';
import { calculateTotalSavings } from '../logic/budgetAlternatives';
import RoutineCard from '../components/RoutineCard';
import ProductCard from '../components/ProductCard';
import {
  ArrowLeft, ArrowRight, Sun, Moon, Sparkles, Brain, Star,
  CheckCircle2, AlertTriangle, Lightbulb, Calendar, Thermometer,
  IndianRupee, TrendingUp, Target, Zap, ChevronRight, Leaf,
  ShieldCheck, Heart
} from 'lucide-react';

const allConcerns: { value: SkinConcern; label: string; emoji: string }[] = [
  { value: 'acne', label: 'Acne & Breakouts', emoji: '🔴' },
  { value: 'pigmentation', label: 'Dark Spots', emoji: '🟤' },
  { value: 'dryness', label: 'Dryness', emoji: '🏜️' },
  { value: 'aging', label: 'Fine Lines', emoji: '📅' },
  { value: 'oiliness', label: 'Oiliness', emoji: '💧' },
  { value: 'blackheads', label: 'Blackheads', emoji: '⚫' },
  { value: 'sensitivity', label: 'Sensitivity', emoji: '🌸' },
];

const allGoals: { value: SkinGoal; label: string; emoji: string }[] = [
  { value: 'glow', label: 'Glow & Radiance', emoji: '✨' },
  { value: 'acne-free', label: 'Clear Skin', emoji: '🎯' },
  { value: 'hydration', label: 'Deep Hydration', emoji: '💧' },
  { value: 'anti-aging', label: 'Anti-Aging', emoji: '⏰' },
  { value: 'brightening', label: 'Brightening', emoji: '☀️' },
  { value: 'oil-control', label: 'Oil Control', emoji: '🛢️' },
  { value: 'sensitive-care', label: 'Gentle Care', emoji: '🌿' },
  { value: 'even-tone', label: 'Even Skin Tone', emoji: '🎨' },
];

const budgetOptions: { value: BudgetLevel; label: string; desc: string; emoji: string; range: string }[] = [
  { value: 'low', label: 'Student Budget', desc: 'Products under ₹400 — maximum value for minimum spend', emoji: '💰', range: '₹100-400' },
  { value: 'medium', label: 'Mid-Range', desc: 'Dermatologist-recommended brands — best balance of quality & price', emoji: '💎', range: '₹400-800' },
  { value: 'high', label: 'Premium', desc: 'Luxury & clinical-grade products — maximum efficacy', emoji: '👑', range: '₹800+' },
];

const RoutineGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { detectedSkinType } = useSkinContext();

  // Form state
  const [skinType, setSkinType] = useState<SkinType | ''>('');
  const [concerns, setConcerns] = useState<SkinConcern[]>([]);
  const [goals, setGoals] = useState<SkinGoal[]>([]);
  const [budget, setBudget] = useState<BudgetLevel>('low');

  // Result state
  const [result, setResult] = useState<RoutineResult | null>(null);
  const [activeTab, setActiveTab] = useState<'morning' | 'night' | 'products' | 'why' | 'tips'>('morning');
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-fill skin type from context
  useEffect(() => {
    if (detectedSkinType) {
      setSkinType(detectedSkinType);
    }
  }, [detectedSkinType]);

  // Toggle concern selection
  const toggleConcern = (c: SkinConcern) => {
    setConcerns(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  // Toggle goal selection
  const toggleGoal = (g: SkinGoal) => {
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  // Generate routine
  const handleGenerate = () => {
    if (!skinType) return;
    setIsGenerating(true);
    // Simulate brief processing time for UX
    setTimeout(() => {
      const routineResult = generateRoutine({
        skinType,
        concerns,
        goals,
        budget,
      });
      setResult(routineResult);
      setIsGenerating(false);
      setActiveTab('morning');
    }, 1200);
  };

  // Calculate total savings
  const totalSavings = result
    ? calculateTotalSavings([...result.morningRoutine.alternatives, ...result.nightRoutine.alternatives])
    : null;

  // Tab config
  const tabs = [
    { key: 'morning' as const, label: 'Morning', icon: <Sun size={16} /> },
    { key: 'night' as const, label: 'Night', icon: <Moon size={16} /> },
    { key: 'products' as const, label: 'Products', icon: <Star size={16} /> },
    { key: 'why' as const, label: 'Why It Works', icon: <Brain size={16} /> },
    { key: 'tips' as const, label: 'Tips & More', icon: <Lightbulb size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 via-emerald-500 to-green-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-1">
                <Leaf size={12} /> TASK 6 — Personalized Routine
              </div>
              <h1 className="text-3xl md:text-4xl font-black">Your Daily Routine</h1>
            </div>
          </div>
          <p className="text-white/80 text-lg max-w-2xl">
            Get a personalized morning & night skincare routine based on your skin type, concerns, and budget — with product recommendations and cheaper alternatives.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Input Form */}
        <div className="bg-white rounded-3xl border-2 border-teal-100 p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
            <Target size={22} className="text-teal-500" />
            Tell Us About Your Skin
          </h2>

          {/* Skin Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              1. Your Skin Type {!detectedSkinType && <span className="text-gray-400 font-normal">(or </span>}
              {!detectedSkinType && (
                <button onClick={() => navigate('/skin-type')} className="text-teal-500 font-semibold hover:underline text-sm">
                  detect it here
                </button>
              )}
              {!detectedSkinType && <span className="text-gray-400 font-normal">)</span>}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['oily', 'dry', 'combination', 'sensitive'] as SkinType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setSkinType(type)}
                  className={`px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                    skinType === type
                      ? 'border-teal-400 bg-teal-50 text-teal-700 shadow-md'
                      : 'border-gray-200 text-gray-600 hover:border-teal-200 hover:bg-teal-50/50'
                  }`}
                >
                  {type === 'oily' && '💧 '}{type === 'dry' && '🏜️ '}{type === 'combination' && '🔄 '}{type === 'sensitive' && '🌸 '}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            {detectedSkinType && (
              <p className="text-xs text-teal-600 mt-2 flex items-center gap-1">
                <CheckCircle2 size={12} /> Auto-detected from your skin analysis
              </p>
            )}
          </div>

          {/* Concerns */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              2. Your Skin Concerns <span className="text-gray-400 font-normal">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {allConcerns.map(c => (
                <button
                  key={c.value}
                  onClick={() => toggleConcern(c.value)}
                  className={`px-3.5 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    concerns.includes(c.value)
                      ? 'border-rose-300 bg-rose-50 text-rose-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              3. Your Skincare Goals <span className="text-gray-400 font-normal">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {allGoals.map(g => (
                <button
                  key={g.value}
                  onClick={() => toggleGoal(g.value)}
                  className={`px-3.5 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    goals.includes(g.value)
                      ? 'border-violet-300 bg-violet-50 text-violet-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {g.emoji} {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              4. Your Budget Level
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {budgetOptions.map(b => (
                <button
                  key={b.value}
                  onClick={() => setBudget(b.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    budget === b.value
                      ? 'border-amber-300 bg-amber-50 shadow-md'
                      : 'border-gray-200 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{b.emoji}</span>
                    <span className="font-bold text-gray-800 text-sm">{b.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
                  <p className="text-xs font-semibold text-amber-600 mt-1">{b.range}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!skinType || isGenerating}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
              !skinType
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isGenerating
                ? 'bg-teal-300 text-white cursor-wait'
                : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 shadow-xl hover:shadow-2xl hover:-translate-y-0.5'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Building Your Routine...
              </>
            ) : (
              <>
                <Zap size={22} />
                Generate My Personalized Routine
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Score Banner */}
            <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-white/70 text-xs font-semibold uppercase mb-1">Routine Score</div>
                  <div className="text-3xl font-black">{result.routineScore}<span className="text-lg text-white/70">/100</span></div>
                </div>
                <div>
                  <div className="text-white/70 text-xs font-semibold uppercase mb-1">Total Products</div>
                  <div className="text-3xl font-black">{result.totalProducts}</div>
                </div>
                <div>
                  <div className="text-white/70 text-xs font-semibold uppercase mb-1">Monthly Cost</div>
                  <div className="text-lg font-bold">{result.estimatedMonthlyCost}</div>
                </div>
                {totalSavings && totalSavings.totalSavings > 0 && (
                  <div>
                    <div className="text-white/70 text-xs font-semibold uppercase mb-1">Potential Savings</div>
                    <div className="text-3xl font-black text-yellow-300">₹{totalSavings.totalSavings}</div>
                    <div className="text-xs text-yellow-200">{totalSavings.percentage}% cheaper</div>
                  </div>
                )}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-gray-100 rounded-2xl p-1.5 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.key
                      ? 'bg-white text-teal-700 shadow-md'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="animate-fadeIn">
              {/* ── Morning Routine ── */}
              {activeTab === 'morning' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center">
                      <Sun size={20} className="text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-800">{result.morningRoutine.emoji} {result.morningRoutine.title}</h3>
                      <p className="text-sm text-gray-500">{result.morningRoutine.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {result.morningRoutine.steps.map((step, i) => (
                      <RoutineCard key={i} step={step} index={i} total={result.morningRoutine.steps.length} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Night Routine ── */}
              {activeTab === 'night' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center">
                      <Moon size={20} className="text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-800">{result.nightRoutine.emoji} {result.nightRoutine.title}</h3>
                      <p className="text-sm text-gray-500">{result.nightRoutine.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {result.nightRoutine.steps.map((step, i) => (
                      <RoutineCard key={i} step={step} index={i} total={result.nightRoutine.steps.length} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Products Tab ── */}
              {activeTab === 'products' && (
                <div>
                  <h3 className="text-xl font-black text-gray-800 mb-2 flex items-center gap-2">
                    <Star size={22} className="text-amber-500" />
                    Recommended Products
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Products matched to your skin profile. Each comes with a budget-friendly alternative.
                  </p>

                  {/* Morning Products */}
                  <div className="mb-8">
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <Sun size={16} className="text-amber-400" /> Morning Products
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.morningRoutine.products.map((product, i) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          alternative={result.morningRoutine.alternatives[i]}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Night Products */}
                  <div>
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <Moon size={16} className="text-indigo-400" /> Night Products
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.nightRoutine.products.map((product, i) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          alternative={result.nightRoutine.alternatives[i]}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Total Savings Card */}
                  {totalSavings && totalSavings.totalSavings > 0 && (
                    <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                      <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                        <IndianRupee size={18} />
                        Total Potential Savings with Budget Alternatives
                      </h4>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-black text-green-600">₹{totalSavings.totalSavings}</span>
                        <span className="text-green-500 font-semibold">({totalSavings.percentage}% less)</span>
                      </div>
                      <div className="space-y-1">
                        {totalSavings.breakdown.map((b, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{b.productName}</span>
                            <span className="text-green-600 font-semibold">Save ₹{b.savings}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Why It Works (XAI) ── */}
              {activeTab === 'why' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                    <Brain size={22} className="text-violet-500" />
                    Why This Routine Works For You
                  </h3>

                  {/* Overall */}
                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border-2 border-violet-100">
                    <h4 className="font-bold text-violet-800 mb-2 flex items-center gap-2">
                      <Sparkles size={16} /> Overall Explanation
                    </h4>
                    <p className="text-violet-700 leading-relaxed">{result.explanation.overall}</p>
                  </div>

                  {/* Why It Works */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                      <ShieldCheck size={16} /> Why This Works
                    </h4>
                    <p className="text-emerald-700 leading-relaxed">{result.explanation.whyItWorks}</p>
                  </div>

                  {/* Morning & Night Focus */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-100">
                      <h5 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                        <Sun size={16} /> Morning Focus
                      </h5>
                      <p className="text-amber-700 text-sm leading-relaxed">{result.explanation.morningFocus}</p>
                    </div>
                    <div className="bg-indigo-50 rounded-2xl p-5 border-2 border-indigo-100">
                      <h5 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                        <Moon size={16} /> Night Focus
                      </h5>
                      <p className="text-indigo-700 text-sm leading-relaxed">{result.explanation.nightFocus}</p>
                    </div>
                  </div>

                  {/* Key Ingredients */}
                  <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Heart size={16} className="text-rose-400" /> Key Ingredients In Your Routine
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.explanation.keyIngredients.map((ing, i) => (
                        <span key={i} className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-medium border border-teal-100 capitalize">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expected Results */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                      <TrendingUp size={16} /> Expected Results Timeline
                    </h4>
                    <div className="space-y-2">
                      {result.explanation.expectedResults.map((r, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-green-700 text-sm">{r}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-green-600 mt-3 italic">
                      * Individual results vary. Consistency is the key to seeing real improvement.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Tips & More ── */}
              {activeTab === 'tips' && (
                <div className="space-y-6">
                  {/* Tips */}
                  <div>
                    <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                      <Lightbulb size={22} className="text-amber-500" />
                      Pro Tips for Your Routine
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.tips.map((tip, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                          <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Variations */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                      <Calendar size={16} /> Weekly Routine Variation
                    </h4>
                    <div className="space-y-2">
                      {result.weeklyVariations.map((v, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <ChevronRight size={14} className="text-blue-400 flex-shrink-0 mt-1" />
                          <span className="text-blue-700 text-sm">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seasonal Notes */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-100">
                    <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                      <Thermometer size={16} /> Seasonal Adjustments
                    </h4>
                    <div className="space-y-2">
                      {result.seasonalNotes.map((n, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-orange-400 flex-shrink-0">•</span>
                          <span className="text-orange-700 text-sm leading-relaxed">{n}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-gray-600 text-sm mb-1">Important Disclaimer</h5>
                        <p className="text-gray-500 text-xs leading-relaxed">
                          This routine is generated using ingredient science and dermatology best practices, but it is NOT a substitute for professional dermatological advice.
                          Always patch test new products. If you have persistent skin issues, consult a board-certified dermatologist.
                          Product prices are approximate and may vary by region and availability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-6 pb-12 border-t border-gray-200 mt-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >
                <ArrowLeft size={16} /> Back to Home
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/ingredient-analysis')}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors"
                >
                  Analyze Ingredients <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => navigate('/progress')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl font-semibold text-sm hover:bg-indigo-600 transition-colors"
                >
                  Track Progress <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineGeneratorPage;
