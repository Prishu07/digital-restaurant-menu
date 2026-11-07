import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';
import IntroSection from './sections/IntroSection';
import PopularDishesSection from './sections/PopularDishesSection';
import MenuSection from './sections/MenuSection';
import PromoVideoSection from './sections/PromoVideoSection';
import OpeningHoursSection from './sections/OpeningHoursSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const [menuData, setMenuData] = useState({
    restaurant: null,
    categories: ['All'],
    items: []
  });
  const [mediaData, setMediaData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWebsiteData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Relative endpoints - works identically in dev (via Vite proxy) and production (via Express/Nginx)
      const [menuRes, mediaRes] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/media')
      ]);

      if (!menuRes.ok) {
        throw new Error(`Failed to load menu: HTTP ${menuRes.status}`);
      }

      const menuJson = await menuRes.json();
      if (menuJson.success) {
        setMenuData({
          restaurant: menuJson.restaurant,
          categories: menuJson.categories || ['All'],
          items: menuJson.items || []
        });
      }

      if (mediaRes.ok) {
        const mediaJson = await mediaRes.json();
        if (mediaJson.success) {
          setMediaData(mediaJson.media);
        }
      }
    } catch (err) {
      console.error('Error fetching website data:', err);
      setError(err.message || 'Unable to connect to the restaurant API server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsiteData();
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-dark-950">
      {/* 1. Navbar */}
      <Navbar restaurant={menuData.restaurant} />

      {/* Global Connection Error Banner if Backend is Unreachable */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md p-4 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="text-xs">{error}</span>
          </div>
          <button
            onClick={fetchWebsiteData}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-xs font-semibold shrink-0 flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 2. Hero Section */}
      <HeroSection
        restaurant={menuData.restaurant}
        media={mediaData}
      />

      {/* 3. Restaurant Introduction */}
      <IntroSection
        restaurant={menuData.restaurant}
        media={mediaData}
      />

      {/* 4. Popular Dishes & Chef's Specials */}
      <PopularDishesSection
        items={menuData.items}
      />

      {/* 5, 6, 7, 8, 9, 10, 11, 12. Main Interactive Menu Section */}
      <MenuSection
        categories={menuData.categories}
        items={menuData.items}
        isLoading={isLoading}
      />

      {/* 13. Promotional Video */}
      <PromoVideoSection
        media={mediaData}
      />

      {/* 14. Restaurant Opening Hours */}
      <OpeningHoursSection
        restaurant={menuData.restaurant}
      />

      {/* 15. Contact Information & Map */}
      <ContactSection
        restaurant={menuData.restaurant}
      />

      {/* 16. Footer */}
      <Footer
        restaurant={menuData.restaurant}
      />
    </div>
  );
}

