import React from 'react';
import FoodCard from '../components/FoodCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function PopularDishesSection({ items }) {
  // Filter popular or chef special items (limit to 3 or 4)
  const popularDishes = items
    .filter(item => item.isChefSpecial || item.isPopular)
    .slice(0, 3);

  if (popularDishes.length === 0) return null;

  return (
    <section id="specials" className="py-24 bg-dark-950 relative overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Handpicked Masterpieces</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Chef's Signatures & Popular
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Our guests' most beloved creations, meticulously crafted with rare seasonal ingredients.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <a
              href="#menu"
              className="inline-flex items-center space-x-2 text-amber-400 hover:text-amber-300 font-semibold text-sm group"
            >
              <span>View complete menu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* 3 Highlighted Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularDishes.map((dish) => (
            <FoodCard key={dish.id} item={dish} />
          ))}
        </div>

      </div>
    </section>
  );
}

