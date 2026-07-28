import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Code2, 
  Briefcase, 
  Dumbbell, 
  CircleDollarSign, 
  BookOpen, 
  FileText, 
  BrainCircuit, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Sparkles,
  Calendar,
  ListTodo,
  History,
  Smartphone,
  TrendingUp,
  Calculator,
  Award,
  Flame,
  Headphones,
  Database,
  Utensils,
  Kanban,
  Target,
  PieChart,
  Crown,
  Brain,
  Users,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode, userMode } = useData();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-400' },
    { id: 'gamified_xp', label: 'Life XP & Level Ranks', icon: Crown, color: 'text-amber-400' },
    { id: 'tasks', label: 'Task Manager', icon: ListTodo, color: 'text-sky-400' },
    { id: 'kanban_board', label: 'Project Kanban Board', icon: Kanban, color: 'text-blue-400' },
    { id: 'calendar', label: 'Schedule Calendar', icon: Calendar, color: 'text-orange-400' },
    { id: 'college', label: 'College Hub', icon: GraduationCap, color: 'text-amber-400' },
    { id: 'exam_cgpa', label: 'Exam Prep & CGPA', icon: Calculator, color: 'text-blue-400' },
    { id: 'ai_flashcards', label: 'AI Study Flashcards', icon: Brain, color: 'text-purple-400' },
    { id: 'habits_heatmap', label: '365-Day Habit Heatmap', icon: Flame, color: 'text-amber-400' },
    { id: 'skills', label: 'Skills & Courses', icon: Award, color: 'text-purple-400' },
    { id: 'placement', label: 'Career Prep', icon: Briefcase, color: 'text-amber-400' },
    { id: 'ai_interview', label: 'AI Mock Interviewer', icon: BrainCircuit, color: 'text-indigo-400' },
    { id: 'resume_builder', label: 'Resume & Portfolio PDF', icon: FileText, color: 'text-blue-400' },
    { id: 'work', label: 'Work & Business', icon: Briefcase, color: 'text-amber-400' },
    { id: 'health', label: 'Health & Workout', icon: Dumbbell, color: 'text-rose-400' },
    { id: 'nutrition_planner', label: 'Nutrition & Macros', icon: Utensils, color: 'text-amber-400' },
    { id: 'digital_wellbeing', label: 'Digital Wellbeing', icon: Smartphone, color: 'text-indigo-400' },
    { id: 'focus_music', label: 'Focus Music & Beats', icon: Headphones, color: 'text-purple-400' },
    { id: 'study_rooms', label: 'Peer Study Rooms', icon: Users, color: 'text-indigo-400' },
    { id: 'backup_vault', label: 'Data Backup & Restore', icon: Database, color: 'text-teal-400' },
    { id: 'android_companion', label: 'Android Companion App', icon: Smartphone, color: 'text-sky-400' },
    { id: 'automations', label: 'Smart Automations', icon: Zap, color: 'text-amber-400' },
    { id: 'reports', label: 'Reports & Analytics', icon: TrendingUp, color: 'text-emerald-400' },
    { id: 'weekly_report', label: 'Weekly Executive Audit', icon: FileText, color: 'text-blue-400' },
    { id: 'finance', label: 'Finance Manager', icon: CircleDollarSign, color: 'text-teal-400' },
    { id: 'smart_finance', label: 'Smart Finance Analytics', icon: PieChart, color: 'text-emerald-400' },
    { id: 'personal', label: 'Reading & Personal', icon: BookOpen, color: 'text-indigo-400' },
    { id: 'vision_board', label: 'Interactive Vision Board', icon: Target, color: 'text-purple-400' },
    { id: 'notes', label: 'Notes & Files', icon: FileText, color: 'text-cyan-400' },
    { id: 'ai', label: 'AI Daily Assistant', icon: BrainCircuit, color: 'text-violet-400' },
    { id: 'activities', label: 'Activity Log', icon: History, color: 'text-indigo-400' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-400' },
  ].filter(item => {
    if (userMode === 'student' && item.id === 'work') return false;
    if (userMode === 'professional' && (item.id === 'college' || item.id === 'placement')) return false;
    return true;
  });

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-white/5 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen glass-panel ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <img src="./logo.png" alt="Life OS Logo" className="w-10 h-10 rounded-xl shadow-glow object-cover border border-white/10" />
          <div>
            <h1 className="text-lg font-extrabold tracking-wide text-white">
              Life OS
            </h1>
            <p className="text-[9px] text-cyan-400 font-extrabold uppercase tracking-wider">Plan • Track • Achieve</p>
          </div>
        </div>

        {/* User profile brief */}
        {user && (
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.01]">
            <img 
              src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'} 
              alt={user.displayName} 
              className="w-10 h-10 rounded-full ring-2 ring-blue-500/20"
            />
            <div className="overflow-hidden">
              <h2 className="text-sm font-semibold truncate text-gray-200">
                {user.displayName}
              </h2>
              <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-blue-400 bg-blue-500/10 rounded uppercase">
                {user.isGuest ? 'Guest' : 'Premium'}
              </span>
            </div>
          </div>
        )}

        {/* Navigation items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-glow'
                    : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors group-hover:scale-110 duration-200 ${
                    isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-200'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'ai' && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold text-violet-300 bg-violet-500/20 rounded-full flex items-center gap-0.5 animate-pulse">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="p-4 border-t border-white/5 space-y-2">
          {/* Theme toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] rounded-xl border border-transparent transition-all"
          >
            <div className="flex items-center gap-3">
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-blue-400" />
                  <span>Dark Mode</span>
                </>
              )}
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl border border-transparent transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
