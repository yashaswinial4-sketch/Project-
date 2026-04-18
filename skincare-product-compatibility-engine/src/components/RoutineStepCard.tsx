import React from 'react';
import type { RoutineStep, BudgetLevel } from '../types';
import { Sun, Moon, Droplets, Sparkles, Shield, FlaskConical, Star, AlertTriangle, ChevronDown, ChevronUp, Tag } from 'lucide-react';

interface Props {
  step: RoutineStep;
  budget: BudgetLevel;
  showAlternatives: boolean;
  onToggleAlternatives: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  cleanser: <Droplets size={18} />,
  toner: <Sparkles size={18} />,
  serum: <FlaskConical size={18} />,
  moisturizer: <Shield size={18} />,
  sunscreen: <Sun size={18} />,
  treatment: <Star size={18} />,
};

const categoryColors: Record<string, string> = {
  cleanser: 'bg-blue-100 text-blue-600 border-blue-200',
  toner: 'bg-purple-100 text-purple-600 border-purple-200',
  serum: 'bg-amber-100 text-amber-600 border-amber-200',
  moisturizer: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  sunscreen: 'bg-orange-100 text-orange-600 border-orange-200',
  treatment: 'bg-rose-100 text-rose-600 border-rose-200',
};

const importanceColors: Record<string, string> = {
  essential: 'bg-emerald-500',
  recommended: 'bg-amber-500',
  optional: 'bg-gray-400',
};

const RoutineStepCard: React.FC<Props> = ({ step, budget, showAlternatives, onToggleAlternatives }) => {
  const isNight = step.timeOfDay === 'night';
  const prod = step.productRecommendation;

  const alternatives: { name: string; price: string; savings: string }[] = [];
  if (budget === 'medium') {
    alternatives.push({
      name: 'Budget Option Available',
      price: `\u20b9${Math.round(prod.priceValue * 0.45)}`,
      savings: `Save \u20b9${Math.round(prod.priceValue * 0.55)}`,
    });
  } else if (budget === 'high') {
    alternatives.push({
      name: 'Mid-Range Alternative',
      price: `\u20b9${Math.round(prod.priceValue * 0.55)}`,
      savings: `Save \u20b9${Math.round(prod.priceValue * 0.45)}`,
    });
    alternatives.push({
      name: 'Budget Alternative',
      price: `\u20b9${Math.round(prod.priceValue * 0.3)}`,
      savings: `Save \u20b9${Math.round(prod.priceValue * 0.7)}`,
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-2">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${categoryColors[step.category] || 'bg-gray-100 text-gray-600'}`}>
          {categoryIcons[step.category] || <Droplets size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-800 text-sm">{step.name}</h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${importanceColors[step.importance]}`}>
              {step.importance}
            </span>
            {step.isOptional && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
                optional
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {isNight ? <Moon size={10} className="inline mr-1" /> : <Sun size={10} className="inline mr-1" />}
            Step {step.stepNumber} \u00b7 {step.durationNote}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 pb-3">
        <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
      </div>

      {/* Key Ingredients */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {step.keyIngredients.slice(0, 4).map((ing, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-medium text-gray-600">
              {ing}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended Product */}
      <div className="mx-4 mb-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <Tag size={12} className="text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Recommended</span>
            </div>
            <p className="font-bold text-gray-800 text-sm">{prod.name}</p>
            <p className="text-xs text-gray-500">{prod.brand}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="font-bold text-emerald-700 text-sm">{prod.priceRange}</span>
            <div className="flex items-center gap-0.5 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={10} className={i < Math.round(prod.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
              ))}
              <span className="text-[10px] text-gray-400 ml-0.5">{prod.rating}</span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">{prod.whyRecommended}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {prod.keyIngredients.slice(0, 3).map((ki, i) => (
            <span key={i} className="px-1.5 py-0.5 rounded-md bg-emerald-100/50 text-[9px] font-medium text-emerald-700">
              {ki}
            </span>
          ))}
        </div>
      </div>

      {/* Application Tip */}
      <div className="mx-4 mb-3 p-2.5 rounded-lg bg-blue-50 border border-blue-100">
        <p className="text-[11px] text-blue-700 leading-relaxed">
          <span className="font-bold">\ud83d\udc49 How to use:</span> {step.applicationTip}
        </p>
      </div>

      {/* Warnings */}
      {step.warnings.length > 0 && (
        <div className="mx-4 mb-3 space-y-1">
          {step.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-1.5 p-2 rounded-lg bg-amber-50 border border-amber-100">
              <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 leading-relaxed">{w}</p>
            </div>
          ))}
        </div>
      )}

      {/* Budget Alternatives Toggle */}
      {budget !== 'low' && alternatives.length > 0 && (
        <div className="mx-4 mb-3">
          <button
            onClick={onToggleAlternatives}
            className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors"
          >
            {showAlternatives ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            \ud83d\udcb0 Budget Alternatives
          </button>
          {showAlternatives && (
            <div className="mt-2 space-y-2 animate-fade-in">
              {alternatives.map((alt, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-violet-50 border border-violet-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{alt.name}</p>
                      <p className="text-[10px] text-gray-500">Available at lower price point</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-violet-700">{alt.price}</span>
                      <p className="text-[10px] text-emerald-600 font-medium">{alt.savings}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Why This Step */}
      <div className="mx-4 mb-4 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-100">
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide mb-1">\ud83e\udde0 Why This Step</p>
        <p className="text-[11px] text-gray-700 leading-relaxed">{step.explanation}</p>
      </div>
    </div>
  );
};

export default RoutineStepCard;
