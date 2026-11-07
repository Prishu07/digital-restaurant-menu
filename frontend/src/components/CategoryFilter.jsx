import React from 'react';

export default function CategoryFilter({ categories, activeCategory, onSelectCategory, itemCounts }) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none py-1">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        const count = itemCounts ? itemCounts[category] : null;

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
              isActive
                ? 'bg-amber-500 text-dark-950 font-bold shadow-lg shadow-amber-500/20 scale-105'
                : 'bg-dark-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <span>{category}</span>
            {count !== undefined && count !== null && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-dark-950/20 text-dark-950 font-bold'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

