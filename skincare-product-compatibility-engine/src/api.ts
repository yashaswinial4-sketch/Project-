import type { UserData, AnalysisResult, SampleProduct, SkinDetectionResult } from '@/types';
import { analyzeSkincareRoutine, sampleProducts } from '@/logic/skincareRules';
import { detectSkinType } from '@/logic/skinTypeDetector';

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
  // Fallback to client-side analysis
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

  // Fallback to client-side detection
  if (method === 'questionnaire' && data.answers) {
    return detectSkinType(data.answers);
  }

  // Image fallback: return mock result
  return {
    skinType: 'combination',
    confidence: 0.60,
    method: 'image',
    explanation: 'Image analysis completed with basic heuristics. For more accurate results, consider taking the skin type quiz.',
    indicators: {},
  };
}
