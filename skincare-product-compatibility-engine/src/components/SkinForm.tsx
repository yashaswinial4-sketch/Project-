import React from 'react';
import type { SkinType, SkinConcern } from '../types';

interface SkinFormProps {
  skinType: SkinType | '';
  concerns: SkinConcern[];
  onSkinTypeChange: (type: SkinType) => void;
  onConcernsChange: (concerns: SkinConcern[]) => void;
}

const skinTypes: { value: SkinType; label: string; emoji: string; desc: string }[] = [
  { value: 'dry', label: 'Dry', emoji: '🏜️', desc: 'Tight, flaky, rough texture' },
  { value: 'oily', label: 'Oily', emoji: '💧', desc: 'Shiny, enlarged pores, prone to acne' },
  { value: 'combination', label: 'Combination', emoji: '⚖️', desc: 'Oily T-zone, dry cheeks' },
  { value: 'sensitive', label: 'Sensitive', emoji: '🌸', desc: 'Easily irritated, redness-prone' },
];

const concernsList: { value: SkinConcern; label: string; emoji: string }[] = [
  { value: 'acne', label: 'Acne', emoji: '🔴' },
  { value: 'pigmentation', label: 'Pigmentation', emoji: '🟤' },
  { value: 'dryness', label: 'Dryness', emoji: '🏜️' },
  { value: 'aging', label: 'Aging', emoji: '⏳' },
  { value: 'sensitivity', label: 'Sensitivity', emoji: '🌸' },
  { value: 'oiliness', label: 'Oiliness', emoji: '💧' },
  { value: 'blackheads', label: 'Blackheads', emoji: '⚫' },
];

const SkinForm: React.FC<SkinFormProps> = ({
  skinType, concerns, onSkinTypeChange, onConcernsChange
}) => {
  const toggleConcern = (concern: SkinConcern) => {
    if (concerns.includes(concern)) {
      onConcernsChange(concerns.filter(c => c !== concern));
    } else {
      onConcernsChange([...concerns, concern]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Skin Type Selection */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🧴</span> What's Your Skin Type?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skinTypes.map(type => (
            <button
              key={type.value}
              onClick={() => onSkinTypeChange(type.value)}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left
                ${skinType === type.value
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100 scale-105'
                  : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md'
                }`}
            >
              <div className="text-3xl mb-2">{type.emoji}</div>
              <div className="font-bold text-gray-800">{type.label}</div>
              <div className="text-sm text-gray-500 mt-1">{type.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Skin Concerns */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🎯</span> What Are Your Skin Concerns?
          <span className="text-sm font-normal text-gray-400">(Select all that apply)</span>
        </h3>
        <div className="flex flex-wrap gap-3">
          {concernsList.map(concern => (
            <button
              key={concern.value}
              onClick={() => toggleConcern(concern.value)}
              className={`px-5 py-3 rounded-xl border-2 transition-all duration-300 font-medium
                ${concerns.includes(concern.value)
                  ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-md'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300 hover:bg-rose-50'
                }`}
            >
              <span className="mr-2">{concern.emoji}</span>
              {concern.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkinForm;
