// ─────────────────────────────────────────────────────────────
// TASK 9: PRIVACY, FEEDBACK & PROGRESS DASHBOARD
// Unified page for privacy management, feedback submission,
// feedback history, and enhanced progress tracking
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Shield, MessageSquare, TrendingUp, Star,
  Download, Trash2, Eye, Lock, CheckCircle2,
  BarChart3, Calendar, Heart, Activity,
  Sparkles, Trophy, ChevronDown, ChevronUp, RefreshCw,
  Info, Award, Target, Zap,
} from 'lucide-react';
import { useSkinContext } from '../context/SkinContext';
import ConsentCheckbox from '../components/ConsentCheckbox';
import FeedbackForm from '../components/FeedbackForm';
import type {
  FeedbackEntry, FeedbackStats,
  PrivacyReport, ProgressDashboard, ProgressTrend, ProgressMilestone,
  WeeklySummary,
} from '../types';
import {
  generatePrivacyReport, downloadDataExport,
  deleteSpecificData, estimateStorageSize, checkStorageHealth,
} from '../logic/privacyEngine';
import {
  getAllFeedback, calculateFeedbackStats, deleteFeedback,
  MODULE_LABELS,
} from '../logic/feedbackEngine';
import {
  generateProgressDashboard,
  markMilestoneSeen,
} from '../logic/progressEngine';

// ── Tab Configuration ──

type TabId = 'privacy' | 'feedback' | 'progress';

const TABS: { id: TabId; label: string; icon: React.ReactNode; emoji: string }[] = [
  { id: 'privacy', label: 'Privacy & Data', icon: <Shield size={18} />, emoji: '🔒' },
  { id: 'feedback', label: 'Feedback', icon: <MessageSquare size={18} />, emoji: '💬' },
  { id: 'progress', label: 'Progress Tracking', icon: <TrendingUp size={18} />, emoji: '📈' },
];

// ─────────────────────────────────────────────────────────────
// PROGRESS TREND CARD
// ─────────────────────────────────────────────────────────────

const TrendCard: React.FC<{ trend: ProgressTrend }> = ({ trend }) => {
  return (
    <div className={`bg-white rounded-xl border p-4 transition-all ${
      trend.direction === 'improving' ? 'border-emerald-200 bg-emerald-50/30' :
      trend.direction === 'declining' ? 'border-rose-200 bg-rose-50/30' :
      'border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{trend.emoji}</span>
          <div>
            <p className="font-semibold text-gray-800">{trend.label}</p>
            <p className="text-sm text-gray-500">
              {trend.current} → <span className={
                trend.direction === 'improving' ? 'text-emerald-600 font-medium' :
                trend.direction === 'declining' ? 'text-rose-600 font-medium' :
                'text-gray-600'
              }>
                {trend.changePercent > 0 ? '+' : ''}{trend.changePercent}%
              </span>
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          trend.direction === 'improving' ? 'bg-emerald-100 text-emerald-700' :
          trend.direction === 'declining' ? 'bg-rose-100 text-rose-700' :
          'bg-gray-100 text-gray-600'
        }`}>
          {trend.direction === 'improving' ? '↑ Improving' :
           trend.direction === 'declining' ? '↓ Needs Attention' :
           '→ Stable'}
        </div>
      </div>

      {/* Mini Sparkline */}
      {trend.trend.length > 1 && (
        <div className="mt-3 flex items-end gap-1 h-8">
          {trend.trend.map((val, i) => {
            const max = Math.max(...trend.trend);
            const min = Math.min(...trend.trend);
            const range = max - min || 1;
            const height = Math.max(4, ((val - min) / range) * 100);
            return (
              <div
                key={i}
                className={`flex-1 rounded-sm transition-all ${
                  i === trend.trend.length - 1 ? 'bg-current' : 'bg-gray-300'
                } ${trend.direction === 'improving' ? 'text-emerald-500' :
                   trend.direction === 'declining' ? 'text-rose-500' : 'text-gray-400'}`}
                style={{ height: `${height}%`, minHeight: '4px' }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MILESTONE CARD
// ─────────────────────────────────────────────────────────────

const MilestoneCard: React.FC<{ milestone: ProgressMilestone }> = ({ milestone }) => (
  <div className={`bg-white rounded-xl border p-4 transition-all ${
    milestone.isNew ? 'border-yellow-300 ring-2 ring-yellow-200 bg-yellow-50/30' : 'border-gray-200'
  }`}>
    <div className="flex items-center gap-3">
      <span className="text-3xl">{milestone.emoji}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-bold text-gray-800">{milestone.title}</p>
          {milestone.isNew && (
            <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold animate-pulse">
              NEW!
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">{milestone.description}</p>
        <p className="text-xs text-gray-400 mt-1">
          Achieved: {new Date(milestone.achievedDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// WEEKLY SUMMARY CARD
// ─────────────────────────────────────────────────────────────

const WeeklySummaryCard: React.FC<{ summary: WeeklySummary }> = ({ summary }) => {
  const [expanded, setExpanded] = useState(false);

  const ratingConfig: Record<string, { color: string; bg: string; emoji: string }> = {
    excellent: { color: 'text-emerald-700', bg: 'bg-emerald-100', emoji: '🌟' },
    good: { color: 'text-blue-700', bg: 'bg-blue-100', emoji: '👍' },
    fair: { color: 'text-yellow-700', bg: 'bg-yellow-100', emoji: '😐' },
    needs_work: { color: 'text-rose-700', bg: 'bg-rose-100', emoji: '💪' },
  };

  const config = ratingConfig[summary.weekRating];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.emoji}</span>
          <div>
            <p className="font-semibold text-gray-800">{summary.weekLabel}</p>
            <p className="text-xs text-gray-500">{summary.scanCount} scan{summary.scanCount !== 1 ? 's' : ''} • Best: {summary.bestDay}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.color}`}>
            {summary.weekRating.replace('_', ' ')} ({summary.avgScore})
          </div>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
      {expanded && (
        <div className="mt-4 space-y-3 border-t pt-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">Changes:</p>
            <ul className="space-y-1">
              {summary.changes.map((change, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" /> {change}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">Tips for next week:</p>
            <ul className="space-y-1">
              {summary.tips.map((tip, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                  <Lightbulb size={14} className="text-yellow-500" /> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const Lightbulb = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
);

// ─────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────

const PrivacyDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { detectedSkinType } = useSkinContext();
  const [activeTab, setActiveTab] = useState<TabId>('privacy');
  const [privacyReport, setPrivacyReport] = useState<PrivacyReport>(generatePrivacyReport());
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>(getAllFeedback());
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats>(calculateFeedbackStats());
  const [progressDashboard, setProgressDashboard] = useState<ProgressDashboard>(generateProgressDashboard());
  const [storageInfo, setStorageInfo] = useState({ size: '', health: { healthy: true, usedPercent: 0, message: '' } });
  const [deleteConfirm, setDeleteConfirm] = useState<'none' | 'records' | 'feedback' | 'all'>('none');

  // Refresh all data
  const refreshData = useCallback(() => {
    setPrivacyReport(generatePrivacyReport());
    setFeedbackEntries(getAllFeedback());
    setFeedbackStats(calculateFeedbackStats());
    setProgressDashboard(generateProgressDashboard());
    setStorageInfo({
      size: estimateStorageSize(),
      health: checkStorageHealth(),
    });
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle feedback submission
  const handleFeedbackSubmit = () => {
    refreshData();
  };

  // Handle data deletion
  const handleDelete = (type: 'records' | 'feedback' | 'all') => {
    if (deleteConfirm === type) {
      deleteSpecificData(type);
      setDeleteConfirm('none');
      refreshData();
    } else {
      setDeleteConfirm(type);
    }
  };

  // Handle milestone seen
  const handleMilestoneSeen = (id: string) => {
    markMilestoneSeen(id);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-6">
          <ArrowLeft size={20} /> Back to Home
        </button>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold mb-4">
            <Shield size={16} /> TASK 9 — Privacy, Feedback & Progress
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-800 mb-3">
            Your Data, <span className="text-violet-600">Your Control</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Manage your privacy, share feedback, and track your skin improvement journey — all in one place.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* TAB 1: PRIVACY & DATA */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === 'privacy' && (
          <div className="space-y-8">
            {/* Privacy Score Banner */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-8 text-white">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <div className="text-6xl font-black text-yellow-300 mb-2">
                    {privacyReport.privacyScore}
                  </div>
                  <p className="text-sm text-white/70">Privacy Score</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">{storageInfo.health.healthy ? '✅' : '⚠️'}</div>
                  <p className="text-sm text-white/70">Storage: {storageInfo.size}</p>
                  <p className="text-xs text-white/50">{storageInfo.health.message}</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-400 mb-2">
                    {privacyReport.dataStored.length}
                  </div>
                  <p className="text-sm text-white/70">Data Categories Stored</p>
                </div>
              </div>
            </div>

            {/* Consent Management */}
            <ConsentCheckbox
              onConsentChange={() => { refreshData(); }}
            />

            {/* Data Stored */}
            {privacyReport.dataStored.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Eye size={20} /> Stored Data Overview
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {privacyReport.dataStored.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                            {item.count}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{item.type}</p>
                            <p className="text-xs text-gray-500">Size: {item.size}</p>
                          </div>
                        </div>
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* User Rights */}
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
              <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <Shield size={20} /> Your Privacy Rights
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {privacyReport.userRights.map((right, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    {right}
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Recommendations */}
            {privacyReport.recommendations.length > 0 && (
              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <Info size={20} /> Privacy Recommendations
                </h3>
                <ul className="space-y-2">
                  {privacyReport.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                      <Zap size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Retention Policy */}
            <div className="bg-violet-50 rounded-2xl border border-violet-200 p-6">
              <h3 className="font-bold text-violet-800 mb-3 flex items-center gap-2">
                <Lock size={20} /> Data Retention Policy
              </h3>
              <p className="text-sm text-violet-700">{privacyReport.retentionPolicy}</p>
            </div>

            {/* Data Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h3 className="font-bold text-gray-800">Data Management</h3>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-4">
                {/* Export */}
                <button
                  onClick={downloadDataExport}
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-50 text-blue-700 rounded-xl border-2 border-blue-200 hover:bg-blue-100 transition-all font-semibold"
                >
                  <Download size={22} />
                  Export All Data (JSON)
                </button>

                {/* Delete Records */}
                <button
                  onClick={() => handleDelete('records')}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 font-semibold transition-all ${
                    deleteConfirm === 'records'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Trash2 size={22} />
                  {deleteConfirm === 'records' ? 'Click Again to Confirm' : 'Delete Analysis Records'}
                </button>

                {/* Delete Feedback */}
                <button
                  onClick={() => handleDelete('feedback')}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 font-semibold transition-all ${
                    deleteConfirm === 'feedback'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Trash2 size={22} />
                  {deleteConfirm === 'feedback' ? 'Click Again to Confirm' : 'Delete Feedback Data'}
                </button>

                {/* Delete All */}
                <button
                  onClick={() => handleDelete('all')}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 font-semibold transition-all ${
                    deleteConfirm === 'all'
                      ? 'bg-red-700 text-white border-red-700'
                      : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  }`}
                >
                  <Trash2 size={22} />
                  {deleteConfirm === 'all' ? '⚠️ CLICK AGAIN TO DELETE EVERYTHING' : 'Delete ALL Data'}
                </button>
              </div>
              {deleteConfirm !== 'none' && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-rose-600 text-center">
                    ⚠️ This action cannot be undone. Click the same button again to confirm.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* TAB 2: FEEDBACK */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === 'feedback' && (
          <div className="space-y-8">
            {/* Feedback Stats Banner */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-8 text-white">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-4xl font-black text-yellow-300">{feedbackStats.totalFeedback}</div>
                  <p className="text-sm text-white/70">Total Reviews</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Star size={24} className="text-yellow-300 fill-yellow-300" />
                    <span className="text-4xl font-black">{feedbackStats.averageRating}</span>
                  </div>
                  <p className="text-sm text-white/70">Average Rating</p>
                </div>
                <div>
                  <div className="text-4xl font-black text-emerald-300">{feedbackStats.positiveCount}</div>
                  <p className="text-sm text-white/70">Positive</p>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    feedbackStats.trendDirection === 'improving' ? 'text-emerald-300' :
                    feedbackStats.trendDirection === 'declining' ? 'text-rose-300' : 'text-yellow-300'
                  }`}>
                    {feedbackStats.trendDirection === 'improving' ? '📈 Improving' :
                     feedbackStats.trendDirection === 'declining' ? '📉 Declining' : '➡️ Stable'}
                  </div>
                  <p className="text-sm text-white/70">Satisfaction Trend</p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            {feedbackStats.totalFeedback > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 size={20} /> Rating Distribution
                </h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = feedbackStats.ratingDistribution[star] || 0;
                    const percent = feedbackStats.totalFeedback > 0 ? (count / feedbackStats.totalFeedback) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm font-medium">{star}</span>
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        </div>
                        <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit Feedback */}
            <FeedbackForm
              module="privacy"
              userSkinType={detectedSkinType}
              onSubmit={handleFeedbackSubmit}
            />

            {/* Feedback History */}
            {feedbackEntries.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <MessageSquare size={20} /> Feedback History ({feedbackEntries.length})
                  </h3>
                  <button onClick={refreshData} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <RefreshCw size={16} className="text-gray-500" />
                  </button>
                </div>
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {[...feedbackEntries].reverse().map(entry => {
                    const moduleInfo = MODULE_LABELS[entry.module] || { label: entry.module, emoji: '📋' };
                    return (
                      <div key={entry._id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span>{moduleInfo.emoji}</span>
                            <span className="text-sm font-medium text-gray-700">{moduleInfo.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} size={14} className={s <= entry.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
                              ))}
                            </div>
                            <button
                              onClick={() => { deleteFeedback(entry._id); refreshData(); }}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                        {entry.comment && <p className="text-sm text-gray-600 mb-2">"{entry.comment}"</p>}
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>{entry.category}</span>
                          <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                          {entry.foundAccurate !== undefined && (
                            <span className={entry.foundAccurate ? 'text-emerald-500' : 'text-rose-500'}>
                              {entry.foundAccurate ? '✓ Accurate' : '✗ Inaccurate'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* TAB 3: PROGRESS TRACKING */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === 'progress' && (
          <div className="space-y-8">
            {/* Progress Score Banner */}
            <div className={`rounded-2xl p-8 text-white ${
              progressDashboard.direction === 'improving' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' :
              progressDashboard.direction === 'declining' ? 'bg-gradient-to-r from-rose-600 to-pink-600' :
              'bg-gradient-to-r from-blue-600 to-indigo-600'
            }`}>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                <div>
                  <div className="text-5xl font-black text-yellow-300">{progressDashboard.overallProgress}</div>
                  <p className="text-sm text-white/70">Progress Score</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-1">
                    {progressDashboard.direction === 'improving' ? '📈' :
                     progressDashboard.direction === 'declining' ? '📉' : '➡️'}
                  </div>
                  <p className="text-sm text-white/70 capitalize">{progressDashboard.direction}</p>
                </div>
                <div>
                  <div className="text-4xl font-black text-yellow-300">{progressDashboard.totalRecords}</div>
                  <p className="text-sm text-white/70">Total Scans</p>
                </div>
                <div>
                  <div className="text-4xl font-black text-yellow-300">{progressDashboard.streakWeeks}</div>
                  <p className="text-sm text-white/70">Week Streak</p>
                </div>
                <div>
                  <div className="text-4xl font-black text-yellow-300">{progressDashboard.skinAgeEstimate}</div>
                  <p className="text-sm text-white/70">Est. Skin Age</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm">
                  <Activity size={16} />
                  Tracking confidence: {progressDashboard.trackingConfidence}%
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <Target size={24} className="text-violet-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{progressDashboard.trends.length}</p>
                <p className="text-xs text-gray-500">Metrics Tracked</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <Trophy size={24} className="text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{progressDashboard.milestones.length}</p>
                <p className="text-xs text-gray-500">Achievements</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <Calendar size={24} className="text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{progressDashboard.weeklySummaries.length}</p>
                <p className="text-xs text-gray-500">Weeks Tracked</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <Heart size={24} className="text-rose-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">
                  {progressDashboard.insights.filter(i => i.type === 'positive').length}
                </p>
                <p className="text-xs text-gray-500">Positive Insights</p>
              </div>
            </div>

            {/* No Data State */}
            {progressDashboard.totalRecords === 0 && (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Progress Data Yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Start by analyzing your skin through any of our tools. Enable progress tracking in the Privacy tab to save your results.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
                  >
                    <Sparkles size={18} className="inline mr-2" />
                    Complete Analysis
                  </button>
                  <button
                    onClick={() => navigate('/simple-analysis')}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all"
                  >
                    Quick Analysis
                  </button>
                </div>
              </div>
            )}

            {/* Insights */}
            {progressDashboard.insights.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Sparkles size={20} /> Smart Insights
                  </h3>
                </div>
                <div className="p-6 space-y-3">
                  {progressDashboard.insights.map((insight, i) => (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${
                      insight.type === 'positive' ? 'bg-emerald-50 border-emerald-200' :
                      insight.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                      insight.type === 'milestone' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <span className="text-xl">{insight.emoji}</span>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          insight.type === 'positive' ? 'text-emerald-700' :
                          insight.type === 'warning' ? 'text-amber-700' :
                          insight.type === 'milestone' ? 'text-yellow-700' :
                          'text-blue-700'
                        }`}>
                          {insight.text}
                        </p>
                      </div>
                      {insight.type === 'milestone' && (
                        <Award size={18} className="text-yellow-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trends */}
            {progressDashboard.trends.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp size={20} /> Metric Trends
                  </h3>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-4">
                  {progressDashboard.trends.map((trend, i) => (
                    <TrendCard key={i} trend={trend} />
                  ))}
                </div>
              </div>
            )}

            {/* Milestones */}
            {progressDashboard.milestones.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Trophy size={20} /> Achievements ({progressDashboard.milestones.length})
                  </h3>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-4">
                  {progressDashboard.milestones.map((ms) => (
                    <div key={ms._id} onClick={() => ms.isNew && handleMilestoneSeen(ms._id)} className="cursor-pointer">
                      <MilestoneCard milestone={ms} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weekly Summaries */}
            {progressDashboard.weeklySummaries.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Calendar size={20} /> Weekly Summaries
                  </h3>
                </div>
                <div className="p-6 space-y-3">
                  {progressDashboard.weeklySummaries.map((summary, i) => (
                    <WeeklySummaryCard key={i} summary={summary} />
                  ))}
                </div>
              </div>
            )}

            {/* Navigate to Enhanced Progress Page */}
            <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-3">Want More Progress Features?</h3>
              <p className="text-white/80 mb-6">
                Visit the dedicated Progress Tracking page for image uploads, before/after comparisons, and lifestyle impact analysis.
              </p>
              <button
                onClick={() => navigate('/progress')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg hover:bg-yellow-300 transition-all shadow-xl hover:-translate-y-1"
              >
                <TrendingUp size={24} />
                Open Progress Tracker
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            <ArrowLeft size={18} className="inline mr-2" /> Home
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
          >
            <Sparkles size={18} className="inline mr-2" /> Complete Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyDashboardPage;
