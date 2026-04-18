import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SkinDetectionResult } from '../types';
import { useSkinContext } from '../context/SkinContext';
import SkinQuiz from '../components/SkinQuiz';
import ImageUpload from '../components/ImageUpload';
import SkinResultCard from '../components/SkinResultCard';
import { ArrowLeft, ClipboardList, Camera, Sparkles } from 'lucide-react';

type DetectionMode = 'quiz' | 'image' | 'result';

const SkinTypePage: React.FC = () => {
  const navigate = useNavigate();
  const { setDetectedSkinType } = useSkinContext();
  const [mode, setMode] = useState<DetectionMode>('quiz');
  const [result, setResult] = useState<SkinDetectionResult | null>(null);

  const handleQuizComplete = (res: SkinDetectionResult) => {
    setResult(res);
    setMode('result');
  };

  const handleImageComplete = (res: SkinDetectionResult) => {
    setResult(res);
    setMode('result');
  };

  const handleUseResult = () => {
    if (!result) return;
    setDetectedSkinType(result.skinType, result.method, result.confidence);
    navigate('/analyze');
  };

  const handleRetake = () => {
    setResult(null);
    setMode('quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
            <Sparkles size={16} />
            Task 2: Skin Type Detection
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-800 mb-4">
            Discover Your <span className="text-emerald-600">Skin Type</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Most people don't know their actual skin type. Take our smart quiz or upload a photo to find out — then get personalized product recommendations.
          </p>
        </div>

        {/* Mode Selector (only show when not in result mode) */}
        {mode !== 'result' && (
          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              onClick={() => setMode('quiz')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300
                ${mode === 'quiz'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-emerald-300'
                }`}
            >
              <ClipboardList size={20} />
              Take Quiz
            </button>
            <button
              onClick={() => setMode('image')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300
                ${mode === 'image'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-emerald-300'
                }`}
            >
              <Camera size={20} />
              Upload Photo
            </button>
          </div>
        )}

        {/* Content */}
        {mode === 'quiz' && (
          <SkinQuiz onComplete={handleQuizComplete} />
        )}

        {mode === 'image' && (
          <ImageUpload onComplete={handleImageComplete} />
        )}

        {mode === 'result' && result && (
          <SkinResultCard
            result={result}
            onUseResult={handleUseResult}
            onRetake={handleRetake}
          />
        )}

        {/* Info Banner */}
        {mode !== 'result' && (
          <div className="mt-10 bg-white rounded-2xl border-2 border-gray-100 p-6 text-center">
            <p className="text-sm text-gray-500">
              💡 <strong>Which method is more accurate?</strong> The quiz uses 8 targeted questions with a proven scoring system.
              Image analysis uses basic brightness/redness heuristics and is less accurate.
              <strong> We recommend the quiz for best results.</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinTypePage;
