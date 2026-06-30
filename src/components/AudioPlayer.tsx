import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Radio, Music, Flame } from 'lucide-react';
import { Track } from '../types';
import { TRACKS_DATA } from '../data';
import LyricsPane from './LyricsPane';

interface AudioPlayerProps {
  currentTrackId: string;
  onTrackChange: (trackId: string) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export default function AudioPlayer({
  currentTrackId,
  onTrackChange,
  isPlaying,
  setIsPlaying,
}: AudioPlayerProps) {
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(-1);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentTrack = TRACKS_DATA.find((t) => t.id === currentTrackId) || TRACKS_DATA[0];

  // MIDI Note to Frequency Helper
  const midiToFreq = (note: number) => {
    return 440 * Math.pow(2, (note - 69) / 12);
  };

  // Web Audio Synth Synthesizers
  const playKick = (ctx: AudioContext, destination: AudioNode) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(destination);

    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(1.2 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  };

  const playSnare = (ctx: AudioContext, destination: AudioNode) => {
    // White noise for snare snap
    const bufferSize = ctx.sampleRate * 0.2; // 0.2 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5 * volume, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    // Osc for body
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    
    oscGain.gain.setValueAtTime(0.4 * volume, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    // Connect noise
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(destination);

    // Connect body
    osc.connect(oscGain);
    oscGain.connect(destination);

    noise.start(ctx.currentTime);
    osc.start(ctx.currentTime);

    noise.stop(ctx.currentTime + 0.2);
    osc.stop(ctx.currentTime + 0.1);
  };

  const playBassNote = (ctx: AudioContext, destination: AudioNode, note: number, duration: number) => {
    if (note <= 0) return;
    
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(midiToFreq(note), ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.Q.setValueAtTime(8, ctx.currentTime);
    // Envelope on filter frequency
    filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.35 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  };

  const playLeadNote = (ctx: AudioContext, destination: AudioNode, note: number, duration: number) => {
    if (note <= 0) return;

    // Two detuned sawtooth waves for fat distorted lead sound
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const waveShaper = ctx.createWaveShaper(); // Distorter
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    // Create a beautiful distortion curve
    const makeDistortionCurve = (amount = 20) => {
      const k = typeof amount === 'number' ? amount : 50;
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      return curve;
    };

    waveShaper.curve = makeDistortionCurve(50);
    waveShaper.oversample = '4x';

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(note, ctx.currentTime);
    osc1.detune.setValueAtTime(-10, ctx.currentTime);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(note, ctx.currentTime);
    osc2.detune.setValueAtTime(10, ctx.currentTime);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.Q.setValueAtTime(1, ctx.currentTime);

    gain.gain.setValueAtTime(0.22 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc1.connect(waveShaper);
    osc2.connect(waveShaper);
    waveShaper.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + duration);
    osc2.stop(ctx.currentTime + duration);
  };

  // Drum & Bass Patterns corresponding to our tracks
  const getPatternForTrack = (trackId: string, step: number) => {
    // 16-step sequencer pattern loops
    // Return: [kick, snare, bass_note, lead_note]
    const s = step % 16;
    
    if (trackId === 'track-1') {
      // SNOT ROCKET: super fast punchy skate punk
      const kickPattern = [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0];
      const snarePattern = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1];
      const bassRoots = [36, 36, 36, 36, 41, 41, 41, 41, 39, 39, 39, 39, 43, 43, 41, 41];
      const leadNotes = [220, 0, 261, 293, 329, 0, 392, 349, 329, 293, 261, 220, 329, 329, 293, 0];
      return {
        kick: kickPattern[s],
        snare: snarePattern[s],
        bass: bassRoots[s],
        lead: s % 2 === 0 ? leadNotes[s] : 0,
      };
    } else if (trackId === 'track-2') {
      // DISTORTION IS MY LOVE LANGUAGE: heavy, groovy grunge
      const kickPattern = [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0];
      const snarePattern = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1];
      const bassRoots = [33, 33, 33, 33, 38, 38, 38, 38, 35, 35, 35, 35, 31, 31, 31, 31];
      const leadNotes = [165, 165, 196, 220, 0, 220, 196, 165, 293, 293, 261, 220, 0, 220, 196, 174];
      return {
        kick: kickPattern[s],
        snare: snarePattern[s],
        bass: bassRoots[s],
        lead: s % 2 === 0 ? leadNotes[s] : 0,
      };
    } else if (trackId === 'track-3') {
      // STAY LOUD OR DIE: raw high-bpm hardcore punk
      const kickPattern = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
      const snarePattern = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1];
      const bassRoots = [38, 38, 38, 38, 45, 45, 45, 45, 41, 41, 41, 41, 43, 43, 40, 40];
      const leadNotes = [293, 293, 0, 293, 349, 349, 0, 349, 392, 392, 329, 329, 293, 293, 246, 0];
      return {
        kick: kickPattern[s],
        snare: snarePattern[s],
        bass: bassRoots[s],
        lead: leadNotes[s],
      };
    } else {
      // BOOGER ATTACK: melodic skate punk
      const kickPattern = [1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1];
      const snarePattern = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];
      const bassRoots = [40, 40, 40, 40, 40, 40, 40, 40, 43, 43, 43, 43, 45, 45, 45, 45];
      const leadNotes = [329, 0, 329, 349, 392, 0, 392, 349, 440, 0, 440, 392, 349, 349, 329, 293];
      return {
        kick: kickPattern[s],
        snare: snarePattern[s],
        bass: bassRoots[s],
        lead: s % 4 !== 3 ? leadNotes[s] : 0,
      };
    }
  };

  // Start / Init Audio Context
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Main Sequencer Tick Loop
  useEffect(() => {
    if (isPlaying) {
      initAudio();
      
      const intervalMs = (60 * 1000) / (currentTrack.bpm * 4); // 16th notes
      let stepCount = 0;

      const scheduleNextStep = () => {
        const ctx = audioCtxRef.current;
        const analyser = analyserRef.current;
        if (!ctx || !analyser) return;

        const pattern = getPatternForTrack(currentTrackId, stepCount);
        const duration = intervalMs / 1000;

        if (pattern.kick === 1 && !isMuted) playKick(ctx, analyser);
        if (pattern.snare === 1 && !isMuted) playSnare(ctx, analyser);
        if (pattern.bass > 0 && !isMuted) playBassNote(ctx, analyser, pattern.bass, duration * 0.9);
        if (pattern.lead > 0 && !isMuted) playLeadNote(ctx, analyser, pattern.lead, duration * 0.6);

        setActiveStep(stepCount % 16);
        stepCount++;
      };

      // Schedule first step immediately
      scheduleNextStep();

      const timer = setInterval(scheduleNextStep, intervalMs);
      timerRef.current = timer as any;
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setActiveStep(-1);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentTrackId, volume, isMuted]);

  // Clean up Audio Context on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Visualizer Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const renderFrame = () => {
      animationFrameRef.current = requestAnimationFrame(renderFrame);

      const width = canvas.width;
      const height = canvas.height;

      // Clear the canvas with transparent black
      canvasCtx.fillStyle = 'rgba(19, 19, 19, 0.3)';
      canvasCtx.fillRect(0, 0, width, height);

      const analyser = analyserRef.current;
      if (analyser && isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * height * 0.9;

          // Draw neon green/yellow lime bar with punk aesthetic
          canvasCtx.fillStyle = `rgba(195, 244, 0, ${0.4 + (dataArray[i] / 255) * 0.6})`;
          canvasCtx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

          // Add secondary noise outline or white spike
          if (dataArray[i] > 180) {
            canvasCtx.fillStyle = '#ffffff';
            canvasCtx.fillRect(x, height - barHeight, barWidth - 2, 2);
          }

          x += barWidth;
        }
      } else {
        // Draw idle static hum line
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = '#353534';
        canvasCtx.lineWidth = 2;
        canvasCtx.moveTo(0, height / 2);
        
        for (let i = 0; i < width; i++) {
          const y = height / 2 + Math.sin(i * 0.05 + Date.now() * 0.01) * (isPlaying ? 10 : 1.5);
          canvasCtx.lineTo(i, y);
        }
        canvasCtx.stroke();
      }
    };

    renderFrame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    initAudio();
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = TRACKS_DATA.findIndex((t) => t.id === currentTrackId);
    const nextIndex = (currentIndex + 1) % TRACKS_DATA.length;
    onTrackChange(TRACKS_DATA[nextIndex].id);
  };

  const handlePrev = () => {
    const currentIndex = TRACKS_DATA.findIndex((t) => t.id === currentTrackId);
    const prevIndex = (currentIndex - 1 + TRACKS_DATA.length) % TRACKS_DATA.length;
    onTrackChange(TRACKS_DATA[prevIndex].id);
  };

  return (
    <div className="bg-[#222] brutal-border neon-shadow p-6 relative max-w-xl mx-auto w-full group">
      {/* Absolute Corner Rivets / Brackets */}
      <span className="absolute top-2 left-2 text-primary font-mono text-xs select-none">[+]</span>
      <span className="absolute top-2 right-2 text-primary font-mono text-xs select-none">[+]</span>
      <span className="absolute bottom-2 left-2 text-primary font-mono text-xs select-none">[+]</span>
      <span className="absolute bottom-2 right-2 text-primary font-mono text-xs select-none">[+]</span>

      {/* Spray Accent Behind */}
      <div className="absolute inset-0 bg-primary-container/5 spray-paint pointer-events-none"></div>

      <div className="flex flex-col gap-4 relative z-10">
        {/* Header Display */}
        <div className="flex justify-between items-start border-b-2 border-dashed border-outline-variant pb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isPlaying ? 'bg-primary-container text-on-primary-container animate-pulse' : 'bg-surface-container-high text-on-surface-variant'}`}>
              <Radio className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#c3f400] uppercase block">
                NOW REELING // STEP {activeStep >= 0 ? activeStep + 1 : 'IDLE'}
              </span>
              <h4 className="font-headline-md text-lg uppercase tracking-tight text-white line-clamp-1">
                {currentTrack.title}
              </h4>
            </div>
          </div>
          <div className="flex flex-col items-end font-mono">
            <span className="text-xs text-on-surface-variant bg-surface-container-high px-2 py-0.5 border border-outline-variant uppercase">
              {currentTrack.bpm} BPM
            </span>
            <span className="text-[10px] text-on-surface-variant mt-1">{currentTrack.duration}</span>
          </div>
        </div>

        {/* Visualizer Canvas */}
        <div className="h-16 w-full bg-background border border-outline-variant relative overflow-hidden rounded">
          <canvas ref={canvasRef} className="w-full h-full" width={400} height={64} />
          {isPlaying && (
            <div className="absolute top-2 left-3 flex gap-1 items-center font-mono text-[9px] text-[#c3f400] bg-background/80 px-1 border border-[#c3f400]/20 animate-pulse">
              <Flame className="w-3 h-3 fill-[#c3f400]" /> LIVE SYNTH ACTIVE
            </div>
          )}
        </div>

        {/* Track Step Sequencer Dot Display (Aesthetic) */}
        <div className="grid grid-cols-16 gap-1 border border-outline-variant p-2 bg-surface-container-lowest rounded">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 border transition-all ${
                i === activeStep
                  ? 'bg-primary-container border-white scale-110 shadow-[0_0_8px_#c3f400]'
                  : isPlaying && i % 4 === 0
                  ? 'bg-outline-variant/50 border-outline'
                  : 'bg-background border-outline-variant'
              }`}
              title={`Step ${i + 1}`}
            />
          ))}
        </div>

        {/* Playback Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-1">
          {/* Main Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="p-3 border border-primary text-primary hover:bg-surface-container-high hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer rounded"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="p-4 bg-primary-container text-on-primary-container font-black border-2 border-white flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#ffffff] active:translate-y-0 transition-all cursor-pointer rounded"
              title={isPlaying ? 'Pause Snot Synth' : 'Play Snot Synth'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span className="font-mono text-xs uppercase tracking-widest font-black">STFU</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span className="font-mono text-xs uppercase tracking-widest font-black">LOUD</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              className="p-3 border border-primary text-primary hover:bg-surface-container-high hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer rounded"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Volume and Mix Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-on-surface-variant hover:text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-24 h-1 bg-background rounded-lg appearance-none cursor-pointer accent-[#c3f400] border border-outline-variant"
            />
            <span className="text-[10px] font-mono text-on-surface-variant w-8 text-right">
              {isMuted ? 'MUTE' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
        </div>

        {/* Track Selection List */}
        <div className="mt-2 border-t border-dashed border-outline-variant pt-3">
          <p className="text-[10px] font-mono tracking-widest text-on-surface-variant uppercase mb-2 flex items-center gap-1">
            <Music className="w-3 h-3" /> TRACK LIST // PICK YOUR DISTORTION:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {TRACKS_DATA.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => {
                  onTrackChange(t.id);
                  if (!isPlaying) setIsPlaying(true);
                }}
                className={`flex justify-between items-center px-2 py-1.5 border transition-all text-left rounded cursor-pointer ${
                  t.id === currentTrackId
                    ? 'bg-primary-container/25 text-white border-[#c3f400] font-bold'
                    : 'bg-background hover:bg-surface-container-high text-on-surface-variant border-outline-variant hover:text-white'
                }`}
              >
                <span className="truncate">
                  {idx + 1}. {t.title}
                </span>
                <span className="font-mono text-[10px] opacity-70 ml-2">{t.duration}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Expandable Punk Lyrics component */}
        <LyricsPane currentTrack={currentTrack} />
      </div>
    </div>
  );
}
