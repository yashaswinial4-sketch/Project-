// ─────────────────────────────────────────────────────────────
// TASK 9: PRIVACY ENGINE
// Manages consent, data storage, data export, and deletion
// ─────────────────────────────────────────────────────────────

import type {
  ConsentPreferences,
  DataExport,
  PrivacyReport,
  FeedbackEntry,
  SkinRecord,
} from '@/types';

// ── Default Consent ──

export const DEFAULT_CONSENT: ConsentPreferences = {
  storeAnalysisResults: false,
  storeImages: false,
  storeLifestyleData: false,
  storeFeedback: false,
  enableProgressTracking: false,
  acceptedPrivacyPolicy: false,
  consentDate: '',
  sessionId: '',
};

// ── Local Storage Keys ──

const CONSENT_KEY = 'skincare_consent';
const RECORDS_KEY = 'skinRecords';
const FEEDBACK_KEY = 'skincare_feedback';
const SESSION_KEY = 'skincare_session_id';

// ── Session Management ──

export function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

// ── Consent Management ──

export function getConsent(): ConsentPreferences {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      return { ...DEFAULT_CONSENT, ...JSON.parse(stored) };
    }
  } catch {
    // corrupted data
  }
  return { ...DEFAULT_CONSENT };
}

export function saveConsent(consent: Partial<ConsentPreferences>): ConsentPreferences {
  const current = getConsent();
  const updated: ConsentPreferences = {
    ...current,
    ...consent,
    consentDate: new Date().toISOString(),
    sessionId: getOrCreateSessionId(),
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(updated));
  return updated;
}

export function hasAnyConsent(): boolean {
  const consent = getConsent();
  return (
    consent.storeAnalysisResults ||
    consent.storeImages ||
    consent.storeLifestyleData ||
    consent.storeFeedback ||
    consent.enableProgressTracking
  );
}

export function canStoreData(dataType: 'analysis' | 'image' | 'lifestyle' | 'feedback' | 'progress'): boolean {
  const consent = getConsent();
  switch (dataType) {
    case 'analysis': return consent.storeAnalysisResults;
    case 'image': return consent.storeImages;
    case 'lifestyle': return consent.storeLifestyleData;
    case 'feedback': return consent.storeFeedback;
    case 'progress': return consent.enableProgressTracking;
    default: return false;
  }
}

// ── Data Validation ──

export interface ValidationResult {
  valid: boolean;
  sanitized: any;
  errors: string[];
  warnings: string[];
}

export function validateImageFile(file: File): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // File type check
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type: ${file.type}. Only JPG, PNG, and WebP are allowed.`);
  }

  // File size check (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push(`File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum 10MB allowed.`);
  }

  // Warning for very small files (might be poor quality)
  if (file.size < 10 * 1024) {
    warnings.push('Image is very small — quality may be poor.');
  }

  // Warning for very large files
  if (file.size > 5 * 1024 * 1024) {
    warnings.push('Large image detected — processing may take longer.');
  }

  return {
    valid: errors.length === 0,
    sanitized: errors.length === 0 ? file : null,
    errors,
    warnings,
  };
}

export function sanitizeTextInput(input: string, maxLength: number = 1000): string {
  return input
    .replace(/[<>{}]/g, '') // Remove potential HTML/JS injection chars
    .replace(/script/gi, '') // Remove script tags
    .slice(0, maxLength)
    .trim();
}

export function sanitizeRating(rating: number): number {
  return Math.max(1, Math.min(5, Math.round(rating)));
}

// ── Data Export ──

export function exportAllData(): DataExport {
  const records: SkinRecord[] = JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]');
  const feedback: FeedbackEntry[] = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
  const consent = getConsent();

  return {
    records,
    feedback,
    consent,
    exportDate: new Date().toISOString(),
    totalEntries: records.length + feedback.length,
  };
}

export function downloadDataExport(): void {
  const data = exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `skincare-data-export-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Data Deletion ──

export function deleteAllData(): void {
  localStorage.removeItem(RECORDS_KEY);
  localStorage.removeItem(FEEDBACK_KEY);
  localStorage.removeItem(CONSENT_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function deleteSpecificData(dataType: 'records' | 'feedback' | 'all'): void {
  switch (dataType) {
    case 'records':
      localStorage.removeItem(RECORDS_KEY);
      break;
    case 'feedback':
      localStorage.removeItem(FEEDBACK_KEY);
      break;
    case 'all':
      deleteAllData();
      break;
  }
}

// ── Privacy Report ──

export function generatePrivacyReport(): PrivacyReport {
  const records: SkinRecord[] = JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]');
  const feedback: FeedbackEntry[] = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
  const consent = getConsent();

  const dataStored: { type: string; count: number; size: string }[] = [];

  if (records.length > 0) {
    dataStored.push({
      type: 'Skin Analysis Records',
      count: records.length,
      size: `${(JSON.stringify(records).length / 1024).toFixed(1)} KB`,
    });
  }
  if (feedback.length > 0) {
    dataStored.push({
      type: 'Feedback Entries',
      count: feedback.length,
      size: `${(JSON.stringify(feedback).length / 1024).toFixed(1)} KB`,
    });
  }
  if (consent.acceptedPrivacyPolicy) {
    dataStored.push({
      type: 'Consent Preferences',
      count: 1,
      size: `${(JSON.stringify(consent).length / 1024).toFixed(1)} KB`,
    });
  }

  // Privacy score based on consent granularity
  const consentCount = [
    consent.storeAnalysisResults,
    consent.storeImages,
    consent.storeLifestyleData,
    consent.storeFeedback,
    consent.enableProgressTracking,
  ].filter(Boolean).length;

  // More granular consent = higher privacy score
  const privacyScore = consent.acceptedPrivacyPolicy
    ? Math.round(40 + (consentCount / 5) * 30 + (consent.storeAnalysisResults && !consent.storeImages ? 15 : 0) + 15)
    : 100; // No consent = maximum privacy

  const recommendations: string[] = [];
  if (consent.storeImages && consent.storeAnalysisResults) {
    recommendations.push('Consider disabling image storage if you only need analysis results.');
  }
  if (!consent.enableProgressTracking) {
    recommendations.push('Enable progress tracking to see skin improvement over time — data stays on your device.');
  }
  if (records.length === 0) {
    recommendations.push('No data stored yet — start by taking a skin analysis to track your progress.');
  }
  if (records.length > 20) {
    recommendations.push('You have many records. Consider exporting and archiving older data.');
  }

  return {
    dataStored,
    retentionPolicy: 'Data is stored locally on your device until you choose to delete it. No data is sent to external servers in offline mode.',
    userRights: [
      'View all stored data at any time',
      'Export your data in JSON format',
      'Delete specific data types',
      'Delete all data instantly',
      'Manage consent preferences',
      'Use the app without consenting to storage',
      'Withdraw consent at any time',
    ],
    lastAccess: records.length > 0
      ? records[records.length - 1].date
      : 'Never',
    privacyScore,
    recommendations,
  };
}

// ── Data Security Utilities ──

/** Simple anonymization — removes direct identifiers */
export function anonymizeRecord(record: SkinRecord): SkinRecord {
  return {
    ...record,
    _id: 'anon_' + record._id,
    userId: undefined,
    imageUrl: record.imageUrl ? '[IMAGE_STORED]' : undefined,
  };
}

/** Estimate storage size */
export function estimateStorageSize(): string {
  let totalBytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key) || '';
      totalBytes += key.length + value.length;
    }
  }
  // 2 bytes per character (UTF-16)
  const totalKB = (totalBytes * 2) / 1024;
  if (totalKB < 1024) return `${totalKB.toFixed(1)} KB`;
  return `${(totalKB / 1024).toFixed(1)} MB`;
}

/** Check if storage is nearly full */
export function checkStorageHealth(): { healthy: boolean; usedPercent: number; message: string } {
  try {
    const sizeStr = estimateStorageSize();
    const sizeKB = parseFloat(sizeStr);
    // Most browsers allow ~5-10MB for localStorage
    const maxSizeKB = 5120; // 5MB
    const usedPercent = Math.min(100, (sizeKB / maxSizeKB) * 100);

    return {
      healthy: usedPercent < 80,
      usedPercent: Math.round(usedPercent),
      message: usedPercent > 80
        ? 'Storage is nearly full. Consider exporting and clearing old data.'
        : usedPercent > 50
        ? 'Storage usage is moderate. Consider reviewing stored data periodically.'
        : 'Storage usage is healthy.',
    };
  } catch {
    return { healthy: true, usedPercent: 0, message: 'Unable to check storage.' };
  }
}
