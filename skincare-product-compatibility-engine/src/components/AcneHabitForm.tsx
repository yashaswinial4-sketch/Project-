import React from 'react';
import type { AcneHabits } from '../types';
import { Moon, UtensilsCrossed, ShieldCheck, AlertCircle, Check } from 'lucide-react';

interface Props {
  habits: AcneHabits;
  onChange: (habits: AcneHabits) => void;
}

const AcneHabitForm: React.FC<Props> = ({ habits, onChange }) => {
  const update = (field: keyof AcneHabits, value: string | number) => {
    onChange({ ...habits, [field]: value });
  };

  const sections = [
    {
      title: 'Current Skin Status',
      icon: <AlertCircle size={20} />,
      fields: [
        {
          label: 'How would you describe your current acne?',
          field: 'currentAcne' as keyof AcneHabits,
          options: [
            { value: 'none', label: 'No acne', emoji: '✨' },
            { value: 'mild', label: 'Occasional breakouts', emoji: '🙂' },
            { value: 'moderate', label: 'Regular breakouts', emoji: '😐' },
            { value: 'severe', label: 'Constant breakouts', emoji: '😣' },
          ],
        },
        {
          label: 'How many active breakouts do you have right now?',
          field: 'currentBreakouts' as keyof AcneHabits,
          options: [
            { value: 'none', label: 'None', emoji: '0️⃣' },
            { value: 'few', label: '1-3 spots', emoji: '1️⃣' },
            { value: 'moderate', label: '4-10 spots', emoji: '5️⃣' },
            { value: 'many', label: '10+ spots', emoji: '🔴' },
          ],
        },
      ],
    },
    {
      title: 'Sleep & Hydration',
      icon: <Moon size={20} />,
      fields: [
        {
          label: 'How many hours of sleep do you get per night?',
          field: 'sleepHours' as keyof AcneHabits,
          options: [
            { value: 4, label: '4 or less', emoji: '😫' },
            { value: 5, label: '5 hours', emoji: '😪' },
            { value: 6, label: '6 hours', emoji: '😴' },
            { value: 7, label: '7 hours', emoji: '😊' },
            { value: 8, label: '8+ hours', emoji: '😁' },
          ],
        },
        {
          label: 'How many glasses of water do you drink daily?',
          field: 'waterIntake' as keyof AcneHabits,
          options: [
            { value: 2, label: '1-2 glasses', emoji: '🏜️' },
            { value: 4, label: '3-4 glasses', emoji: '💧' },
            { value: 6, label: '5-6 glasses', emoji: '💦' },
            { value: 8, label: '7-8 glasses', emoji: '🌊' },
            { value: 10, label: '9+ glasses', emoji: '🌟' },
          ],
        },
      ],
    },
    {
      title: 'Diet & Lifestyle',
      icon: <UtensilsCrossed size={20} />,
      fields: [
        {
          label: 'How would you describe your diet?',
          field: 'dietType' as keyof AcneHabits,
          options: [
            { value: 'healthy', label: 'Mostly whole foods', emoji: '🥗' },
            { value: 'balanced', label: 'Balanced', emoji: '🍽️' },
            { value: 'high-sugar', label: 'High in sugar', emoji: '🍬' },
            { value: 'high-dairy', label: 'High in dairy', emoji: '🥛' },
            { value: 'junk-food', label: 'Mostly junk food', emoji: '🍔' },
          ],
        },
        {
          label: 'What is your stress level?',
          field: 'stressLevel' as keyof AcneHabits,
          options: [
            { value: 'low', label: 'Low — I feel relaxed', emoji: '😌' },
            { value: 'moderate', label: 'Moderate', emoji: '😐' },
            { value: 'high', label: 'High — often anxious', emoji: '😰' },
            { value: 'extreme', label: 'Extreme — overwhelmed', emoji: '🤯' },
          ],
        },
        {
          label: 'How often do you exercise?',
          field: 'exerciseFrequency' as keyof AcneHabits,
          options: [
            { value: 'none', label: 'Never', emoji: '🛋️' },
            { value: '1-2x', label: '1-2 times/week', emoji: '🚶' },
            { value: '3-4x', label: '3-4 times/week', emoji: '🏃' },
            { value: 'daily', label: 'Daily', emoji: '💪' },
          ],
        },
      ],
    },
    {
      title: 'Skincare Habits',
      icon: <ShieldCheck size={20} />,
      fields: [
        {
          label: 'How often do you wash your face?',
          field: 'faceWashFrequency' as keyof AcneHabits,
          options: [
            { value: 'rarely', label: 'Rarely', emoji: '🚫' },
            { value: 'once', label: 'Once a day', emoji: '1️⃣' },
            { value: 'twice', label: 'Twice a day', emoji: '2️⃣' },
            { value: 'thrice', label: '3+ times a day', emoji: '3️⃣' },
          ],
        },
        {
          label: 'Do you remove makeup before bed?',
          field: 'makeupRemoval' as keyof AcneHabits,
          options: [
            { value: 'always', label: 'Always', emoji: '✅' },
            { value: 'sometimes', label: 'Sometimes', emoji: '🤷' },
            { value: 'never', label: 'Never', emoji: '❌' },
          ],
        },
        {
          label: 'How often do you change your pillowcase?',
          field: 'pillowcaseChange' as keyof AcneHabits,
          options: [
            { value: 'weekly', label: 'Every week', emoji: '📅' },
            { value: 'biweekly', label: 'Every 2 weeks', emoji: '📆' },
            { value: 'monthly', label: 'Monthly', emoji: '🗓️' },
            { value: 'rarely', label: 'Rarely', emoji: '🚫' },
          ],
        },
        {
          label: 'Do you use sunscreen daily?',
          field: 'sunscreenUse' as keyof AcneHabits,
          options: [
            { value: 'always', label: 'Always', emoji: '☀️' },
            { value: 'sometimes', label: 'Sometimes', emoji: '⛅' },
            { value: 'never', label: 'Never', emoji: '🌧️' },
          ],
        },
        {
          label: 'How often do you touch your face?',
          field: 'touchingFace' as keyof AcneHabits,
          options: [
            { value: 'often', label: 'Very often', emoji: '🤚' },
            { value: 'sometimes', label: 'Sometimes', emoji: '👆' },
            { value: 'rarely', label: 'Rarely', emoji: '🙅' },
            { value: 'never', label: 'Never', emoji: '✋' },
          ],
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {sections.map((section, si) => (
        <div key={si} className="animate-fade-in" style={{ animationDelay: `${si * 100}ms` }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
              {section.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
          </div>
          <div className="space-y-6">
            {section.fields.map((f, fi) => (
              <div key={fi}>
                <label className="block text-sm font-semibold text-gray-700 mb-3">{f.label}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {f.options.map((opt) => {
                    const isSelected = habits[f.field] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update(f.field, opt.value)}
                        className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                          isSelected
                            ? 'border-rose-500 bg-rose-50 shadow-md scale-105'
                            : 'border-gray-200 bg-white hover:border-rose-300 hover:bg-rose-50/50'
                        }`}
                      >
                        <span className="text-xl">{opt.emoji}</span>
                        <span className={`text-xs font-medium ${isSelected ? 'text-rose-700' : 'text-gray-600'}`}>
                          {opt.label}
                        </span>
                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AcneHabitForm;
