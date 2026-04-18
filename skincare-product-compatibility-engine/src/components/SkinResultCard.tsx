import React from 'react';
import type { SkinDetectionResult, SkinType } from '../types';
import { CheckCircle, RefreshCw, ArrowRight, Sparkles, Target } from 'lucide-react';

interface SkinResultCardProps {
  result: SkinDetectionResult;
  onUseResult: () => void;
  onRetake: () => void;
}

const skinTypeInfo: Record<SkinType, { emoji: string; color: string; bgColor: string; borderColor: string; tips: string[] }> = {
  dry: {
    emoji: '🏜️',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    tips: ['Use hydrating cleansers', 'Apply hyaluronic acid serum', 'Lock in moisture with ceramide cream', 'Avoid alcohol-based products'],
  },
  oily: {
    emoji: '💧',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    tips: ['Use gel-based cleansers', 'Apply salicylic acid for pores', 'Use oil-free moisturizers', 'Don\'t skip moisturizer!'],
  },
  combination: {
    emoji: '⚖️',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    tips: ['Use gentle foaming cleanser', 'Apply lightweight moisturizer', 'Use targeted treatments per zone', 'Niacinamide is your best friend'],
  },
  sensitive: {
    emoji: '🌸',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    tips: ['Use fragrance-free products only', 'Patch test everything', 'Avoid retinol & strong AHAs', 'Centella asiatica is great for you'],
  },
};

const SkinResultCard: React.FC<SkinResultCardProps> = ({ result, onUseResult, onRetake }) => {
  const info = skinTypeInfo[result.skinType];
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Main Result Card */}
      <div className={`bg-white rounded-3xl border-2 ${info.borderColor} overflow-hidden shadow-lg`}>
        {/* Header */}
        <div className={`${info.bgColor} p-8 text-center`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
            <Sparkles size={16} className={info.color} />
            <span className={info.color}>Skin Type Detected</span>
          </div>
          <div className="text-7xl mb-4">{info.emoji}</div>
          <h2 className={`text-3xl md:text-4xl font-black ${info.color} mb-2 capitalize`}>
            {result.skinType} Skin
          </h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto">{result.explanation}</p>
        </div>

        {/* Confidence & Method */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-8 mb-6">
            {/* Confidence Circle */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={confidencePercent >= 75 ? '#10b981' : confidencePercent >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${confidencePercent * 2.64} 264`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xl font-black ${info.color}`}>{confidencePercent}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium">Confidence</p>
            </div>

            {/* Method */}
            <div className="text-center">
              <div className={`w-24 h-24 rounded-2xl ${info.bgColor} flex flex-col items-center justify-center border ${info.borderColor}`}>
                <Target size={28} className={info.color} />
                <span className="text-xs font-bold text-gray-600 mt-1 capitalize">{result.method}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-2">Detection Method</p>
            </div>
          </div>

          {/* Score Breakdown (if available) */}
          {result.breakdown && Object.keys(result.breakdown).length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-600 mb-3 text-center">Score Breakdown</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {Object.entries(result.breakdown).map(([type, score]) => {
                  const isActive = type === result.skinType || (result.skinType === 'sensitive' && type === 'sensitive');
                  return (
                    <div
                      key={type}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all
                        ${isActive
                          ? `${info.bgColor} ${info.color} border ${info.borderColor}`
                          : 'bg-gray-100 text-gray-500'
                        }`}
                    >
                      {type}: {score}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Image Indicators (if available) */}
          {result.indicators && result.indicators.brightness !== undefined && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-600 mb-3 text-center">Image Analysis Indicators</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                  <p className="text-2xl font-black text-amber-600">{result.indicators.brightness}</p>
                  <p className="text-xs text-amber-600 font-medium">Brightness</p>
                </div>
                <div className="bg-rose-50 rounded-xl p-3 text-center border border-rose-100">
                  <p className="text-2xl font-black text-rose-600">{result.indicators.redness}</p>
                  <p className="text-xs text-rose-600 font-medium">Redness</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                  <p className="text-2xl font-black text-blue-600">{result.indicators.saturation}</p>
                  <p className="text-xs text-blue-600 font-medium">Saturation</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips Card */}
      <div className={`${info.bgColor} rounded-3xl border-2 ${info.borderColor} p-6`}>
        <h3 className={`text-lg font-bold ${info.color} mb-4 flex items-center gap-2`}>
          <Sparkles size={20} />
          Quick Tips for {result.skinType} Skin
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {info.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/80 rounded-xl p-3">
              <CheckCircle size={18} className={`${info.color} shrink-0 mt-0.5`} />
              <span className="text-sm text-gray-700 font-medium">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onUseResult}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <CheckCircle size={22} />
          Use This Skin Type
          <ArrowRight size={20} />
        </button>
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-6 py-4 bg-white text-gray-700 rounded-2xl font-bold border-2 border-gray-200 hover:border-emerald-300 hover:text-emerald-700 transition-all"
        >
          <RefreshCw size={20} />
          Retake
        </button>
      </div>
    </div>
  );
};

export default SkinResultCard;
