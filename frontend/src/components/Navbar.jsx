import React, { useState, useEffect } from 'react';
import { Utensils, Phone, Menu, X, ShieldCheck } from 'lucide-react';

export default function Navbar({ restaurant, onOpenAdmin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Story', href: '#about' },
    { name: 'Specials', href: '#specials' },
    { name: 'Menu', href: '#menu' },
    { name: 'Ambience', href: '#video' },
    { name: 'Hours & Location', href: '#hours' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-950/95 backdrop-blur-md shadow-lg border-b border-slate-800/80 py-3'
          : 'bg-gradient-to-b from-dark-950/90 via-dark-950/50 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Name */}
          <a href="#home" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-dark-950 shadow-md group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5 font-bold" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                {restaurant?.name || "L'Aura Bistro"}
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-amber-400/90 font-medium -mt-1">
                Fine Dining & Lounge
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors tracking-wide relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Quick Contact & Admin CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href={`tel:${restaurant?.phone || '+15558392041'}`}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-sm font-semibold transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{restaurant?.phone || '+1 (555) 839-2041'}</span>
            </a>

            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-full border border-slate-700 bg-dark-900 hover:border-amber-500 text-slate-300 hover:text-amber-400 transition-all"
              title="Admin S3 & Menu Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            <a
              href="#menu"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-dark-950 text-sm font-bold shadow-md hover:shadow-amber-500/20 transition-all hover:scale-105"
            >
              View Menu
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-lg bg-dark-850 text-slate-300 hover:text-amber-400"
              title="Admin S3 & Menu Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-dark-850 text-slate-200 hover:text-amber-400 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-900/98 backdrop-blur-xl border-b border-slate-800 px-4 pt-3 pb-6 animate-fadeIn">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-amber-400 hover:bg-dark-800/80 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-800 flex flex-col space-y-3">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                className="flex items-center justify-center space-x-2 py-2.5 rounded-lg border border-slate-700 bg-dark-850 text-slate-300 text-sm font-medium"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin S3 & Menu Portal</span>
              </button>
              <a
                href="#menu"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-amber-500 text-dark-950 text-sm font-bold shadow"
              >
                Explore Full Menu
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
