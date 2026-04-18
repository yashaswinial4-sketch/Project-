import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Heart, Sparkles, CheckCircle2, Target, Brain, ClipboardList, Camera } from 'lucide-react';

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
            </div>
          </div>
        </div>
      </section>

      {/* Skin Type Detection Feature Highlight */}
      <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-4">
                  <Brain size={14} /> NEW FEATURE — Task 2
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  Don't Know Your Skin Type?
                </h2>
                <p className="text-white/80 text-lg mb-6">
                  Most people use products meant for the wrong skin type. Our smart detection system identifies your skin type through an 8-question quiz or photo analysis — then auto-fills it into your routine analysis.
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
                icon: '⚠️',
                title: 'Unknown Skin Type',
                desc: 'Most people don\'t actually know their skin type, choosing products that worsen their condition instead of helping.'
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
              How Our Smart Solution Works
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Three simple steps to a safer, more effective skincare routine.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Target size={32} />,
                title: 'Detect Skin Type',
                desc: 'Take our 8-question quiz or upload a photo to identify your skin type automatically.',
                color: 'bg-violet-100 text-violet-600',
                action: () => navigate('/skin-type'),
              },
              {
                icon: <Shield size={32} />,
                title: 'Analyze Products',
                desc: 'Enter your current skincare products and we\'ll detect harmful ingredient combinations.',
                color: 'bg-emerald-100 text-emerald-600',
                action: () => navigate('/analyze'),
              },
              {
                icon: <Zap size={32} />,
                title: 'Detect Conflicts',
                desc: 'Our rule-based engine checks 14+ ingredient conflict rules and skin type compatibility.',
                color: 'bg-amber-100 text-amber-600',
                action: () => navigate('/analyze'),
              },
              {
                icon: <Heart size={32} />,
                title: 'Get Safe Alternatives',
                desc: 'Receive personalized recommendations for safer product alternatives.',
                color: 'bg-rose-100 text-rose-600',
                action: () => navigate('/analyze'),
              },
            ].map((item, i) => (
              <div
                key={i}
                onClick={item.action}
                className="bg-white rounded-3xl p-6 border-2 border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
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
              { value: '25+', label: 'Ingredients Tracked' },
              { value: '4', label: 'Skin Types Covered' },
              { value: '2', label: 'Detection Methods' },
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
              Ready to Fix Your Skincare Routine?
            </h2>
            <p className="text-xl text-gray-500 mb-8 max-w-xl mx-auto">
              Start by detecting your skin type, then analyze your products for harmful combinations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/skin-type')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-violet-600 text-white rounded-2xl font-bold text-lg hover:bg-violet-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <Target size={22} />
                Detect Skin Type First
              </button>
              <button
                onClick={() => navigate('/analyze')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Start Free Analysis
                <ArrowRight size={24} />
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
            Task 1: Ingredient Conflict Detection • Task 2: Skin Type Detection System
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
