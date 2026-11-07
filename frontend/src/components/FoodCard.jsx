import React, { useState } from 'react';
import { Star, Flame, Clock, Sparkles, AlertCircle } from 'lucide-react';

export default function FoodCard({ item }) {
  const [imgSrc, setImgSrc] = useState(item.imageUrl || item.fallbackImage);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Handle fallback if S3 URL or external URL fails
  const handleImageError = () => {
    if (!imgError && item.fallbackImage && imgSrc !== item.fallbackImage) {
      setImgSrc(item.fallbackImage);
    } else {
      setImgError(true);
    }
  };

  // Dietary badge styling
  const getDietaryBadge = (diet) => {
    switch (diet) {
      case 'Vegetarian':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Veg</span>
          </span>
        );
      case 'Vegan':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            <span>Vegan</span>
          </span>
        );
      case 'Gluten-Free':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-500/30">
            <span>GF</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Non-Veg</span>
          </span>
        );
    }
  };

  return (
    <div className="group bg-dark-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 flex flex-col justify-between">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[16/10] overflow-hidden bg-dark-850">
          
          {/* Skeleton loader while image is buffering */}
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 bg-dark-800 animate-shimmer" />
          )}

          {imgError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-dark-800 text-slate-400 p-4 text-center">
              <AlertCircle className="w-8 h-8 text-amber-500/60 mb-1" />
              <span className="text-xs">{item.name}</span>
            </div>
          ) : (
            <img
              src={imgSrc}
              alt={item.name}
              onLoad={() => setImgLoaded(true)}
              onError={handleImageError}
              loading="lazy"
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-black/30 pointer-events-none" />

          {/* Badges on Top */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {item.isChefSpecial && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-dark-950 shadow-md">
                  <Sparkles className="w-3 h-3 fill-current" />
                  <span>Chef's Choice</span>
                </span>
              )}
              {item.isPopular && !item.isChefSpecial && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/90 text-dark-950 shadow-md">
                  <span>Popular</span>
                </span>
              )}
            </div>

            {/* Dietary Badge */}
            <div>{getDietaryBadge(item.dietary)}</div>
          </div>

          {/* Category Tag & Rating at Bottom of Image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
            <span className="px-2 py-0.5 rounded-md bg-dark-950/80 backdrop-blur-sm border border-slate-700/60 font-medium">
              {item.category}
            </span>
            {item.rating && (
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-dark-950/80 backdrop-blur-sm border border-slate-700/60 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{item.rating}</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
              {item.name}
            </h3>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>

      {/* Footer Info: Prep Time, Spicy Meter, and Price */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          {item.prepTime && (
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.prepTime}</span>
            </span>
          )}
          {item.spicyLevel > 0 && (
            <span className="flex items-center space-x-0.5 text-rose-400" title={`Spiciness Level: ${item.spicyLevel}/3`}>
              {Array.from({ length: item.spicyLevel }).map((_, i) => (
                <Flame key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </span>
          )}
        </div>

        {/* Price Tag */}
        <div className="text-right">
          <span className="text-xs text-slate-400 block -mb-1">Price</span>
          <span className="font-serif text-xl sm:text-2xl font-bold text-amber-400">
            ${item.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

