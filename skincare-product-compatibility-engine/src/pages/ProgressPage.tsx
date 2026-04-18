import React, { useState, useCallback } from 'react';
import { ArrowLeft, Camera, TrendingUp, TrendingDown, Minus, Sparkles, Upload, Calendar, Droplets, Moon, UtensilsCrossed, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SkinRecord, ProgressComparison, LifestyleData, LifestyleImpact } from '../types';
import { calculateLifestyleImpact } from '../logic/lifestyleImpact';
import { preprocessImage, analyzePreprocessedImage } from '../logic/imageProcessing';

const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<SkinRecord[]>(() => {
    const saved = localStorage.getItem('skinRecords');
    return saved ? JSON.parse(saved) : [];
  });
  const [showUpload, setShowUpload] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [comparison, setComparison] = useState<ProgressComparison | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedBefore, setSelectedBefore] = useState<string>('');
  const [selectedAfter, setSelectedAfter] = useState<string>('');
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  // Lifestyle form state
  const [lifestyleData, setLifestyleData] = useState<LifestyleData>({
    sleepHours: 7, waterIntake: 8, dietQuality: 'average',
    stressLevel: 'moderate', exerciseDays: 3, alcoholConsumption: 'none',
    smokingStatus: 'non-smoker', screenTime: 6,
  });
  const [lifestyleImpact, setLifestyleImpact] = useState<LifestyleImpact | null>(null);

  const saveRecords = useCallback((newRecords: SkinRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem('skinRecords', JSON.stringify(newRecords));
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    try {
      const result = await preprocessImage(file);
      const analysis = analyzePreprocessedImage(result.metrics);

      const newRecord: SkinRecord = {
        _id: Date.now().toString(),
        date: new Date().toISOString(),
        skinType: analysis.skinType as any,
        imageUrl: result.processedUrl,
        imageMetrics: result.metrics,
        lifestyleData: { ...lifestyleData },
        notes: `Quality: ${result.quality} | Steps: ${result.preprocessingSteps.length}`,
      };

      const updated = [...records, newRecord];
      saveRecords(updated);
      setShowUpload(false);
    } catch (err) {
      console.error('Image processing failed:', err);
    }
    setProcessing(false);
  };

  const handleCalculateLifestyle = () => {
    const impact = calculateLifestyleImpact(lifestyleData);
    setLifestyleImpact(impact);
  };

  const handleCompare = () => {
    if (!selectedBefore || !selectedAfter) return;
    const before = records.find(r => r._id === selectedBefore);
    const after = records.find(r => r._id === selectedAfter);
    if (!before || !after) return;

    const comp = compareRecords(before, after);
    setComparison(comp);
  };

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r._id !== id);
    saveRecords(updated);
    if (selectedBefore === id) setSelectedBefore('');
    if (selectedAfter === id) setSelectedAfter('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Back Button */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-8">
          <ArrowLeft size={20} /> Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
            <Sparkles size={16} /> Task 4: Progress Tracking
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-800 mb-3">
            Track Your <span className="text-indigo-600">Skin Progress</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Upload skin photos over time, track improvements, compare before & after, and see how lifestyle affects your skin.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <button onClick={() => setShowUpload(!showUpload)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg">
            <Camera size={18} /> {showUpload ? 'Cancel Upload' : 'Upload Photo'}
          </button>
          <button onClick={() => setCompareMode(!compareMode)} className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg">
            <TrendingUp size={18} /> {compareMode ? 'Cancel Compare' : 'Compare Records'}
          </button>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <div className="bg-white rounded-3xl border-2 border-indigo-100 p-8 mb-8 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Upload size={22} className="text-indigo-600" /> Upload & Analyze Skin Photo
            </h3>

            {/* Lifestyle Data Section */}
            <div className="mb-6 p-4 bg-indigo-50 rounded-2xl">
              <h4 className="font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                <Activity size={18} /> Log Today's Lifestyle Data
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1 mb-1"><Moon size={12} /> Sleep (hrs)</label>
                  <input type="number" min={0} max={16} value={lifestyleData.sleepHours} onChange={e => setLifestyleData(p => ({ ...p, sleepHours: +e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1 mb-1"><Droplets size={12} /> Water (glasses)</label>
                  <input type="number" min={0} max={20} value={lifestyleData.waterIntake} onChange={e => setLifestyleData(p => ({ ...p, waterIntake: +e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1 mb-1"><UtensilsCrossed size={12} /> Diet</label>
                  <select value={lifestyleData.dietQuality} onChange={e => setLifestyleData(p => ({ ...p, dietQuality: e.target.value as any }))} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="poor">Poor</option><option value="average">Average</option><option value="good">Good</option><option value="excellent">Excellent</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1 mb-1">Stress</label>
                  <select value={lifestyleData.stressLevel} onChange={e => setLifestyleData(p => ({ ...p, stressLevel: e.target.value as any }))} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option>
                  </select>
                </div>
              </div>
              <button onClick={handleCalculateLifestyle} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
                Calculate Lifestyle Impact
              </button>
              {lifestyleImpact && (
                <div className="mt-4 p-4 bg-white rounded-xl border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${lifestyleImpact.overallScore >= 70 ? 'bg-green-500' : lifestyleImpact.overallScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                      {lifestyleImpact.overallScore}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Lifestyle Score</p>
                      <p className="text-sm text-gray-500">Higher is better for your skin</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                    {[
                      { label: 'Sleep', score: lifestyleImpact.sleepImpact.score },
                      { label: 'Hydration', score: lifestyleImpact.hydrationImpact.score },
                      { label: 'Diet', score: lifestyleImpact.dietImpact.score },
                      { label: 'Stress', score: lifestyleImpact.stressImpact.score },
                      { label: 'Exercise', score: lifestyleImpact.exerciseImpact.score },
                    ].map(item => (
                      <div key={item.label} className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="font-semibold">{item.label}</p>
                        <p className={`font-bold ${item.score >= 70 ? 'text-green-600' : item.score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>{item.score}%</p>
                      </div>
                    ))}
                  </div>
                  {lifestyleImpact.recommendations.length > 0 && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-xs font-semibold text-yellow-800 mb-1">Recommendations:</p>
                      {lifestyleImpact.recommendations.map((r, i) => <p key={i} className="text-xs text-yellow-700">• {r}</p>)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-8 text-center hover:border-indigo-500 transition-colors">
              <Camera size={48} className="mx-auto text-indigo-400 mb-4" />
              <p className="text-gray-600 mb-4">Upload a clear, well-lit photo of your face for skin analysis</p>
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors cursor-pointer">
                <Upload size={18} /> Choose Photo
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {processing && <p className="mt-4 text-indigo-600 animate-pulse">Processing image...</p>}
            </div>
            <p className="mt-3 text-xs text-gray-400 text-center">Tips: Use natural lighting, face the camera directly, no makeup for best results</p>
          </div>
        )}

        {/* Compare Mode */}
        {compareMode && (
          <div className="bg-white rounded-3xl border-2 border-purple-100 p-8 mb-8 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp size={22} className="text-purple-600" /> Compare Two Records
            </h3>
            {records.length < 2 ? (
              <p className="text-gray-500 text-center py-8">You need at least 2 records to compare. Upload more photos!</p>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">Before Record</label>
                    <select value={selectedBefore} onChange={e => setSelectedBefore(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm">
                      <option value="">Select before record...</option>
                      {records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(r => (
                        <option key={r._id} value={r._id!}>{new Date(r.date).toLocaleDateString()} — {r.skinType}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">After Record</label>
                    <select value={selectedAfter} onChange={e => setSelectedAfter(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm">
                      <option value="">Select after record...</option>
                      {records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(r => (
                        <option key={r._id} value={r._id!}>{new Date(r.date).toLocaleDateString()} — {r.skinType}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button onClick={handleCompare} disabled={!selectedBefore || !selectedAfter} className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Compare Now
                </button>
              </>
            )}
          </div>
        )}

        {/* Comparison Result */}
        {comparison && (
          <div className="bg-white rounded-3xl border-2 border-purple-200 p-8 mb-8 animate-slide-up">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp size={22} className="text-purple-600" /> Comparison Results
            </h3>

            {/* Overall Improvement */}
            <div className="flex items-center justify-center mb-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-black text-white ${comparison.improvementScore >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                {comparison.improvementScore > 0 ? '+' : ''}{comparison.improvementScore}%
              </div>
            </div>

            {/* Metrics Comparison */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(comparison.metricsComparison).map(([key, data]) => (
                <div key={key} className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{key}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-bold">{data.before}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-bold">{data.after}</span>
                  </div>
                  <div className="mt-1">
                    {data.change > 0 ? <TrendingUp size={14} className="inline text-green-500" /> : data.change < 0 ? <TrendingDown size={14} className="inline text-red-500" /> : <Minus size={14} className="inline text-gray-400" />}
                    <span className={`text-xs font-semibold ml-1 ${data.change > 0 ? 'text-green-600' : data.change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                      {data.change > 0 ? '+' : ''}{data.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Insights */}
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm font-semibold text-purple-800 mb-2">Insights:</p>
              {comparison.insights.map((insight, i) => (
                <p key={i} className="text-sm text-purple-700 mb-1">• {insight}</p>
              ))}
            </div>
          </div>
        )}

        {/* Records List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar size={22} className="text-indigo-600" /> Your Skin Records ({records.length})
          </h3>
          {records.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-12 text-center">
              <Camera size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No records yet. Upload your first skin photo to start tracking!</p>
            </div>
          ) : (
            records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => (
              <div key={record._id} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpandedRecord(expandedRecord === record._id ? null : record._id!)}>
                  {record.imageUrl && (
                    <img src={record.imageUrl} alt="Skin" className="w-16 h-16 rounded-xl object-cover" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 capitalize">{record.skinType}</span>
                      <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">{record.imageMetrics ? 'Image' : 'Manual'}</span>
                    </div>
                    <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={e => { e.stopPropagation(); deleteRecord(record._id!); }} className="p-2 text-red-400 hover:text-red-600 transition-colors" title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                    </button>
                    {expandedRecord === record._id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                  </div>
                </div>
                {expandedRecord === record._id && record.imageMetrics && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4 animate-fade-in">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {Object.entries(record.imageMetrics).map(([key, value]) => (
                        <div key={key} className="text-center p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 capitalize">{key}</p>
                          <p className="text-lg font-bold text-gray-800">{value}</p>
                        </div>
                      ))}
                    </div>
                    {record.lifestyleData && (
                      <div className="mt-4 p-3 bg-indigo-50 rounded-xl">
                        <p className="text-xs font-semibold text-indigo-800 mb-2">Lifestyle Data:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <p><Moon size={12} className="inline mr-1" />Sleep: {record.lifestyleData.sleepHours}h</p>
                          <p><Droplets size={12} className="inline mr-1" />Water: {record.lifestyleData.waterIntake}</p>
                          <p><UtensilsCrossed size={12} className="inline mr-1" />Diet: {record.lifestyleData.dietQuality}</p>
                          <p>Stress: {record.lifestyleData.stressLevel}</p>
                        </div>
                      </div>
                    )}
                    {record.notes && <p className="mt-3 text-xs text-gray-500">{record.notes}</p>}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ── Compare Two Records ──
function compareRecords(before: SkinRecord, after: SkinRecord): ProgressComparison {
  const bm = before.imageMetrics || { brightness: 150, redness: 10, saturation: 20, uniformity: 50, oiliness: 40, dryness: 40 };
  const am = after.imageMetrics || { brightness: 150, redness: 10, saturation: 20, uniformity: 50, oiliness: 40, dryness: 40 };

  const rednessChange = bm.redness - am.redness; // Lower redness = improvement
  const oilChange = bm.oiliness - am.oiliness;
  const drynessChange = bm.dryness - am.dryness;
  const uniformityChange = am.uniformity - bm.uniformity; // Higher uniformity = improvement
  const brightnessChange = am.brightness - bm.brightness;

  // Calculate improvement score
  let improvementScore = 0;
  if (rednessChange > 0) improvementScore += 25;
  if (uniformityChange > 0) improvementScore += 20;
  if (Math.abs(oilChange) < 10) improvementScore += 15; // More balanced
  if (Math.abs(drynessChange) < 10) improvementScore += 15;
  if (Math.abs(brightnessChange) < 20) improvementScore += 10; // More even
  if (before.skinType !== after.skinType) improvementScore += 15;

  const insights: string[] = [];
  if (rednessChange > 5) insights.push('Reduced redness — less inflammation and irritation');
  if (rednessChange < -5) insights.push('Increased redness — may indicate new sensitivity');
  if (uniformityChange > 10) insights.push('More even skin tone — better overall skin health');
  if (oilChange > 10) insights.push('Reduced oiliness — better oil control');
  if (oilChange < -10) insights.push('Increased oiliness — may need lighter products');
  if (drynessChange > 10) insights.push('Reduced dryness — better hydration');
  if (drynessChange < -10) insights.push('Increased dryness — may need more moisturizing');
  if (before.skinType !== after.skinType) insights.push(`Skin type changed from ${before.skinType} to ${after.skinType}`);
  if (insights.length === 0) insights.push('Minor changes detected — continue your current routine');

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

export default ProgressPage;
