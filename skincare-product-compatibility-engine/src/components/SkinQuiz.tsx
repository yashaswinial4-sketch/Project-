import React, { useState } from 'react';
import type { QuizQuestion, QuizAnswer, SkinDetectionResult } from '../types';
import { detectSkinType } from '../logic/skinTypeDetector';
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

interface SkinQuizProps {
  onComplete: (result: SkinDetectionResult) => void;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'How does your skin feel right after washing (before applying anything)?',
    options: [
      { value: 'tight', label: 'Tight & stretched', emoji: '😬' },
      { value: 'comfortable', label: 'Comfortable & balanced', emoji: '😊' },
      { value: 'oily', label: 'Already getting oily', emoji: '😅' },
      { value: 'normal', label: 'Slightly tight then normal', emoji: '🙂' },
    ],
  },
  {
    id: 2,
    question: 'How often does your face get shiny or oily during the day?',
    options: [
      { value: 'rarely', label: 'Rarely or never', emoji: '🌵' },
      { value: 'sometimes', label: 'Sometimes (mostly T-zone)', emoji: '⚖️' },
      { value: 'often', label: 'Very often (all over)', emoji: '💧' },
      { value: 'never', label: 'Almost never', emoji: '✨' },
    ],
  },
  {
    id: 3,
    question: 'How often do you experience breakouts or acne?',
    options: [
      { value: 'never', label: 'Rarely or never', emoji: '🧘' },
      { value: 'rarely', label: 'Occasionally', emoji: '🙂' },
      { value: 'sometimes', label: 'Sometimes (T-zone mostly)', emoji: '😐' },
      { value: 'frequently', label: 'Frequently', emoji: '😣' },
    ],
  },
  {
    id: 4,
    question: 'Are your pores visibly large?',
    options: [
      { value: 'no', label: 'No, barely visible', emoji: '🔍' },
      { value: 'slightly', label: 'Slightly visible', emoji: '👀' },
      { value: 't-zone', label: 'Only on nose & forehead', emoji: '👃' },
      { value: 'yes', label: 'Yes, clearly visible', emoji: '🔎' },
    ],
  },
  {
    id: 5,
    question: 'Does your skin react easily to new products (redness, itching, burning)?',
    options: [
      { value: 'yes', label: 'Yes, very easily', emoji: '🔴' },
      { value: 'sometimes', label: 'Sometimes with strong products', emoji: '🟡' },
      { value: 'rarely', label: 'Rarely', emoji: '🟢' },
      { value: 'no', label: 'No, my skin is tough', emoji: '💪' },
    ],
  },
  {
    id: 6,
    question: 'By midday, how does the oil on your face look?',
    options: [
      { value: 'tight-dry', label: 'Still tight & dry', emoji: '🏜️' },
      { value: 'comfortable', label: 'Comfortable, no oil', emoji: '😌' },
      { value: 'oily-tzone', label: 'Oily on T-zone only', emoji: '🔶' },
      { value: 'oily-all-over', label: 'Oily all over', emoji: '💦' },
    ],
  },
  {
    id: 7,
    question: 'How does your skin look at the end of the day?',
    options: [
      { value: 'dull-flat', label: 'Dull & flat', emoji: '😑' },
      { value: 'glowy', label: 'Natural glow', emoji: '✨' },
      { value: 'mixed', label: 'Shiny T-zone, dry cheeks', emoji: '🌓' },
      { value: 'very-shiny', label: 'Very shiny/oily', emoji: '🪞' },
    ],
  },
  {
    id: 8,
    question: 'How often does your skin feel flaky or peeling?',
    options: [
      { value: 'often', label: 'Often', emoji: '🍂' },
      { value: 'sometimes', label: 'Sometimes in winter', emoji: '❄️' },
      { value: 'rarely', label: 'Rarely', emoji: '🌿' },
      { value: 'never', label: 'Never', emoji: '🌞' },
    ],
  },
];

const SkinQuiz: React.FC<SkinQuizProps> = ({ onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const currentAnswer = answers.find((a) => a.questionId === questions[currentQ].id);
  const progress = ((currentQ + 1) / questions.length) * 100;

  const handleSelect = (value: string) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== questions[currentQ].id);
      return [...filtered, { questionId: questions[currentQ].id, answer: value }];
    });
  };

  const handleNext = () => {
    if (!currentAnswer) return;
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const handleSubmit = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const result = detectSkinType(answers);
      onComplete(result);
      setAnalyzing(false);
    }, 1200);
  };

  const q = questions[currentQ];

  return (
    <div className="animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-500">
            Question {currentQ + 1} of {questions.length}
          </span>
          <span className="text-sm font-bold text-emerald-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 md:p-8 shadow-sm">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
          {q.question}
        </h3>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map((opt) => {
            const isSelected = currentAnswer?.answer === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left
                  ${isSelected
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100 scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md'
                  }`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <div>
                  <span className={`font-semibold ${isSelected ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {opt.label}
                  </span>
                </div>
                {isSelected && (
                  <CheckCircle size={22} className="text-emerald-500 ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handleBack}
          disabled={currentQ === 0}
          className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!currentAnswer || analyzing}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg
            ${currentQ === questions.length - 1
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }
            disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {analyzing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Analyzing...
            </>
          ) : currentQ === questions.length - 1 ? (
            <>
              <CheckCircle size={20} />
              Get My Skin Type
            </>
          ) : (
            <>
              Next
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>

      {/* Question dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentQ(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300
              ${i === currentQ
                ? 'bg-emerald-500 w-8'
                : answers.some((a) => a.questionId === questions[i].id)
                  ? 'bg-emerald-300'
                  : 'bg-gray-300'
              }`}
            aria-label={`Go to question ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SkinQuiz;
