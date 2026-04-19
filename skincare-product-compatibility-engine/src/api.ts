import type { UserData, AnalysisResult, SampleProduct, SkinDetectionResult, AcneHabits, AcneRiskResult, Product, SkinType, SkinRecord, LifestyleData, LifestyleImpact, ProgressComparison } from '@/types';
import { analyzeSkincareRoutine, sampleProducts } from '@/logic/skincareRules';
import { detectSkinType } from '@/logic/skinTypeDetector';
import { predictAcneRisk } from '@/logic/acneRiskPredictor';
import { calculateLifestyleImpact } from '@/logic/lifestyleImpact';

// ── API Configuration ──
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

// ── Use backend API if available, fallback to client-side logic ──
let useBackend = false;

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (res.ok) {
      useBackend = true;
      return true;
    }
  } catch {
    useBackend = false;
  }
  return false;
}

// ── Analyze Routine (Task 1) ──
export async function analyzeRoutine(data: UserData): Promise<AnalysisResult> {
  if (useBackend) {
    try {
      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) return json.data;
    } catch {
      useBackend = false;
    }
  }
  return analyzeSkincareRoutine(data);
}

// ── Get Sample Products ──
export async function getSampleProducts(): Promise<SampleProduct[]> {
  if (useBackend) {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      const json = await res.json();
      if (json.success) return json.data;
    } catch {
      useBackend = false;
    }
  }
  return sampleProducts;
}

// ── Analyze Skin Type (Task 2) ──
export async function analyzeSkinType(
  method: 'questionnaire' | 'image',
  data: { answers?: { questionId: number; answer: string }[]; image?: string }
): Promise<SkinDetectionResult> {
  if (useBackend) {
    try {
      const res = await fetch(`${API_BASE_URL}/analyze-skin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, ...data })
      });
      const json = await res.json();
      if (json.success) return json.data;
    } catch {
      useBackend = false;
    }
  }

  if (method === 'questionnaire' && data.answers) {
    return detectSkinType(data.answers);
  }

  return {
    skinType: 'combination',
    confidence: 0.60,
    method: 'image',
    explanation: 'Image analysis completed with basic heuristics. For more accurate results, consider taking the skin type quiz.',
    indicators: {},
  };
}

// ── Predict Acne Risk (Task 3) ──
export async function predictAcneRiskAPI(
  habits: AcneHabits,
  products: Product[],
  skinType: SkinType | ''
): Promise<AcneRiskResult> {
  if (useBackend) {
    try {
      const res = await fetch(`${API_BASE_URL}/acne-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habits, products, skinType })
      });
      const json = await res.json();
      if (json.success) return json.data;
    } catch {
      useBackend = false;
    }
  }
  return predictAcneRisk(habits, products, skinType);
}

// ── Lifestyle Impact (Task 4) ──
export async function getLifestyleImpact(data: LifestyleData): Promise<LifestyleImpact> {
  if (useBackend) {
    try {
      const res = await fetch(`${API_BASE_URL}/lifestyle-impact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) return json.data;
    } catch {
      useBackend = false;
    }
  }
  return calculateLifestyleImpact(data);
}

// ── Skin Records (Task 4) ──
export async function saveSkinRecord(record: Partial<SkinRecord>): Promise<SkinRecord> {
  if (useBackend) {
    try {
      const res = await fetch(`${API_BASE_URL}/skin/save-record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      const json = await res.json();
      if (json.success) return json.data;
    } catch {
      useBackend = false;
    }
  }
  // Local storage fallback
  const newRecord: SkinRecord = {
    _id: Date.now().toString(),
    date: new Date().toISOString(),
    ...record,
  } as SkinRecord;
  const records = JSON.parse(localStorage.getItem('skinRecords') || '[]');
  records.push(newRecord);
  localStorage.setItem('skinRecords', JSON.stringify(records));
  return newRecord;
}

export async function getSkinHistory(): Promise<SkinRecord[]> {
  if (useBackend) {
    try {
      const res = await fetch(`${API_BASE_URL}/skin/history`);
      const json = await res.json();
      if (json.success) return json.data;
    } catch {
      useBackend = false;
    }
  }
  return JSON.parse(localStorage.getItem('skinRecords') || '[]');
}

export async function compareRecords(beforeId: string, afterId: string): Promise<ProgressComparison> {
  if (useBackend) {
    try {
      const res = await fetch(`${API_BASE_URL}/skin/compare?before=${beforeId}&after=${afterId}`);
      const json = await res.json();
      if (json.success) return json.data;
    } catch {
      useBackend = false;
    }
  }
  // Client-side comparison
  const records = JSON.parse(localStorage.getItem('skinRecords') || '[]');
  const before = records.find((r: SkinRecord) => r._id === beforeId);
  const after = records.find((r: SkinRecord) => r._id === afterId);
  if (!before || !after) throw new Error('Records not found');

  const bm = before.imageMetrics || { brightness: 150, redness: 10, saturation: 20, uniformity: 50, oiliness: 40, dryness: 40 };
  const am = after.imageMetrics || { brightness: 150, redness: 10, saturation: 20, uniformity: 50, oiliness: 40, dryness: 40 };

  const rednessChange = bm.redness - am.redness;
  const oilChange = bm.oiliness - am.oiliness;
  const drynessChange = bm.dryness - am.dryness;
  const uniformityChange = am.uniformity - bm.uniformity;
  const brightnessChange = am.brightness - bm.brightness;

  let improvementScore = 0;
  if (rednessChange > 0) improvementScore += 25;
  if (uniformityChange > 0) improvementScore += 20;
  if (Math.abs(oilChange) < 10) improvementScore += 15;
  if (Math.abs(drynessChange) < 10) improvementScore += 15;
  if (Math.abs(brightnessChange) < 20) improvementScore += 10;
  if (before.skinType !== after.skinType) improvementScore += 15;

  const insights: string[] = [];
  if (rednessChange > 5) insights.push('Reduced redness — less inflammation');
  if (uniformityChange > 10) insights.push('More even skin tone');
  if (oilChange > 10) insights.push('Reduced oiliness');
  if (drynessChange > 10) insights.push('Reduced dryness — better hydration');
  if (insights.length === 0) insights.push('Minor changes detected');

  return {
    before, after,
    improvementScore: Math.min(100, Math.max(-50, improvementScore)),
    acneReduction: rednessChange > 0 ? `${Math.round(rednessChange)}%` : '0%',
    oilChange: oilChange > 0 ? `-${oilChange}%` : `+${Math.abs(oilChange)}%`,
    drynessChange: drynessChange > 0 ? `-${drynessChange}%` : `+${Math.abs(drynessChange)}%`,
    overallChange: improvementScore > 0 ? 'Improving' : improvementScore < 0 ? 'Declining' : 'Stable',
    insights,
    metricsComparison: {
      brightness: { before: bm.brightness, after: am.brightness, change: brightnessChange },
      redness: { before: bm.redness, after: am.redness, change: -rednessChange },
      oiliness: { before: bm.oiliness, after: am.oiliness, change: -oilChange },
      uniformity: { before: bm.uniformity, after: am.uniformity, change: uniformityChange },
    }
  };
}
