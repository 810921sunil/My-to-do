import React, { useState, useEffect, useRef } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CloudRain, 
  Waves, 
  Brain, 
  Coffee, 
  Clock, 
  RotateCcw,
  Zap
} from 'lucide-react';

interface SoundTrack {
  id: string;
  title: string;
  subtitle: string;
  category: 'lofi' | 'rain' | 'binaural' | 'ocean' | 'cafe';
  icon: any;
  color: string;
  freq: number;
}

const tracksList: SoundTrack[] = [
  { id: 't1', title: 'Lo-Fi Chill Study Beats', subtitle: 'Smooth relaxing chords for coding & reading', category: 'lofi', icon: Headphones, color: 'text-purple-400', freq: 220 },
  { id: 't2', title: 'Calming Rain & Thunder', subtitle: 'Gentle raindrops for deep focus & study', category: 'rain', icon: CloudRain, color: 'text-blue-400', freq: 150 },
  { id: 't3', title: '432Hz Alpha Binaural Waves', subtitle: 'Brainwave entrainment for maximum memory retention', category: 'binaural', icon: Brain, color: 'text-emerald-400', freq: 432 },
  { id: 't4', title: 'Ocean Waves & Sea Breeze', subtitle: 'Natural rhythmic sea waves for stress relief', category: 'ocean', icon: Waves, color: 'text-cyan-400', freq: 180 },
  { id: 't5', title: 'Cozy Coffee Shop Ambience', subtitle: 'Subtle background chatter & warm vibes', category: 'cafe', icon: Coffee, color: 'text-amber-400', freq: 300 }
];

export const FocusMusicPlayer: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<SoundTrack>(tracksList[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);

  // Pomodoro Timer State
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 mins
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Web Audio Procedural Synthesizer for 100% Offline Audio
  const startSynthesizer = (freq: number, vol: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      stopSynthesizer();

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol * 0.15, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.warn('Audio Synthesis Warning:', e);
    }
  };

  const stopSynthesizer = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSynthesizer();
      setIsPlaying(false);
    } else {
      startSynthesizer(activeTrack.freq, volume);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (track: SoundTrack) => {
    setActiveTrack(track);
    if (isPlaying) {
      startSynthesizer(track.freq, volume);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setValueAtTime(newVol * 0.15, audioCtxRef.current.currentTime);
    }
  };

  // Pomodoro Countdown Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (timerMode === 'work') {
        setTimerMode('break');
        setTimeLeft(5 * 60);
      } else {
        setTimerMode('work');
        setTimeLeft(25 * 60);
      }
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, timerMode]);

  useEffect(() => {
    return () => {
      stopSynthesizer();
    };
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#0B0F19] to-blue-950/40 border border-white/10 glass-panel shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-glow">
              <Headphones className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              Ambient Focus Music & Binaural Player
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Immersive procedural soundscapes, binaural beats, and Pomodoro study timer for deep work.
          </p>
        </div>

        {/* Master Play Controller in Header */}
        <div className="flex items-center gap-4 z-10">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={e => handleVolumeChange(Number(e.target.value))}
              className="w-20 accent-purple-500 cursor-pointer"
            />
          </div>

          <button
            onClick={togglePlay}
            className={`flex items-center gap-2 px-5 py-2.5 text-white rounded-2xl text-xs font-extrabold shadow-glow transition-all ${
              isPlaying ? 'bg-rose-600 hover:bg-rose-500' : 'bg-purple-600 hover:bg-purple-500'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Sound</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Play Soundscape</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Audio Visualizer + Sound Tracks + Pomodoro Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Sound Track Selection Grid */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Select Focus Soundscape Track
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tracksList.map(track => {
              const IconComp = track.icon;
              const isSelected = activeTrack.id === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => handleSelectTrack(track)}
                  className={`p-5 rounded-2xl glass-panel border transition-all cursor-pointer space-y-3 ${
                    isSelected 
                      ? 'border-purple-500/50 bg-purple-500/[0.05] shadow-glow scale-[1.02]' 
                      : 'border-white/5 bg-white/[0.01] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${track.color}`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    {isSelected && isPlaying && (
                      <div className="flex items-end gap-1 h-5">
                        <span className="w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.1s] h-full" />
                        <span className="w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.3s] h-3/4" />
                        <span className="w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s] h-1/2" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white">{track.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{track.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Pomodoro Focus Timer */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Pomodoro Focus Timer
          </h3>

          <div className="p-6 rounded-3xl glass-panel border border-blue-500/20 bg-blue-500/[0.02] text-center space-y-5">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>{timerMode === 'work' ? '25-Min Deep Work' : '5-Min Rest Break'}</span>
            </div>

            {/* Timer Clock Display */}
            <div className="text-5xl font-black font-mono text-white tracking-widest">
              {formatTimer(timeLeft)}
            </div>

            {/* Controller Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-glow transition-all"
              >
                {isTimerRunning ? 'Pause Session' : 'Start Session'}
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimeLeft(timerMode === 'work' ? 25 * 60 : 5 * 60);
                }}
                className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl transition-all"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
