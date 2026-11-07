import React from 'react';
import { MapPin, Phone, Mail, Navigation, HeartHandshake } from 'lucide-react';

export default function ContactSection({ restaurant }) {
  const address = restaurant?.address || "450 Grand Avenue, Suite 100, San Francisco, CA 94102";
  const phone = restaurant?.phone || "+1 (555) 839-2041";
  const email = restaurant?.email || "contact@laurabistro.com";

  return (
    <section id="contact" className="py-24 bg-dark-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Connect & Visit</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Contact & Location
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Conveniently situated in the city center with valet parking and private dining rooms available.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Card 1: Address */}
          <div className="p-8 rounded-2xl bg-dark-900 border border-slate-800 hover:border-amber-500/40 transition-colors flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-lg text-white mb-2">Our Address</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {address}
            </p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>
          </div>

          {/* Card 2: Phone */}
          <div className="p-8 rounded-2xl bg-dark-900 border border-slate-800 hover:border-amber-500/40 transition-colors flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5">
              <Phone className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-lg text-white mb-2">Direct Phone</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Reservations, private bookings & curbside pickup:
            </p>
            <a
              href={`tel:${phone}`}
              className="mt-auto inline-flex items-center space-x-2 text-base font-bold text-amber-400 hover:text-amber-300"
            >
              <span>{phone}</span>
            </a>
          </div>

          {/* Card 3: Email */}
          <div className="p-8 rounded-2xl bg-dark-900 border border-slate-800 hover:border-amber-500/40 transition-colors flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-lg text-white mb-2">Email Inquiries</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Events, private dining & general feedback:
            </p>
            <a
              href={`mailto:${email}`}
              className="mt-auto text-sm font-semibold text-amber-400 hover:text-amber-300"
            >
              {email}
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}

