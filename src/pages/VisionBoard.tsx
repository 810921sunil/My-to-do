import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Target, 
  Plus, 
  Trash2, 
  CheckSquare, 
  Square, 
  Award, 
  TrendingUp, 
  Plane, 
  Briefcase, 
  Heart, 
  Wallet, 
  Code2
} from 'lucide-react';

interface VisionGoal {
  id: string;
  title: string;
  category: 'career' | 'wealth' | 'health' | 'tech' | 'travel';
  targetYear: string;
  milestones: Array<{ id: string; text: string; done: boolean }>;
}

export const VisionBoard: React.FC = () => {
  const [goals, setGoals] = useState<VisionGoal[]>(() => {
    const saved = localStorage.getItem('z_vision_goals');
    return saved ? JSON.parse(saved) : [
      {
        id: 'v1',
        title: 'Land High-Growth Full-Stack Engineer Role',
        category: 'career',
        targetYear: '2026',
        milestones: [
          { id: 'm1', text: 'Build 3 Full-Stack Projects in React & Node', done: true },
          { id: 'm2', text: 'Solve 150+ Medium DSA Problems', done: true },
          { id: 'm3', text: 'Clear Technical Interviews', done: false }
        ]
      },
      {
        id: 'v2',
        title: 'Achieve Peak Physical Fitness & 12% Bodyfat',
        category: 'health',
        targetYear: '2026',
        milestones: [
          { id: 'm4', text: 'Drink 3L Water Daily for 30 Days', done: true },
          { id: 'm5', text: 'Hit 100kg Bench Press PR', done: false },
          { id: 'm6', text: 'Complete 10km Marathon Run', done: false }
        ]
      },
      {
        id: 'v3',
        title: 'Master System Design & Microservices Architecture',
        category: 'tech',
        targetYear: '2027',
        milestones: [
          { id: 'm7', text: 'Read Designing Data-Intensive Applications', done: true },
          { id: 'm8', text: 'Build Distributed Redis & Queue System', done: false }
        ]
      }
    ];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'career' | 'wealth' | 'health' | 'tech' | 'travel'>('career');
  const [newYear, setNewYear] = useState('2026');
  const [newMilestoneText, setNewMilestoneText] = useState('');

  useEffect(() => {
    localStorage.setItem('z_vision_goals', JSON.stringify(goals));
  }, [goals]);

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          milestones: g.milestones.map(m => m.id === milestoneId ? { ...m, done: !m.done } : m)
        };
      }
      return g;
    }));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const initialMilestones = newMilestoneText.trim()
      ? newMilestoneText.split('\n').filter(t => t.trim().length > 0).map((t, idx) => ({
          id: `m_${Date.now()}_${idx}`,
          text: t.trim(),
          done: false
        }))
      : [{ id: `m_${Date.now()}`, text: 'Initial Milestone Target', done: false }];

    setGoals(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newTitle.trim(),
        category: newCategory,
        targetYear: newYear,
        milestones: initialMilestones
      }
    ]);

    setNewTitle('');
    setNewMilestoneText('');
    setShowAddModal(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const getCategoryIcon = (cat: string) => {
    if (cat === 'career') return <Briefcase className="w-4 h-4 text-blue-400" />;
    if (cat === 'wealth') return <Wallet className="w-4 h-4 text-amber-400" />;
    if (cat === 'health') return <Heart className="w-4 h-4 text-rose-400" />;
    if (cat === 'tech') return <Code2 className="w-4 h-4 text-purple-400" />;
    return <Plane className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#0B0F19] to-amber-950/40 border border-white/10 glass-panel shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-glow">
              <Target className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              Interactive Vision Board & Life Goals Matrix
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Define long-term life aspirations, track sub-milestones, and manifest your career roadmap.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-bold shadow-glow transition-all z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vision Goal</span>
        </button>
      </div>

      {/* Daily Affirmation Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
        <p className="italic font-medium">
          "What you stay focused on grows. Consistency in daily small steps transforms visionary goals into reality."
        </p>
      </div>

      {/* Vision Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const completedCount = goal.milestones.filter(m => m.done).length;
          const percent = goal.milestones.length > 0 ? Math.round((completedCount / goal.milestones.length) * 100) : 0;

          return (
            <div 
              key={goal.id}
              className="p-5 rounded-3xl glass-panel border border-white/5 bg-white/[0.01] hover:border-white/10 transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(goal.category)}
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] font-extrabold text-gray-300 uppercase">
                      {goal.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold font-mono">
                      Target: {goal.targetYear}
                    </span>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1 rounded-lg text-gray-500 hover:text-rose-400 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{goal.title}</h3>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400">
                    <span>Progress ({completedCount}/{goal.milestones.length})</span>
                    <span className="text-purple-400">{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Milestones Checklist */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Milestones</span>
                  {goal.milestones.map(m => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(goal.id, m.id)}
                      className="flex items-start gap-2.5 text-xs text-gray-300 cursor-pointer hover:text-white transition-all"
                    >
                      {m.done ? (
                        <CheckSquare className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                      )}
                      <span className={m.done ? 'line-through text-gray-500' : ''}>{m.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel border border-white/10 bg-[#070b14] space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              Add Vision Goal
            </h3>

            <form onSubmit={handleAddGoal} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Vision Goal Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Master Machine Learning & AI Engineering"
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="career">Career</option>
                    <option value="tech">Technology</option>
                    <option value="health">Health & Fitness</option>
                    <option value="wealth">Wealth & Finance</option>
                    <option value="travel">Travel & Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Target Year</label>
                  <input
                    type="text"
                    value={newYear}
                    onChange={e => setNewYear(e.target.value)}
                    placeholder="2026"
                    className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Milestones (1 per line)</label>
                <textarea
                  rows={3}
                  value={newMilestoneText}
                  onChange={e => setNewMilestoneText(e.target.value)}
                  placeholder="Complete Python Course&#10;Build 2 PyTorch Models"
                  className="w-full bg-[#060813] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
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
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-glow"
                >
                  Save Vision Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
