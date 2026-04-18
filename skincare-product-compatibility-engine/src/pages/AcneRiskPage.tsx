import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AcneHabits, Product } from '../types';
import { predictAcneRisk } from '../logic/acneRiskPredictor';
import { useSkinContext } from '../context/SkinContext';
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Shield, Brain } from 'lucide-react';
import AcneHabitForm from '../components/AcneHabitForm';
import AcneProductReview from '../components/AcneProductReview';
import AcneRiskResult from '../components/AcneRiskResult';

const defaultHabits: AcneHabits = {
  currentAcne: 'none',
  sleepHours: 7,
  waterIntake: 6,
  dietType: 'balanced',
  stressLevel: 'moderate',
  exerciseFrequency: '1-2x',
  faceWashFrequency: 'twice',
  makeupRemoval: 'always',
  pillowcaseChange: 'weekly',
  sunscreenUse: 'sometimes',
  touchingFace: 'sometimes',
  currentBreakouts: 'none',
};

const AcneRiskPage: React.FC = () => {
  const navigate = useNavigate();
  const { detectedSkinType } = useSkinContext();

  const [step, setStep] = useState(1);
  const [habits, setHabits] = useState<AcneHabits>(defaultHabits);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof predictAcneRisk> | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    // Simulate processing delay
    await new Promise(r => setTimeout(r, 1500));
    const analysis = predictAcneRisk(habits, products, detectedSkinType);
    setResult(analysis);
    setStep(3);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    setHabits(defaultHabits);
    setProducts([]);
    setResult(null);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else {
      navigate('/');
    }
  };

  const canProceed = () => {
    if (step === 1) return true; // habits always have defaults
    if (step === 2) return products.length > 0 && products.every(p => p.name && p.ingredients);
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-semibold mb-4">
            <Shield size={16} /> Task 3 — Acne Risk Prediction
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-800 mb-3">
            Predict Your <span className="text-rose-500">Acne Risk</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Analyze your daily habits, product ingredients, and skincare routine to predict your risk of developing acne.
          </p>
        </div>

        {/* Step Indicators */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-bold ${step >= 1 ? 'text-rose-600' : 'text-gray-400'}`}>
              Step 1: Habits
            </span>
            <span className={`text-sm font-bold ${step >= 2 ? 'text-rose-600' : 'text-gray-400'}`}>
              Step 2: Products
            </span>
            <span className={`text-sm font-bold ${step >= 3 ? 'text-rose-600' : 'text-gray-400'}`}>
              Step 3: Results
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
            ></div>
          </div>
        </div>

        {/* Detected Skin Type Banner */}
        {detectedSkinType && (
          <div className="mb-6 bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Brain size={18} className="text-violet-600 shrink-0" />
              <p className="text-sm text-violet-700">
                Using detected skin type: <strong className="capitalize">{detectedSkinType}</strong> — this helps us give more accurate acne predictions.
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Habits */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 md:p-8 shadow-sm mb-8">
              <AcneHabitForm habits={habits} onChange={setHabits} />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-8 py-4 bg-rose-600 text-white rounded-2xl font-bold text-lg hover:bg-rose-700 transition-all shadow-lg hover:shadow-xl"
              >
                Next: Add Products
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Products */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 md:p-8 shadow-sm mb-8">
              <AcneProductReview products={products} onChange={setProducts} />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                <ArrowLeft size={20} />
                Back
              </button>
              <button
                onClick={handleAnalyze}
                disabled={loading || !canProceed()}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold text-lg hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Analyzing Risk...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Predict My Acne Risk
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <AcneRiskResult
            result={result}
            skinType={detectedSkinType || ''}
            onBack={() => navigate('/analyze')}
            onRetake={handleRetake}
          />
        )}
      </div>
    </div>
  );
};

export default AcneRiskPage;
