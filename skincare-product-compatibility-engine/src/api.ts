import type { UserData, AnalysisResult, SampleProduct } from '@/types';
import { analyzeSkincareRoutine, sampleProducts } from '@/logic/skincareRules';

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

// ── Analyze Routine ──
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
