import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Sparkles, CheckCircle2, Target, Brain, ClipboardList, Camera, AlertTriangle, Activity, Droplets } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} /> AI-Powered Skincare Analysis
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Your Skin Deserves
              <br />
              <span className="text-yellow-300">Personalized Care</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10">
              Stop guessing. Stop damaging your skin. Get instant analysis of your skincare routine with our intelligent ingredient conflict detection system.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/analyze')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-emerald-700 rounded-2xl font-bold text-lg hover:bg-yellow-300 hover:text-emerald-800 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1"
              >
                Analyze Your Routine
                <ArrowRight size={24} />
              </button>
              <button
                onClick={() => navigate('/skin-type')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 border-2 border-white/30"
              >
                <Target size={22} />
                Detect My Skin Type
              </button>
              <button
                onClick={() => navigate('/acne-risk')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-rose-300/50"
              >
                <AlertTriangle size={22} />
                Predict Acne Risk
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Skin Type Detection Feature Highlight */}
      <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-4">
                  <Brain size={14} /> TASK 2 — Skin Type Detection
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  Don't Know Your Skin Type?
                </h2>
                <p className="text-white/80 text-lg mb-6">
                  Most people use products meant for the wrong skin type. Our smart detection system identifies your skin type through an 8-question quiz or photo analysis.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                    <ClipboardList size={18} className="text-yellow-300" />
                    <span className="text-sm font-medium">8-Question Smart Quiz</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                    <Camera size={18} className="text-yellow-300" />
                    <span className="text-sm font-medium">Photo Analysis</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                    <Zap size={18} className="text-yellow-300" />
                    <span className="text-sm font-medium">Auto-Integration</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => navigate('/skin-type')}
                  className="flex items-center gap-3 px-8 py-5 bg-white text-purple-700 rounded-2xl font-bold text-lg hover:bg-yellow-300 hover:text-purple-800 transition-all duration-300 shadow-2xl hover:-translate-y-1"
                >
                  <Target size={24} />
                  Find My Skin Type
                  <ArrowRight size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Acne Risk Prediction Feature Highlight */}
          <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-4">
                  <Activity size={14} /> TASK 3 — Acne Risk Prediction
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  Why Do You Keep Breaking Out?
                </h2>
                <p className="text-white/80 text-lg mb-6">
                  Many users get acne due to wrong routines or products. Our advanced prediction engine analyzes 12+ daily habits, product ingredients, and routine gaps to predict your acne risk score.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                    <Activity size={18} className="text-yellow-300" />
                    <span className="text-sm font-medium">12+ Habit Factors</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                    <Droplets size={18} className="text-yellow-300" />
                    <span className="text-sm font-medium">30+ Ingredient Checks</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                    <Shield size={18} className="text-yellow-300" />
                    <span className="text-sm font-medium">Personalized Tips</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => navigate('/acne-risk')}
                  className="flex items-center gap-3 px-8 py-5 bg-white text-rose-700 rounded-2xl font-bold text-lg hover:bg-yellow-300 hover:text-rose-800 transition-all duration-300 shadow-2xl hover:-translate-y-1"
                >
                  <AlertTriangle size={24} />
                  Predict My Acne Risk
                  <ArrowRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
              The Problem With Your Current Routine
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Most people use skincare products without understanding compatibility — leading to damage, breakouts, and wasted money.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎲',
                title: 'Random Product Usage',
                desc: 'People apply products without understanding ingredient compatibility, leading to acne, irritation, and skin damage.'
              },
              {
                icon: '🤷',
                title: 'No Personalized Guidance',
                desc: 'Especially students and young adults lack access to dermatologist advice and personalized skincare recommendations.'
              },
              {
                icon: '🔴',
                title: 'Hidden Acne Triggers',
                desc: 'Daily habits like poor sleep, high sugar diet, and not removing makeup are silently causing your breakouts.'
              }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
              Three Powerful Tools for Your Skin
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Detect, analyze, and predict — everything you need for a safer skincare routine.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target size={36} />,
                title: 'Skin Type Detection',
                desc: 'Take our 8-question quiz or upload a photo to identify your skin type automatically.',
                color: 'bg-violet-100 text-violet-600',
                border: 'hover:border-violet-200',
                action: () => navigate('/skin-type'),
                tag: 'Task 2',
                tagColor: 'bg-violet-100 text-violet-700',
              },
              {
                icon: <Shield size={36} />,
                title: 'Product Analysis',
                desc: 'Enter your current skincare products and we\'ll detect harmful ingredient combinations.',
                color: 'bg-emerald-100 text-emerald-600',
                border: 'hover:border-emerald-200',
                action: () => navigate('/analyze'),
                tag: 'Task 1',
                tagColor: 'bg-emerald-100 text-emerald-700',
              },
              {
                icon: <AlertTriangle size={36} />,
                title: 'Acne Risk Prediction',
                desc: 'Analyze habits, products, and routine gaps to predict your acne risk with personalized tips.',
                color: 'bg-rose-100 text-rose-600',
                border: 'hover:border-rose-200',
                action: () => navigate('/acne-risk'),
                tag: 'Task 3',
                tagColor: 'bg-rose-100 text-rose-700',
              },
            ].map((item, i) => (
              <div
                key={i}
                onClick={item.action}
                className={`bg-white rounded-3xl p-8 border-2 border-gray-100 ${item.border} hover:shadow-xl transition-all duration-300 cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.tagColor}`}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-emerald-600 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '14+', label: 'Conflict Rules' },
              { value: '30+', label: 'Ingredients Tracked' },
              { value: '12+', label: 'Habit Factors' },
              { value: '3', label: 'Smart Tools' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-black text-yellow-300 mb-2">{stat.value}</div>
                <div className="text-emerald-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-12 border-2 border-emerald-100">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
              Ready to Transform Your Skincare?
            </h2>
            <p className="text-xl text-gray-500 mb-8 max-w-xl mx-auto">
              Start with any of our three powerful tools — or use all of them for the complete experience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/skin-type')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-violet-600 text-white rounded-2xl font-bold text-lg hover:bg-violet-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <Target size={22} />
                Detect Skin Type
              </button>
              <button
                onClick={() => navigate('/analyze')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Analyze Products
                <ArrowRight size={24} />
              </button>
              <button
                onClick={() => navigate('/acne-risk')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-rose-600 text-white rounded-2xl font-bold text-lg hover:bg-rose-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <AlertTriangle size={22} />
                Predict Acne Risk
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-400">
              <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500" /> No signup required</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500" /> Instant results</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500" /> 100% free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🧴</span>
            <span className="text-white font-bold text-lg">AI Skincare Advisor</span>
          </div>
          <p className="text-sm">
            Task 1: Ingredient Conflict Detection • Task 2: Skin Type Detection • Task 3: Acne Risk Prediction
          </p>
          <p className="text-xs mt-4 text-gray-600">
            Built with React + Express + MongoDB • MERN Stack
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
