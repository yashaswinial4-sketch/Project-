// ─────────────────────────────────────────────────────────────
// ROUTINE STEP CARD COMPONENT (TASK 6)
// Displays a single step in the routine with details
// ─────────────────────────────────────────────────────────────

import React from 'react';
import type { RoutineStep } from '../types';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  step: RoutineStep;
  index: number;
  total: number;
}

const RoutineCard: React.FC<Props> = ({ step, index, total }) => {
  const suitabilityColor = step.optional
    ? 'border-amber-200 bg-amber-50/50'
    : 'border-emerald-200 bg-white';

  return (
    <div className={`relative border-2 ${suitabilityColor} rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group`}>
      {/* Connector line */}
      {index < total - 1 && (
        <div className="absolute left-8 -bottom-4 w-0.5 h-4 bg-gray-200 z-0" />
      )}

      {/* Step number badge */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
          {step.order}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{step.emoji}</span>
            <h4 className="font-bold text-gray-800 text-base">{step.name}</h4>
            {step.optional && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                Optional
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            {step.description}
          </p>

          {/* Why Included */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 mb-3 border border-emerald-100">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Why This Step</span>
                <p className="text-emerald-800 text-sm mt-0.5 leading-relaxed">{step.whyIncluded}</p>
              </div>
            </div>
          </div>

          {/* Ingredient Focus */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {step.ingredientFocus.map((ing, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-100"
              >
                {ing}
              </span>
            ))}
          </div>

          {/* Duration Tip */}
          {step.durationTip && (
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Clock size={12} />
              <span>{step.durationTip}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutineCard;
