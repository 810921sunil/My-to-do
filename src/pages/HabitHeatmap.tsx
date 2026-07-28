import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  Flame, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Award, 
  TrendingUp, 
  Zap, 
  Sparkles,
  Filter,
  Check
} from 'lucide-react';

interface HabitItem {
  id: string;
  name: string;
  category: 'health' | 'skill' | 'mindset' | 'routine';
  completedDays: Record<string, boolean>; // "YYYY-MM-DD": true
  streak: number;
  bestStreak: number;
}

export const HabitHeatmap: React.FC = () => {
  const { habits: contextHabits, toggleHabitDay } = useData();
  const currentDateStr = new Date().toISOString().split('T')[0];

  // Saved Custom Habits State
  const [habits, setHabits] = useState<HabitItem[]>(() => {
    const saved = localStorage.getItem('z_heatmap_habits');
    return saved ? JSON.parse(saved) : [
      {
        id: 'h1',
        name: 'Drink 3L Water & Stay Hydrated',
        category: 'health',
        completedDays: { '2026-07-25': true, '2026-07-26': true, '2026-07-27': true, '2026-07-28': true },
        streak: 4,
        bestStreak: 12
      },
      {
        id: 'h2',
        name: 'Solve 2 LeetCode / DSA Problems',
        category: 'skill',
        completedDays: { '2026-07-26': true, '2026-07-27': true, '2026-07-28': true },
        streak: 3,
        bestStreak: 15
      },
      {
        id: 'h3',
        name: '45-Min Gym / Cardio Workout',
        category: 'health',
        completedDays: { '2026-07-24': true, '2026-07-25': true, '2026-07-27': true },
        streak: 1,
        bestStreak: 8
      },
      {
        id: 'h4',
        name: 'Read 15 Pages of Book',
        category: 'mindset',
        completedDays: { '2026-07-27': true, '2026-07-28': true },
        streak: 2,
        bestStreak: 6
      }
    ];
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCat, setNewHabitCat] = useState<'health' | 'skill' | 'mindset' | 'routine'>('health');

  useEffect(() => {
    localStorage.setItem('z_heatmap_habits', JSON.stringify(habits));
  }, [habits]);

  // Generate 52 Weeks (364 Days) Heatmap Data Grid
  const generateHeatmapDays = () => {
    const days = [];
    const today = new Date();
    // Start 52 weeks ago
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    for (let i = 0; i < 364; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];

      // Count completions on this date across active habits
      const completionCount = habits.reduce((count, h) => {
        return count + (h.completedDays[dateStr] ? 1 : 0);
      }, 0);

      days.push({
        dateStr,
        count: completionCount
      });
    }

    return days;
  };

  const heatmapDays = generateHeatmapDays();

  // Helper for heatmap cell color intensity
  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-white/[0.03] border-white/5';
    if (count === 1) return 'bg-emerald-900/40 border-emerald-700/30';
    if (count === 2) return 'bg-emerald-700/60 border-emerald-500/40';
    if (count === 3) return 'bg-emerald-500 border-emerald-400 shadow-glow';
    return 'bg-emerald-400 border-emerald-300 shadow-glow';
  };

  // Toggle Habit for Today
  const handleToggleToday = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const isDone = !!h.completedDays[currentDateStr];
        const nextDays = { ...h.completedDays };
        let nextStreak = h.streak;

        if (isDone) {
          delete nextDays[currentDateStr];
          nextStreak = Math.max(0, h.streak - 1);
        } else {
          nextDays[currentDateStr] = true;
          nextStreak = h.streak + 1;
        }

        const nextBest = Math.max(h.bestStreak, nextStreak);

        return {
          ...h,
          completedDays: nextDays,
          streak: nextStreak,
          bestStreak: nextBest
        };
      }
      return h;
    }));
  };

  // Add Habit
  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    setHabits(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        category: newHabitCat,
        completedDays: {},
        streak: 0,
        bestStreak: 0
      }
    ]);

    setNewHabitName('');
    setShowAddModal(false);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // Calculate Metrics
  const totalCompletions = habits.reduce((sum, h) => sum + Object.keys(h.completedDays).length, 0);
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const todayDoneCount = habits.filter(h => h.completedDays[currentDateStr]).length;

  const filteredHabits = selectedCategory === 'all' 
    ? habits 
    : habits.filter(h => h.category === selectedCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#0B0F19] to-amber-950/40 border border-white/10 glass-panel shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-glow">
              <Flame className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              365-Day Habit Streaks Heatmap
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Visualize your annual consistency, track active streaks, and lock in daily routines.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold shadow-glow transition-all z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Habit</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel border border-amber-500/20 bg-amber-500/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Active Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{maxStreak}</span>
            <span className="text-xs text-amber-400 font-bold">Days Consecutive</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/20 bg-emerald-500/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Routine</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{todayDoneCount} / {habits.length}</span>
            <span className="text-xs text-emerald-400 font-bold">Completed</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-blue-500/20 bg-blue-500/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Annual Logged Days</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalCompletions}</span>
            <span className="text-xs text-blue-400 font-bold">Check-ins</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-purple-500/20 bg-purple-500/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Consistency Score</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {habits.length > 0 ? Math.round((todayDoneCount / habits.length) * 100) : 0}%
            </span>
            <span className="text-xs text-purple-400 font-bold">Rating</span>
          </div>
        </div>

      </div>

      {/* GitHub-Style 365-Day Heatmap Grid */}
      <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-4 bg-white/[0.01]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            Annual Consistency Contribution Grid (365 Days)
          </h3>

          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span>Less</span>
            <span className="w-3 h-3 rounded bg-white/[0.03] border border-white/5 inline-block" />
            <span className="w-3 h-3 rounded bg-emerald-900/40 border border-emerald-700/30 inline-block" />
            <span className="w-3 h-3 rounded bg-emerald-700/60 border border-emerald-500/40 inline-block" />
            <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-400 inline-block" />
            <span className="w-3 h-3 rounded bg-emerald-400 border border-emerald-300 inline-block" />
            <span>More</span>
          </div>
        </div>

        {/* Scrollable Heatmap Columns */}
        <div className="overflow-x-auto scrollbar-thin pb-2">
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[700px]">
            {heatmapDays.map((day, idx) => (
              <div
                key={idx}
                title={`${day.dateStr}: ${day.count} habits completed`}
                className={`w-3.5 h-3.5 rounded border transition-all hover:scale-125 hover:z-10 cursor-pointer ${getCellColor(day.count)}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Daily Routine Matrix & Category Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            Today's Habit Check-in Matrix ({currentDateStr})
          </h3>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            {['all', 'health', 'skill', 'mindset', 'routine'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all ${
                  selectedCategory === cat 
                    ? 'bg-emerald-600 text-white shadow-glow' 
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Habits Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHabits.map(habit => {
            const isDoneToday = !!habit.completedDays[currentDateStr];
            return (
              <div
                key={habit.id}
                className={`p-4 rounded-2xl glass-panel border transition-all flex items-center justify-between ${
                  isDoneToday 
                    ? 'border-emerald-500/40 bg-emerald-500/[0.03]' 
                    : 'border-white/5 bg-white/[0.01]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => handleToggleToday(habit.id)}
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all ${
                      isDoneToday 
                        ? 'bg-emerald-500 border-emerald-400 text-black shadow-glow scale-105' 
                        : 'bg-white/5 border-white/10 text-transparent hover:border-emerald-400/50'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div>
                    <h4 className={`text-xs font-bold transition-all ${isDoneToday ? 'line-through text-gray-400' : 'text-white'}`}>
                      {habit.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-gray-400 uppercase">
                        {habit.category}
                      </span>
                      <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-amber-400" />
                        {habit.streak} Day Streak
                      </span>
                      <span className="text-[10px] text-gray-500">
                        (Best: {habit.bestStreak})
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel border border-white/10 bg-[#070b14] space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Add Custom Habit Goal
            </h3>

            <form onSubmit={handleAddHabit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Habit Title</label>
                <input
                  type="text"
                  required
                  value={newHabitName}
                  onChange={e => setNewHabitName(e.target.value)}
                  placeholder="e.g. 30 Minutes DSA Coding"
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Category</label>
                <select
                  value={newHabitCat}
                  onChange={e => setNewHabitCat(e.target.value as any)}
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="health">Health & Fitness</option>
                  <option value="skill">Skill & Coding</option>
                  <option value="mindset">Mindset & Reading</option>
                  <option value="routine">Daily Routine</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-glow"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
