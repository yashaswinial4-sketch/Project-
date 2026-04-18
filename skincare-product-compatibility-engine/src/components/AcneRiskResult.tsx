import React from 'react';
import type { AcneRiskResult, AcneTrigger, AcneTip } from '../types';
import { ArrowLeft, AlertTriangle, Shield, CheckCircle2, XCircle, Lightbulb, ArrowRight, TrendingUp, Droplets, Activity } from 'lucide-react';

interface Props {
  result: AcneRiskResult;
  skinType: string;
  onBack: () => void;
  onRetake: () => void;
}

const riskConfig: Record<string, { color: string; bg: string; border: string; label: string; emoji: string; gradient: string }> = {
  low: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Low Risk', emoji: '🟢', gradient: 'from-emerald-400 to-green-500' },
  moderate: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Moderate Risk', emoji: '🟡', gradient: 'from-amber-400 to-yellow-500' },
  high: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'High Risk', emoji: '🟠', gradient: 'from-orange-400 to-red-400' },
  severe: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Severe Risk', emoji: '🔴', gradient: 'from-red-500 to-rose-600' },
};

const AcneRiskResult: React.FC<Props> = ({ result, skinType, onBack, onRetake }) => {
  const config = riskConfig[result.riskLevel];
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (result.riskScore / 100) * circumference;

  const severityColors: Record<string, string> = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Acne Risk Assessment
      </button>

      {/* Hero Score Card */}
      <div className={`bg-gradient-to-br ${config.gradient} rounded-3xl p-8 md:p-10 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* Score Circle */}
          <div className="relative shrink-0">
            <svg width="140" height="140" viewBox="0 0 120 120" className="transform -rotate-90">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="54" fill="none" stroke="white" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black">{result.riskScore}</span>
              <span className="text-xs font-medium text-white/80">/ 100</span>
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-3">
              <span>{config.emoji}</span> {config.label}
            </div>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl">
              {result.summary}
            </p>
            {skinType && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-sm">
                <Activity size={14} />
                <span>Skin Type: <strong className="capitalize">{skinType}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Risk Breakdown */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp size={22} className="text-rose-500" />
          Risk Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Lifestyle Habits', score: result.breakdown.habitScore, icon: <Activity size={18} />, color: 'bg-blue-500' },
            { label: 'Product Ingredients', score: result.breakdown.ingredientScore, icon: <Droplets size={18} />, color: 'bg-purple-500' },
            { label: 'Routine Gaps', score: result.breakdown.routineScore, icon: <Shield size={18} />, color: 'bg-amber-500' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center text-white`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                </div>
                <span className={`text-lg font-black ${item.score >= 50 ? 'text-red-500' : item.score >= 25 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {item.score}%
                </span>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${item.score >= 50 ? 'bg-red-500' : item.score >= 25 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(item.score, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Triggers */}
      {result.triggers.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <AlertTriangle size={22} className="text-amber-500" />
            Detected Triggers ({result.triggers.length})
          </h3>
          <div className="space-y-3">
            {result.triggers.map((trigger: AcneTrigger, i) => (
              <div
                key={i}
                className={`rounded-2xl border-2 p-4 transition-all ${severityColors[trigger.severity]}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    trigger.severity === 'high' ? 'bg-red-200' : trigger.severity === 'medium' ? 'bg-amber-200' : 'bg-green-200'
                  }`}>
                    {trigger.severity === 'high' ? <XCircle size={16} className="text-red-700" /> :
                     trigger.severity === 'medium' ? <AlertTriangle size={16} className="text-amber-700" /> :
                     <Shield size={16} className="text-green-700" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm">{trigger.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        trigger.severity === 'high' ? 'bg-red-200 text-red-800' :
                        trigger.severity === 'medium' ? 'bg-amber-200 text-amber-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {trigger.severity}
                      </span>
                    </div>
                    <p className="text-sm opacity-80 mb-2">{trigger.description}</p>
                    <p className="text-sm font-semibold flex items-center gap-1">
                      <Lightbulb size={14} /> {trigger.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Analysis */}
      {(result.riskyProducts.length > 0 || result.safeProducts.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Risky Products */}
          {result.riskyProducts.length > 0 && (
            <div className="bg-white rounded-3xl border-2 border-red-100 p-6">
              <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                <XCircle size={20} /> Risky Products
              </h3>
              <div className="space-y-3">
                {result.riskyProducts.map((p, i) => (
                  <div key={i} className="bg-red-50 rounded-xl p-3">
                    <p className="font-semibold text-sm text-red-800 mb-1">{p.name}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.triggers.map((t, ti) => (
                        <span key={ti} className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safe Products */}
          {result.safeProducts.length > 0 && (
            <div className="bg-white rounded-3xl border-2 border-emerald-100 p-6">
              <h3 className="text-lg font-bold text-emerald-700 mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} /> Safe Products
              </h3>
              <div className="space-y-2">
                {result.safeProducts.map((name, i) => (
                  <div key={i} className="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span className="text-sm font-medium text-emerald-800">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Personalized Tips */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Lightbulb size={22} className="text-yellow-500" />
          Personalized Acne Prevention Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.tips.map((tip: AcneTip, i) => (
            <div
              key={i}
              className={`rounded-2xl p-4 border-2 ${
                tip.priority === 'high' ? 'border-red-100 bg-red-50/50' :
                tip.priority === 'medium' ? 'border-amber-100 bg-amber-50/50' :
                'border-green-100 bg-green-50/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{tip.icon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-gray-800">{tip.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      tip.priority === 'high' ? 'bg-red-200 text-red-800' :
                      tip.priority === 'medium' ? 'bg-amber-200 text-amber-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {tip.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Routine Changes */}
      {result.routineChanges.length > 0 && (
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-3xl border-2 border-violet-200 p-6 md:p-8">
          <h3 className="text-xl font-bold text-violet-800 mb-4 flex items-center gap-2">
            <Shield size={22} className="text-violet-600" />
            Recommended Routine Changes
          </h3>
          <div className="space-y-3">
            {result.routineChanges.map((change, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4">
                <div className="w-7 h-7 bg-violet-100 rounded-full flex items-center justify-center shrink-0 text-violet-600 font-bold text-sm">
                  {i + 1}
                </div>
                <p className="text-sm font-medium text-violet-800">{change}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all"
        >
          Retake Assessment
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
        >
          Analyze My Products Too
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default AcneRiskResult;
