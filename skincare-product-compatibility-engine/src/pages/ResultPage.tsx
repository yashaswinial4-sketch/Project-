import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { AnalysisResult } from '../types';
import { useSkinContext } from '../context/SkinContext';
import ResultDisplay from '../components/ResultDisplay';
import { ArrowLeft, RefreshCw, Home, Target } from 'lucide-react';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { detectedSkinType, detectionMethod, detectionConfidence } = useSkinContext();

  const resultStr = sessionStorage.getItem('analysisResult');
  const manualSkinType = sessionStorage.getItem('skinType') || '';
  const skinType = detectedSkinType || manualSkinType || 'oily';

  if (!resultStr) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Analysis Found</h2>
          <p className="text-gray-500 mb-6">Please analyze your skincare routine first.</p>
          <button
            onClick={() => navigate('/analyze')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            Go to Analysis
          </button>
        </div>
      </div>
    );
  }

  const result: AnalysisResult = JSON.parse(resultStr);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/analyze')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Analysis
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Home size={20} />
            Home
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-3">
            Your Skincare Analysis Results
          </h1>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <p className="text-lg text-gray-500">
              Based on your <span className="font-bold text-emerald-600 capitalize">{skinType}</span> skin type
            </p>
            {detectedSkinType && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold">
                <Target size={12} />
                Detected via {detectionMethod} ({Math.round(detectionConfidence * 100)}%)
              </span>
            )}
          </div>
        </div>

        {/* Results */}
        <ResultDisplay result={result} skinType={skinType} />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 pb-12">
          <button
            onClick={() => navigate('/analyze')}
            className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl"
          >
            <RefreshCw size={20} />
            Re-Analyze Routine
          </button>
          <button
            onClick={() => navigate('/skin-type')}
            className="flex items-center gap-2 px-8 py-4 bg-violet-600 text-white rounded-2xl font-bold text-lg hover:bg-violet-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Target size={20} />
            Detect Skin Type
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-2xl font-bold text-lg border-2 border-gray-200 hover:border-emerald-300 hover:text-emerald-700 transition-all"
          >
            <Home size={20} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
