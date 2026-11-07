import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Clapperboard } from 'lucide-react';

export default function PromoVideoSection({ media }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const videoData = media?.promoVideo || {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    title: 'The Art of Culinary Perfection',
    subtitle: 'Behind the scenes inside the kitchen of L\'Aura Bistro'
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section id="video" className="py-24 bg-dark-950 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Clapperboard className="w-3.5 h-3.5" />
            <span>Visual Experience</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            {videoData.title || "The Culinary Experience"}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            {videoData.subtitle || "Watch our master chefs transform pure ingredients into culinary art"}
          </p>
        </div>

        {/* Video Player Card */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-dark-900 shadow-2xl group">
          
          <video
            ref={videoRef}
            src={videoData.url}
            poster={videoData.poster}
            muted={isMuted}
            playsInline
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full aspect-video object-cover"
          />

          {/* Overlay with Controls */}
          <div className={`absolute inset-0 bg-dark-950/40 transition-opacity flex items-center justify-center ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            
            {/* Center Big Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-amber-500/90 hover:bg-amber-400 text-dark-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
              aria-label={isPlaying ? "Pause Video" : "Play Video"}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current translate-x-0.5" />
              )}
            </button>
          </div>

          {/* Bottom Bar Controls */}
          <div className="absolute bottom-4 right-4 flex items-center space-x-2 z-20">
            <button
              onClick={toggleMute}
              className="p-2.5 rounded-full bg-dark-950/80 backdrop-blur-md text-white hover:text-amber-400 border border-slate-700 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

