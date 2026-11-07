import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export default function SearchBar({
  searchQuery,
  onSearchChange,
  activeDietary,
  onDietaryChange
}) {
  const dietaryOptions = [
    { label: 'All Diets', value: 'All' },
    { label: 'Vegetarian Only', value: 'Vegetarian' },
    { label: 'Non-Veg Only', value: 'Non-Vegetarian' }
  ];

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
      {/* Search Input Box */}
      <div className="relative w-full md:flex-1">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-amber-500/70" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by dish name, truffle, steak, pasta, dessert..."
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-dark-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dietary Fast Filter */}
      <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto">
        {dietaryOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onDietaryChange(opt.value)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
              activeDietary === opt.value
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                : 'bg-dark-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

