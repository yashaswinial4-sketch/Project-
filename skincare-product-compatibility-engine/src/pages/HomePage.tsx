import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

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
            <button
              onClick={() => navigate('/analyze')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-emerald-700 rounded-2xl font-bold text-lg hover:bg-yellow-300 hover:text-emerald-800 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1"
            >
              Analyze Your Routine
              <ArrowRight size={24} />
            </button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield size={32} />,
                title: 'Analyze Your Products',
                desc: 'Enter your current skincare products and we\'ll detect harmful ingredient combinations, skin type mismatches, and overuse of actives.',
                color: 'bg-emerald-100 text-emerald-600'
              },
              {
                icon: <Zap size={32} />,
                title: 'Detect Conflicts',
                desc: 'Our rule-based engine checks 14+ ingredient conflict rules, skin type compatibility, and sensitivity filters to flag dangerous combinations.',
                color: 'bg-amber-100 text-amber-600'
              },
              {
                icon: <Heart size={32} />,
                title: 'Get Safe Alternatives',
                desc: 'Receive personalized recommendations for safer product alternatives and ingredients that work best for your specific skin type.',
                color: 'bg-rose-100 text-rose-600'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                  {item.icon}
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
              { value: '25+', label: 'Ingredients Tracked' },
              { value: '4', label: 'Skin Types Covered' },
              { value: '100%', label: 'Rule-Based Analysis' },
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
              It takes less than 2 minutes to analyze your entire routine and discover harmful combinations.
            </p>
            <button
              onClick={() => navigate('/analyze')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Start Free Analysis
              <ArrowRight size={24} />
            </button>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400">
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
            Task 1: Prevent harmful product combinations • Rule-based ingredient analysis
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
