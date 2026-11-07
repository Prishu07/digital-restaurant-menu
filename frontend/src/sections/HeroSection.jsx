import React from 'react';
import { ChevronDown, Sparkles, Compass, ShieldCheck } from 'lucide-react';

export default function HeroSection({ restaurant, media }) {
  const heroBg = media?.heroBanner?.url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80';

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt={media?.heroBanner?.alt || "Restaurant Dining"}
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/80 to-dark-950/40" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-dark-950/60 to-dark-950" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Michelin-inspired Subheading Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Artisanal Gastronomy & Prime Dining</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.15] mb-6">
          A Culinary Journey of <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
            Flavor, Passion & Art
          </span>
        </h1>

        {/* Subtitle / Story Brief */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-light mb-10">
          {restaurant?.story || "Welcome to L'Aura Bistro. Experience farm-to-table culinary masterpieces, aged prime steaks, fresh oceanic catches, and handcrafted cocktails in an atmosphere of warmth and elegance."}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#menu"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-dark-950 text-base font-bold shadow-xl shadow-amber-500/20 hover:scale-105 transition-all text-center"
          >
            Explore Digital Menu
          </a>
          <a
            href="#video"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-dark-900/80 hover:bg-dark-850 text-slate-200 hover:text-white border border-slate-700/80 hover:border-amber-500/50 text-base font-semibold backdrop-blur-sm transition-all text-center flex items-center justify-center space-x-2"
          >
            <span>Watch Kitchen Story</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-14 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-400 text-xs sm:text-sm">
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl font-bold text-white">100%</span>
            <span className="text-slate-400">Farm Fresh Ingredients</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl font-bold text-amber-400">4.9 ★</span>
            <span className="text-slate-400">Over 1,200 Reviews</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl font-bold text-white">14+</span>
            <span className="text-slate-400">Signature Recipes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl font-bold text-amber-400">Private</span>
            <span className="text-slate-400">Dining Available</span>
          </div>
        </div>

      </div>

      {/* Floating Scroll Down Arrow */}
      <a
        href="#about"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-full text-slate-400 hover:text-amber-400 transition-colors animate-bounce"
        aria-label="Scroll to about"
      >
        <ChevronDown className="w-6 h-6" />
      </a>
    </section>
  );
}

