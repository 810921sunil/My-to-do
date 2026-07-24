import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  Sparkles, 
  Bell, 
  Play, 
  Pause, 
  Clock, 
  CheckCircle2, 
  Zap, 
  X,
  Volume2
} from 'lucide-react';

export const DynamicIsland: React.FC = () => {
  const { tasks, getProductivityMetrics } = useData();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeAlert, setActiveAlert] = useState<{
    id: string;
    title: string;
    sub: string;
    type: 'pomodoro' | 'reminder' | 'ai' | 'achievement';
    icon: string;
  } | null>({
    id: 'pomo_1',
    title: 'Focus Session Active',
    sub: 'Pomodoro Timer: 18m 42s remaining',
    type: 'pomodoro',
    icon: '⚡'
  });

  const [timerSeconds, setTimerSeconds] = useState(1122); // 18m 42s
  const [isRunning, setIsRunning] = useState(true);

  // Timer loop
  useEffect(() => {
    let interval: any;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!activeAlert) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 font-sans">
      
      {/* Collapsed Pill */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0b0f24]/90 border border-white/10 backdrop-blur-md shadow-2xl hover:scale-105 transition-all text-xs cursor-pointer group"
        >
          <div className="flex items-center gap-1.5 text-blue-400 font-bold">
            <span className="animate-pulse">{activeAlert.icon}</span>
            <span className="text-[11px] text-gray-200 font-semibold">{activeAlert.title}</span>
          </div>

          <div className="h-3 w-px bg-white/10" />

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-indigo-400 font-bold">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>
        </button>
      ) : (
        /* Expanded Island Card */
        <div className="w-80 sm:w-96 rounded-3xl bg-[#0b0f24]/95 border border-white/15 backdrop-blur-xl p-4 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">{activeAlert.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-gray-200">{activeAlert.title}</h4>
                <span className="text-[10px] text-gray-500 font-medium">{activeAlert.sub}</span>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pomodoro Timer Controls */}
          {activeAlert.type === 'pomodoro' && (
            <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
              <div className="space-y-0.5">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Remaining Time</span>
                <div className="text-2xl font-bold font-mono text-indigo-300">{formatTimer(timerSeconds)}</div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`p-2.5 rounded-xl font-bold transition-all shadow-glow ${
                    isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setTimerSeconds(1500)} // Reset 25 mins
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl border border-white/5"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center text-[10px] text-gray-400 pt-1">
            <span>Dynamic Notification Active</span>
            <button 
              onClick={() => setIsExpanded(false)} 
              className="text-blue-400 font-bold hover:underline"
            >
              Minimize Pill
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
