// ─────────────────────────────────────────────────────────────
// TASK 9: PROGRESS ENGINE
// Enhanced progress tracking with trends, milestones, insights
// and weekly summaries
// ─────────────────────────────────────────────────────────────

import type {
  SkinRecord,
  ProgressTrend,
  ProgressMilestone,
  ProgressInsight,
  WeeklySummary,
  ProgressDashboard,
} from '@/types';
import { canStoreData } from './privacyEngine';
import { calculateLifestyleImpact } from './lifestyleImpact';

// ── Constants ──

const RECORDS_KEY = 'skinRecords';
const MILESTONES_KEY = 'skincare_milestones';

// ── Get Records ──

export function getProgressRecords(): SkinRecord[] {
  try {
    return JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecords(records: SkinRecord[]): void {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

// ── Add Record with Consent Check ──

export function addProgressRecord(record: Omit<SkinRecord, '_id'>): SkinRecord | null {
  if (!canStoreData('progress')) {
    console.warn('Progress tracking not consented.');
    return null;
  }

  const records = getProgressRecords();
  const newRecord: SkinRecord = {
    ...record,
    _id: 'rec_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
  };

  records.push(newRecord);
  saveRecords(records);

  // Check for new milestones
  checkAndAwardMilestones(records);

  return newRecord;
}

// ── Delete Record ──

export function deleteProgressRecord(id: string): void {
  const records = getProgressRecords().filter(r => r._id !== id);
  saveRecords(records);
}

// ── Calculate Trends ──

function calculateTrend(records: SkinRecord[]): ProgressTrend[] {
  if (records.length < 2) return [];

  const latest = records[records.length - 1];
  const previous = records[records.length - 2];

  const trends: ProgressTrend[] = [];

  // Helper to calculate a single metric trend
  const metricTrend = (
    metricName: string,
    getValue: (r: SkinRecord) => number,
    label: string,
    emoji: string,
    color: string,
    higherIsBetter: boolean = true
  ): ProgressTrend => {
    const current = getValue(latest);
    const prev = getValue(previous);
    const changePercent = prev !== 0 ? Math.round(((current - prev) / prev) * 100) : 0;
    const improved = higherIsBetter ? current > prev : current < prev;

    // Build trend over last N records (up to 10)
    const trendSlice = records.slice(-10);
    const trendValues = trendSlice.map(getValue);

    return {
      metric: metricName,
      current: Math.round(current * 10) / 10,
      previous: Math.round(prev * 10) / 10,
      changePercent,
      direction: improved ? 'improving' : current === prev ? 'stable' : 'declining',
      trend: trendValues,
      label,
      emoji,
      color,
    };
  };

  // Brightness
  if (latest.imageMetrics && previous.imageMetrics) {
    trends.push(metricTrend('brightness', r => r.imageMetrics?.brightness || 0, 'Skin Brightness', '☀️', 'text-yellow-500'));
    trends.push(metricTrend('redness', r => r.imageMetrics?.redness || 0, 'Redness', '🔴', 'text-red-500', false));
    trends.push(metricTrend('oiliness', r => r.imageMetrics?.oiliness || 0, 'Oiliness', '💧', 'text-blue-500', false));
    trends.push(metricTrend('uniformity', r => r.imageMetrics?.uniformity || 0, 'Skin Uniformity', '✨', 'text-purple-500'));
    trends.push(metricTrend('dryness', r => r.imageMetrics?.dryness || 0, 'Dryness', '🏜️', 'text-orange-500', false));
  }

  // Lifestyle trends
  if (latest.lifestyleData && previous.lifestyleData) {
    trends.push(metricTrend('sleep', r => r.lifestyleData?.sleepHours || 0, 'Sleep Hours', '😴', 'text-indigo-500'));
    trends.push(metricTrend('water', r => r.lifestyleData?.waterIntake || 0, 'Water Intake', '💧', 'text-cyan-500'));
  }

  return trends;
}

// ── Milestone System ──

function getMilestones(): ProgressMilestone[] {
  try {
    return JSON.parse(localStorage.getItem(MILESTONES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveMilestones(milestones: ProgressMilestone[]): void {
  localStorage.setItem(MILESTONES_KEY, JSON.stringify(milestones));
}

export function getNewMilestones(): ProgressMilestone[] {
  return getMilestones().filter(m => m.isNew);
}

export function markMilestoneSeen(id: string): void {
  const milestones = getMilestones().map(m =>
    m._id === id ? { ...m, isNew: false } : m
  );
  saveMilestones(milestones);
}

function checkAndAwardMilestones(records: SkinRecord[]): void {
  const existing = getMilestones();
  const existingTypes = new Set(existing.map(m => m.type));
  const newMilestones: ProgressMilestone[] = [];

  const award = (type: ProgressMilestone['type'], title: string, description: string, emoji: string) => {
    if (!existingTypes.has(type)) {
      newMilestones.push({
        _id: 'ms_' + Date.now().toString(36) + '_' + type,
        type,
        title,
        description,
        emoji,
        achievedDate: new Date().toISOString(),
        isNew: true,
      });
    }
  };

  // First scan
  if (records.length >= 1) {
    award('first_scan', 'First Scan!', 'You completed your first skin analysis.', '🎉');
  }

  // Week streak
  if (records.length >= 3) {
    const firstDate = new Date(records[0].date);
    const lastDate = new Date(records[records.length - 1].date);
    const daysDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff >= 7) {
      award('week_streak', 'Week Warrior', 'You have been tracking for over a week!', '🏆');
    }
  }

  // Consistent tracker
  if (records.length >= 7) {
    award('consistent_tracker', 'Consistent Tracker', 'You have recorded 7+ skin analyses!', '📊');
  }

  // Improvement milestones
  if (records.length >= 2) {
    const first = records[0].imageMetrics;
    const last = records[records.length - 1].imageMetrics;
    if (first && last) {
      const improvement = calculateImprovementScore(first, last);
      if (improvement >= 10) {
        award('improvement_10', '10% Improvement!', 'Your skin has improved by 10%!', '🌟');
      }
      if (improvement >= 25) {
        award('improvement_25', '25% Improvement!', 'Incredible — your skin improved by 25%!', '💫');
      }
      if (improvement >= 50) {
        award('improvement_50', '50% Improvement!', 'Half-century milestone — 50% skin improvement!', '🚀');
      }
    }
  }

  // Healthy lifestyle
  if (records.length >= 1) {
    const latest = records[records.length - 1];
    if (latest.lifestyleData) {
      const impact = calculateLifestyleImpact(latest.lifestyleData);
      if (impact.overallScore >= 80) {
        award('healthy_lifestyle', 'Healthy Lifestyle', 'Your lifestyle score is 80+!', '🥗');
      }
    }
  }

  if (newMilestones.length > 0) {
    saveMilestones([...existing, ...newMilestones]);
  }
}

function calculateImprovementScore(
  before: NonNullable<SkinRecord['imageMetrics']>,
  after: NonNullable<SkinRecord['imageMetrics']>
): number {
  let score = 0;
  // Redness decrease is good
  if (before.redness > after.redness) score += 25;
  // Uniformity increase is good
  if (after.uniformity > before.uniformity) score += 25;
  // Brightness increase is good
  if (after.brightness > before.brightness) score += 25;
  // Oil/dry balance
  const beforeBalance = Math.abs(before.oiliness - before.dryness);
  const afterBalance = Math.abs(after.oiliness - after.dryness);
  if (afterBalance < beforeBalance) score += 25;
  return score;
}

// ── Generate Insights ──

function generateInsights(records: SkinRecord[], trends: ProgressTrend[]): ProgressInsight[] {
  const insights: ProgressInsight[] = [];

  if (records.length === 0) {
    insights.push({
      type: 'info',
      text: 'Start tracking your skin by taking your first analysis!',
      priority: 10,
      emoji: '👋',
    });
    return insights;
  }

  // Check trends for insights
  for (const trend of trends) {
    if (trend.direction === 'improving') {
      insights.push({
        type: 'positive',
        text: `${trend.emoji} ${trend.label} has improved by ${Math.abs(trend.changePercent)}%!`,
        metric: trend.metric,
        priority: 8,
        emoji: '📈',
      });
    } else if (trend.direction === 'declining' && trend.metric !== 'redness' && trend.metric !== 'oiliness' && trend.metric !== 'dryness') {
      insights.push({
        type: 'warning',
        text: `${trend.emoji} ${trend.label} has decreased by ${Math.abs(trend.changePercent)}%. Consider adjusting your routine.`,
        metric: trend.metric,
        priority: 7,
        emoji: '⚠️',
      });
    }
    // For redness/oiliness/dryness, declining is actually GOOD
    if (trend.direction === 'declining' && (trend.metric === 'redness' || trend.metric === 'oiliness' || trend.metric === 'dryness')) {
      insights.push({
        type: 'positive',
        text: `${trend.emoji} ${trend.label} has decreased by ${Math.abs(trend.changePercent)}% — great improvement!`,
        metric: trend.metric,
        priority: 8,
        emoji: '✅',
      });
    }
  }

  // Lifestyle insights
  const latest = records[records.length - 1];
  if (latest.lifestyleData) {
    const ls = latest.lifestyleData;
    if (ls.sleepHours < 6) {
      insights.push({
        type: 'warning',
        text: 'Your sleep is below 6 hours. This can lead to dull skin and increased breakouts.',
        priority: 9,
        emoji: '😴',
      });
    }
    if (ls.waterIntake < 5) {
      insights.push({
        type: 'warning',
        text: 'Low water intake detected. Aim for 8+ glasses for hydrated, healthy skin.',
        priority: 8,
        emoji: '💧',
      });
    }
    if (ls.stressLevel === 'high') {
      insights.push({
        type: 'warning',
        text: 'High stress can trigger acne and premature aging. Try relaxation techniques.',
        priority: 7,
        emoji: '🧘',
      });
    }
  }

  // Check for milestone achievements
  const newMilestones = getNewMilestones();
  for (const ms of newMilestones) {
    insights.push({
      type: 'milestone',
      text: `${ms.emoji} Achievement Unlocked: "${ms.title}" — ${ms.description}`,
      priority: 10,
      emoji: '🏆',
    });
  }

  // Sort by priority
  insights.sort((a, b) => b.priority - a.priority);
  return insights.slice(0, 8);
}

// ── Weekly Summaries ──

function generateWeeklySummaries(records: SkinRecord[]): WeeklySummary[] {
  if (records.length === 0) return [];

  // Group records by week
  const weeks: Map<string, SkinRecord[]> = new Map();

  records.forEach(record => {
    const date = new Date(record.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().slice(0, 10);

    if (!weeks.has(weekKey)) {
      weeks.set(weekKey, []);
    }
    weeks.get(weekKey)!.push(record);
  });

  const summaries: WeeklySummary[] = [];

  weeks.forEach((weekRecords, weekKey) => {
    const weekStart = new Date(weekKey);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    // Calculate average score
    let totalScore = 0;
    const changes: string[] = [];
    let bestDayScore = 0;
    let bestDay = '';

    weekRecords.forEach(record => {
      // Simple scoring based on image metrics
      let score = 50;
      if (record.imageMetrics) {
        score = Math.round(
          (record.imageMetrics.uniformity * 0.3) +
          (Math.min(record.imageMetrics.brightness, 200) / 200 * 30) +
          ((100 - record.imageMetrics.redness) * 0.2) +
          ((100 - Math.abs(record.imageMetrics.oiliness - record.imageMetrics.dryness)) * 0.2)
        );
      }
      totalScore += score;

      const dayName = new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' });
      if (score > bestDayScore) {
        bestDayScore = score;
        bestDay = dayName;
      }
    });

    const avgScore = Math.round(totalScore / weekRecords.length);

    // Determine changes
    if (weekRecords.length >= 2) {
      const first = weekRecords[0].imageMetrics;
      const last = weekRecords[weekRecords.length - 1].imageMetrics;
      if (first && last) {
        if (last.redness < first.redness) changes.push('Reduced redness');
        if (last.uniformity > first.uniformity) changes.push('More even skin tone');
        if (last.brightness > first.brightness) changes.push('Brighter complexion');
        if (Math.abs(last.oiliness - first.oiliness) > 5) {
          changes.push(last.oiliness < first.oiliness ? 'Less oily' : 'More hydrated');
        }
      }
    }
    if (changes.length === 0) changes.push('Maintained consistent skin condition');

    // Week rating
    const weekRating: WeeklySummary['weekRating'] =
      avgScore >= 80 ? 'excellent' :
      avgScore >= 60 ? 'good' :
      avgScore >= 40 ? 'fair' : 'needs_work';

    // Tips for next week
    const tips: string[] = [];
    const latestInWeek = weekRecords[weekRecords.length - 1];
    if (latestInWeek.lifestyleData) {
      if (latestInWeek.lifestyleData.sleepHours < 7) tips.push('Try to get 7-8 hours of sleep');
      if (latestInWeek.lifestyleData.waterIntake < 8) tips.push('Increase water intake to 8+ glasses');
    }
    if (avgScore < 60) tips.push('Consider reviewing your skincare products');
    if (tips.length === 0) tips.push('Keep up the great routine!');

    summaries.push({
      weekLabel,
      scanCount: weekRecords.length,
      avgScore,
      bestDay: bestDay || 'N/A',
      changes,
      weekRating,
      tips,
    });
  });

  return summaries.reverse(); // Most recent first
}

// ── Calculate Streak ──

function calculateStreak(records: SkinRecord[]): number {
  if (records.length === 0) return 0;

  const sorted = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group by week
  const weekSet = new Set<string>();
  sorted.forEach(record => {
    const date = new Date(record.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    weekSet.add(weekStart.toISOString().slice(0, 10));
  });

  // Count consecutive weeks from most recent
  const weekKeys = Array.from(weekSet).sort().reverse();
  let streak = 0;
  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay());

  for (let i = 0; i < weekKeys.length; i++) {
    const expectedWeek = new Date(currentWeekStart);
    expectedWeek.setDate(expectedWeek.getDate() - (i * 7));
    const expectedKey = expectedWeek.toISOString().slice(0, 10);
    if (weekKeys.includes(expectedKey)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// ── Fun: Estimate "Skin Age" ──

function estimateSkinAge(records: SkinRecord[]): number {
  if (records.length === 0) return 25;

  const latest = records[records.length - 1];
  if (!latest.imageMetrics) return 25;

  const m = latest.imageMetrics;
  // Simple heuristic
  let age = 20; // base
  age += Math.max(0, (m.redness - 10) * 0.3); // More redness = older
  age -= Math.min(10, (m.uniformity - 40) * 0.2); // More uniform = younger
  age -= Math.min(5, (m.brightness - 120) * 0.05); // Brighter = younger
  age += Math.max(0, Math.abs(m.oiliness - 40) * 0.1); // Imbalance = older

  // Lifestyle adjustments
  if (latest.lifestyleData) {
    if (latest.lifestyleData.sleepHours >= 7) age -= 2;
    if (latest.lifestyleData.waterIntake >= 8) age -= 2;
    if (latest.lifestyleData.stressLevel === 'high') age += 3;
    if (latest.lifestyleData.dietQuality === 'good' || latest.lifestyleData.dietQuality === 'excellent') age -= 1;
  }

  return Math.max(18, Math.min(60, Math.round(age)));
}

// ── Main: Generate Progress Dashboard ──

export function generateProgressDashboard(): ProgressDashboard {
  const records = getProgressRecords();
  const trends = calculateTrend(records);
  const milestones = getMilestones();
  const insights = generateInsights(records, trends);
  const weeklySummaries = generateWeeklySummaries(records);
  const streakWeeks = calculateStreak(records);
  const skinAgeEstimate = estimateSkinAge(records);

  // Overall progress score
  let overallProgress = 50; // default
  if (records.length >= 2 && trends.length > 0) {
    const improvingCount = trends.filter(t => t.direction === 'improving').length;
    const totalTrends = trends.length;
    overallProgress = Math.round(50 + (improvingCount / totalTrends) * 50);
  } else if (records.length === 1) {
    overallProgress = 50; // baseline
  }

  // Direction
  const direction: ProgressDashboard['direction'] =
    trends.filter(t => t.direction === 'improving').length > trends.filter(t => t.direction === 'declining').length
      ? 'improving'
      : trends.filter(t => t.direction === 'declining').length > trends.filter(t => t.direction === 'improving').length
      ? 'declining'
      : 'stable';

  // Tracking confidence
  const trackingConfidence = Math.min(100, records.length * 15);

  return {
    overallProgress,
    direction,
    trends,
    milestones,
    insights,
    weeklySummaries,
    totalRecords: records.length,
    streakWeeks,
    skinAgeEstimate,
    trackingConfidence,
  };
}

// ── Quick Stats for Mini Displays ──

export function getQuickProgressStats(): {
  totalRecords: number;
  streakWeeks: number;
  lastAnalysisDate: string | null;
  skinType: string | null;
  topInsight: string | null;
} {
  const records = getProgressRecords();
  const lastRecord = records.length > 0 ? records[records.length - 1] : null;

  return {
    totalRecords: records.length,
    streakWeeks: calculateStreak(records),
    lastAnalysisDate: lastRecord ? new Date(lastRecord.date).toLocaleDateString() : null,
    skinType: lastRecord?.skinType || null,
    topInsight: lastRecord?.notes || null,
  };
}
