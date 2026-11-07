import React from 'react';
import { ChefHat, Leaf, Wine, Sparkles } from 'lucide-react';

export default function IntroSection({ restaurant, media }) {
  const introImg = media?.introImage?.url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80';

  const highlights = [
    {
      icon: Leaf,
      title: 'Locally Sourced Organic',
      desc: 'Partnered with regional organic farmers to source seasonal produce harvested at peak flavor.'
    },
    {
      icon: ChefHat,
      title: 'Master Culinary Team',
      desc: 'Decades of European and world culinary expertise bringing precision to every plate.'
    },
    {
      icon: Wine,
      title: 'Curated Cellar & Mixology',
      desc: 'Exclusive wine pairings and artisanal hand-crafted cocktails smoked with oak wood.'
    },
    {
      icon: Sparkles,
      title: 'Exquisite Ambience',
      desc: 'Intimate candlelit interiors crafted for celebratory moments, anniversaries, and evenings.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-dark-900 border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image Collage & Chef Badge */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl">
              <img
                src={introImg}
                alt={media?.introImage?.alt || "Executive Chef in Kitchen"}
                className="w-full h-[450px] sm:h-[520px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
            </div>

            {/* Overlapping Floating Experience Badge */}
            <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:right-6 bg-dark-950/95 border border-amber-500/40 p-5 rounded-2xl shadow-xl backdrop-blur-md max-w-[260px]">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <ChefHat className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-white text-base">Executive Chef</h4>
                  <p className="text-xs text-amber-400">Master of Gastronomy</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                "Every dish tells a story of tradition, reinvention, and respect for ingredients."
              </p>
            </div>
          </div>

          {/* Right Column: Text & Features */}
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <span>Our Heritage & Philosophy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
              Crafting Unforgettable Flavors Since 2012
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6 font-light">
              {restaurant?.story}
            </p>

            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              At L'Aura Bistro, we celebrate the communion of nature, art, and gathering. Our kitchen runs on pure passion—from 48-hour slow fermentations to delicate reduction sauces, ensuring an elevated sensory journey with every forkful.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-dark-950/60 border border-slate-800/80 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-sm text-white">{item.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

