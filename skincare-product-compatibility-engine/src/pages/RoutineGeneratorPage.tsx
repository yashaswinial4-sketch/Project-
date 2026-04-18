import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkinContext } from '../context/SkinContext';
import type { SkinType, SkinConcern, SkinGoal, BudgetLevel, RoutineResult } from '../types';
import { generateRoutine } from '../logic/routineGenerator';
import RoutineStepCard from '../components/RoutineStepCard';
import {
  ArrowLeft, ArrowRight, Sun, Moon, Sparkles, DollarSign,
  Target, TrendingUp,
  Lightbulb, AlertTriangle, Heart, Palette, BookOpen, Calendar,
  SunSnow, CheckCircle2, Zap, Droplets, Shield
} from 'lucide-react';

const allConcerns: { value: SkinConcern; label: string; emoji: string }[] = [
  { value: 'acne', label: 'Acne', emoji: '\ud83e\udeb7' },
  { value: 'pigmentation', label: 'Dark Spots', emoji: '\ud83c\udfa8' },
  { value: 'dryness', label: 'Dryness', emoji: '\ud83d\udca7' },
  { value: 'oiliness', label: 'Oiliness', emoji: '\u2728' },
  { value: 'sensitivity', label: 'Sensitivity', emoji: '\ud83e\ude78' },
  { value: 'aging', label: 'Fine Lines', emoji: '\u23f0' },
  { value: 'blackheads', label: 'Blackheads', emoji: '\u2b1c' },
];

const allGoals: { value: SkinGoal; label: string; emoji: string }[] = [
  { value: 'glow', label: 'Glow & Radiance', emoji: '\u2728' },
  { value: 'acne-free', label: 'Acne-Free Skin', emoji: '\ud83d\udee1\ufe0f' },
  { value: 'hydration', label: 'Deep Hydration', emoji: '\ud83d\udca7' },
  { value: 'anti-aging', label: 'Anti-Aging', emoji: '\u23f0' },
  { value: 'oil-control', label: 'Oil Control', emoji: '\u2601\ufe0f' },
  { value: 'brightening', label: 'Brightening', emoji: '\ud83c\udf1f' },
  { value: 'barrier-repair', label: 'Barrier Repair', emoji: '\ud83d\udd28' },
];

const budgetOptions: { value: BudgetLevel; label: string; desc: string; emoji: string }[] = [
  { value: 'low', label: 'Student Budget', desc: 'Under \u20b9350/product', emoji: '\ud83c\udf93' },
  { value: 'medium', label: 'Balanced', desc: '\u20b9400-900/product', emoji: '\u2696\ufe0f' },
  { value: 'high', label: 'Premium', desc: '\u20b91000+/product', emoji: '\ud83d\udc8e' },
];

const RoutineGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { detectedSkinType, detectionMethod, detectionConfidence } = useSkinContext();

  // Form state
  const [skinType, setSkinType] = useState<SkinType | ''>(detectedSkinType || '');
  const [concerns, setConcerns] = useState<SkinConcern[]>([]);
  const [goals, setGoals] = useState<SkinGoal[]>([]);
  const [budget, setBudget] = useState<BudgetLevel>('medium');
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');

  // Result
  const [routine, setRoutine] = useState<RoutineResult | null>(null);
  const [alternativesOpen, setAlternativesOpen] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<'morning' | 'night' | 'explain' | 'tips'>('morning');

  useEffect(() => {
    if (detectedSkinType) setSkinType(detectedSkinType);
  }, [detectedSkinType]);

  const toggleConcern = (c: SkinConcern) => {
    setConcerns(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const toggleGoal = (g: SkinGoal) => {
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const toggleAlternative = (stepNum: number) => {
    setAlternativesOpen(prev => ({ ...prev, [stepNum]: !prev[stepNum] }));
  };

  const handleGenerate = () => {
    if (!skinType) return;
    setStep('loading');
    setTimeout(() => {
      const result = generateRoutine({
        skinType,
        concerns,
        goals,
        budget,
      });
      setRoutine(result);
      setStep('result');
    }, 1800);
  };

  // ── INPUT STEP ──
  if (step === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        {/* Nav */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-gray-800 text-sm">Routine Generator</h1>
              <p className="text-xs text-gray-400">Task 6 \u2014 Personalized Daily Skincare</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">NEW</span>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
          {/* Hero */}
          <div className="text-center animate-fade-in">
            <div className="text-5xl mb-4">\u2728</div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-2">Build Your Perfect Routine</h2>
            <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
              Tell us about your skin, and we'll generate a personalized morning & night routine with product recommendations tailored to your budget.
            </p>
          </div>

          {/* Detected Skin Type Banner */}
          {detectedSkinType && (
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                    <Target size={20} className="text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-violet-600 font-medium">Auto-detected from Skin Analysis</p>
                    <p className="font-bold text-gray-800 capitalize">{detectedSkinType} Skin</p>
                    <p className="text-[10px] text-gray-400">
                      via {detectionMethod} \u00b7 {Math.round(detectionConfidence * 100)}% confidence
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSkinType('')}
                  className="text-xs text-violet-500 hover:text-violet-700 font-medium"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Skin Type */}
          <div className="space-y-3 animate-slide-up">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <Droplets size={16} className="text-teal-500" />
              Step 1: Select Your Skin Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['oily', 'dry', 'combination', 'sensitive'] as SkinType[]).map(st => (
                <button
                  key={st}
                  onClick={() => setSkinType(st)}
                  className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                    skinType === st
                      ? 'border-teal-400 bg-teal-50 shadow-md'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <span className="text-lg">
                    {st === 'oily' ? '\ud83d\udca7' : st === 'dry' ? '\ud83c\udf26\ufe0f' : st === 'combination' ? '\u2696\ufe0f' : '\ud83e\ude78'}
                  </span>
                  <p className="font-bold text-gray-800 text-sm capitalize mt-1">{st}</p>
                  <p className="text-[10px] text-gray-400">
                    {st === 'oily' ? 'Shiny, large pores, acne-prone' :
                     st === 'dry' ? 'Tight, flaky, dull appearance' :
                     st === 'combination' ? 'Oily T-zone, dry cheeks' :
                     'Easily irritated, reactive'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Concerns */}
          <div className="space-y-3 animate-slide-up">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <AlertTriangle size={16} className="text-amber-500" />
              Step 2: Your Skin Concerns
              <span className="text-xs font-normal text-gray-400">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {allConcerns.map(c => (
                <button
                  key={c.value}
                  onClick={() => toggleConcern(c.value)}
                  className={`px-3 py-2 rounded-xl border-2 text-xs font-medium transition-all duration-200 ${
                    concerns.includes(c.value)
                      ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-sm'
                      : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Goals */}
          <div className="space-y-3 animate-slide-up">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <Target size={16} className="text-violet-500" />
              Step 3: Your Skin Goals
              <span className="text-xs font-normal text-gray-400">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {allGoals.map(g => (
                <button
                  key={g.value}
                  onClick={() => toggleGoal(g.value)}
                  className={`px-3 py-2 rounded-xl border-2 text-xs font-medium transition-all duration-200 ${
                    goals.includes(g.value)
                      ? 'border-violet-400 bg-violet-50 text-violet-700 shadow-sm'
                      : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                  }`}
                >
                  {g.emoji} {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Budget */}
          <div className="space-y-3 animate-slide-up">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <DollarSign size={16} className="text-emerald-500" />
              Step 4: Your Budget Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {budgetOptions.map(b => (
                <button
                  key={b.value}
                  onClick={() => setBudget(b.value)}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                    budget === b.value
                      ? 'border-emerald-400 bg-emerald-50 shadow-md'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{b.emoji}</div>
                  <p className="font-bold text-gray-800 text-xs">{b.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{b.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!skinType}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
              skinType
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Sparkles size={22} />
            Generate My Routine
            <ArrowRight size={22} />
          </button>

          {!skinType && (
            <p className="text-center text-xs text-gray-400">
              Please select your skin type to continue.
              <button onClick={() => navigate('/skin-type')} className="text-teal-600 font-medium ml-1 hover:underline">
                Don't know it? Detect it here \u2192
              </button>
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── LOADING STEP ──
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-teal-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-3 rounded-full bg-teal-50 flex items-center justify-center">
              <Sparkles size={28} className="text-teal-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Building Your Routine...</h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Analyzing your skin profile, selecting products, and creating personalized explanations.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Sun size={14} className="text-amber-400" /> Morning Routine
            </div>
            <div className="w-8 h-px bg-gray-200"></div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Moon size={14} className="text-indigo-400" /> Night Routine
            </div>
            <div className="w-8 h-px bg-gray-200"></div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <DollarSign size={14} className="text-emerald-400" /> Budget Fit
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT STEP ──
  if (!routine) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-gray-800 text-sm">Your Personalized Routine</h1>
            <p className="text-xs text-gray-400 capitalize">{skinType} skin \u00b7 {budget} budget</p>
          </div>
          <button
            onClick={() => { setStep('input'); setRoutine(null); }}
            className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Quality Score Header */}
        <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-2xl p-6 text-white mb-6 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} />
                <span className="text-sm font-medium text-white/80">Your Routine is Ready!</span>
              </div>
              <h2 className="text-2xl font-black capitalize">{skinType} Skin \u00b7 {budget} Budget</h2>
              <p className="text-white/70 text-sm mt-1">
                {routine.totalSteps} steps \u00b7 ~{routine.estimatedTimeMinutes.morning} min morning \u00b7 ~{routine.estimatedTimeMinutes.night} min night
              </p>
            </div>
            <div className="text-center">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="white" strokeWidth="3" strokeDasharray={`${routine.routineQualityScore}, 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black">{routine.routineQualityScore}</span>
                </div>
              </div>
              <p className="text-xs text-white/70 mt-1">Quality Score</p>
            </div>
          </div>

          {/* Quick summary */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-white/90 text-sm leading-relaxed">{routine.explanations.overallExplanation}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          {[
            { key: 'morning' as const, label: 'Morning', icon: <Sun size={14} />, emoji: '\u2600\ufe0f' },
            { key: 'night' as const, label: 'Night', icon: <Moon size={14} />, emoji: '\ud83c\udf19' },
            { key: 'explain' as const, label: 'Why This Works', icon: <Lightbulb size={14} />, emoji: '\ud83e\udde0' },
            { key: 'tips' as const, label: 'Tips & Seasonal', icon: <Calendar size={14} />, emoji: '\ud83d\udcc5' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* ── MORNING ROUTINE TAB ── */}
        {activeTab === 'morning' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Sun size={22} className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-black text-gray-800 text-lg">{routine.morningRoutine.title}</h3>
                <p className="text-xs text-gray-400">
                  {routine.morningRoutine.steps.length} steps \u00b7 ~{routine.estimatedTimeMinutes.morning} minutes
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {routine.morningRoutine.steps.map(s => (
                <RoutineStepCard
                  key={`m-${s.stepNumber}`}
                  step={s}
                  budget={budget}
                  showAlternatives={!!alternativesOpen[s.stepNumber * 10]}
                  onToggleAlternatives={() => toggleAlternative(s.stepNumber * 10)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── NIGHT ROUTINE TAB ── */}
        {activeTab === 'night' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Moon size={22} className="text-indigo-500" />
              </div>
              <div>
                <h3 className="font-black text-gray-800 text-lg">{routine.nightRoutine.title}</h3>
                <p className="text-xs text-gray-400">
                  {routine.nightRoutine.steps.length} steps \u00b7 ~{routine.estimatedTimeMinutes.night} minutes
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {routine.nightRoutine.steps.map(s => (
                <RoutineStepCard
                  key={`n-${s.stepNumber}`}
                  step={s}
                  budget={budget}
                  showAlternatives={!!alternativesOpen[s.stepNumber * 100]}
                  onToggleAlternatives={() => toggleAlternative(s.stepNumber * 100)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── WHY THIS WORKS TAB (Explainability) ── */}
        {activeTab === 'explain' && (
          <div className="space-y-6 animate-fade-in">
            {/* Overall Explanation */}
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={20} />
                <h3 className="font-bold text-lg">Why This Routine Works For You</h3>
              </div>
              <p className="text-white/90 leading-relaxed">{routine.explanations.whyThisRoutine}</p>
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2 text-white/80 text-sm">
                <TrendingUp size={16} />
                <span>{routine.explanations.estimatedImprovement}</span>
              </div>
            </div>

            {/* Key Decisions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target size={18} className="text-teal-500" />
                Key Decisions Made For Your Routine
              </h4>
              <div className="space-y-3">
                {routine.explanations.keyDecisions.map((d, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-6 h-6 bg-teal-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={14} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{d.decision}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{d.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customization Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Palette size={18} className="text-violet-500" />
                Customization Notes
              </h4>
              <div className="space-y-2">
                {routine.explanations.customizationNotes.map((note, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-violet-50 border border-violet-100">
                    <Sparkles size={14} className="text-violet-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700 leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign size={18} className="text-emerald-500" />
                Budget Breakdown
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className={`p-3 rounded-xl text-center ${budget === 'low' ? 'bg-emerald-50 border-2 border-emerald-300' : 'bg-gray-50 border border-gray-100'}`}>
                  <span className="text-lg">\ud83c\udf93</span>
                  <p className="font-bold text-xs text-gray-700 mt-1">Student</p>
                  <p className="text-xs text-emerald-600 font-medium">{routine.budgetBreakdown.low}</p>
                </div>
                <div className={`p-3 rounded-xl text-center ${budget === 'medium' ? 'bg-emerald-50 border-2 border-emerald-300' : 'bg-gray-50 border border-gray-100'}`}>
                  <span className="text-lg">\u2696\ufe0f</span>
                  <p className="font-bold text-xs text-gray-700 mt-1">Balanced</p>
                  <p className="text-xs text-emerald-600 font-medium">{routine.budgetBreakdown.medium}</p>
                </div>
                <div className={`p-3 rounded-xl text-center ${budget === 'high' ? 'bg-emerald-50 border-2 border-emerald-300' : 'bg-gray-50 border border-gray-100'}`}>
                  <span className="text-lg">\ud83d\udc8e</span>
                  <p className="font-bold text-xs text-gray-700 mt-1">Premium</p>
                  <p className="text-xs text-emerald-600 font-medium">{routine.budgetBreakdown.high}</p>
                </div>
              </div>
            </div>

            {/* Weekly Variation */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 p-6">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Calendar size={18} className="text-amber-500" />
                Weekly Variation Tip
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">{routine.explanations.weeklyVariationTip}</p>
            </div>
          </div>
        )}

        {/* ── TIPS & SEASONAL TAB ── */}
        {activeTab === 'tips' && (
          <div className="space-y-6 animate-fade-in">
            {/* Weekly Tips */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-teal-500" />
                Routine Timeline & Tips
              </h4>
              <div className="space-y-3">
                {routine.weeklyTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-teal-700">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Seasonal Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <SunSnow size={18} className="text-orange-500" />
                Seasonal Adjustments
              </h4>
              <div className="space-y-3">
                {routine.seasonalNotes.map((note, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                    <Zap size={14} className="text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Reminders */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200 p-6">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Heart size={18} className="text-rose-500" />
                Important Reminders
              </h4>
              <div className="grid gap-2">
                {[
                  'Consistency is more important than expensive products.',
                  'Always patch-test new products on your inner arm for 24 hours.',
                  'Results take 4-8 weeks of consistent use to become visible.',
                  'Adjust routine if you experience persistent irritation or breakouts.',
                  'Consult a dermatologist for severe or persistent skin conditions.',
                  'Drink 2-3L water daily and get 7-8 hours of sleep for best results.',
                ].map((reminder, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-rose-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700 leading-relaxed">{reminder}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 pb-8">
          <button
            onClick={() => { setStep('input'); setRoutine(null); }}
            className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-all"
          >
            \u21a9 Modify Profile & Regenerate
          </button>
          <button
            onClick={() => navigate('/ingredient-analysis')}
            className="px-6 py-3 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-all shadow-lg"
          >
            <BookOpen size={16} className="inline mr-1" />
            Analyze My Ingredients
          </button>
          <button
            onClick={() => navigate('/analyze')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-sm hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg"
          >
            <Shield size={16} className="inline mr-1" />
            Analyze My Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoutineGeneratorPage;
