import React, { useState } from 'react';
import { Music, Eye, EyeOff, ShieldAlert, Sparkles } from 'lucide-react';
import { Track } from '../types';

interface LyricsPaneProps {
  currentTrack: Track;
}

export default function LyricsPane({ currentTrack }: LyricsPaneProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const lyrics = currentTrack.lyrics || [];

  return (
    <div className="mt-4 border-t-2 border-dashed border-zinc-600 pt-4">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 border-2 border-[#c3f400] bg-black text-[#c3f400] font-mono text-xs uppercase tracking-wider hover:bg-[#c3f400] hover:text-black transition-all cursor-pointer font-bold rounded"
      >
        <span className="flex items-center gap-2">
          <Music className="w-3.5 h-3.5 animate-bounce" />
          {isExpanded ? 'CLOSE RAW LYRICS' : 'VIEW RAW LYRICS'}
        </span>
        <span className="font-bold flex items-center gap-1">
          {isExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {isExpanded ? '[ HIDE ]' : '[ SHOW ]'}
        </span>
      </button>

      {/* Lyrics Content Pane */}
      {isExpanded && (
        <div className="mt-3 p-4 bg-black border-2 border-dashed border-[#c3f400] relative overflow-hidden rounded animate-fadeIn">
          {/* Graffiti/Spray Paint and Punk Elements */}
          <div className="absolute top-0 right-0 p-1 opacity-25 pointer-events-none select-none">
            <ShieldAlert className="w-16 h-16 text-[#c3f400] -rotate-12" />
          </div>
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[9px] font-mono text-zinc-500">
            <Sparkles className="w-2.5 h-2.5 text-[#c3f400]" /> LOUD MODE ACTIVE
          </div>

          <div className="relative z-10">
            <h5 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-1 flex items-center justify-between">
              <span>TRACK: {currentTrack.title}</span>
              <span className="text-[#c3f400]">100% PUNK CONTENT</span>
            </h5>

            <div className="space-y-3 font-sans my-4">
              {lyrics.length > 0 ? (
                lyrics.map((line, idx) => (
                  <p
                    key={idx}
                    className="font-black text-base sm:text-lg md:text-xl uppercase tracking-tighter text-white distorted-text hover:text-[#c3f400] hover:scale-[1.02] transform transition-all duration-150 leading-tight select-none italic"
                  >
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-zinc-500 italic text-sm">NO LYRICS TRANSCRIBED YET.</p>
              )}
            </div>

            <div className="mt-4 border-t border-zinc-800 pt-2 flex justify-between items-center text-[10px] font-mono text-[#c3f400]">
              <span>[ DO NOT SHUT UP ]</span>
              <span>[ STAY LOUD COLLECTIVE ]</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
