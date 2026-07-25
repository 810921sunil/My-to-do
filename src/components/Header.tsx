import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Command, 
  Bell, 
  Plus, 
  Sun, 
  CloudSun, 
  Moon, 
  CloudRain, 
  Flame, 
  CheckCircle, 
  ClipboardList, 
  Clock,
  Sparkles,
  Columns,
  ShieldCheck,
  UserCheck,
  Lock,
  Menu,
  Keyboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickAdd: (type: 'task' | 'habit' | 'transaction' | 'note') => void;
  isSplitScreen?: boolean;
  onToggleSplitScreen?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  sidebarOpen,
  setSidebarOpen, 
  activeTab,
  setActiveTab,
  onQuickAdd,
  isSplitScreen,
  onToggleSplitScreen
}) => {
  const { user, logout } = useAuth();
  const { weather, quote, tasks, habits, transactions, toggleDarkMode, logWater } = useData();
  const [greeting, setGreeting] = useState('Welcome back');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickAddDropdown, setShowQuickAddDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState<any[]>([]);

  // Command Palette Overlay state
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [focusedCommandIdx, setFocusedCommandIdx] = useState(0);

  // Calculate greetings based on time
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good morning');
    else if (hours < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute notifications based on database state
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const alerts: any[] = [];

    // 1. Task Reminders due today
    tasks.forEach(t => {
      if (t.dueDate === today && t.status !== 'completed') {
        alerts.push({
          id: 't_alert_' + t.id,
          title: 'Task Due Today',
          message: t.title,
          type: 'task',
          time: t.dueTime || 'All Day'
        });
      }
    });

    // 2. High Priority overdue tasks
    tasks.forEach(t => {
      if (t.dueDate < today && t.status !== 'completed') {
        alerts.push({
          id: 't_overdue_' + t.id,
          title: 'Task Overdue!',
          message: t.title,
          type: 'overdue',
          time: 'Urgent'
        });
      }
    });

    // 3. Finance Bill payments due soon
    transactions.forEach(tx => {
      if (tx.category === 'bills' && tx.type === 'expense') {
        alerts.push({
          id: 'tx_bill_' + tx.id,
          title: 'Bill Reminder',
          message: `Pending payment for: ${tx.description} ($${tx.amount})`,
          type: 'bill',
          time: 'Payment Due'
        });
      }
    });

    setUnreadNotifications(alerts);
  }, [tasks, transactions]);

  // Weather icon selector
  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-4 h-4 text-amber-400" />;
      case 'CloudSun': return <CloudSun className="w-4 h-4 text-sky-400" />;
      case 'Moon': return <Moon className="w-4 h-4 text-indigo-300" />;
      case 'CloudRain': return <CloudRain className="w-4 h-4 text-blue-400" />;
      default: return <Sun className="w-4 h-4 text-amber-400" />;
    }
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Life Command Center';
      case 'tasks': return 'Centralized Task Manager';
      case 'calendar': return 'Schedule Calendar';
      case 'college': return 'College Hub & Academics';
      case 'skills': return 'Skill Development & Courses';
      case 'work': return 'Internship & Startup Pipelines';
      case 'health': return 'Health, Fitness & Tracker';
      case 'finance': return 'Personal Finances & Budgets';
      case 'personal': return 'Reading Bookshelf & Reminders';
      case 'notes': return 'Rich Notes & Cloud Files';
      case 'ai': return 'AI Copilot & Schedule Optimizer';
      case 'settings': return 'System Settings';
      default: return 'ZenithLife';
    }
  };

  // List of all Command Palette Actions
  const commandList = [
    { title: 'Go to Dashboard', category: 'Navigation', shortcut: 'G + D', action: () => setActiveTab('dashboard') },
    { title: 'Go to Task Manager', category: 'Navigation', shortcut: 'G + T', action: () => setActiveTab('tasks') },
    { title: 'Go to Schedule Calendar', category: 'Navigation', shortcut: 'G + C', action: () => setActiveTab('calendar') },
    { title: 'Go to College Hub', category: 'Navigation', shortcut: 'G + A', action: () => setActiveTab('college') },
    { title: 'Go to Settings', category: 'Navigation', shortcut: 'G + S', action: () => setActiveTab('settings') },
    { title: 'Toggle Dark/Light Mode', category: 'Preferences', shortcut: 'T + D', action: () => toggleDarkMode() },
    { title: 'Drink Water (+250ml cup)', category: 'Hydration', shortcut: 'W + A', action: () => logWater(250) },
    { title: 'Log Daily Gym Habit', category: 'Health', shortcut: 'H + G', action: () => onQuickAdd('habit') },
    { title: 'Create Quick Note Card', category: 'Notes', shortcut: 'N + Q', action: () => onQuickAdd('note') },
    { title: 'Record Expense Bills', category: 'Finance', shortcut: 'F + B', action: () => onQuickAdd('transaction') }
  ];

  const filteredCommands = commandList.filter(cmd => 
    cmd.title.toLowerCase().includes(commandSearch.toLowerCase()) || 
    cmd.category.toLowerCase().includes(commandSearch.toLowerCase())
  );

  const handleCommandKeySelect = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedCommandIdx(prev => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedCommandIdx(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[focusedCommandIdx]) {
        filteredCommands[focusedCommandIdx].action();
        setShowCommandPalette(false);
        setCommandSearch('');
        setFocusedCommandIdx(0);
      }
    }
  };

  return (
    <header className="relative flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#060813]/60 backdrop-blur-md z-30">
      {/* Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-gray-400 hover:text-gray-200 rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {getTabTitle(activeTab)}
          </h1>
          <p className="text-xs text-gray-400 font-medium hidden md:block">
            {user ? `${greeting}, ${user.displayName}!` : greeting}
          </p>
        </div>
      </div>

      {/* Global Command Center search trigger */}
      <div className="hidden md:block">
        <button
          onClick={() => { setShowCommandPalette(true); setFocusedCommandIdx(0); }}
          className="flex items-center gap-2.5 px-3.5 py-2 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-xl text-xs text-gray-500 font-semibold transition-all w-52 text-left"
        >
          <Search className="w-3.5 h-3.5 text-gray-500" />
          <span>Search actions...</span>
          <kbd className="ml-auto px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-gray-400">Ctrl+K</kbd>
        </button>
      </div>

      {/* Center Ticker: Weather & Quotes (hidden on small screens) */}
      <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 rounded-2xl bg-white/[0.02] border border-white/5 max-w-sm xl:max-w-lg overflow-hidden truncate">
        {/* Weather */}
        <div className="flex items-center gap-2 border-r border-white/10 pr-4 shrink-0">
          {getWeatherIcon(weather.icon)}
          <span className="text-xs font-semibold text-gray-300">{weather.temp}°C</span>
          <span className="text-[10px] text-gray-500 font-medium truncate">{weather.condition}</span>
        </div>
        {/* Quote */}
        <div className="flex items-center gap-2 text-xs truncate">
          <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
          <span className="text-gray-300 italic truncate">"{quote.text}"</span>
          <span className="text-[10px] text-gray-500 font-semibold shrink-0">— {quote.author}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Split Screen Mode toggle button */}
        <button
          onClick={onToggleSplitScreen}
          title={isSplitScreen ? "Disable Split Screen View" : "Enable Dual Split Screen View"}
          className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
            isSplitScreen 
              ? 'bg-purple-600/20 border-purple-500/40 text-purple-300 shadow-glow' 
              : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-gray-200'
          }`}
        >
          <Columns className="w-4 h-4" />
        </button>

        {/* Floating Quick Add */}
        <div className="relative">
          <button
            onClick={() => setShowQuickAddDropdown(!showQuickAddDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-glow rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Quick Add</span>
          </button>

          {showQuickAddDropdown && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowQuickAddDropdown(false)} 
              />
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/5 shadow-xl glass-panel p-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => { onQuickAdd('task'); setShowQuickAddDropdown(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/[0.05] hover:text-white rounded-lg text-left"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-blue-400" />
                  <span>Add New Task</span>
                </button>
                <button
                  onClick={() => { onQuickAdd('habit'); setShowQuickAddDropdown(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/[0.05] hover:text-white rounded-lg text-left"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>Add Habit Track</span>
                </button>
                <button
                  onClick={() => { onQuickAdd('transaction'); setShowQuickAddDropdown(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/[0.05] hover:text-white rounded-lg text-left"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Log Budget Expense</span>
                </button>
                <button
                  onClick={() => { onQuickAdd('note'); setShowQuickAddDropdown(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/[0.05] hover:text-white rounded-lg text-left"
                >
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Create Quick Note</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Firebase User Authentication Profile Badge */}
        <div>
          {user ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all text-left"
            >
              <img
                src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                alt={user.displayName}
                className="w-6 h-6 rounded-full object-cover border border-blue-500/50"
              />
              <div className="hidden lg:block text-left">
                <span className="text-xs font-bold text-gray-200 block line-clamp-1">{user.displayName}</span>
                <span className="text-[9px] text-blue-400 font-extrabold uppercase block">{user.email || 'Verified Account'}</span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-glow transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>

        {/* Notifications Panel */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-400 hover:text-gray-200 rounded-xl hover:bg-white/[0.03] transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#060813]" />
            )}
          </button>

          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowNotifications(false)} 
              />
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/5 shadow-2xl glass-panel p-2 z-20 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5 mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alert Center</span>
                  <span className="text-[10px] bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded-full font-bold">
                    {unreadNotifications.length} Active
                  </span>
                </div>
                {unreadNotifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-gray-500">
                    No active reminders. You are all set!
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {unreadNotifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`p-2.5 rounded-lg border text-left ${
                          notif.type === 'overdue' 
                            ? 'bg-rose-500/10 border-rose-500/10 text-rose-300' 
                            : 'bg-white/[0.02] border-white/5 text-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-0.5">
                          <span className="text-xs font-semibold">{notif.title}</span>
                          <span className="text-[9px] text-gray-500 font-bold uppercase">{notif.time}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-gray-400 truncate">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- CTRL+K COMMAND PALETTE OVERLAY MODAL --- */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 backdrop-blur-sm p-4 pt-20">
          <div 
            className="fixed inset-0" 
            onClick={() => setShowCommandPalette(false)} 
          />
          
          <div className="w-full max-w-lg rounded-3xl border border-white/10 glass-panel bg-[#070b14]/95 shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[420px] animate-in fade-in zoom-in-95 duration-200">
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5">
              <Search className="w-4 h-4 text-blue-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={commandSearch}
                onChange={e => { setCommandSearch(e.target.value); setFocusedCommandIdx(0); }}
                onKeyDown={handleCommandKeySelect}
                placeholder="Search tools, loggers, navigation views..."
                className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
              />
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-gray-400">ESC</kbd>
            </div>

            {/* Content Results */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500">
                  No matching shortcuts or logs found.
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const isFocused = idx === focusedCommandIdx;
                  return (
                    <button
                      key={cmd.title}
                      onClick={() => {
                        cmd.action();
                        setShowCommandPalette(false);
                        setCommandSearch('');
                      }}
                      className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-left transition-all ${
                        isFocused 
                          ? 'bg-blue-600/25 text-blue-200 border border-blue-500/20' 
                          : 'text-gray-400 hover:bg-white/[0.02] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Keyboard className={`w-3.5 h-3.5 ${isFocused ? 'text-blue-400' : 'text-gray-500'}`} />
                        <div>
                          <span className="text-xs font-semibold block text-gray-200">{cmd.title}</span>
                          <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{cmd.category}</span>
                        </div>
                      </div>
                      <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-gray-500">
                        {cmd.shortcut}
                      </kbd>
                    </button>
                  );
                })
              )}
            </div>

            {/* Instruction footer */}
            <div className="px-4 py-2 bg-white/[0.01] border-t border-white/5 flex justify-between items-center text-[9px] text-gray-500 font-semibold">
              <span className="flex items-center gap-1">
                <span>↑↓ Navigation</span>
                <span className="mx-1">•</span>
                <span>Enter Selection</span>
              </span>
              <span>ZenithLife System Console</span>
            </div>
          </div>
        </div>
      )}

      {/* --- FIREBASE AUTHENTICATION OVERLAY MODAL --- */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
};
