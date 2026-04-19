// ─────────────────────────────────────────────────────────────
// TASK 9: CONSENT CHECKBOX COMPONENT
// Reusable consent UI for data storage opt-in
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { Shield, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import type { ConsentPreferences } from '../types';
import { saveConsent, getConsent } from '../logic/privacyEngine';

interface ConsentCheckboxProps {
  /** Called when consent state changes */
  onConsentChange?: (consent: ConsentPreferences) => void;
  /** Compact mode — show minimal UI */
  compact?: boolean;
  /** Pre-checked consent for analysis */
  defaultAnalysis?: boolean;
}

const CONSENT_ITEMS: {
  key: keyof Pick<ConsentPreferences, 'storeAnalysisResults' | 'storeImages' | 'storeLifestyleData' | 'storeFeedback' | 'enableProgressTracking'>;
  label: string;
  description: string;
  emoji: string;
}[] = [
  {
    key: 'storeAnalysisResults',
    label: 'Store Analysis Results',
    description: 'Save your skin type, acne risk, and ingredient analysis for future reference.',
    emoji: '📊',
  },
  {
    key: 'storeImages',
    label: 'Store Uploaded Images',
    description: 'Save your skin photos locally for before/after comparisons.',
    emoji: '📸',
  },
  {
    key: 'storeLifestyleData',
    label: 'Store Lifestyle Data',
    description: 'Save sleep, water, diet, and stress data for personalized insights.',
    emoji: '🧬',
  },
  {
    key: 'storeFeedback',
    label: 'Store Feedback',
    description: 'Save your ratings and comments to improve our recommendations.',
    emoji: '💬',
  },
  {
    key: 'enableProgressTracking',
    label: 'Enable Progress Tracking',
    description: 'Track skin improvement over time with weekly summaries and milestones.',
    emoji: '📈',
  },
];

const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({
  onConsentChange,
  compact = false,
  defaultAnalysis = false,
}) => {
  const [consent, setConsent] = React.useState<ConsentPreferences>(() => {
    const existing = getConsent();
    if (defaultAnalysis && !existing.storeAnalysisResults) {
      existing.storeAnalysisResults = true;
    }
    return existing;
  });

  const [showInfo, setShowInfo] = React.useState(false);

  const handleToggle = (key: keyof ConsentPreferences, value: boolean) => {
    const updated = saveConsent({ [key]: value });
    setConsent(updated);
    onConsentChange?.(updated);
  };

  const handleAcceptAll = () => {
    const updated = saveConsent({
      storeAnalysisResults: true,
      storeImages: true,
      storeLifestyleData: true,
      storeFeedback: true,
      enableProgressTracking: true,
      acceptedPrivacyPolicy: true,
    });
    setConsent(updated);
    onConsentChange?.(updated);
  };

  const handleRejectAll = () => {
    const updated = saveConsent({
      storeAnalysisResults: false,
      storeImages: false,
      storeLifestyleData: false,
      storeFeedback: false,
      enableProgressTracking: false,
      acceptedPrivacyPolicy: false,
    });
    setConsent(updated);
    onConsentChange?.(updated);
  };

  const acceptedCount = CONSENT_ITEMS.filter(item => consent[item.key]).length;
  const allAccepted = acceptedCount === CONSENT_ITEMS.length;
  const noneAccepted = acceptedCount === 0;

  // Compact mode — single checkbox
  if (compact) {
    return (
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <button
          type="button"
          onClick={() => handleToggle('storeAnalysisResults', !consent.storeAnalysisResults)}
          className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            consent.storeAnalysisResults
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-gray-300 bg-white hover:border-emerald-400'
          }`}
        >
          {consent.storeAnalysisResults && <CheckCircle2 size={16} />}
        </button>
        <div>
          <p className="text-sm font-medium text-gray-700">
            I agree to store my data for analysis and tracking
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Data is stored locally on your device. No external servers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-emerald-400" />
            <div>
              <h3 className="font-bold text-lg">Data Privacy & Consent</h3>
              <p className="text-sm text-white/70">Choose what data you want to store</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Privacy Info Banner */}
      {showInfo && (
        <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-emerald-800 space-y-2">
              <p className="font-semibold">Your Privacy Rights:</p>
              <ul className="list-disc list-inside space-y-1 text-emerald-700">
                <li>All data is stored <strong>locally on your device</strong> (localStorage)</li>
                <li>No data is sent to external servers in offline mode</li>
                <li>You can delete all data at any time</li>
                <li>You can export your data in a readable format</li>
                <li>Analysis works without consent — just won't save results</li>
                <li>You can withdraw consent at any time</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Status Banner */}
      <div className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
        allAccepted ? 'bg-emerald-50 text-emerald-700' :
        noneAccepted ? 'bg-amber-50 text-amber-700' :
        'bg-blue-50 text-blue-700'
      }`}>
        {allAccepted ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
        {allAccepted ? 'Full consent — all features enabled' :
         noneAccepted ? 'No storage — analysis works but nothing is saved' :
         `Partial consent — ${acceptedCount}/${CONSENT_ITEMS.length} features enabled`}
      </div>

      {/* Consent Items */}
      <div className="p-6 space-y-4">
        {CONSENT_ITEMS.map(item => (
          <div
            key={item.key}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
              consent[item.key]
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleToggle(item.key, !consent[item.key])}
          >
            <button
              type="button"
              className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                consent[item.key]
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {consent[item.key] && <CheckCircle2 size={16} />}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.emoji}</span>
                <span className="font-semibold text-gray-800">{item.label}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-6 pb-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAcceptAll}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors text-sm"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={handleRejectAll}
          className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors text-sm"
        >
          Reject All
        </button>
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className="px-5 py-2.5 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors text-sm"
        >
          {showInfo ? 'Hide Info' : 'Learn More'}
        </button>
      </div>

      {/* Privacy Policy Acceptance */}
      <div className="px-6 pb-6">
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
            consent.acceptedPrivacyPolicy
              ? 'bg-violet-50 border-violet-200'
              : 'bg-gray-50 border-gray-200'
          }`}
          onClick={() => handleToggle('acceptedPrivacyPolicy', !consent.acceptedPrivacyPolicy)}
        >
          <button
            type="button"
            className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              consent.acceptedPrivacyPolicy
                ? 'bg-violet-500 border-violet-500 text-white'
                : 'border-gray-300 bg-white'
            }`}
          >
            {consent.acceptedPrivacyPolicy && <CheckCircle2 size={16} />}
          </button>
          <div>
            <p className="text-sm font-medium text-gray-700">
              I have read and accept the Privacy Policy
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Data is stored locally. No third-party sharing. You control everything.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentCheckbox;
