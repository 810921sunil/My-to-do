import React from 'react';
import { useData } from '../context/DataContext';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  HeartHandshake, 
  Sparkles, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export const AiBurnoutPredictor: React.FC = () => {
  const { tasks, habits } = useData();

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const criticalTasks = pendingTasks.filter(t => t.priority === 'critical' || t.priority === 'high').length;
  const activeHabitsCount = habits.filter(h => h.isActive).length;

  // Compute Workload & Burnout Score
  let score = (pendingTasks.length * 8) + (criticalTasks * 15) + (activeHabitsCount * 5);
  score = Math.min(100, Math.max(10, score));

  const getBurnoutStatus = (s: number) => {
    if (s >= 70) return { level: 'High Workload Risk', color: 'text-rose-400 border-rose-500/30 bg-rose-500/10', text: 'Heavy task overload detected. Take a 15-minute ambient music break and delegate non-critical tasks.' };
    if (s >= 40) return { level: 'Moderate Workload', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', text: 'Steady task volume. Maintain Pomodoro intervals and stay hydrated.' };
    return { level: 'Optimal Workload Balance', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', text: 'Great balance! Energy levels are optimal for deep focus sessions.' };
  };

  const status = getBurnoutStatus(score);

  return (
    <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-4 bg-white/[0.01]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
              AI Workload & Burnout Risk Predictor
            </h3>
            <p className="text-[10px] text-gray-400">Predicts energy exhaustion risk from active task volume.</p>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-extrabold ${status.color}`}>
          {score}% Index • {status.level}
        </span>
      </div>

      {/* Progress Index Bar */}
      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            score >= 70 ? 'bg-rose-500' : score >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="text-xs text-gray-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
        💡 <strong>AI Energy Note:</strong> {status.text}
      </p>
    </div>
  );
};
