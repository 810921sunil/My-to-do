import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Trophy, 
  Award, 
  Zap, 
  Star, 
  Share2, 
  CheckCircle2, 
  Flame, 
  ShieldCheck, 
  Sparkles,
  Copy,
  Crown
} from 'lucide-react';

interface AchievementBadge {
  id: string;
  title: string;
  desc: string;
  icon: string;
  isUnlocked: boolean;
  xpReward: number;
}

export const GamifiedLevelSystem: React.FC = () => {
  const { tasks, habits, courses, transactions } = useData();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const activeHabitsCount = habits.filter(h => h.streak > 0).length;
  const completedCoursesCount = courses.filter(c => c.isCompleted).length;
  const txCount = transactions.length;

  // Compute Total XP Points
  const totalXP = (completedTasksCount * 50) + (activeHabitsCount * 30) + (completedCoursesCount * 100) + (txCount * 20) + 450; // 450 base XP

  // Compute Level
  const currentLevel = Math.floor(totalXP / 200) + 1;
  const xpInCurrentLevel = totalXP % 200;
  const levelProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / 200) * 100));

  const getRankTitle = (lvl: number) => {
    if (lvl <= 5) return 'Productivity Novice';
    if (lvl <= 15) return 'Focus Warrior';
    if (lvl <= 30) return 'Routine Master';
    return 'Zen Productivity Titan';
  };

  const badgesList: AchievementBadge[] = [
    { id: 'b1', title: 'First Task Solved', desc: 'Completed your first task card', icon: '🏆', isUnlocked: completedTasksCount > 0, xpReward: 50 },
    { id: 'b2', title: 'Habit Igniter', desc: 'Maintained an active habit streak', icon: '🔥', isUnlocked: activeHabitsCount > 0, xpReward: 100 },
    { id: 'b3', title: 'Financial Master', desc: 'Logged financial transactions', icon: '💰', isUnlocked: txCount > 0, xpReward: 75 },
    { id: 'b4', title: 'Course Graduate', desc: 'Finished a online skill course', icon: '🎓', isUnlocked: completedCoursesCount > 0, xpReward: 150 },
    { id: 'b5', title: 'Level 5 Unlocked', desc: 'Reached Level 5 in Life OS', icon: '⭐', isUnlocked: currentLevel >= 5, xpReward: 200 },
    { id: 'b6', title: 'Zen Titan Scholar', desc: 'Earned over 1000 Total XP', icon: '👑', isUnlocked: totalXP >= 1000, xpReward: 500 }
  ];

  const shareText = `🚀 I just reached Level ${currentLevel} (${getRankTitle(currentLevel)}) on Life OS with ${totalXP} XP points! 🎯 Check out my productivity streak!`;

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-[#0B0F19] to-purple-950/40 border border-white/10 glass-panel shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-glow">
              <Crown className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              Gamified Life XP & Achievement System
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Earn XP for completed tasks, habits, and courses. Level up your productivity rank!
          </p>
        </div>

        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs font-bold shadow-glow transition-all z-10"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Rank Card</span>
        </button>
      </div>

      {/* Main Level Progress Banner */}
      <div className="p-6 rounded-3xl glass-panel border border-amber-500/20 bg-amber-500/[0.01] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-glow">
              L{currentLevel}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">{getRankTitle(currentLevel)}</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                  Level {currentLevel}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Total XP Earned: <strong className="text-amber-300 font-mono">{totalXP} XP</strong>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-400 font-mono">{xpInCurrentLevel} / 200 XP to Level {currentLevel + 1}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${levelProgressPercent}%` }}
          />
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Achievement Badges Vault ({badgesList.filter(b => b.isUnlocked).length} / {badgesList.length} Unlocked)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badgesList.map(badge => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl glass-panel border transition-all space-y-3 ${
                badge.isUnlocked 
                  ? 'border-amber-500/30 bg-amber-500/[0.02] shadow-lg' 
                  : 'border-white/5 bg-white/[0.01] opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{badge.icon}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  badge.isUnlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  +{badge.xpReward} XP
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{badge.title}</span>
                  {badge.isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </h4>
                <p className="text-[10px] text-gray-400 mt-1">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel border border-amber-500/30 bg-[#070b14] space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-400" />
                Share Rank Card
              </h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-white text-xs">✕</button>
            </div>

            {/* Share Preview Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950 via-[#0B0F19] to-purple-950 border border-amber-500/40 text-center space-y-3 shadow-glow">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 mx-auto text-2xl font-black">
                👑
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-white">{getRankTitle(currentLevel)}</h4>
                <p className="text-xs text-amber-400 font-bold">Level {currentLevel} • {totalXP} Total XP</p>
              </div>

              <p className="text-[11px] text-gray-300 italic">"Building daily discipline with Life OS."</p>
            </div>

            {/* Copy Button */}
            <div className="space-y-2">
              <button
                onClick={handleCopyShare}
                className="w-full flex items-center justify-center gap-2 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs font-bold shadow-glow transition-all"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedToast ? 'Copied to Clipboard!' : 'Copy Social Media Share Post'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
