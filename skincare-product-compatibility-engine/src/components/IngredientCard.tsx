import React from 'react';
import type { AnalyzedIngredient } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface Props {
  ingredient: AnalyzedIngredient;
}

const IngredientCard: React.FC<Props> = ({ ingredient }) => {
  const [expanded, setExpanded] = React.useState(false);

  const config = {
    excellent: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      headerBg: 'bg-emerald-100',
      icon: <CheckCircle2 size={20} className="text-emerald-600" />,
      badge: 'bg-emerald-100 text-emerald-700',
      label: 'Excellent Match',
      glow: '',
    },
    good: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      headerBg: 'bg-blue-100',
      icon: <CheckCircle2 size={20} className="text-blue-600" />,
      badge: 'bg-blue-100 text-blue-700',
      label: 'Good Match',
      glow: '',
    },
    caution: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      headerBg: 'bg-amber-100',
      icon: <AlertTriangle size={20} className="text-amber-600" />,
      badge: 'bg-amber-100 text-amber-700',
      label: 'Use Caution',
      glow: 'animate-pulse-soft',
    },
    avoid: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      headerBg: 'bg-red-100',
      icon: <XCircle size={20} className="text-red-600" />,
      badge: 'bg-red-100 text-red-700',
      label: 'Avoid',
      glow: 'animate-glow-pulse',
    },
    unknown: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      headerBg: 'bg-gray-100',
      icon: <HelpCircle size={20} className="text-gray-500" />,
      badge: 'bg-gray-100 text-gray-600',
      label: 'Unknown',
      glow: '',
    },
  };

  const c = config[ingredient.suitability];

  return (
    <div className={`rounded-2xl border-2 ${c.border} ${c.bg} overflow-hidden transition-all duration-300 hover:shadow-lg ${c.glow}`}>
      {/* Header */}
      <div className={`${c.headerBg} px-5 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          {c.icon}
          <div>
            <h4 className="font-bold text-gray-800 capitalize">
              {ingredient.info?.name || ingredient.name}
            </h4>
            {ingredient.info && (
              <p className="text-xs text-gray-500">{ingredient.info.category}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.badge}`}>
            {c.label}
          </span>
          <span className="text-lg font-black text-gray-700">{ingredient.personalScore}</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="px-5 py-2">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              ingredient.personalScore >= 75 ? 'bg-emerald-500' :
              ingredient.personalScore >= 55 ? 'bg-blue-500' :
              ingredient.personalScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${ingredient.personalScore}%` }}
          />
        </div>
      </div>

      {/* Quick purpose */}
      {ingredient.info && (
        <div className="px-5 py-3">
          <p className="text-sm text-gray-700 leading-relaxed">{ingredient.info.purpose}</p>
        </div>
      )}

      {/* Reasons */}
      {ingredient.reasons.length > 0 && (
        <div className="px-5 pb-2">
          <div className="space-y-1">
            {ingredient.reasons.slice(0, 2).map((reason, i) => (
              <p key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                <span className="mt-0.5">•</span>
                {reason}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Expand button */}
      {ingredient.info && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 transition-colors"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {expanded ? 'Show Less' : 'Show Details'}
        </button>
      )}

      {/* Expanded details */}
      {expanded && ingredient.info && (
        <div className="px-5 pb-5 space-y-4 animate-fade-in border-t border-gray-200 pt-4">
          {/* How it works */}
          <div>
            <h5 className="font-bold text-gray-700 text-sm mb-1 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" /> How It Works
            </h5>
            <p className="text-xs text-gray-600 leading-relaxed">{ingredient.info.howItWorks}</p>
          </div>

          {/* Benefits */}
          {ingredient.info.benefits.length > 0 && (
            <div>
              <h5 className="font-bold text-emerald-700 text-sm mb-1">Benefits</h5>
              <div className="flex flex-wrap gap-1.5">
                {ingredient.info.benefits.map((b, i) => (
                  <span key={i} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs">{b}</span>
                ))}
              </div>
            </div>
          )}

          {/* Side Effects */}
          {ingredient.info.sideEffects.length > 0 && (
            <div>
              <h5 className="font-bold text-amber-700 text-sm mb-1">Possible Side Effects</h5>
              <div className="space-y-1">
                {ingredient.info.sideEffects.map((s, i) => (
                  <p key={i} className="text-xs text-amber-600 flex items-start gap-1.5">
                    <AlertTriangle size={12} className="mt-0.5 shrink-0" /> {s}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Best For / Avoid For */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h5 className="font-bold text-emerald-700 text-xs mb-1">Best For</h5>
              <div className="flex flex-wrap gap-1">
                {ingredient.info.bestFor.map((b, i) => (
                  <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-xs capitalize">{b}</span>
                ))}
              </div>
            </div>
            {ingredient.info.avoidFor.length > 0 && (
              <div>
                <h5 className="font-bold text-red-700 text-xs mb-1">Avoid For</h5>
                <div className="flex flex-wrap gap-1">
                  {ingredient.info.avoidFor.map((a, i) => (
                    <span key={i} className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs capitalize">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Usage Tips */}
          <div className="bg-white/60 rounded-xl p-3">
            <h5 className="font-bold text-gray-700 text-xs mb-1">Usage Tips</h5>
            <p className="text-xs text-gray-600 leading-relaxed">{ingredient.info.usageTips}</p>
          </div>

          {/* Strength */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Strength:</span>
            <span className={`font-bold ${
              ingredient.info.strength === 'gentle' ? 'text-emerald-600' :
              ingredient.info.strength === 'mild' ? 'text-blue-600' :
              ingredient.info.strength === 'moderate' ? 'text-amber-600' :
              'text-red-600'
            }`}>
              {ingredient.info.strength.toUpperCase()}
            </span>
          </div>

          {/* Personal warnings */}
          {ingredient.warnings.length > 0 && (
            <div className="bg-red-50 rounded-xl p-3">
              <h5 className="font-bold text-red-700 text-xs mb-1">Warnings For Your Skin</h5>
              {ingredient.warnings.map((w, i) => (
                <p key={i} className="text-xs text-red-600 flex items-start gap-1.5 mb-1">
                  <XCircle size={12} className="mt-0.5 shrink-0" /> {w}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IngredientCard;
