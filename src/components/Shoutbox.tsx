import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, Send, Trash, Smile, Shield } from 'lucide-react';
import { Shoutout } from '../types';

export default function Shoutbox() {
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sprayColor, setSprayColor] = useState('#c3f400'); // Default lime green

  const colors = [
    { name: 'Slime Green', value: '#c3f400' },
    { name: 'Riot Pink', value: '#ff007f' },
    { name: 'Static Cyan', value: '#00f0ff' },
    { name: 'Anarchy Orange', value: '#ff6c00' },
    { name: 'Trash White', value: '#ffffff' }
  ];

  // Load shoutouts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('fb_shoutouts');
    if (saved) {
      try {
        setShoutouts(JSON.parse(saved));
      } catch (e) {
        // use default if parse failed
        initDefaultShoutouts();
      }
    } else {
      initDefaultShoutouts();
    }
  }, []);

  const initDefaultShoutouts = () => {
    const defaults: Shoutout[] = [
      {
        id: 's-1',
        name: 'Snotty_Pete',
        message: 'SO36 WAS INSANE! MY SHOES ARE STILL COVERED IN BEER!',
        color: '#ff007f',
        timestamp: '10 mins ago',
        angle: -3,
      },
      {
        id: 's-2',
        name: 'MoshPit_Queen',
        message: 'PLZ COMING TO TOKYO ASAP! ALREADY GOT MY TICKETS!',
        color: '#c3f400',
        timestamp: '1 hour ago',
        angle: 4,
      },
      {
        id: 's-3',
        name: 'Anarchy_Joe',
        message: 'STAY LOUD! THE NEW SINGLE IS A CHERRY BOMB!',
        color: '#00f0ff',
        timestamp: '5 hours ago',
        angle: -2,
      }
    ];
    setShoutouts(defaults);
    localStorage.setItem('fb_shoutouts', JSON.stringify(defaults));
  };

  const handleSprayShout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    // Simulate spray sound using Web Audio API!
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const bufferSize = ctx.sampleRate * 0.4; // 0.4 seconds of spray
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Filtered white noise for sssshhhhh spray sound
        data[i] = Math.random() * 2 - 1;
      }
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2500;
      filter.Q.value = 1.5;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      source.start();
    } catch (err) {
      // AudioContext fails gracefully if browser blocks it
    }

    const newShoutout: Shoutout = {
      id: 'shout-' + Date.now(),
      name: name.trim().slice(0, 15),
      message: message.trim().toUpperCase().slice(0, 80), // Caps lock to stay loud!
      color: sprayColor,
      timestamp: 'Just Now',
      angle: Math.floor(Math.random() * 8) - 4 // Slight random rotation
    };

    const updated = [newShoutout, ...shoutouts];
    setShoutouts(updated);
    localStorage.setItem('fb_shoutouts', JSON.stringify(updated));

    setMessage('');
  };

  const clearBoard = () => {
    const fresh: Shoutout[] = [];
    setShoutouts(fresh);
    localStorage.removeItem('fb_shoutouts');
  };

  return (
    <div className="bg-surface border-4 border-primary p-6 md:p-8 relative max-w-5xl mx-auto w-full rounded">
      {/* Spray paint effect back */}
      <div className="absolute inset-0 bg-primary-container/5 spray-paint pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left column: Spray form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border-b-4 border-[#c3f400] pb-2 mb-4">
            <span className="font-mono text-xs text-[#c3f400] tracking-widest uppercase block mb-1">
              STAY LOUD SHOUTBOX
            </span>
            <h3 className="font-headline-md text-2xl uppercase text-white font-black italic tracking-tight">
              SPRAY YOUR MESSAGE
            </h3>
          </div>

          <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
            Leave your mark on the digital brick wall. Messages are automatically formatted to SCREAM (Caps Lock) and spray-painted in real-time. Keep it raw!
          </p>

          <form onSubmit={handleSprayShout} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] text-on-surface-variant block mb-1 uppercase">PUNK ALIAS / HANDHELD</label>
              <input
                type="text"
                required
                placeholder="MOSHER_99"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-background border border-outline-variant p-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#c3f400] rounded focus:ring-1 focus:ring-[#c3f400]"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] text-on-surface-variant block mb-1 uppercase">GRAFFITI TEXT (MAX 80 CHARS)</label>
              <textarea
                required
                rows={2}
                maxLength={80}
                placeholder="STAY LOUD OR DIE!!! BEST CONCERT OF THE DECADE"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-background border border-outline-variant p-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#c3f400] rounded focus:ring-1 focus:ring-[#c3f400] resize-none"
              />
            </div>

            {/* Spray Colors Selection */}
            <div>
              <label className="font-mono text-[10px] text-on-surface-variant block mb-1.5 uppercase">CHOOSE SPRAY CAN</label>
              <div className="flex gap-2">
                {colors.map(c => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSprayColor(c.value)}
                    className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
                    style={{
                      backgroundColor: c.value,
                      borderColor: sprayColor === c.value ? '#ffffff' : '#131313',
                      boxShadow: sprayColor === c.value ? `0 0 8px ${c.value}` : 'none'
                    }}
                    title={c.name}
                  >
                    {sprayColor === c.value && (
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 btn-riot bg-[#c3f400] text-[#131313] py-2.5 uppercase font-headline-md text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer font-black border-2"
              >
                <Send className="w-3.5 h-3.5" /> Spray Brick Wall!
              </button>
              
              {shoutouts.length > 0 && (
                <button
                  type="button"
                  onClick={clearBoard}
                  className="px-3 border border-outline hover:border-red-600 hover:bg-red-600/10 text-on-surface-variant hover:text-white cursor-pointer transition-all rounded"
                  title="Clear Wall"
                >
                  <Trash className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-on-surface-variant bg-surface-container-high p-2 border border-outline-variant rounded">
            <Shield className="w-3.5 h-3.5 text-[#c3f400]" />
            <span>MODERATION ACTIVE // HOSTED OFFLINE</span>
          </div>
        </div>

        {/* Right column: The Wall */}
        <div className="lg:col-span-7 flex flex-col h-[320px] lg:h-[450px]">
          <span className="font-mono text-[10px] text-on-surface-variant mb-2 block uppercase tracking-wider">
            BRICK WALL // LIVE GRAFFITI ({shoutouts.length})
          </span>

          <div className="flex-1 bg-surface-container-lowest border-4 border-dashed border-outline-variant p-4 overflow-y-auto rounded relative flex flex-wrap gap-4 items-start content-start">
            {/* Simulated bricks background lines */}
            <div className="absolute inset-0 flex flex-col pointer-events-none opacity-[0.03]">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="h-8 border-b border-white flex">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div
                      key={j}
                      className="flex-1 border-r border-white"
                      style={{ transform: `translateX(${i % 2 === 0 ? '16px' : '0px'})` }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {shoutouts.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-center text-on-surface-variant font-mono text-xs gap-2">
                <Smile className="w-8 h-8 opacity-40" />
                <span>WALL CLEAN! BE THE FIRST TO GRAFFITI!</span>
              </div>
            ) : (
              shoutouts.map((shout) => (
                <div
                  key={shout.id}
                  className="p-3 max-w-[240px] border border-stone-800 transition-all hover:scale-105 select-none relative shadow-md rounded"
                  style={{
                    transform: `rotate(${shout.angle}deg)`,
                    backgroundColor: '#1c1b1b',
                    boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 0 10px ${shout.color}15`
                  }}
                >
                  <div className="flex justify-between items-baseline gap-2 mb-1 border-b border-stone-800/60 pb-1">
                    <span className="font-mono text-[11px] font-black truncate" style={{ color: shout.color }}>
                      @{shout.name}
                    </span>
                    <span className="font-mono text-[8px] text-stone-500 shrink-0">
                      {shout.timestamp}
                    </span>
                  </div>
                  <p className="font-headline-md text-xs tracking-tight break-words uppercase font-extrabold leading-tight" style={{ color: shout.color }}>
                    {shout.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
