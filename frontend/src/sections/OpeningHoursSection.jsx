import React from 'react';
import { Clock, CalendarCheck, CheckCircle2 } from 'lucide-react';

export default function OpeningHoursSection({ restaurant }) {
  const hours = restaurant?.hours || {
    weekday: "Monday – Thursday: 11:30 AM – 10:00 PM",
    weekend: "Friday – Saturday: 11:30 AM – 11:00 PM",
    sunday: "Sunday: 12:00 PM – 9:30 PM"
  };

  // Determine if open now
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const isOpen = currentHour >= 11.5 && currentHour <= 22.5;

  return (
    <section id="hours" className="py-20 bg-dark-900 border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-dark-850 to-dark-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            
            {/* Left: Heading and Live Status */}
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>Plan Your Visit</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
                Opening Hours
              </h2>

              <p className="text-slate-400 text-sm max-w-md mb-6">
                Join us for lunch, twilight cocktails, or an intimate dinner. Walk-ins and table reservations are both warmly welcomed.
              </p>

              {/* Real-time Open/Closed Status Badge */}
              <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-xl bg-dark-950/80 border border-slate-700">
                <span className={`w-3 h-3 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-sm font-semibold text-white">
                  {isOpen ? 'Currently Open' : 'Open Today (11:30 AM)'}
                </span>
                <span className="text-xs text-slate-400">• Dine-In & Takeout</span>
              </div>
            </div>

            {/* Right: Timetable Cards */}
            <div className="flex-1 max-w-md space-y-3">
              <div className="p-4 rounded-xl bg-dark-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">Mon – Thu</span>
                  <span className="text-sm text-slate-200 font-medium">Lunch & Dinner Service</span>
                </div>
                <span className="text-sm font-semibold text-white">11:30 AM – 10:00 PM</span>
              </div>

              <div className="p-4 rounded-xl bg-dark-950/60 border border-amber-500/30 flex items-center justify-between shadow-md">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">Fri – Sat</span>
                  <span className="text-sm text-slate-200 font-medium">Extended Late Hours</span>
                </div>
                <span className="text-sm font-semibold text-amber-400">11:30 AM – 11:00 PM</span>
              </div>

              <div className="p-4 rounded-xl bg-dark-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">Sunday</span>
                  <span className="text-sm text-slate-200 font-medium">Sunday Brunch & Dinner</span>
                </div>
                <span className="text-sm font-semibold text-white">12:00 PM – 9:30 PM</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

