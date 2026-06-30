import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Volume2,
  Music,
  Share2,
  ShoppingBag,
  Ticket,
  ChevronRight,
  Sparkles,
  Check,
  ShieldAlert,
  ArrowRight,
  Lock,
  Unlock,
  Radio
} from 'lucide-react';
import { GIGS_DATA } from './data';
import { CartItem, Gig } from './types';

// Modular Components
import AudioPlayer from './components/AudioPlayer';
import MerchStore from './components/MerchStore';
import TicketModal from './components/TicketModal';
import Shoutbox from './components/Shoutbox';

export default function App() {
  // State variables
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackId, setCurrentTrackId] = useState<string>('track-1');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [backstageUnlocked, setBackstageUnlocked] = useState<boolean>(false);
  
  // Header display and visual feedback
  const [shareToast, setShareToast] = useState<boolean>(false);
  const [titleTilt, setTitleTilt] = useState({ x: 0, y: 0 });

  // Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse Move Distort Effect on Hero Title
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 30;
    const y = (e.clientY - rect.top - rect.height / 2) / 30;
    setTitleTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTitleTilt({ x: 0, y: 0 });
  };

  // Helper for scroll action
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Share action
  const handleShare = () => {
    const textToCopy = `FLYING BOOGER | STAY LOUD - The raw power of punk! ${window.location.href}`;
    navigator.clipboard.writeText(textToCopy);
    setShareToast(true);
    setTimeout(() => {
      setShareToast(false);
    }, 3000);
  };

  return (
    <div className="bg-[#131313] text-[#e5e2e1] font-body-md overflow-x-hidden min-h-screen relative">
      {/* Absolute Film Grain Texture Overlay */}
      <div className="fixed inset-0 grain-texture z-50 pointer-events-none"></div>

      {/* TopNavBar */}
      <header
        className={`w-full sticky top-0 z-40 bg-black border-b-4 border-white transition-all duration-300 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 ${
          isScrolled ? 'shadow-[12px_12px_0px_0px_#c3f400]' : 'shadow-[8px_8px_0px_0px_#c3f400]'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#c3f400] border-2 border-black flex items-center justify-center font-bold text-black text-xl italic shrink-0">
            FB
          </div>
          <h1 className="font-headline-md text-xl md:text-2xl italic font-black text-white uppercase tracking-tighter">
            FLYING BOOGER
          </h1>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex gap-6 font-label-md text-xs uppercase tracking-widest items-center">
          <button
            onClick={() => scrollToSection('tour-section')}
            className="text-white font-bold hover:bg-[#c3f400] hover:text-[#161e00] transition-all px-2 py-1 cursor-pointer"
          >
            Tour
          </button>
          <button
            onClick={() => scrollToSection('merch-section')}
            className="text-[#c4c9ac] hover:bg-[#c3f400] hover:text-[#161e00] transition-all px-2 py-1 cursor-pointer"
          >
            Merch
          </button>
          <button
            onClick={() => scrollToSection('contact-section')}
            className="text-[#c4c9ac] hover:bg-[#c3f400] hover:text-[#161e00] transition-all px-2 py-1 cursor-pointer"
          >
            Stay Loud
          </button>
        </nav>

        {/* Action controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Snot Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-white hover:bg-surface-container hover:text-[#c3f400] transition-colors relative cursor-pointer"
            title="Open Snot Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-container text-on-primary-container font-mono text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border border-black animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Quick Play Trigger */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 transition-colors cursor-pointer rounded ${
              isPlaying ? 'bg-[#c3f400] text-[#131313]' : 'text-white hover:bg-surface-container'
            }`}
            title={isPlaying ? 'Pause Synth' : 'Play Live Synth'}
          >
            {isPlaying ? <Radio className="w-5 h-5 animate-spin" /> : <Music className="w-5 h-5" />}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 text-white hover:bg-surface-container transition-colors cursor-pointer"
            title="Share Band Applet"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Share success toast banner */}
      {shareToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#c3f400] text-black font-mono text-xs font-black border-2 border-white px-4 py-2 flex items-center gap-2 animate-bounce shadow-lg">
          <Check className="w-4 h-4 stroke-3" /> ACCESS LINK COPIED! STAY LOUD!
        </div>
      )}

      <main className="pb-16">
        {/* Hero Section */}
        <section
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative min-h-[75vh] flex flex-col items-center justify-center text-center px-margin-mobile pt-16 overflow-hidden"
        >
          {/* High-impact background gradient overlay */}
          <div className="absolute inset-0 gradient-overlay-hero pointer-events-none z-0"></div>

          {/* Decorative Bolts */}
          <span
            className="material-symbols-outlined absolute top-10 left-10 text-[#c3f400] text-7xl md:text-8xl rotate-12 opacity-15 select-none"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
          <span
            className="material-symbols-outlined absolute bottom-20 right-10 text-[#c3f400] text-[10rem] md:text-[12rem] -rotate-12 opacity-10 select-none"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>

          <div className="z-10 relative">
            <div className="mb-6 inline-block bg-[#c3f400] text-black px-4 py-1.5 font-bold uppercase text-xs md:text-sm -rotate-2 tracking-wider">
              NEW LIVE SYNTH ENGINE RELEASED
            </div>

            <h2
              style={{
                transform: `translate(${titleTilt.x}px, ${titleTilt.y}px) skewX(-5deg)`,
                transition: 'transform 0.1s ease-out',
              }}
              className="font-headline-xl text-6xl sm:text-8xl md:text-[110px] md:leading-[0.9] tracking-tighter uppercase font-black text-white mb-8 select-none"
            >
              FLYING
              <br />
              <span className="neon-text">BOOGER</span>
            </h2>

            <p className="font-body-lg text-lg md:text-xl max-w-2xl mx-auto text-[#c4c9ac] mb-8 italic px-4 leading-relaxed">
              "Raw power. Distorted reality. The only band that sounds like a punch in the face and a party in your
              brain." Live procedural synthesizers rendering snot punk beats.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto w-full px-4">
              <button
                onClick={() => scrollToSection('tour-section')}
                className="brutal-border neon-shadow bg-[#c3f400] text-black font-black text-lg md:text-xl px-8 py-3 uppercase tracking-tighter w-full sm:w-auto hover:bg-white transition-colors cursor-pointer"
              >
                Tour &amp; Chaos
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="brutal-border bg-white text-black font-black text-lg md:text-xl px-8 py-3 uppercase tracking-tighter w-full sm:w-auto flex items-center justify-center gap-2 hover:bg-[#c3f400] transition-colors cursor-pointer"
              >
                {isPlaying ? 'PAUSE BEAT' : 'START SYNTH'} <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Absolute Background Logo */}
          <div className="absolute -bottom-16 -left-16 w-48 h-48 md:w-64 md:h-64 opacity-20 mix-blend-screen animate-pulse pointer-events-none">
            <img
              alt="Logo Background"
              className="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkNx8JEjy06B1MSw4vC13yMzFyIsBAT7vCz51XCI37lm2LtHRzdRW-79_j2gua-N3RLAJQuHQ374zG8e5BDVSKIiMVRYiRnxED_08FzCO1KgPFN48HG-qpVMZgDDKLphoup6KQW3IB4slxaalyiqHN5o3YTeBRcPkMqlPWzLmatLlRLAirvYG9wfeJP-P0W3nPmXtYp2k2vTDkQVRNsM_PUTJIBdX4srhqNl-ckb_i750KXMypTKIjL8DhEHticwvy_NekayNUUJ6C"
            />
          </div>
        </section>

        {/* Live Audio Sequencer Section */}
        <section className="px-margin-mobile md:px-margin-desktop mb-16 relative">
          {/* Vibrant background gradient overlay */}
          <div className="absolute inset-0 gradient-overlay-sequencer pointer-events-none z-0 opacity-80"></div>
          <div className="max-w-xl mx-auto relative z-10">
            <div className="text-center mb-6">
              <span className="font-mono text-xs text-[#c3f400] tracking-widest uppercase block mb-1">
                PROCEDURAL SOUNDS
              </span>
              <h2 className="font-headline-md text-xl md:text-2xl uppercase font-black text-white">
                SNOT ROCKET NOISE BOX
              </h2>
            </div>
            <AudioPlayer
              currentTrackId={currentTrackId}
              onTrackChange={setCurrentTrackId}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          </div>
        </section>

        {/* Stay Loud Section (Streaming links) */}
        <section className="bg-surface-container gradient-overlay-stayloud py-16 border-y-4 border-dashed border-[#444933] relative">
          <div className="max-w-7xl mx-auto px-margin-mobile text-center relative z-10">
            <h3 className="font-headline-xl text-4xl md:text-5xl uppercase text-white mb-10 italic font-black">
              STAY LOUD
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter">
              {/* Spotify */}
              <button
                onClick={() => alert("TUNING IN SPOTIFY... DEMOS OFFLINE!")}
                className="btn-riot bg-surface-container-high p-6 md:p-8 flex flex-col items-center group cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-[#c3f400] text-5xl md:text-6xl group-hover:scale-110 transition-transform mb-2"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  album
                </span>
                <span className="font-label-md text-xs uppercase tracking-widest text-white">Spotify</span>
              </button>

              {/* Apple Music */}
              <button
                onClick={() => alert("SYNCHRONIZING APPLE MUSIC STREAMS...")}
                className="btn-riot bg-surface-container-high p-6 md:p-8 flex flex-col items-center group cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-[#c3f400] text-5xl md:text-6xl group-hover:scale-110 transition-transform mb-2"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  music_note
                </span>
                <span className="font-label-md text-xs uppercase tracking-widest text-white">Apple Music</span>
              </button>

              {/* YouTube */}
              <button
                onClick={() => alert("LAUNCHING FLYING BOOGER CHANNEL...")}
                className="btn-riot bg-surface-container-high p-6 md:p-8 flex flex-col items-center group cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-[#c3f400] text-5xl md:text-6xl group-hover:scale-110 transition-transform mb-2"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  smart_display
                </span>
                <span className="font-label-md text-xs uppercase tracking-widest text-white">YouTube</span>
              </button>

              {/* Instagram */}
              <button
                onClick={() => alert("TUNING FEED IN INSTAGRAM...")}
                className="btn-riot bg-surface-container-high p-6 md:p-8 flex flex-col items-center group cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-[#c3f400] text-5xl md:text-6xl group-hover:scale-110 transition-transform mb-2"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  camera
                </span>
                <span className="font-label-md text-xs uppercase tracking-widest text-white">Instagram</span>
              </button>
            </div>
          </div>
        </section>

        {/* QR Code Backstage Universe section */}
        <section className="py-16 px-margin-mobile overflow-hidden">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 border-4 border-white p-6 md:p-10 bg-[#131313] relative rounded overflow-hidden">
            {/* High-impact background gradient overlay */}
            <div className="absolute inset-0 gradient-overlay-backstage pointer-events-none z-0 opacity-80"></div>
            {/* Spray Paint Background Accent */}
            <div className="absolute inset-0 bg-primary-container/5 spray-paint pointer-events-none z-0"></div>

            <div className="relative w-full md:w-1/2 aspect-square group flex justify-center">
              <div className="absolute -inset-4 border-2 border-dashed border-[#c3f400] group-hover:rotate-3 transition-transform duration-500 rounded"></div>
              <div className="w-full max-w-[320px] aspect-square relative cursor-pointer" onClick={() => setBackstageUnlocked(!backstageUnlocked)}>
                <img
                  alt="QR Code Universe"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all shadow-[12px_12px_0px_0px_#c3f400] rounded"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCigZCB8pkk0Bq0Vmn8oNzINytAKxa7hqwGhcUuzBYl7EyCxpASGEs53apyBQ-nB9Wk5Ktv7oi7EEMeirZeyrY1-f9C9BOWEPeUzugfDj--1ZpX2a41NEGUwV421l-qBSQv2A47nTxWShJ61bPNWvjoQxmZOQotoW7NUu_imBkKX3rfIf9G30bcIPol0EaS-vrFlqCEi2fp7J73LH9arjQeK-RIAEYEv3KSrUkLg9gNKQE0X6IR3PJTuW-O4mRpSJXk2TBF_xDTnT6T"
                />
                <div className="absolute inset-0 bg-[#131313]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black border border-[#c3f400] text-[#c3f400] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider">
                    CLICK TO SCAN
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 text-center md:text-left z-10 flex flex-col justify-between h-full">
              <div>
                <span className="font-mono text-xs text-[#c3f400] tracking-widest uppercase block mb-1">
                  BACKSTAGE ACCESS
                </span>
                <h4 className="font-headline-lg text-3xl md:text-4xl uppercase italic mb-4 text-white leading-none font-black">
                  SCAN TO ENTER THE UNIVERSE
                </h4>
                <p className="font-body-lg text-base text-[#c4c9ac] mb-6 leading-relaxed">
                  Unlock exclusive backstage footage, leaked demos, priority access to the 'SNOT ROCKET' tour dates, and
                  spray your name on the fan wall. This is for the fans who live for the distortion.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <button
                  onClick={() => setBackstageUnlocked(!backstageUnlocked)}
                  className={`btn-riot px-6 py-3 font-headline-md text-xs uppercase font-black cursor-pointer tracking-wider flex items-center gap-2 ${
                    backstageUnlocked
                      ? 'bg-red-600 text-white border-white shadow-[4px_4px_0px_0px_#ffffff]'
                      : 'bg-[#c3f400] text-[#131313] border-white'
                  }`}
                >
                  {backstageUnlocked ? (
                    <>
                      <Lock className="w-4 h-4" /> LOCK BACKSTAGE
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" /> REVEAL BACKSTAGE
                    </>
                  )}
                </button>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white text-3xl animate-pulse">
                    keyboard_double_arrow_right
                  </span>
                  <p className="font-label-md text-xs uppercase tracking-widest text-[#c3f400] font-black">
                    {backstageUnlocked ? 'ACCESS GRANTED' : 'UNLOCKED VIA QR'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Backstage Segment (Interactive Shoutbox Area) */}
        {backstageUnlocked && (
          <section id="contact-section" className="px-margin-mobile md:px-margin-desktop mb-16 relative scroll-mt-20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 border-4 border-dashed border-red-600 bg-red-950/20 p-4 rounded animate-pulse">
                <div className="flex items-center justify-center gap-2 text-red-500 font-mono text-sm font-black uppercase">
                  <Flame className="w-5 h-5 fill-red-500" /> ** UNIVERSE AREA UNLOCKED **
                </div>
                <p className="text-xs text-[#c4c9ac] mt-1 uppercase font-mono">
                  YOU CAN NOW ACCESS LEAKED CONTENT & THE LIVE SPRAY BOARD. STAY ROWDY!
                </p>
              </div>
              <Shoutbox />
            </div>
          </section>
        )}

        {/* Upcoming Chaos (Gigs Section) */}
        <section id="tour-section" className="max-w-7xl mx-auto px-margin-mobile py-16 scroll-mt-20 relative rounded overflow-hidden">
          {/* Vibrant background gradient overlay */}
          <div className="absolute inset-0 gradient-overlay-tour pointer-events-none z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-baseline border-b-4 border-white mb-8 pb-3">
            <h2 className="font-headline-md text-2xl md:text-3xl uppercase text-white font-black italic tracking-tight">
              UPCOMING CHAOS
            </h2>
            <span className="font-mono text-xs text-[#c3f400] uppercase tracking-wider font-bold shrink-0">
              SNOT ROCKET 2024 TOUR
            </span>
          </div>

          <div className="space-y-1">
            {GIGS_DATA.map((gig) => (
              <div
                key={gig.id}
                onClick={() => {
                  if (!gig.soldOut) {
                    setSelectedGig(gig);
                  }
                }}
                className={`group flex flex-col md:flex-row justify-between items-center p-5 border-b border-[#444933] transition-all relative ${
                  gig.soldOut
                    ? 'opacity-50 cursor-not-allowed bg-stone-900/10'
                    : 'hover:bg-[#c3f400] cursor-pointer'
                }`}
              >
                {/* Event date & info */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 items-center sm:items-baseline text-center sm:text-left w-full md:w-auto">
                  <span
                    className={`font-mono text-sm tracking-wider font-black ${
                      gig.soldOut ? 'text-[#c4c9ac]' : 'text-[#c3f400] group-hover:text-[#161e00]'
                    }`}
                  >
                    {gig.date}
                  </span>
                  <h3
                    className={`font-headline-md text-xl md:text-2xl uppercase font-black transition-all text-white ${
                      gig.soldOut ? 'text-stone-400' : 'group-hover:text-[#161e00] group-hover:italic'
                    }`}
                  >
                    {gig.location} // {gig.venue}
                  </h3>
                </div>

                {/* Status elements */}
                <div className="flex gap-4 items-center mt-3 md:mt-0">
                  {gig.soldOut ? (
                    <span className="font-label-sm text-[10px] uppercase bg-white text-black px-2.5 py-1 font-black">
                      SOLD OUT
                    </span>
                  ) : (
                    <>
                      {gig.lowTickets && (
                        <span className="font-label-sm text-[10px] uppercase bg-red-600 text-white px-2.5 py-1 font-black animate-pulse">
                          LOW TIX
                        </span>
                      )}
                      <span className="font-mono text-xs text-[#c4c9ac] group-hover:text-[#161e00] font-bold">
                        ${gig.price} BASE
                      </span>
                      <span className="material-symbols-outlined text-white group-hover:text-[#161e00] group-hover:translate-x-2 transition-transform">
                        arrow_forward
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* Merchandise Section */}
        <section id="merch-section" className="max-w-7xl mx-auto px-margin-mobile py-16 scroll-mt-20 relative rounded overflow-hidden">
          {/* Vibrant background gradient overlay */}
          <div className="absolute inset-0 gradient-overlay-merch pointer-events-none z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-baseline border-b-4 border-white mb-8 pb-3">
              <h2 className="font-headline-md text-2xl md:text-3xl uppercase text-white font-black italic tracking-tight">
                SNOT THREADS & MUSIC
              </h2>
              <button
                onClick={() => setIsCartOpen(true)}
                className="font-mono text-xs text-[#c3f400] uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer hover:underline shrink-0"
              >
                <ShoppingBag className="w-4 h-4" /> BAG ({cartCount})
              </button>
            </div>

            <MerchStore
              onAddToCartCountChange={setCartCount}
              cart={cart}
              setCart={setCart}
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full h-auto min-h-16 border-t-4 border-white bg-black flex flex-col md:flex-row items-center px-8 py-4 justify-between z-20 gap-4">
        <div className="flex gap-6 font-mono text-[10px] uppercase text-[#c4c9ac]">
          <button
            onClick={() => alert('PRIVACY POLICY? WE ARE PUNK. WE DO NOT SELL YOUR SNOT.')}
            className="hover:text-[#c3f400] transition-colors cursor-pointer"
          >
            Privacy: NO
          </button>
          <button
            onClick={() => alert('TERMS OF SERVICE: 1. STAY LOUD. 2. MOSH HARD. 3. RESPECT OTHERS.')}
            className="hover:text-[#c3f400] transition-colors cursor-pointer"
          >
            Terms: MAYBE
          </button>
          <button
            onClick={() => alert('ACCESSING ELECTRONIC PRESS KIT... METADATA LOADED.')}
            className="hover:text-[#c3f400] transition-colors cursor-pointer"
          >
            Noise: YES
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono uppercase text-[#c4c9ac]">Follow:</span>
          <div className="flex gap-2">
            <button
              onClick={() => alert('EPISODES STREAMING VIA FEED...')}
              className="w-4 h-4 bg-[#c3f400] cursor-pointer"
              title="Alternate Email"
            ></button>
            <button
              onClick={() => alert('PODCAST TRANSMISSION SECURED...')}
              className="w-4 h-4 bg-white cursor-pointer"
              title="Podcasts"
            ></button>
            <div className="w-4 h-4 bg-zinc-600"></div>
          </div>
        </div>

        <div className="font-black italic text-xs tracking-widest text-[#c3f400] uppercase">
          © 2026 FB // STAY LOUD OR SHUT UP
        </div>
      </footer>

      {/* Ticket Purchase Modal */}
      <TicketModal gig={selectedGig} onClose={() => setSelectedGig(null)} />
    </div>
  );
}
