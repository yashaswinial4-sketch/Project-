import React from 'react';
import type { AnalysisResult } from '../types';
import { AlertTriangle, CheckCircle, XCircle, Lightbulb, ArrowRight, Shield, RefreshCw } from 'lucide-react';

interface ResultDisplayProps {
  result: AnalysisResult;
  skinType: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, skinType }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Score Overview */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Score Circle */}
          <div className="relative">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${result.overallScore * 3.27} 327`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={result.overallScore >= 80 ? '#10b981' : result.overallScore >= 50 ? '#f59e0b' : '#ef4444'} />
                  <stop offset="100%" stopColor={result.overallScore >= 80 ? '#059669' : result.overallScore >= 50 ? '#d97706' : '#dc2626'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-black ${getScoreColor(result.overallScore)}`}>
                {result.overallScore}
              </span>
              <span className="text-xs text-gray-400 font-medium">/ 100</span>
            </div>
          </div>

          {/* Score Details */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Routine Safety Score</h2>
            <p className="text-gray-600 text-lg">{result.summary}</p>
            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-xl">
                <XCircle size={18} className="text-red-500" />
                <span className="text-sm font-medium text-red-700">{result.conflicts.length} Conflicts</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl">
                <AlertTriangle size={18} className="text-amber-500" />
                <span className="text-sm font-medium text-amber-700">{result.skinTypeIssues.length} Skin Mismatches</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl">
                <CheckCircle size={18} className="text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700">{result.safeProducts.length} Safe Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredient Conflicts */}
      {result.conflicts.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-red-100 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
            <XCircle size={24} className="text-red-500" />
            Ingredient Conflicts Detected
          </h3>
          <div className="space-y-4">
            {result.conflicts.map((conflict, i) => (
              <div key={i} className="bg-red-50 rounded-2xl p-5 border border-red-100">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="px-3 py-1 bg-red-200 text-red-800 rounded-lg font-bold text-sm">
                        {conflict.ingredient1}
                      </span>
                      <span className="text-red-400 font-bold">✕</span>
                      <span className="px-3 py-1 bg-red-200 text-red-800 rounded-lg font-bold text-sm">
                        {conflict.ingredient2}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getSeverityColor(conflict.severity)}`}>
                        {conflict.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{conflict.reason}</p>
                    <p className="text-emerald-600 text-sm font-medium">
                      💡 {conflict.suggestion}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      Found in: {conflict.product1} & {conflict.product2}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skin Type Mismatches */}
      {result.skinTypeIssues.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-amber-100 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-amber-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={24} className="text-amber-500" />
            Skin Type Mismatches ({skinType} skin)
          </h3>
          <div className="space-y-3">
            {result.skinTypeIssues.map((issue, i) => (
              <div key={i} className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-start gap-3">
                <span className="text-amber-500 mt-0.5"><AlertTriangle size={18} /></span>
                <div>
                  <p className="text-gray-800 font-medium">
                    <span className="text-amber-600 font-bold">{issue.product}</span> — contains <span className="text-red-600 font-bold">{issue.ingredient}</span>
                  </p>
                  <p className="text-gray-500 text-sm">{issue.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safe Products */}
      {result.safeProducts.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-emerald-100 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-2">
            <CheckCircle size={24} className="text-emerald-500" />
            Safe Products for Your Skin
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {result.safeProducts.map((product, i) => (
              <div key={i} className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-center gap-3">
                <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                <span className="text-gray-700 font-medium text-sm">{product}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions / Alternatives */}
      {result.suggestions.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-blue-100 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <RefreshCw size={24} className="text-blue-500" />
            Safer Alternatives
          </h3>
          <div className="space-y-4">
            {result.suggestions.map((suggestion, i) => (
              <div key={i} className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <p className="text-gray-700 font-medium mb-3">
                  Replace <span className="text-red-600 font-bold">{suggestion.product}</span> with:
                </p>
                {suggestion.alternatives.length > 0 ? (
                  <div className="space-y-2">
                    {suggestion.alternatives.map((alt, j) => (
                      <div key={j} className="bg-white rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <ArrowRight size={16} className="text-blue-500" />
                          <span className="font-bold text-gray-800">{alt.name}</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {alt.type}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm">{alt.reason}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No direct alternatives found. Consider consulting a dermatologist.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-purple-100 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
            <Lightbulb size={24} className="text-purple-500" />
            Recommended Ingredients for {skinType} Skin
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={18} className="text-purple-500" />
                  <span className="font-bold text-gray-800 capitalize">{rec.ingredient}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{rec.reason}</p>
                <div className="flex flex-wrap gap-1.5">
                  {rec.benefits.map((b, j) => (
                    <span key={j} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
