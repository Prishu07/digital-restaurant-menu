import React from 'react';
import { Utensils, ArrowUp, Cloud, ShieldCheck } from 'lucide-react';

export default function Footer({ restaurant, onOpenAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-dark-950 flex items-center justify-center font-bold">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-tight">
                {restaurant?.name || "L'Aura Bistro"}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {restaurant?.tagline || "Modern Culinary Craftsmanship & Fine Dining"}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#home" className="hover:text-amber-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-amber-400 transition-colors">About Our Kitchen</a></li>
              <li><a href="#specials" className="hover:text-amber-400 transition-colors">Chef's Specials</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition-colors">Interactive Menu</a></li>
              <li><a href="#video" className="hover:text-amber-400 transition-colors">Promotional Video</a></li>
              <li><a href="#hours" className="hover:text-amber-400 transition-colors">Opening Hours</a></li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-amber-400 hover:text-amber-300 font-medium flex items-center space-x-1.5 transition-colors pt-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin & S3 Portal (PIN Protected)</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Service Hours</h4>
            <div className="space-y-2 text-xs">
              <p><strong className="text-slate-300">Mon – Thu:</strong> 11:30 AM – 10:00 PM</p>
              <p><strong className="text-slate-300">Fri – Sat:</strong> 11:30 AM – 11:00 PM</p>
              <p><strong className="text-slate-300">Sunday:</strong> 12:00 PM – 9:30 PM</p>
              <p className="text-amber-400/80 pt-2 font-medium">Kitchen closes 30 mins before closing time.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Cloud Architecture</h4>
            <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                <Cloud className="w-4 h-4" />
                <span>AWS Cloud Native</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Hosted on <strong>Amazon EC2</strong> with secure <strong>Amazon S3</strong> media storage via <strong>IAM Instance Role</strong> credentials.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded bg-dark-950 text-[10px] text-slate-300 border border-slate-700">EC2</span>
                <span className="px-2 py-0.5 rounded bg-dark-950 text-[10px] text-slate-300 border border-slate-700">S3 Presigned</span>
                <span className="px-2 py-0.5 rounded bg-dark-950 text-[10px] text-slate-300 border border-slate-700">Nginx</span>
                <span className="px-2 py-0.5 rounded bg-dark-950 text-[10px] text-slate-300 border border-slate-700">PM2</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} {restaurant?.name || "L'Aura Bistro"}. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-800 hover:border-amber-500/50 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
