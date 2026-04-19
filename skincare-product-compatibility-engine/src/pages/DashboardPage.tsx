// ─────────────────────────────────────────────────────────────
// UNIFIED ANALYSIS DASHBOARD (TASK 7)
// Integrates ALL 6 modules: Skin Type, Acne Risk, Ingredients,
// Lifestyle, Routine, and Product Analysis into one seamless flow
// ─────────────────────────────────────────────────────────────

import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Camera, X, Loader2, CheckCircle2,
  Moon, Droplets, Utensils, Activity, Sparkles, Zap, Shield,
  Target, AlertTriangle, BookOpen, Calendar,
  Plus, Trash2, Info,
} from 'lucide-react';
import { useSkinContext } from '../context/SkinContext';
import { runUnifiedAnalysis } from '../logic/unifiedAnalysisEngine';
import type {
  SkinType, SkinConcern, SkinGoal, BudgetLevel,
  UnifiedAnalysisInput, UnifiedAnalysisResult,
} from '../types';
import {
  OverallScoreBanner, SkinTypeCard, AcneRiskCard,
  IngredientSafetyCard, LifestyleImpactCard, RoutinePreviewCard,
  ExplanationBox,
} from '../components/dashboard/DashboardCards';

// ─────────────────────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────────────────────
const steps = [
  { label: 'Skin & Image', icon: <Camera size={18} /> },
  { label: 'Lifestyle', icon: <Moon size={18} /> },
  { label: 'Products', icon: <Shield size={18} /> },
  { label: 'Results', icon: <Sparkles size={18} /> },
];

const StepIndicator: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {steps.map((step, i) => (
      <React.Fragment key={i}>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
          i <= current ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
        }`}>
          {step.icon}
          <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
        </div>
        {i < steps.length - 1 && (
          <div className={`w-8 h-0.5 rounded-full ${i < current ? 'bg-indigo-400' : 'bg-gray-200'}`}></div>
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { detectedSkinType } = useSkinContext();

  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [skinType, setSkinType] = useState<SkinType | ''>(detectedSkinType || '');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sleepHours, setSleepHours] = useState(7);
  const [waterIntake, setWaterIntake] = useState(6);
  const [dietQuality, setDietQuality] = useState<'poor' | 'average' | 'good' | 'excellent'>('average');
  const [stressLevel, setStressLevel] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [exerciseDays, setExerciseDays] = useState(3);

  const [concerns, setConcerns] = useState<SkinConcern[]>([]);
  const [goals, setGoals] = useState<SkinGoal[]>([]);
  const [budget, setBudget] = useState<BudgetLevel>('medium');
  const [products, setProducts] = useState<{ name: string; ingredients: string }[]>([
    { name: '', ingredients: '' },
  ]);

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<UnifiedAnalysisResult | null>(null);

  // ── Image handling ──
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  }, [handleFileSelect]);

  // ── Concern/Goal toggles ──
  const toggleConcern = (c: SkinConcern) => {
    setConcerns(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };
  const toggleGoal = (g: SkinGoal) => {
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  // ── Product management ──
  const addProduct = () => setProducts(prev => [...prev, { name: '', ingredients: '' }]);
  const removeProduct = (idx: number) => setProducts(prev => prev.filter((_, i) => i !== idx));
  const updateProduct = (idx: number, field: 'name' | 'ingredients', value: string) => {
    setProducts(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  // ── Run unified analysis ──
  const handleAnalyze = async () => {
    setAnalyzing(true);
    setCurrentStep(3);

    const input: UnifiedAnalysisInput = {
      skinType,
      imageData: imagePreview || undefined,
      sleepHours,
      waterIntake,
      dietQuality,
      stressLevel,
      exerciseDays,
      products: products.filter(p => p.name.trim() || p.ingredients.trim()),
      concerns,
      goals,
      budget,
    };

    // Simulate processing delay for UX
    await new Promise(r => setTimeout(r, 1500));

    try {
      const analysisResult = await runUnifiedAnalysis(input);
      setResult(analysisResult);
    } catch {
      console.error('Analysis failed');
    }
    setAnalyzing(false);
  };

  const canProceed = () => {
    if (currentStep === 0) return skinType || imagePreview;
    if (currentStep === 1) return true;
    if (currentStep === 2) return true;
    return false;
  };

  const nextStep = () => {
    if (currentStep === 2) {
      handleAnalyze();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  // ───────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={22} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles size={22} className="text-indigo-500" />
              Complete Skin Analysis
            </h1>
            <p className="text-sm text-gray-500">All 6 modules working together for comprehensive results</p>
          </div>
          {result && (
            <button
              onClick={() => { setResult(null); setCurrentStep(0); }}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-medium text-sm hover:bg-indigo-200 transition-colors"
            >
              New Analysis
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <StepIndicator current={currentStep} />

        {/* ══════════ STEP 0: Skin & Image ══════════ */}
        {currentStep === 0 && !result && (
          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Camera size={22} className="text-indigo-500" />
                  Upload Skin Photo (Optional)
                </h2>
                {!imagePreview ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-3 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 h-64 flex items-center justify-center
                      ${dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50'}`}
                  >
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${dragOver ? 'bg-indigo-200' : 'bg-gray-200'}`}>
                        <Camera size={28} className={dragOver ? 'text-indigo-600' : 'text-gray-400'} />
                      </div>
                      <p className="text-lg font-semibold text-gray-600">
                        {dragOver ? 'Drop image here!' : 'Upload a selfie'}
                      </p>
                      <p className="text-sm text-gray-400">Drag & drop or click • JPG, PNG</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden">
                    <div className="relative">
                      <img src={imagePreview} alt="Skin" className="w-full h-64 object-cover" />
                      <button onClick={() => setImagePreview(null)} className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg">
                        <X size={16} className="text-gray-500" />
                      </button>
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span className="text-xs font-medium text-gray-700">Ready for analysis</span>
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Info size={12} />
                  Image helps detect skin type via pixel analysis
                </p>
              </div>

              {/* Manual Skin Type */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Target size={22} className="text-violet-500" />
                  Select Skin Type
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {imagePreview ? 'Or override the image result:' : 'Choose your skin type (or detect it first):'}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'oily' as SkinType, emoji: '💧', label: 'Oily', desc: 'Shiny, enlarged pores', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                    { type: 'dry' as SkinType, emoji: '🏜️', label: 'Dry', desc: 'Tight, flaky, rough', color: 'bg-amber-50 border-amber-200 text-amber-700' },
                    { type: 'combination' as SkinType, emoji: '🔄', label: 'Combination', desc: 'Oily T-zone, dry cheeks', color: 'bg-purple-50 border-purple-200 text-purple-700' },
                    { type: 'sensitive' as SkinType, emoji: '🌸', label: 'Sensitive', desc: 'Easily irritated, red', color: 'bg-rose-50 border-rose-200 text-rose-700' },
                  ].map(st => (
                    <button
                      key={st.type}
                      onClick={() => setSkinType(st.type)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        skinType === st.type ? 'ring-2 ring-indigo-400 ring-offset-2 ' + st.color : 'bg-white border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="text-2xl mb-1">{st.emoji}</div>
                      <div className="font-bold text-gray-800">{st.label}</div>
                      <div className="text-xs text-gray-500">{st.desc}</div>
                    </button>
                  ))}
                </div>
                {detectedSkinType && (
                  <div className="mt-3 bg-violet-50 rounded-xl p-3 flex items-center gap-2 border border-violet-100">
                    <CheckCircle2 size={16} className="text-violet-500" />
                    <span className="text-sm text-violet-700">
                      Previously detected: <strong>{detectedSkinType}</strong> — auto-filled!
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Concerns & Goals */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Skin Concerns</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { val: 'acne' as SkinConcern, label: 'Acne & Breakouts', emoji: '🔴' },
                  { val: 'dryness' as SkinConcern, label: 'Dryness', emoji: '🏜️' },
                  { val: 'oiliness' as SkinConcern, label: 'Oiliness', emoji: '💧' },
                  { val: 'pigmentation' as SkinConcern, label: 'Dark Spots', emoji: '🟤' },
                  { val: 'sensitivity' as SkinConcern, label: 'Sensitivity', emoji: '🌸' },
                  { val: 'aging' as SkinConcern, label: 'Fine Lines', emoji: '🕐' },
                  { val: 'blackheads' as SkinConcern, label: 'Blackheads', emoji: '⬛' },
                ].map(c => (
                  <button
                    key={c.val}
                    onClick={() => toggleConcern(c.val)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                      concerns.includes(c.val)
                        ? 'bg-rose-100 text-rose-700 border-rose-300 shadow-sm'
                        : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-4">Skin Goals</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { val: 'glow' as SkinGoal, label: 'Glow', emoji: '✨' },
                  { val: 'acne-free' as SkinGoal, label: 'Acne-Free', emoji: '🎯' },
                  { val: 'hydration' as SkinGoal, label: 'Hydration', emoji: '💧' },
                  { val: 'anti-aging' as SkinGoal, label: 'Anti-Aging', emoji: '⏰' },
                  { val: 'brightening' as SkinGoal, label: 'Brightening', emoji: '☀️' },
                  { val: 'oil-control' as SkinGoal, label: 'Oil Control', emoji: '🛢️' },
                  { val: 'sensitive-care' as SkinGoal, label: 'Sensitive Care', emoji: '🌸' },
                  { val: 'even-tone' as SkinGoal, label: 'Even Tone', emoji: '🎨' },
                ].map(g => (
                  <button
                    key={g.val}
                    onClick={() => toggleGoal(g.val)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                      goals.includes(g.val)
                        ? 'bg-indigo-100 text-indigo-700 border-indigo-300 shadow-sm'
                        : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    {g.emoji} {g.label}
                  </button>
                ))}
              </div>

              {/* Budget */}
              <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">Budget Level</h3>
              <div className="flex gap-3">
                {[
                  { val: 'low' as BudgetLevel, label: '💰 Student', desc: 'Under ₹400/mo' },
                  { val: 'medium' as BudgetLevel, label: '💎 Balanced', desc: '₹400-800/mo' },
                  { val: 'high' as BudgetLevel, label: '👑 Premium', desc: '₹800+/mo' },
                ].map(b => (
                  <button
                    key={b.val}
                    onClick={() => setBudget(b.val)}
                    className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-200 text-center ${
                      budget === b.val
                        ? 'bg-teal-50 border-teal-300 shadow-sm'
                        : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="text-lg font-bold text-gray-700">{b.label}</div>
                    <div className="text-xs text-gray-500">{b.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ STEP 1: Lifestyle ══════════ */}
        {currentStep === 1 && !result && (
          <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-black text-gray-800 text-center">Your Daily Habits</h2>
            <p className="text-center text-gray-500 mb-6">Lifestyle factors directly impact your skin health</p>

            {/* Sleep */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Moon size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Sleep Hours</h3>
                    <p className="text-xs text-gray-500">7-8 hours is optimal for skin repair</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-indigo-600">{sleepHours}h</span>
              </div>
              <input
                type="range" min={3} max={12} step={0.5} value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3h</span><span>8h</span><span>12h</span>
              </div>
              {sleepHours < 6 && (
                <div className="mt-2 bg-rose-50 rounded-xl p-2 flex items-center gap-2 border border-rose-100">
                  <AlertTriangle size={14} className="text-rose-500" />
                  <span className="text-xs text-rose-600">Below 6h — sleep deprivation increases cortisol by 45%, triggering oil production and breakouts</span>
                </div>
              )}
            </div>

            {/* Water */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Droplets size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Water Intake</h3>
                    <p className="text-xs text-gray-500">8+ glasses daily for hydrated skin</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-blue-600">{waterIntake} 🥛</span>
              </div>
              <input
                type="range" min={1} max={15} value={waterIntake}
                onChange={(e) => setWaterIntake(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1</span><span>8</span><span>15 glasses</span>
              </div>
            </div>

            {/* Diet */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Utensils size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Diet Quality</h3>
                  <p className="text-xs text-gray-500">Sugar and dairy are proven acne triggers</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: 'poor' as const, label: '🍔 Junk Food', color: 'rose' },
                  { val: 'average' as const, label: '🍕 Average', color: 'amber' },
                  { val: 'good' as const, label: '🥗 Good', color: 'emerald' },
                  { val: 'excellent' as const, label: '🥦 Excellent', color: 'teal' },
                ].map(d => (
                  <button
                    key={d.val}
                    onClick={() => setDietQuality(d.val)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      dietQuality === d.val
                        ? `bg-${d.color}-100 border-${d.color}-300 text-${d.color}-700 shadow-sm`
                        : 'bg-gray-50 border-gray-100 hover:border-gray-200 text-gray-600'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stress */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                  <Activity size={20} className="text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Stress Level</h3>
                  <p className="text-xs text-gray-500">Stress increases cortisol → more oil → more acne</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: 'low' as const, label: '😌 Low', color: 'bg-emerald-100 border-emerald-300 text-emerald-700' },
                  { val: 'moderate' as const, label: '😐 Moderate', color: 'bg-amber-100 border-amber-300 text-amber-700' },
                  { val: 'high' as const, label: '😰 High', color: 'bg-rose-100 border-rose-300 text-rose-700' },
                ].map(s => (
                  <button
                    key={s.val}
                    onClick={() => setStressLevel(s.val)}
                    className={`p-4 rounded-xl border-2 font-medium transition-all text-center ${
                      stressLevel === s.val ? s.color + ' shadow-sm' : 'bg-gray-50 border-gray-100 hover:border-gray-200 text-gray-600'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Zap size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Exercise Frequency</h3>
                    <p className="text-xs text-gray-500">Days per week</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-orange-600">{exerciseDays}x/wk</span>
              </div>
              <input
                type="range" min={0} max={7} value={exerciseDays}
                onChange={(e) => setExerciseDays(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0 days</span><span>3-4</span><span>7 days</span>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ STEP 2: Products ══════════ */}
        {currentStep === 2 && !result && (
          <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-black text-gray-800 text-center">Your Current Products</h2>
            <p className="text-center text-gray-500 mb-6">Add products you currently use so we can check ingredient safety</p>

            {products.map((product, idx) => (
              <div key={idx} className="bg-white rounded-3xl border-2 border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-700 flex items-center gap-2">
                    <Shield size={16} className="text-indigo-500" />
                    Product {idx + 1}
                  </h4>
                  {products.length > 1 && (
                    <button onClick={() => removeProduct(idx)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Product name (e.g., CeraVe Cleanser)"
                  value={product.name}
                  onChange={(e) => updateProduct(idx, 'name', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none mb-3 text-gray-700"
                />
                <textarea
                  placeholder="Key ingredients (e.g., Salicylic Acid, Niacinamide, Glycerin)"
                  value={product.ingredients}
                  onChange={(e) => updateProduct(idx, 'ingredients', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none resize-none h-20 text-gray-700 text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">Separate multiple ingredients with commas</p>
              </div>
            ))}

            <button
              onClick={addProduct}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-medium hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Add Another Product
            </button>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-start gap-3">
              <Info size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-700">Optional but recommended</p>
                <p className="text-xs text-amber-600">Adding your products helps us check for ingredient conflicts, comedogenic ingredients, and skin type mismatches.</p>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ STEP 3: Analyzing / Results ══════════ */}
        {currentStep === 3 && (
          <div className="animate-fade-in">
            {analyzing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                  <Sparkles size={28} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 mt-8 mb-2">Analyzing Everything...</h2>
                <p className="text-gray-500 text-center max-w-md">
                  Running skin type detection, acne risk prediction, ingredient analysis, lifestyle impact, and routine generation
                </p>
                <div className="mt-8 space-y-3 w-full max-w-sm">
                  {[
                    { label: 'Skin Type Detection', done: true },
                    { label: 'Acne Risk Prediction', done: true },
                    { label: 'Ingredient Safety Analysis', done: true },
                    { label: 'Lifestyle Impact Assessment', done: true },
                    { label: 'Routine Generation', done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {item.done ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      ) : (
                        <Loader2 size={18} className="text-indigo-500 animate-spin" />
                      )}
                      <span className={`text-sm ${item.done ? 'text-gray-600' : 'text-indigo-600 font-medium'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Overall Score */}
                <OverallScoreBanner
                  score={result.overallScore}
                  grade={result.overallGrade}
                  confidence={result.explanation.confidence}
                />

                {/* Results Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SkinTypeCard data={result.skinType} />
                  <AcneRiskCard data={result.acneRisk} />
                  <IngredientSafetyCard data={result.ingredientSafety} />
                  <LifestyleImpactCard data={result.lifestyle} />
                </div>

                {/* Routine Preview */}
                <RoutinePreviewCard data={result.routinePreview} />

                {/* Explanation Box — MAIN FEATURE */}
                <ExplanationBox data={result.explanation} />

                {/* Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => navigate('/skin-type')}
                    className="p-4 bg-violet-50 rounded-2xl hover:bg-violet-100 transition-colors text-center border border-violet-100"
                  >
                    <Target size={20} className="mx-auto text-violet-500 mb-2" />
                    <span className="text-sm font-medium text-violet-700">Detailed Skin Type</span>
                  </button>
                  <button
                    onClick={() => navigate('/acne-risk')}
                    className="p-4 bg-rose-50 rounded-2xl hover:bg-rose-100 transition-colors text-center border border-rose-100"
                  >
                    <AlertTriangle size={20} className="mx-auto text-rose-500 mb-2" />
                    <span className="text-sm font-medium text-rose-700">Full Acne Analysis</span>
                  </button>
                  <button
                    onClick={() => navigate('/ingredient-analysis')}
                    className="p-4 bg-amber-50 rounded-2xl hover:bg-amber-100 transition-colors text-center border border-amber-100"
                  >
                    <BookOpen size={20} className="mx-auto text-amber-500 mb-2" />
                    <span className="text-sm font-medium text-amber-700">Ingredient Deep Dive</span>
                  </button>
                  <button
                    onClick={() => navigate('/routine')}
                    className="p-4 bg-teal-50 rounded-2xl hover:bg-teal-100 transition-colors text-center border border-teal-100"
                  >
                    <Calendar size={20} className="mx-auto text-teal-500 mb-2" />
                    <span className="text-sm font-medium text-teal-700">Full Routine Builder</span>
                  </button>
                </div>

                {/* Timestamp */}
                <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-100">
                  Analysis completed at {new Date(result.timestamp).toLocaleString()} • All 6 modules integrated
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ══════════ NAVIGATION BUTTONS ══════════ */}
        {currentStep < 3 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                currentStep === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              disabled={currentStep === 0}
            >
              ← Back
            </button>
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                currentStep === 2
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {currentStep === 2 ? (
                <>
                  <Sparkles size={20} />
                  Analyze Everything
                </>
              ) : (
                <>
                  Next
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
