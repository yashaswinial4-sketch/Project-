import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SkinType, SkinConcern, Product } from '../types';
import { validateInput } from '../logic/skincareRules';
import { analyzeRoutine } from '../api';
import SkinForm from '../components/SkinForm';
import ProductInputList from '../components/ProductInputList';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState<SkinType | ''>('');
  const [concerns, setConcerns] = useState<SkinConcern[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleNext = () => {
    if (step === 1) {
      if (!skinType) {
        setErrors(['Please select your skin type.']);
        return;
      }
      if (concerns.length === 0) {
        setErrors(['Please select at least one skin concern.']);
        return;
      }
      setErrors([]);
      setStep(2);
    }
  };

  const handleAnalyze = async () => {
    const validation = validateInput({
      skinType: skinType as string,
      concerns: concerns as string[],
      products
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    setLoading(true);

    try {
      const result = await analyzeRoutine({
        skinType: skinType as SkinType,
        concerns: concerns as SkinConcern[],
        products
      });

      // Store result in sessionStorage for the result page
      sessionStorage.setItem('analysisResult', JSON.stringify(result));
      sessionStorage.setItem('skinType', skinType as string);

      navigate('/result');
    } catch (err) {
      setErrors(['An error occurred during analysis. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-bold ${step >= 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
              Step 1: Skin Profile
            </span>
            <span className={`text-sm font-bold ${step >= 2 ? 'text-emerald-600' : 'text-gray-400'}`}>
              Step 2: Products
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: step === 1 ? '50%' : '100%' }}
            ></div>
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-5">
            <h4 className="font-bold text-red-700 mb-2">Please fix the following:</h4>
            <ul className="space-y-1">
              {errors.map((err, i) => (
                <li key={i} className="text-red-600 text-sm flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span> {err}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Step 1: Skin Profile */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-sm mb-8">
              <SkinForm
                skinType={skinType}
                concerns={concerns}
                onSkinTypeChange={setSkinType}
                onConcernsChange={setConcerns}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-sm mb-8">
              <ProductInputList products={products} onProductsChange={setProducts} />
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
                disabled={loading}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Analyze My Routine
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
