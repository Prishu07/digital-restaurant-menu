import React, { useState, useMemo } from 'react';
import FoodCard from '../components/FoodCard';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import { UtensilsCrossed, RefreshCw } from 'lucide-react';

export default function MenuSection({ categories, items, isLoading }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDietary, setActiveDietary] = useState('All');

  // Compute item counts per category
  const itemCounts = useMemo(() => {
    const counts = { All: items.length };
    categories.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = items.filter((it) => it.category === cat).length;
      }
    });
    return counts;
  }, [categories, items]);

  // Filter items dynamically based on category, search string, and dietary choice
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category match
      const matchCategory =
        activeCategory === 'All' ||
        item.category.toLowerCase() === activeCategory.toLowerCase();

      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      // Dietary match
      const matchDietary =
        activeDietary === 'All' ||
        item.dietary.toLowerCase() === activeDietary.toLowerCase();

      return matchCategory && matchSearch && matchDietary;
    });
  }, [items, activeCategory, searchQuery, activeDietary]);

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setActiveDietary('All');
  };

  return (
    <section id="menu" className="py-24 bg-dark-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Interactive Digital Menu</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Explore Our Culinary Offerings
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Every dish is prepared to order using authentic traditions and finest farm-picked ingredients. Use categories or search to explore.
          </p>
        </div>

        {/* Filter & Search Controls Bar */}
        <div className="space-y-6 mb-12">
          {/* Real-time Search & Fast Dietary Switcher */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeDietary={activeDietary}
            onDietaryChange={setActiveDietary}
          />

          {/* Category Tabs */}
          <div className="pt-2">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              itemCounts={itemCounts}
            />
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
          <span>
            Showing <strong className="text-white">{filteredItems.length}</strong> of{' '}
            <strong className="text-white">{items.length}</strong> items
          </span>
          {(activeCategory !== 'All' || searchQuery !== '' || activeDietary !== 'All') && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-dark-850 rounded-2xl h-96 border border-slate-800 animate-shimmer"
              />
            ))}
          </div>
        )}

        {/* Menu Cards Grid */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-16 px-4 bg-dark-950/50 rounded-2xl border border-slate-800 max-w-lg mx-auto">
            <UtensilsCrossed className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-white mb-2">No Matching Dishes Found</h3>
            <p className="text-slate-400 text-sm mb-6">
              We couldn't find any dish matching "{searchQuery || activeCategory}". Try searching for another flavor or reset your filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-sm shadow transition-colors"
            >
              View Full Menu
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

