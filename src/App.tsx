import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// Pages
import { Dashboard } from './pages/Dashboard';
import { CalendarView } from './pages/CalendarView';
import { College } from './pages/College';
import { SkillsCourses } from './pages/SkillsCourses';
import { WorkBusiness } from './pages/WorkBusiness';
import { HealthWellness } from './pages/HealthWellness';
import { FinanceManager } from './pages/FinanceManager';
import { PersonalReading } from './pages/PersonalReading';
import { NotesFileVault } from './pages/NotesFileVault';
import { AiPlanner } from './pages/AiPlanner';
import { Settings } from './pages/Settings';
import { TaskManager } from './pages/TaskManager';
import { PlacementPrep } from './pages/PlacementPrep';
import { ActivityLogView } from './pages/ActivityLogView';
import { DigitalWellbeing } from './pages/DigitalWellbeing';
import { ReportsAnalytics } from './pages/ReportsAnalytics';
import { SmartAutomations } from './pages/SmartAutomations';
import { AndroidCompanion } from './pages/AndroidCompanion';
import { DynamicIsland } from './components/DynamicIsland';
import { FloatingAssistant } from './components/FloatingAssistant';
import { TimePicker12h } from './components/TimePicker12h';

// Authentication page
import { Sparkles, Key } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { user, loginWithEmail, loginWithGoogle, loginWithOtp, verifyOtp } = useAuth();
  const { 
    addTask, addHabit, addTransaction, addNote, 
    userMode, changeUserMode, tasks, updateTask, logActivity 
  } = useData();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeReminder, setActiveReminder] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [secondaryTab, setSecondaryTab] = useState('notes');
  const [pinUnlocked, setPinUnlocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW Registered!', reg))
        .catch(err => console.error('SW Registration failed: ', err));
    }

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Background reminder scheduler
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const curTimeStr = now.toTimeString().slice(0, 5); // HH:MM

      // Check if any non-completed task due today has a dueTime aligning with current time
      const triggered = tasks.find(t => 
        t.status !== 'completed' &&
        t.dueDate === todayStr &&
        t.dueTime === curTimeStr
      );

      if (triggered && (!activeReminder || activeReminder.id !== triggered.id)) {
        setActiveReminder(triggered);
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-200.wav');
          audio.volume = 0.5;
          audio.play();
        } catch (e) {}
        logActivity('reminder_sent', `Task alert: ${triggered.title}`);
      }
    }, 15000); // check every 15 seconds

    return () => clearInterval(interval);
  }, [tasks, user, activeReminder]);

  // Quick Add Modal States
  const [quickAddType, setQuickAddType] = useState<'task' | 'habit' | 'transaction' | 'note' | null>(null);
  
  // Quick Add Form Data
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCat, setTaskCat] = useState<any>('general');
  const [taskPriority, setTaskPriority] = useState<any>('medium');
  const [taskDueDate, setTaskDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [includeTime, setIncludeTime] = useState(false);
  const [taskDueTime, setTaskDueTime] = useState('');

  const [habitName, setHabitName] = useState('');
  const [habitCat, setHabitCat] = useState<any>('general');

  const [txDesc, setTxDesc] = useState('');
  const [txAmt, setTxAmt] = useState(10);
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txCat, setTxCat] = useState<any>('food');

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Auth screen form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authMode, setAuthMode] = useState<'email' | 'otp' | 'google'>('email');

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];

    if (quickAddType === 'task') {
      if (!taskTitle.trim()) return;
      addTask({
        title: taskTitle,
        category: taskCat,
        priority: taskPriority,
        dueDate: taskDueDate,
        dueTime: (includeTime && taskDueTime) ? taskDueTime : undefined,
        status: 'not_started',
        subTasks: []
      });
      setTaskTitle('');
      setTaskDueDate(new Date().toISOString().split('T')[0]);
      setIncludeTime(false);
      setTaskDueTime('');
    } else if (quickAddType === 'habit') {
      if (!habitName.trim()) return;
      addHabit({
        name: habitName,
        category: habitCat
      });
      setHabitName('');
    } else if (quickAddType === 'transaction') {
      if (!txDesc.trim() || txAmt <= 0) return;
      addTransaction({
        description: txDesc,
        amount: txAmt,
        type: txType,
        category: txCat,
        date: today
      });
      setTxDesc('');
      setTxAmt(10);
    } else if (quickAddType === 'note') {
      if (!noteTitle.trim()) return;
      addNote({
        title: noteTitle,
        content: noteContent,
        tags: ['Quick Note'],
        isPinned: false
      });
      setNoteTitle('');
      setNoteContent('');
    }

    setQuickAddType(null);
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      await loginWithEmail(email, password);
      if (!userMode) changeUserMode('student');
    }
  };

  const handleOtpRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpPhone) {
      await loginWithOtp(otpPhone);
      setOtpSent(true);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode) {
      await verifyOtp(otpCode);
      if (!userMode) changeUserMode('student');
    }
  };

  // Render current tab page
  const renderPage = (tabTarget: string = activeTab) => {
    switch (tabTarget) {
      case 'dashboard': return <Dashboard />;
      case 'tasks': return <TaskManager />;
      case 'calendar': return <CalendarView />;
      case 'college': return <College />;
      case 'skills': return <SkillsCourses />;
      case 'work': return <WorkBusiness />;
      case 'health': return <HealthWellness />;
      case 'finance': return <FinanceManager />;
      case 'personal': return <PersonalReading />;
      case 'notes': return <NotesFileVault />;
      case 'ai': return <AiPlanner />;
      case 'settings': return <Settings />;
      case 'placement': return <PlacementPrep />;
      case 'activities': return <ActivityLogView />;
      case 'digital_wellbeing': return <DigitalWellbeing />;
      case 'reports': return <ReportsAnalytics />;
      case 'automations': return <SmartAutomations />;
      case 'android_companion': return <AndroidCompanion />;
      default: return <Dashboard />;
    }
  };

  // 1. PIN Lock overlay check
  if (user && !pinUnlocked) {
    return (
      <div className="min-h-screen bg-[#070110] text-gray-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="glow-bg-blue top-[-100px] left-[-50px]"></div>
        <div className="glow-bg-purple bottom-[-100px] right-[-50px]"></div>
        
        <div className="w-full max-w-xs rounded-3xl border border-white/5 bg-[#0b0f24]/90 p-8 shadow-2xl relative z-10 text-center space-y-6">
          <div className="space-y-2">
            <div className="text-3xl animate-bounce">🔒</div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Enter Security PIN</h2>
            <p className="text-[10px] text-gray-500">Security lock active. Passcode required.</p>
          </div>

          <div className="flex justify-center gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div 
                key={idx} 
                className={`w-3.5 h-3.5 rounded-full border border-white/20 transition-all ${
                  pinInput.length > idx ? 'bg-indigo-500 shadow-glow' : 'bg-transparent'
                }`}
              />
            ))}
          </div>

          {pinError && (
            <p className="text-[10px] text-rose-400 font-bold bg-rose-500/10 py-1 rounded">
              Incorrect PIN code! Try again.
            </p>
          )}

          <div className="grid grid-cols-3 gap-3 font-sans">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => {
                  setPinError(false);
                  if (pinInput.length < 4) {
                    const val = pinInput + num;
                    setPinInput(val);
                    if (val === '1234') {
                      setTimeout(() => setPinUnlocked(true), 150);
                    } else if (val.length === 4) {
                      setTimeout(() => {
                        setPinError(true);
                        setPinInput('');
                      }, 200);
                    }
                  }
                }}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center font-bold text-gray-200 hover:bg-white/10 transition-all text-xs mx-auto"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setPinInput('')}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[10px] text-rose-400 hover:bg-rose-500/10 transition-all mx-auto font-bold"
            >
              Clear
            </button>
            <button
              onClick={() => {
                setPinError(false);
                if (pinInput.length < 4) {
                  const val = pinInput + '0';
                  setPinInput(val);
                  if (val === '1234') {
                    setTimeout(() => setPinUnlocked(true), 150);
                  } else if (val.length === 4) {
                    setTimeout(() => {
                      setPinError(true);
                      setPinInput('');
                    }, 200);
                  }
                }
              }}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center font-bold text-gray-200 hover:bg-white/10 transition-all text-xs mx-auto"
            >
              0
            </button>
            <button
              onClick={() => {
                setPinUnlocked(true);
              }}
              className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 hover:bg-blue-600 hover:text-white transition-all mx-auto font-bold"
            >
              Face ID
            </button>
          </div>
          
          <span className="block text-[8px] text-gray-600 font-mono">Default developer passcode is 1234</span>
        </div>
      </div>
    );
  }

  // 2. Auth Page View
  if (!user) {
    return (
      <div className="min-h-screen bg-[#060813] text-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="glow-bg-blue top-[-100px] left-[-50px]"></div>
        <div className="glow-bg-purple bottom-[-100px] right-[-50px]"></div>
        
        <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-8 shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <img src="./logo.png" alt="Life OS" className="w-16 h-16 rounded-2xl mx-auto shadow-glow border border-white/10 object-cover" />
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Life OS
            </h1>
            <p className="text-[11px] text-cyan-400 font-extrabold uppercase tracking-widest">Plan • Track • Achieve</p>
          </div>

          {/* Auth Tab selectors */}
          <div className="flex gap-2 bg-white/[0.02] border border-white/5 p-1 rounded-2xl">
            <button
              onClick={() => { setAuthMode('email'); setOtpSent(false); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                authMode === 'email' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400'
              }`}
            >
              Email Login
            </button>
            <button
              onClick={() => setAuthMode('otp')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                authMode === 'otp' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400'
              }`}
            >
              OTP Code
            </button>
          </div>

          {/* Email login */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. dev@zenith.com"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs shadow-glow transition-all"
              >
                Log In
              </button>
            </form>
          )}

          {/* OTP Code login */}
          {authMode === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleOtpRequest} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={otpPhone}
                      onChange={e => setOtpPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#060813] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs shadow-glow transition-all"
                  >
                    Send Verification Code
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpVerify} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">6-Digit Verification Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      placeholder="Enter 123456"
                      className="w-full bg-[#060813] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50 text-center tracking-widest text-lg font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs shadow-glow transition-all"
                  >
                    Confirm Code
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Social login buttons */}
          <div className="border-t border-white/5 pt-4 space-y-3">
            <button
              onClick={async () => {
                await loginWithGoogle();
                if (!userMode) changeUserMode('student');
              }}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-200 font-semibold border border-white/5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4 text-amber-400" />
              <span>Sign In with Google Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 1.5 Onboarding Layout Mode Choice Gate
  if (user && userMode === null) {
    return (
      <div className="min-h-screen bg-[#060813] text-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="glow-bg-blue top-[-100px] left-[-50px]"></div>
        <div className="glow-bg-purple bottom-[-100px] right-[-50px]"></div>
        
        <div className="w-full max-w-lg rounded-3xl border border-white/5 glass-panel p-8 shadow-2xl relative z-10 space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-xl font-bold uppercase tracking-wider text-white">
              Configure Your Workspace
            </h2>
            <p className="text-xs text-gray-500">Select a layout template custom-tailored for your daily routine.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => changeUserMode('student')}
              className="p-6 rounded-3xl border border-blue-500/10 hover:border-blue-500/30 bg-blue-500/[0.02] hover:bg-blue-500/[0.05] text-left transition-all duration-300 group space-y-3"
            >
              <div className="w-10 h-10 bg-blue-500/15 rounded-2xl flex items-center justify-center text-blue-400 font-bold group-hover:scale-105 transition-all shadow-glow text-lg">
                📚
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Student Life Mode</h4>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                  Tailored dashboard for class schedules, attendance trackers, exams countdown, study streaks, and Placement preps.
                </p>
              </div>
            </button>

            <button
              onClick={() => changeUserMode('professional')}
              className="p-6 rounded-3xl border border-purple-500/10 hover:border-purple-500/30 bg-purple-500/[0.02] hover:bg-purple-500/[0.05] text-left transition-all duration-300 group space-y-3"
            >
              <div className="w-10 h-10 bg-purple-500/15 rounded-2xl flex items-center justify-center text-purple-400 font-bold group-hover:scale-105 transition-all shadow-glow text-lg">
                💼
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Professional Mode</h4>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                  Tailored dashboard for business CRM logs, client pipelines, project backlogs, and financial statements.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Main Page View
  return (
    <div className="flex h-screen bg-[#060813] overflow-hidden text-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {isOffline && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-center py-2 text-[11px] font-bold flex items-center justify-center gap-1.5 z-20">
            <span>⚠️</span>
            <span>Local Offline Mode Active. All updates saved locally in browser vault.</span>
          </div>
        )}
        {/* Header Top Bar */}
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onQuickAdd={(type) => setQuickAddType(type)}
          isSplitScreen={isSplitScreen}
          onToggleSplitScreen={() => setIsSplitScreen(!isSplitScreen)}
        />
        
        {/* Page Inner Container */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {!isSplitScreen ? (
            renderPage(activeTab)
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-full">
              {/* Primary Panel */}
              <div className="space-y-3 border-r border-white/5 pr-0 xl:pr-4">
                <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-2 rounded-xl text-xs font-bold text-gray-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Primary Panel ({activeTab.toUpperCase()})
                  </span>
                </div>
                {renderPage(activeTab)}
              </div>

              {/* Secondary Panel */}
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-2 rounded-xl text-xs font-bold text-gray-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    Secondary Split Panel
                  </span>
                  <select
                    value={secondaryTab}
                    onChange={e => setSecondaryTab(e.target.value)}
                    className="bg-[#060813] border border-white/5 rounded-lg px-2.5 py-1 text-xs text-gray-300 focus:outline-none"
                  >
                    <option value="notes">Rich Notes & Vault</option>
                    <option value="calendar">Schedule Calendar</option>
                    <option value="tasks">Central Task Manager</option>
                    <option value="digital_wellbeing">Digital Wellbeing</option>
                  </select>
                </div>
                {renderPage(secondaryTab)}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Interactive UI Widgets */}
      <DynamicIsland />
      <FloatingAssistant />

      {/* --- QUICK ADD GENERAL OVERLAY MODAL --- */}
      {quickAddType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
              Quick Add: {quickAddType.toUpperCase()}
            </h3>

            <form onSubmit={handleQuickAddSubmit} className="space-y-4">
              
              {/* Task Fields */}
              {quickAddType === 'task' && (
                <>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Task Title</label>
                    <input
                      type="text"
                      required
                      value={taskTitle}
                      onChange={e => setTaskTitle(e.target.value)}
                      placeholder="e.g. Schedule meeting with Marketing team"
                      className="w-full bg-[#060813] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Category</label>
                      <select
                        value={taskCat}
                        onChange={e => setTaskCat(e.target.value as any)}
                        className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
                      >
                        <option value="general">General</option>
                        <option value="college">College</option>
                        <option value="skill">Skill Dev</option>
                        <option value="business">Business</option>
                        <option value="health">Health</option>
                        <option value="finance">Finance</option>
                        <option value="personal">Personal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Priority</label>
                      <select
                        value={taskPriority}
                        onChange={e => setTaskPriority(e.target.value as any)}
                        className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 p-3 rounded-2xl bg-white/[0.01] border border-white/5 mt-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="includeQuickTime"
                        checked={includeTime}
                        onChange={e => setIncludeTime(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 text-blue-600 bg-transparent focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="includeQuickTime" className="text-xs text-gray-400 select-none cursor-pointer">
                        Specify exact due time
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Due Date</label>
                        <input
                          type="date"
                          required
                          value={taskDueDate}
                          onChange={e => setTaskDueDate(e.target.value)}
                          className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>
                      {includeTime && (
                        <div>
                          <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Due Time (12h AM/PM)</label>
                          <TimePicker12h
                            value={taskDueTime || '11:00'}
                            onChange={val24 => setTaskDueTime(val24)}
                            required={includeTime}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Habit Fields */}
              {quickAddType === 'habit' && (
                <>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Habit Name</label>
                    <input
                      type="text"
                      required
                      value={habitName}
                      onChange={e => setHabitName(e.target.value)}
                      placeholder="e.g. Read 20 pages"
                      className="w-full bg-[#060813] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Habit Category</label>
                    <select
                      value={habitCat}
                      onChange={e => setHabitCat(e.target.value as any)}
                      className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
                    >
                      <option value="general">General</option>
                      <option value="health">Health & Workout</option>
                      <option value="study">Study & Academics</option>
                      <option value="coding">Coding & Projects</option>
                      <option value="personal">Personal Reading</option>
                    </select>
                  </div>
                </>
              )}

              {/* Transaction Fields */}
              {quickAddType === 'transaction' && (
                <>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Ledger Description</label>
                    <input
                      type="text"
                      required
                      value={txDesc}
                      onChange={e => setTxDesc(e.target.value)}
                      placeholder="e.g. Subscriptions renewal"
                      className="w-full bg-[#060813] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Amount ($)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={txAmt}
                        onChange={e => setTxAmt(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Type</label>
                      <select
                        value={txType}
                        onChange={e => setTxType(e.target.value as any)}
                        className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Category</label>
                    <select
                      value={txCat}
                      onChange={e => setTxCat(e.target.value as any)}
                      className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
                    >
                      <option value="food">Food</option>
                      <option value="rent">Rent</option>
                      <option value="sip">SIP Funds</option>
                      <option value="investments">Investments</option>
                      <option value="bills">Utility Bills</option>
                      <option value="salary">Salary</option>
                      <option value="business">Business</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </>
              )}

              {/* Note Fields */}
              {quickAddType === 'note' && (
                <>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Note Title</label>
                    <input
                      type="text"
                      required
                      value={noteTitle}
                      onChange={e => setNoteTitle(e.target.value)}
                      placeholder="e.g. Shopping List for Friday"
                      className="w-full bg-[#060813] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Content</label>
                    <textarea
                      value={noteContent}
                      onChange={e => setNoteContent(e.target.value)}
                      placeholder="Start drafting notes here..."
                      className="w-full h-28 bg-[#060813] border border-white/5 rounded-xl p-3 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50 resize-none font-sans"
                    />
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickAddType(null)}
                  className="flex-1 py-2 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-glow"
                >
                  Add Item
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Smart Notification Alert Overlay */}
      {activeReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 bg-[#0b0f24] p-6 space-y-4 shadow-2xl text-center border-l-4 border-l-blue-500">
            <div className="w-12 h-12 bg-blue-500/15 rounded-2xl flex items-center justify-center mx-auto text-blue-400 font-bold animate-bounce text-xl">
              ⏰
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-white">Smart Task Reminder</h3>
              <p className="text-xs text-blue-300 font-semibold">{activeReminder.title}</p>
              {activeReminder.description && (
                <p className="text-[10px] text-gray-500 italic mt-1">{activeReminder.description}</p>
              )}
            </div>

            <div className="border-t border-white/5 pt-3 space-y-2">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Snooze Alert Options</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    const now = new Date();
                    now.setMinutes(now.getMinutes() + 5);
                    const newTime = now.toTimeString().slice(0, 5);
                    const updated = { ...activeReminder, dueTime: newTime };
                    updateTask(updated);
                    setActiveReminder(null);
                    logActivity('edited', `Snoozed task ${activeReminder.title} +5m`);
                  }}
                  className="py-2 text-[10px] bg-white/5 hover:bg-white/10 rounded-xl font-bold text-gray-300 transition-all"
                >
                  5 Mins
                </button>
                <button
                  onClick={() => {
                    const now = new Date();
                    now.setMinutes(now.getMinutes() + 10);
                    const newTime = now.toTimeString().slice(0, 5);
                    const updated = { ...activeReminder, dueTime: newTime };
                    updateTask(updated);
                    setActiveReminder(null);
                    logActivity('edited', `Snoozed task ${activeReminder.title} +10m`);
                  }}
                  className="py-2 text-[10px] bg-white/5 hover:bg-white/10 rounded-xl font-bold text-gray-300 transition-all"
                >
                  10 Mins
                </button>
                <button
                  onClick={() => {
                    const now = new Date();
                    now.setMinutes(now.getMinutes() + 30);
                    const newTime = now.toTimeString().slice(0, 5);
                    const updated = { ...activeReminder, dueTime: newTime };
                    updateTask(updated);
                    setActiveReminder(null);
                    logActivity('edited', `Snoozed task ${activeReminder.title} +30m`);
                  }}
                  className="py-2 text-[10px] bg-white/5 hover:bg-white/10 rounded-xl font-bold text-gray-300 transition-all"
                >
                  30 Mins
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    const updated = { ...activeReminder, status: 'completed' as const };
                    updateTask(updated);
                    setActiveReminder(null);
                  }}
                  className="flex-1 py-2 text-xs bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-white transition-all shadow-glow"
                >
                  Complete Task
                </button>
                <button
                  onClick={() => setActiveReminder(null)}
                  className="flex-1 py-2 text-xs bg-white/5 hover:bg-white/10 font-bold rounded-xl text-gray-400 transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
