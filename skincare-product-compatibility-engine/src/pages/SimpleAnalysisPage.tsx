// ─────────────────────────────────────────────────────────────
// TASK 8: SMART SIMPLE ANALYSIS PAGE
// Beginner-friendly 3-step analysis with real-world issue handling
// ─────────────────────────────────────────────────────────────

import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Camera, Upload, AlertTriangle, CheckCircle2,
  Moon, Sun, Droplets, Brain, Shield, Sparkles, Image as ImageIcon,
  Info, ChevronDown, ChevronUp, RefreshCw, Lightbulb, Heart
} from 'lucide-react';
import { useSkinContext } from '../context/SkinContext';
import { runSimpleAnalysis } from '../logic/simpleAnalysisEngine';
import type { SimpleAnalysisInput, SimpleAnalysisResult, SkinType } from '../types';

// ═══════════════════════════════════════════════════════════════
// STEP INDICATOR
// ═══════════════════════════════════════════════════════════════

const StepIndicator: React.FC<{ current: number; labels: string[] }> = ({ current, labels }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {labels.map((label, i) => (
      <React.Fragment key={i}>
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            i < current ? 'bg-emerald-500 text-white scale-100' :
            i === current ? 'bg-emerald-600 text-white scale-110 ring-4 ring-emerald-200' :
            'bg-gray-200 text-gray-500'
          }`}>
            {i < current ? <CheckCircle2 size={20} /> : i + 1}
          </div>
          <span className={`text-xs mt-1 font-medium ${i <= current ? 'text-emerald-600' : 'text-gray-400'}`}>
            {label}
          </span>
        </div>
        {i < labels.length - 1 && (
          <div className={`h-0.5 w-12 md:w-20 rounded transition-all duration-300 ${
            i < current ? 'bg-emerald-500' : 'bg-gray-200'
          }`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

const SimpleAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { detectedSkinType } = useSkinContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── State ──
  const [step, setStep] = useState(0); // 0=upload, 1=details, 2=results
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimpleAnalysisResult | null>(null);

  // Input state
  const [imageData, setImageData] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [skinType, setSkinType] = useState<SkinType | ''>(detectedSkinType || '');
  const [acneLevel, setAcneLevel] = useState<'none' | 'mild' | 'moderate' | 'severe' | ''>('');
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [waterGlasses, setWaterGlasses] = useState<number>(6);
  const [stressLevel, setStressLevel] = useState<'low' | 'moderate' | 'high' | ''>('');

  // Expanded sections in results
  const [expandedSection, setExpandedSection] = useState<string | null>('routine');

  // ── Image handling ──
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image is too large. Please upload an image under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target?.result as string;
      setImageData(data);
      setImagePreview(data);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const data = ev.target?.result as string;
        setImageData(data);
        setImagePreview(data);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = () => {
    setImageData('');
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Run analysis ──
  const runAnalysis = async () => {
    setLoading(true);
    // Simulate processing delay for UX
    await new Promise(r => setTimeout(r, 2000));

    const input: SimpleAnalysisInput = {
      imageData: imageData || undefined,
      skinType: skinType || undefined,
      acneLevel: acneLevel || undefined,
      sleepHours: sleepHours || undefined,
      waterGlasses: waterGlasses || undefined,
      stressLevel: stressLevel || undefined,
    };

    const analysisResult = runSimpleAnalysis(input);
    setResult(analysisResult);
    setLoading(false);
    setStep(2);
  };

  // ── Reset ──
  const handleReset = () => {
    setStep(0);
    setResult(null);
    setImageData('');
    setImagePreview('');
    setAcneLevel('');
    setStressLevel('');
    setSleepHours(7);
    setWaterGlasses(6);
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER: LOADING STATE
  // ═══════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain size={40} className="text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-3">Analyzing Your Skin...</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Checking image quality, estimating skin type, generating personalized routine, and finding safe products for you.
          </p>
          <div className="space-y-2 max-w-sm mx-auto">
            {['Checking image quality', 'Estimating skin type', 'Predicting acne risk', 'Generating routine', 'Finding safe products', 'Writing explanations'].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-5 h-5 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" style={{ animationDelay: `${i * 200}ms` }}></div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER: RESULTS
  // ═══════════════════════════════════════════════════════════
  if (result && step === 2) {
    const riskColors = {
      low: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', bar: 'bg-emerald-500' },
      moderate: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', bar: 'bg-amber-500' },
      high: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300', bar: 'bg-rose-500' },
    };
    const riskEmoji = { low: '✅', moderate: '⚠️', high: '🔴' };
    const rc = riskColors[result.acneRisk];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
              <ArrowLeft size={16} /> Back to Home
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-black">Your Skin Analysis Report</h1>
                <p className="text-white/70 text-sm mt-1">Generated on {new Date(result.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black">{result.confidence}%</div>
                <div className="text-xs text-white/70">Confidence</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

          {/* Warnings Banner */}
          {result.warnings.length > 0 && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle size={22} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-800 mb-2">Heads Up!</h3>
                  <ul className="space-y-1">
                    {result.warnings.map((w, i) => (
                      <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                        <span className="mt-1">•</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Skin Type Card */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-2xl">
                  {result.skinType === 'oily' ? '💧' : result.skinType === 'dry' ? '🏜️' : result.skinType === 'sensitive' ? '🌸' : '⚖️'}
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium uppercase">Skin Type</div>
                  <div className="text-xl font-black text-gray-800 capitalize">{result.skinType}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Info size={12} />
                Detected via: <span className="font-medium capitalize">{result.skinTypeMethod}</span>
              </div>
            </div>

            {/* Acne Risk Card */}
            <div className={`rounded-2xl p-6 border-2 ${rc.border} ${rc.bg} shadow-sm`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{riskEmoji[result.acneRisk]}</div>
                <div>
                  <div className="text-xs font-medium uppercase opacity-70">Acne Risk</div>
                  <div className={`text-xl font-black capitalize ${rc.text}`}>{result.acneRisk}</div>
                </div>
              </div>
              <div className="w-full bg-white/50 rounded-full h-2 mt-2">
                <div className={`h-2 rounded-full ${rc.bar} transition-all`} style={{ width: `${result.acneRisk === 'low' ? 30 : result.acneRisk === 'moderate' ? 60 : 85}%` }}></div>
              </div>
            </div>

            {/* Data Completeness */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield size={22} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium uppercase">Data Quality</div>
                  <div className="text-xl font-black text-gray-800">{result.dataCompleteness.completenessScore}%</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">{result.dataCompleteness.provided.length} of 6 fields provided</div>
            </div>
          </div>

          {/* 🌞 MORNING ROUTINE */}
          <div className="bg-white rounded-2xl border-2 border-amber-100 overflow-hidden shadow-sm">
            <button
              onClick={() => setExpandedSection(expandedSection === 'routine' ? null : 'routine')}
              className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <Sun size={24} className="text-amber-500" />
                <div className="text-left">
                  <h2 className="text-lg font-black text-gray-800">Morning Routine</h2>
                  <p className="text-xs text-gray-400">{result.routine.morning.length} steps</p>
                </div>
              </div>
              {expandedSection === 'routine' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSection === 'routine' && (
              <div className="p-5 space-y-4">
                {result.routine.morning.map((s) => (
                  <div key={s.step} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="text-2xl shrink-0">{s.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-800">Step {s.step}: {s.name}</h4>
                        {s.optional && <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Optional</span>}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{s.description}</p>
                      <div className="bg-white rounded-lg p-3 space-y-2 border border-gray-100">
                        <p className="text-sm"><span className="font-semibold text-emerald-700">💡 Why:</span> {s.whyNeeded}</p>
                        <p className="text-sm"><span className="font-semibold text-blue-700">🛍 Product:</span> {s.exampleProduct}</p>
                        <p className="text-sm"><span className="font-semibold text-violet-700">🧪 Key Ingredient:</span> {s.keyIngredient}</p>
                        <p className="text-sm"><span className="font-semibold text-amber-700">⏱ Tip:</span> {s.usageTip}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🌙 NIGHT ROUTINE */}
          <div className="bg-white rounded-2xl border-2 border-indigo-100 overflow-hidden shadow-sm">
            <button
              onClick={() => setExpandedSection(expandedSection === 'night' ? null : 'night')}
              className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <Moon size={24} className="text-indigo-500" />
                <div className="text-left">
                  <h2 className="text-lg font-black text-gray-800">Night Routine</h2>
                  <p className="text-xs text-gray-400">{result.routine.night.length} steps</p>
                </div>
              </div>
              {expandedSection === 'night' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSection === 'night' && (
              <div className="p-5 space-y-4">
                {result.routine.night.map((s) => (
                  <div key={s.step} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="text-2xl shrink-0">{s.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-800">Step {s.step}: {s.name}</h4>
                        {s.optional && <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Optional</span>}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{s.description}</p>
                      <div className="bg-white rounded-lg p-3 space-y-2 border border-gray-100">
                        <p className="text-sm"><span className="font-semibold text-emerald-700">💡 Why:</span> {s.whyNeeded}</p>
                        <p className="text-sm"><span className="font-semibold text-blue-700">🛍 Product:</span> {s.exampleProduct}</p>
                        <p className="text-sm"><span className="font-semibold text-violet-700">🧪 Key Ingredient:</span> {s.keyIngredient}</p>
                        <p className="text-sm"><span className="font-semibold text-amber-700">⏱ Tip:</span> {s.usageTip}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🛍 SAFE PRODUCTS */}
          <div className="bg-white rounded-2xl border-2 border-emerald-100 overflow-hidden shadow-sm">
            <button
              onClick={() => setExpandedSection(expandedSection === 'products' ? null : 'products')}
              className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <Shield size={24} className="text-emerald-500" />
                <div className="text-left">
                  <h2 className="text-lg font-black text-gray-800">Safe Product Suggestions</h2>
                  <p className="text-xs text-gray-400">{result.safeProducts.length} products matched to your skin</p>
                </div>
              </div>
              {expandedSection === 'products' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSection === 'products' && (
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.safeProducts.map((p, i) => (
                  <div key={i} className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{p.emoji}</span>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{p.productName}</h4>
                        <span className="text-xs text-gray-400">{p.category}</span>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-700 mb-1"><strong>Key:</strong> {p.keyIngredient}</p>
                    <p className="text-xs text-gray-600 mb-1">{p.whySafe}</p>
                    <p className="text-xs text-amber-600 font-medium">💰 {p.budgetTip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 💡 WHY THIS WORKS — MAIN FEATURE */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Lightbulb size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black">Why This Works For You</h2>
                <p className="text-white/60 text-xs">Personalized explanation based on your unique profile</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-5 mb-5">
              <p className="text-white/90 leading-relaxed">{result.explanation.headline}</p>
            </div>

            <div className="bg-white/10 rounded-xl p-5 mb-5">
              <h3 className="font-bold text-yellow-300 mb-3 text-sm uppercase tracking-wide">Why This Routine Is Right For You</h3>
              <p className="text-white/90 leading-relaxed text-sm">{result.explanation.whyItWorks}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-5">
              <div className="bg-white/10 rounded-xl p-4">
                <h3 className="font-bold text-emerald-200 mb-2 text-sm">Step-by-Step Reasoning</h3>
                <ul className="space-y-2">
                  {result.explanation.reasoning.map((r, i) => (
                    <li key={i} className="text-white/80 text-xs leading-relaxed">{r}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <h3 className="font-bold text-amber-200 mb-2 text-sm">⚠️ Things To Watch Out For</h3>
                <ul className="space-y-2">
                  {result.explanation.cautions.map((c, i) => (
                    <li key={i} className="text-white/80 text-xs leading-relaxed flex items-start gap-1">
                      <span className="mt-0.5">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 text-center">
              <Heart size={20} className="text-pink-300 mx-auto mb-2" />
              <p className="text-white/90 text-sm italic">{result.explanation.encouragement}</p>
            </div>
          </div>

          {/* Image Quality Report */}
          {result.imageQuality.quality !== 'not_provided' && (
            <div className={`rounded-2xl p-5 border-2 ${
              result.imageQuality.quality === 'excellent' ? 'bg-emerald-50 border-emerald-200' :
              result.imageQuality.quality === 'good' ? 'bg-blue-50 border-blue-200' :
              result.imageQuality.quality === 'fair' ? 'bg-amber-50 border-amber-200' :
              'bg-rose-50 border-rose-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <ImageIcon size={20} className={result.imageQuality.affectsAccuracy ? 'text-amber-500' : 'text-emerald-500'} />
                <h3 className="font-bold text-gray-800">Image Quality Report</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                  result.imageQuality.quality === 'excellent' ? 'bg-emerald-200 text-emerald-800' :
                  result.imageQuality.quality === 'good' ? 'bg-blue-200 text-blue-800' :
                  result.imageQuality.quality === 'fair' ? 'bg-amber-200 text-amber-800' :
                  'bg-rose-200 text-rose-800'
                }`}>{result.imageQuality.quality}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{result.imageQuality.message}</p>
              <div className="flex items-center gap-4 mb-2">
                <div className="text-sm text-gray-500">Score: <span className="font-bold">{result.imageQuality.qualityScore}/100</span></div>
              </div>
              {result.imageQuality.issues.length > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="text-xs font-semibold text-gray-500">Issues Found:</div>
                  {result.imageQuality.issues.map((issue, i) => (
                    <div key={i} className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="w-1 h-1 bg-amber-400 rounded-full"></span> {issue}
                    </div>
                  ))}
                </div>
              )}
              {result.imageQuality.suggestions.length > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="text-xs font-semibold text-gray-500">How to Improve:</div>
                  {result.imageQuality.suggestions.slice(0, 3).map((s, i) => (
                    <div key={i} className="text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={10} /> {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Data Completeness Report */}
          <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Brain size={20} className="text-blue-500" />
              <h3 className="font-bold text-gray-800">Data Completeness Report</h3>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-2 rounded-full transition-all ${result.dataCompleteness.completenessScore >= 70 ? 'bg-emerald-500' : result.dataCompleteness.completenessScore >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${result.dataCompleteness.completenessScore}%` }}></div>
                </div>
                <span className="text-sm font-bold text-gray-600">{result.dataCompleteness.completenessScore}%</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {result.dataCompleteness.provided.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-emerald-600 mb-2">✅ Provided:</div>
                  {result.dataCompleteness.provided.map((p, i) => (
                    <div key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500" /> {p}
                    </div>
                  ))}
                </div>
              )}
              {result.dataCompleteness.missing.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-amber-600 mb-2">📝 Used Defaults For:</div>
                  {result.dataCompleteness.defaultsApplied.map((d, i) => (
                    <div key={i} className="text-sm text-gray-600 mb-1">
                      <span className="font-medium text-gray-700">{d.field}</span>
                      <span className="text-xs text-gray-400"> → Default: {d.defaultValue}</span>
                      <div className="text-xs text-gray-400 italic">{d.reason}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-3 italic">{result.dataCompleteness.message}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg"
            >
              <RefreshCw size={18} /> Analyze Again
            </button>
            <button onClick={() => navigate('/routine')} className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg">
              <Sun size={18} /> Full Routine Generator
            </button>
            <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg">
              <Sparkles size={18} /> Complete Analysis
            </button>
            <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all">
              <ArrowLeft size={18} /> Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER: INPUT STEPS
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
            <ArrowLeft size={16} /> Back to Home
          </button>
          <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3">
            <Brain size={28} /> Smart Simple Analysis
          </h1>
          <p className="text-white/70 mt-1">Get a personalized routine + safe products + explanations in 2 easy steps</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <StepIndicator current={step} labels={['Upload & Select', 'Daily Habits', 'Results']} />

        {/* ═══════ STEP 0: IMAGE + SKIN TYPE ═══════ */}
        {step === 0 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Image Upload */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
              <h2 className="text-lg font-black text-gray-800 mb-1 flex items-center gap-2">
                <Camera size={20} className="text-emerald-600" />
                Upload Skin Photo <span className="text-xs font-normal text-gray-400">(Optional)</span>
              </h2>
              <p className="text-sm text-gray-500 mb-4">A photo helps us detect your skin type. Skip if you prefer to select manually.</p>

              {!imagePreview ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all group"
                >
                  <Upload size={40} className="mx-auto text-gray-300 group-hover:text-emerald-400 transition-colors mb-3" />
                  <p className="text-gray-500 font-medium">Drag & drop your photo here</p>
                  <p className="text-xs text-gray-400 mt-1">or click to browse • JPEG, PNG • Max 10MB</p>
                  <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Sun size={12} /> Natural light preferred</span>
                    <span className="flex items-center gap-1"><Camera size={12} /> No filters</span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img src={imagePreview} alt="Skin preview" className="w-full max-h-72 object-cover rounded-xl" />
                  <button onClick={removeImage} className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-600 transition-colors shadow-lg">
                    ✕ Remove
                  </button>
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                    <CheckCircle2 size={14} /> Photo uploaded — ready for analysis
                  </div>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            {/* Skin Type Selection */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
              <h2 className="text-lg font-black text-gray-800 mb-1">Select Your Skin Type</h2>
              <p className="text-sm text-gray-500 mb-4">
                {detectedSkinType ? 'Auto-filled from your previous detection. Change if needed.' : 'Choose the one that best describes your skin. Not sure? Try our Skin Type Quiz first.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {([
                  { type: 'oily' as SkinType, emoji: '💧', label: 'Oily', desc: 'Shiny, greasy, large pores' },
                  { type: 'dry' as SkinType, emoji: '🏜️', label: 'Dry', desc: 'Tight, flaky, rough patches' },
                  { type: 'combination' as SkinType, emoji: '⚖️', label: 'Combination', desc: 'Oily T-zone, dry cheeks' },
                  { type: 'sensitive' as SkinType, emoji: '🌸', label: 'Sensitive', desc: 'Easily irritated, redness' },
                ]).map(({ type, emoji, label, desc }) => (
                  <button
                    key={type}
                    onClick={() => setSkinType(type)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      skinType === type
                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200'
                        : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{emoji}</div>
                    <div className="font-bold text-sm text-gray-800">{label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
              {!skinType && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 flex items-center gap-2">
                  <Info size={14} /> Not selecting a skin type? We will use "Combination" as default, or try to detect from your photo.
                </div>
              )}
            </div>

            {/* Acne Level */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
              <h2 className="text-lg font-black text-gray-800 mb-1">Current Acne Level <span className="text-xs font-normal text-gray-400">(Optional)</span></h2>
              <p className="text-sm text-gray-500 mb-4">How would you describe your current acne situation?</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {([
                  { val: 'none' as const, emoji: '✨', label: 'None', desc: 'Clear skin' },
                  { val: 'mild' as const, emoji: '😊', label: 'Mild', desc: 'Occasional spots' },
                  { val: 'moderate' as const, emoji: '😐', label: 'Moderate', desc: 'Regular breakouts' },
                  { val: 'severe' as const, emoji: '😟', label: 'Severe', desc: 'Persistent acne' },
                ]).map(({ val, emoji, label, desc }) => (
                  <button
                    key={val}
                    onClick={() => setAcneLevel(val)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      acneLevel === val ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="text-xl">{emoji}</div>
                    <div className="font-bold text-sm text-gray-800">{label}</div>
                    <div className="text-xs text-gray-400">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl hover:-translate-y-0.5"
              >
                Next: Daily Habits
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* ═══════ STEP 1: LIFESTYLE DETAILS ═══════ */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
              <h2 className="text-lg font-black text-gray-800 mb-1 flex items-center gap-2">
                <Droplets size={20} className="text-blue-500" />
                Quick Lifestyle Check <span className="text-xs font-normal text-gray-400">(All Optional)</span>
              </h2>
              <p className="text-sm text-gray-500 mb-6">These details help us personalize your routine. Skip anything you are not sure about.</p>

              {/* Sleep */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-gray-700 text-sm">😴 Average Sleep (hours/night)</label>
                  <span className="text-sm font-bold text-emerald-600">{sleepHours}h</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={12}
                  step={0.5}
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>3h (Too little)</span>
                  <span>7-8h (Ideal)</span>
                  <span>12h</span>
                </div>
                {sleepHours < 5 && (
                  <p className="text-xs text-rose-500 mt-2 flex items-center gap-1">
                    <AlertTriangle size={12} /> Less than 5 hours of sleep significantly increases acne risk and dullness.
                  </p>
                )}
              </div>

              {/* Water */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-gray-700 text-sm">💧 Water Intake (glasses/day)</label>
                  <span className="text-sm font-bold text-blue-600">{waterGlasses} glasses</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  value={waterGlasses}
                  onChange={(e) => setWaterGlasses(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 glass (Too low)</span>
                  <span>8 glasses (Ideal)</span>
                  <span>15 glasses</span>
                </div>
                {waterGlasses < 4 && (
                  <p className="text-xs text-amber-500 mt-2 flex items-center gap-1">
                    <AlertTriangle size={12} /> Low water intake leads to dry, dull skin and slower healing.
                  </p>
                )}
              </div>

              {/* Stress Level */}
              <div className="mb-4">
                <label className="font-semibold text-gray-700 text-sm mb-3 block">🧘 Stress Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { val: 'low' as const, emoji: '😌', label: 'Low', desc: 'Relaxed mostly' },
                    { val: 'moderate' as const, emoji: '😐', label: 'Moderate', desc: 'Sometimes stressed' },
                    { val: 'high' as const, emoji: '😰', label: 'High', desc: 'Very stressed often' },
                  ]).map(({ val, emoji, label, desc }) => (
                    <button
                      key={val}
                      onClick={() => setStressLevel(val)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        stressLevel === val ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="text-xl">{emoji}</div>
                      <div className="font-bold text-sm text-gray-800">{label}</div>
                      <div className="text-xs text-gray-400">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Preview */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border-2 border-emerald-100">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">📋 Your Input Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <span className="text-xs text-gray-400">Skin Photo</span>
                  <div className="font-bold text-gray-800">{imagePreview ? '✅ Uploaded' : '⏭ Skipped'}</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="text-xs text-gray-400">Skin Type</span>
                  <div className="font-bold text-gray-800 capitalize">{skinType || 'Auto-detect'}</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="text-xs text-gray-400">Acne Level</span>
                  <div className="font-bold text-gray-800 capitalize">{acneLevel || 'Auto-estimate'}</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="text-xs text-gray-400">Sleep</span>
                  <div className="font-bold text-gray-800">{sleepHours}h</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="text-xs text-gray-400">Water</span>
                  <div className="font-bold text-gray-800">{waterGlasses} glasses</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="text-xs text-gray-400">Stress</span>
                  <div className="font-bold text-gray-800 capitalize">{stressLevel || 'Not specified'}</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={runAnalysis}
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl hover:-translate-y-0.5"
              >
                <Sparkles size={20} />
                Analyze My Skin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleAnalysisPage;
