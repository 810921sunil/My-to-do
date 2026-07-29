import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { AiBurnoutPredictor } from '../components/AiBurnoutPredictor';
import { useAuth } from '../context/AuthContext';
import type { Task } from '../types';
import { 
  ClipboardList, 
  Flame, 
  Activity, 
  Hourglass, 
  Notebook, 
  Calendar,
  Smile,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Droplets,
  ArrowRight,
  GraduationCap,
  Code2,
  Briefcase,
  Dumbbell,
  CircleDollarSign,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    tasks, 
    habits, 
    transactions,
    courses,
    classes,
    crmClients,
    getProductivityMetrics, 
    getBudgetSummary,
    toggleHabitDay, 
    updateTask, 
    addTask,
    logTaskTime,
    waterIntake,
    logWater,
    userMode,
    xp,
    level,
    coins
  } = useData();

  const [quickNote, setQuickNote] = useState(() => {
    return localStorage.getItem('zenith_quick_note') || '';
  });

  const today = new Date().toISOString().split('T')[0];

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuickNote(e.target.value);
    localStorage.setItem('zenith_quick_note', e.target.value);
  };

  const metrics = getProductivityMetrics();
  const budget = getBudgetSummary();

  // Tasks due today
  const todaysTasks = tasks.filter(t => t.dueDate === today);
  const completedTodayTasks = todaysTasks.filter(t => t.status === 'completed');
  const activeTodaysTasks = todaysTasks.filter(t => t.status !== 'completed');

  // Overdue tasks
  const overdueTasks = tasks.filter(t => t.dueDate < today && t.status !== 'completed');

  // Weekly hours chart data
  const chartData = [
    { name: 'Mon', study: 4, coding: 2, exercise: 1 },
    { name: 'Tue', study: 3, coding: 4, exercise: 1.5 },
    { name: 'Wed', study: 5, coding: 3, exercise: 0.5 },
    { name: 'Thu', study: 2, coding: 5, exercise: 2 },
    { name: 'Fri', study: 6, coding: 2, exercise: 1 },
    { name: 'Sat', study: 2, coding: 6, exercise: 3 },
    { name: 'Sun', study: 1, coding: 3, exercise: 1.5 },
  ];

  // Quick Task Add State
  const [taskTitle, setTaskTitle] = useState('');
  const handleQuickAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      title: taskTitle,
      category: 'general',
      status: 'not_started',
      priority: 'medium',
      dueDate: today,
      subTasks: []
    });
    setTaskTitle('');
  };

  // Reschedule task +1 Day quick action
  const handleRescheduleOneDay = (task: Task) => {
    const d = new Date(task.dueDate);
    d.setDate(d.getDate() + 1);
    updateTask({
      ...task,
      dueDate: d.toISOString().split('T')[0]
    });
  };

  // --- POMODORO TIMER CORE STATES & LOGIC ---
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<'focus' | 'short_break' | 'long_break'>('focus');
  const [logTaskId, setLogTaskId] = useState('');

  useEffect(() => {
    let timer: any = null;
    if (pomodoroActive && pomodoroTime > 0) {
      timer = setInterval(() => {
        setPomodoroTime(prev => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setPomodoroActive(false);
      if (pomodoroMode === 'focus') {
        const timeSession = 0.42; // ~25 minutes in decimal hours
        alert('🍅 Focus Session Completed! Good work.');
        if (logTaskId) {
          logTaskTime(logTaskId, timeSession);
          alert('Session hours logged to selected task.');
        }
      } else {
        alert('Break session finished. Back to work!');
      }
      resetPomodoro(pomodoroMode);
    }
    return () => clearInterval(timer);
  }, [pomodoroActive, pomodoroTime, pomodoroMode, logTaskId]);

  const resetPomodoro = (mode: typeof pomodoroMode) => {
    setPomodoroActive(false);
    if (mode === 'focus') setPomodoroTime(25 * 60);
    else if (mode === 'short_break') setPomodoroTime(5 * 60);
    else setPomodoroTime(15 * 60);
  };

  const handleModeChange = (mode: typeof pomodoroMode) => {
    setPomodoroMode(mode);
    resetPomodoro(mode);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Quick focus command trigger from task rows
  const handleQuickFocus = (task: Task) => {
    setLogTaskId(task.id);
    setPomodoroMode('focus');
    setPomodoroTime(25 * 60);
    setPomodoroActive(true);
  };

  // --- CATEGORY SMART INSIGHTS CONFIGS ---
  const [activeInsightCat, setActiveInsightCat] = useState<'college' | 'coding' | 'work' | 'health' | 'finance'>('college');

  const getCategoryInsights = () => {
    switch (activeInsightCat) {
      case 'college':
        // Find if any class has attendance < 75%
        const lowAttendanceClass = classes.find(c => c.total > 0 && (c.attended / c.total) < 0.75);
        const collegeTasksCount = tasks.filter(t => t.category === 'college' && t.status !== 'completed').length;
        
        return {
          title: 'College Hub Insights',
          icon: GraduationCap,
          color: 'text-purple-400',
          stats: [
            { label: 'Classes Registered', value: `${classes.length} Courses` },
            { label: 'Pending Assignments', value: `${collegeTasksCount} Due` }
          ],
          warning: lowAttendanceClass 
            ? `⚠️ Low Attendance Warning: Your attendance in "${lowAttendanceClass.name}" is currently ${Math.round((lowAttendanceClass.attended / lowAttendanceClass.total) * 100)}% (minimum 75% required). Prioritize attending this class!`
            : '✅ Academics Standard: All registered courses attendances are above the 75% threshold.',
          tip: 'Tip: Upload completed practical records to the Files Vault to avoid exam marks deductions.'
        };

      case 'coding':
        const activeCourse = courses.find(c => !c.isCompleted);
        const codingHours = metrics.codingHours;
        return {
          title: 'Skills & Coding Insights',
          icon: Code2,
          color: 'text-emerald-400',
          stats: [
            { label: 'Weekly Coding Logs', value: `${codingHours} hrs` },
            { label: 'Courses in Progress', value: `${courses.filter(c => !c.isCompleted).length} Active` }
          ],
          warning: activeCourse 
            ? `💡 Course Progress: You are working on "${activeCourse.name}" (${Math.round((activeCourse.completedLectures / activeCourse.totalLectures) * 100)}% done). Complete 2 more lectures today!`
            : '💡 No active online courses in progress. Register a new roadmap path in the Skills tab.',
          tip: 'Tip: Log your daily LeetCode tasks to automatically update your weekly coding charts.'
        };

      case 'work':
        const proposalClient = crmClients.find(c => c.pipelineStage === 'proposal');
        const activeClient = crmClients.find(c => c.pipelineStage === 'active');
        return {
          title: 'Work & Business Insights',
          icon: Briefcase,
          color: 'text-amber-400',
          stats: [
            { label: 'Weekly Work Hours', value: `${metrics.totalWorkingHours} hrs` },
            { label: 'CRM Leads Tracker', value: `${crmClients.length} Contacts` }
          ],
          warning: proposalClient 
            ? `💼 Business Lead Alert: "${proposalClient.clientName}" (${proposalClient.company}) is waiting for proposal approval ($${proposalClient.value}). Schedule an update.`
            : activeClient 
              ? `💼 Active Contract: Managing project for "${activeClient.clientName}" value $${activeClient.value}.`
              : '💼 No active proposals pending. Add fresh leads inside the Work & Business CRM tab.',
          tip: 'Tip: Fill daily logbooks detailing internship deliverables to easily compile weekly reports.'
        };

      case 'health':
        const waterRemaining = Math.max(0, 3000 - waterIntake);
        return {
          title: 'Health & Workout Insights',
          icon: Dumbbell,
          color: 'text-rose-400',
          stats: [
            { label: 'Water Consumed', value: `${(waterIntake / 1000).toFixed(2)}L / 3L` },
            { label: 'Gym Checklists', value: `${habits.filter(h => h.category === 'health').length} Habits` }
          ],
          warning: waterRemaining > 0 
            ? `💧 Hydration Tracker: You need ${waterRemaining}ml more water to reach your 3L daily goal. Drink a cup now!`
            : '✅ Hydration Target Achieved: Daily target of 3,000ml water completed successfully. Great job!',
          tip: 'Tip: Keep your early wake habits active to improve sleep cycles.'
        };

      case 'finance':
        const limitPercent = budget.budgetUsedPercent;
        return {
          title: 'Finance Manager Insights',
          icon: CircleDollarSign,
          color: 'text-teal-400',
          stats: [
            { label: 'Monthly Savings', value: `$${budget.savings}` },
            { label: 'Savings Rate', value: `${budget.income > 0 ? Math.round((budget.savings / budget.income) * 100) : 0}%` }
          ],
          warning: limitPercent > 80 
            ? `⚠️ Budget Alert: Expenses have hit ${limitPercent}% of your $1,500 monthly budget limit. Minimize luxury spending!`
            : `✅ Financial Health: Expenses are under control at ${limitPercent}% of the monthly budget.`,
          tip: 'Tip: Schedule recursive SIP entries on the 15th to auto-deduct and enforce investments.'
        };
    }
  };

  const activeInsight = getCategoryInsights();
  const ActiveInsightIcon = activeInsight.icon;

  // --- SECOND BRAIN / BRAIN DUMP PARSING ENGINE ---
  const [brainDump, setBrainDump] = useState('');
  const handleBrainDumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brainDump.trim()) return;
    
    const lower = brainDump.toLowerCase();
    let category: any = 'general';
    let subCategory = '';
    
    if (lower.includes('assignment') || lower.includes('practical') || lower.includes('college')) {
      category = 'college';
      subCategory = 'Assignments';
    } else if (lower.includes('code') || lower.includes('leetcode') || lower.includes('dsa') || lower.includes('java') || lower.includes('python')) {
      category = 'skill';
      subCategory = 'DSA';
    } else if (lower.includes('gym') || lower.includes('exercise') || lower.includes('workout') || lower.includes('water')) {
      category = 'health';
      subCategory = 'Gym';
    } else if (lower.includes('buy') || lower.includes('money') || lower.includes('bill')) {
      category = 'finance';
      subCategory = 'Bills';
    }

    let priority: any = 'medium';
    if (lower.includes('urgent') || lower.includes('asap') || lower.includes('priority')) {
      priority = 'high';
    }

    addTask({
      title: brainDump,
      category,
      subCategory: subCategory || undefined,
      priority,
      dueDate: today,
      status: 'not_started',
      subTasks: []
    });

    setBrainDump('');
  };

  if (userMode === 'student') {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = days[new Date().getDay()];
    const todaysClasses = classes.filter(c => c.days.includes(currentDayName));

    const studyTasks = tasks.filter(t => (t.category === 'college' || t.category === 'skill' || t.category === 'course') && t.status !== 'completed');
    const pendingAssignments = tasks.filter(t => t.category === 'college' && (t.subCategory === 'Assignments' || t.subCategory === 'Practical Files') && t.status !== 'completed');
    const examTasks = tasks.filter(t => t.category === 'college' && (t.subCategory === 'Semester Exams' || t.subCategory === 'Internal Exams' || t.subCategory === 'Viva') && t.status !== 'completed');

    return (
      <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
        
        {/* Top Student Welcome Banner with Level / RPG stats */}
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-blue-900/20 via-indigo-950/10 to-[#060813] p-6 md:p-8">
          <div className="glow-bg-blue top-[-100px] left-[-50px]"></div>
          <div className="glow-bg-purple bottom-[-100px] right-[-50px]"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                🎓 Study Desk: {user?.displayName || 'Student Guest'}
              </h2>
              <p className="text-xs text-gray-400 max-w-xl">
                Ready to level up? Log study hours and complete assignments to earn XP coins and unlock badge metrics!
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="px-4 py-3 rounded-2xl border border-white/5 bg-[#060813]/80 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                  <Flame className="w-5 h-5 fill-orange-500/20" />
                </div>
                <div>
                  <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">STUDY STREAK</span>
                  <span className="text-base font-extrabold text-gray-200">
                    {Math.max(...habits.map(h => h.streak), 0)} Days
                  </span>
                </div>
              </div>

              <div className="px-4 py-3 rounded-2xl border border-white/5 bg-[#060813]/80 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-400 font-extrabold text-xs">
                  LVL {level}
                </div>
                <div>
                  <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">XP PROGRESS</span>
                  <span className="text-xs font-extrabold text-gray-200 block">
                    {xp} / {level * 500}
                  </span>
                  <div className="w-20 bg-white/5 rounded-full h-1 mt-1">
                    <div className="bg-yellow-400 h-1 rounded-full" style={{ width: `${Math.min(100, (xp / (level * 500)) * 100)}%` }} />
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 rounded-2xl border border-white/5 bg-[#060813]/80 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 text-sm">
                  🪙
                </div>
                <div>
                  <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">COINS</span>
                  <span className="text-base font-extrabold text-gray-200">{coins}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-3xl border border-white/5 glass-panel h-32 flex flex-col justify-between">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Today's Class Count</span>
            <h3 className="text-3xl font-extrabold text-blue-400">{todaysClasses.length} Lectures</h3>
            <span className="text-[9px] text-gray-500 font-semibold">{currentDayName} Class schedule</span>
          </div>

          <div className="p-5 rounded-3xl border border-white/5 glass-panel h-32 flex flex-col justify-between">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Daily Study Goals</span>
            <h3 className="text-3xl font-extrabold text-purple-400">{metrics.studyHours}h logged</h3>
            <span className="text-[9px] text-gray-500 font-semibold">Weekly Target: 20 Hours</span>
          </div>

          <div className="p-5 rounded-3xl border border-white/5 glass-panel h-32 flex flex-col justify-between">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tasks Done Today</span>
            <h3 className="text-3xl font-extrabold text-emerald-400">
              {completedTodayTasks.length} / {todaysTasks.length}
            </h3>
            <div className="w-full bg-white/5 rounded-full h-1 mt-1">
              <div className="bg-emerald-400 h-1 rounded-full" style={{ width: `${todaysTasks.length > 0 ? (completedTodayTasks.length / todaysTasks.length) * 100 : 0}%` }} />
            </div>
          </div>

          <div className="p-5 rounded-3xl border border-white/5 glass-panel h-32 flex flex-col justify-between">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Active Assignments</span>
            <h3 className="text-3xl font-extrabold text-amber-400">{pendingAssignments.length} Pending</h3>
            <span className="text-[9px] text-gray-500 font-semibold">Urgent deadlines highlighted</span>
          </div>
        </div>

        {/* Student Split Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Study Plan & Timetables */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Today's Timetable */}
            <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                📅 Today's Class Schedule
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {todaysClasses.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-xs text-gray-500 border border-dashed border-white/5 rounded-2xl">
                    No classes scheduled for today. Focus on self-study or coding!
                  </div>
                ) : (
                  todaysClasses.map(c => {
                    const percent = c.total > 0 ? Math.round((c.attended / c.total) * 100) : 100;
                    return (
                      <div key={c.id} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-bold text-gray-300">{c.name}</h4>
                          <span className="text-[10px] text-gray-500 font-semibold block mt-0.5">
                            {c.time} | Room: {c.room || 'N/A'}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${percent < 75 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {percent}%
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Today's Study Plan Tasks */}
            <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  📚 Today's Study Plan
                </h3>
                <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2.5 py-0.5 rounded-full">
                  Self-Study Mode
                </span>
              </div>

              <div className="space-y-2">
                {studyTasks.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-500 border border-dashed border-white/5 rounded-2xl">
                    No active study tasks for today. Add new roadmap items inside the Skills tab!
                  </div>
                ) : (
                  studyTasks.slice(0, 4).map(t => (
                    <div key={t.id} className="p-3 rounded-xl bg-white/[0.01] border border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${t.priority === 'high' ? 'bg-rose-500' : t.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        <span className="text-xs font-semibold text-gray-300">{t.title}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">{t.subCategory || t.category}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pending Assignments */}
            <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                📝 Pending Assignments & Practicals
              </h3>
              <div className="space-y-2.5">
                {pendingAssignments.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-500 border border-dashed border-white/5 rounded-2xl">
                    No pending assignments. All caught up!
                  </div>
                ) : (
                  pendingAssignments.slice(0, 4).map(t => (
                    <div key={t.id} className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">{t.subCategory}</span>
                        <h4 className="text-xs font-bold text-gray-200 mt-0.5">{t.title}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-rose-400 block">Due: {t.dueDate}</span>
                        <button
                          onClick={() => {
                            const updated = { ...t, status: 'completed' as const };
                            updateTask(updated);
                          }}
                          className="text-[10px] text-emerald-400 font-semibold hover:underline mt-0.5 block"
                        >
                          Mark Done
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Second Brain Dump Console */}
            <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-3">
              <div>
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  🧠 Second Brain Dump Console
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                  Type anything on your mind (e.g. "Prepare college slides tomorrow"). The AI engine will parse details and auto-create tasks!
                </p>
              </div>

              <form onSubmit={handleBrainDumpSubmit} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={brainDump}
                  onChange={e => setBrainDump(e.target.value)}
                  placeholder="Log thought, task, or reminder..."
                  className="flex-1 bg-[#060813] border border-white/5 rounded-xl px-3.5 py-2 text-xs text-gray-300 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-glow"
                >
                  Dump Parse
                </button>
              </form>
            </div>

          </div>

          {/* Column 3: Study Timer, Exams Countdown, SGPA Gauge */}
          <div className="space-y-6">
            
            {/* Pomodoro Timer */}
            <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-[180px] relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">⏳ Focused Study Timer</span>
                <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full capitalize">
                  {pomodoroMode.replace('_', ' ')}
                </span>
              </div>

              <div className="text-center my-1.5 relative z-10">
                <span className="text-4xl font-black tracking-tight text-white font-mono">
                  {formatTime(pomodoroTime)}
                </span>
              </div>

              <div className="flex gap-2 relative z-10">
                <button
                  onClick={() => setPomodoroActive(!pomodoroActive)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all shadow-glow ${
                    pomodoroActive ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {pomodoroActive ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => resetPomodoro(pomodoroMode)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex justify-between border-t border-white/5 pt-2 text-[9px] relative z-10">
                <button onClick={() => handleModeChange('focus')} className={`font-bold ${pomodoroMode === 'focus' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>Study (25m)</button>
                <button onClick={() => handleModeChange('short_break')} className={`font-bold ${pomodoroMode === 'short_break' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>Break (5m)</button>
              </div>
            </div>

            {/* Upcoming Exams */}
            <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                📖 Upcoming Exams Calendar
              </h3>
              <div className="space-y-3">
                {examTasks.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-500 border border-dashed border-white/5 rounded-2xl">
                    No upcoming exams scheduled. Enjoy the downtime!
                  </div>
                ) : (
                  examTasks.slice(0, 3).map(e => {
                    const daysLeft = Math.ceil((new Date(e.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                    return (
                      <div key={e.id} className="p-3 rounded-2xl bg-rose-500/[0.02] border border-rose-500/10 flex justify-between items-center">
                        <div>
                          <span className="text-[8px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-bold uppercase">{e.subCategory}</span>
                          <h4 className="text-xs font-bold text-gray-200 mt-1">{e.title}</h4>
                        </div>
                        <span className="text-[10px] font-extrabold text-rose-400">
                          {daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? 'Today' : 'Overdue'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Semester Target & SGPA Calculator */}
            <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                📊 Semester Progress & SGPA target
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-semibold">Semester Target</span>
                  <span className="font-bold text-emerald-400">8.50 SGPA</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-semibold">Current CGPA</span>
                  <span className="font-bold text-blue-400">8.42 CGPA</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase">
                    <span>Syllabus Completion</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements & Badges Shelf */}
            <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                🏆 Unlocked Achievements
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Freshman', icon: '🎓', desc: 'Active Student', unlocked: true },
                  { name: 'Slayer', icon: '⚡', desc: 'DSA Active', unlocked: true },
                  { name: 'Hydrated', icon: '💧', desc: 'Drink 3L+ Daily', unlocked: waterIntake >= 8 },
                  { name: 'Knight', icon: '🍅', desc: 'Focus timer used', unlocked: xp > 0 }
                ].map(badge => (
                  <div key={badge.name} className={`p-2 rounded-2xl border flex items-center gap-2 transition-all ${
                    badge.unlocked
                      ? 'bg-blue-500/5 border-blue-500/10 text-white'
                      : 'bg-white/[0.01] border-white/5 opacity-80'
                  }`}>
                    <span className="text-xl shrink-0">{badge.icon}</span>
                    <div className="min-w-0">
                      <h4 className="text-[10px] font-extrabold truncate text-gray-300">{badge.name}</h4>
                      <p className="text-[8px] text-gray-500 truncate">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-blue-900/20 via-indigo-950/10 to-[#060813] p-6 md:p-8">
        <div className="glow-bg-blue top-[-100px] left-[10%]"></div>
        <div className="glow-bg-purple bottom-[-100px] right-[20%]"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Welcome Back, {user?.displayName || 'Zenith User'} <Smile className="w-7 h-7 text-amber-400" />
            </h2>
            <p className="text-sm text-gray-400 max-w-xl">
              You have completed <span className="text-blue-400 font-semibold">{metrics.tasksCompletedToday} tasks</span> and checked off <span className="text-orange-400 font-semibold">{metrics.habitsCompletedToday} habits</span> today. Keep up the high energy momentum!
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="px-4 py-3 rounded-2xl glass-card flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                <Flame className="w-5 h-5 fill-orange-500/20" />
              </div>
              <div>
                <span className="block text-xs text-gray-500 font-semibold">HABIT STREAK</span>
                <span className="text-lg font-bold text-gray-200">
                  {Math.max(...habits.map(h => h.streak), 0)} Days
                </span>
              </div>
            </div>
            <div className="px-4 py-3 rounded-2xl glass-card flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-gray-500 font-semibold">PRODUCTIVITY</span>
                <span className="text-lg font-bold text-gray-200">
                  {metrics.productivityScore}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Widgets Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        
        {/* Productivity Circle */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-48">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Productivity Score</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Excellent
            </span>
          </div>
          <div className="flex items-center gap-5 my-2">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-white/[0.03]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500 progress-ring__circle"
                  strokeDasharray={`${metrics.productivityScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">{metrics.productivityScore}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-gray-400">Daily Goal Completion</h4>
              <p className="text-[10px] text-gray-500">Includes due tasks & habits checked off for today.</p>
            </div>
          </div>
          <div className="text-[11px] text-gray-500">
            Current Target: 80% completion rate
          </div>
        </div>

        {/* Working Hours Track */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-48">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Weekly Time Log</span>
            <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Hourglass className="w-3 h-3" /> Weekly
            </span>
          </div>
          <div className="my-2">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {metrics.totalWorkingHours} hrs
            </h3>
            <span className="text-xs text-gray-400 font-semibold block mt-0.5">Total Intern/Work Hours Logged</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-2.5">
            <div>
              <span className="block text-[10px] text-gray-500 font-bold uppercase">Study</span>
              <span className="text-xs font-bold text-purple-400">{metrics.studyHours}h</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-500 font-bold uppercase">Coding</span>
              <span className="text-xs font-bold text-emerald-400">{metrics.codingHours}h</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-500 font-bold uppercase">Gym</span>
              <span className="text-xs font-bold text-rose-400">{metrics.exerciseHours}h</span>
            </div>
          </div>
        </div>

        {/* Daily Goal Progress */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-48">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Daily Task Load</span>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">
              {todaysTasks.length} Assigned
            </span>
          </div>
          <div className="my-2">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-xs text-gray-400 font-medium">Progress</span>
              <span className="text-xs font-bold text-white">
                {completedTodayTasks.length}/{todaysTasks.length} Tasks
              </span>
            </div>
            <div className="w-full bg-white/[0.04] rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${todaysTasks.length > 0 ? (completedTodayTasks.length / todaysTasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            {overdueTasks.length > 0 && (
              <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-1 rounded-lg font-bold">
                ⚠️ {overdueTasks.length} Overdue
              </span>
            )}
            <span className="text-[10px] text-gray-400 bg-white/[0.03] px-2 py-1 rounded-lg font-semibold">
              Goal: Done by 9 PM
            </span>
          </div>
        </div>

        {/* Budget overview widget */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-48">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly Budget</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              budget.budgetUsedPercent > 80 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {budget.budgetUsedPercent}% Used
            </span>
          </div>
          <div className="my-2">
            <h3 className="text-2xl font-extrabold text-white">
              ${budget.expenses} <span className="text-xs font-medium text-gray-500">/ $1500 cap</span>
            </h3>
            <span className="text-[11px] text-gray-400 font-semibold block mt-0.5">Total Expenses (Current Month)</span>
          </div>
          <div className="flex justify-between items-center border-t border-white/5 pt-2">
            <span className="text-xs text-gray-500 font-medium">Income: <span className="text-emerald-400 font-bold">${budget.income}</span></span>
            <span className="text-xs text-gray-500 font-medium">Savings: <span className="text-blue-400 font-bold">${budget.savings}</span></span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts, Pomodoro, Hydration, and Notes */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Productivity hours chart */}
        <div className="xl:col-span-2 p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Productivity & Habits Balance</h3>
              <p className="text-xs text-gray-500 font-medium">Distribution of study, coding, and exercise hours this week.</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Study
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Coding
              </span>
              <span className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Workout
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="codingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gymGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="study" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#studyGrad)" />
                <Area type="monotone" dataKey="coding" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#codingGrad)" />
                <Area type="monotone" dataKey="exercise" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#gymGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Split into Pomodoro Timer and Hydration Wave Log */}
        <div className="flex flex-col gap-6">
          
          {/* Pomodoro Focus Timer Widget */}
          <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-[180px] relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                🍅 Focus Pomodoro
              </span>
              
              <div className="flex gap-1">
                <button 
                  onClick={() => handleModeChange('focus')}
                  className={`px-1.5 py-0.5 text-[9px] rounded font-bold transition-all ${
                    pomodoroMode === 'focus' ? 'bg-red-500/20 text-red-400' : 'text-gray-500'
                  }`}
                >
                  Focus
                </button>
                <button 
                  onClick={() => handleModeChange('short_break')}
                  className={`px-1.5 py-0.5 text-[9px] rounded font-bold transition-all ${
                    pomodoroMode === 'short_break' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500'
                  }`}
                >
                  Break
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between my-2">
              <span className="text-3xl font-extrabold text-white tracking-widest font-mono">
                {formatTime(pomodoroTime)}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setPomodoroActive(!pomodoroActive)}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white rounded-xl transition-all"
                >
                  {pomodoroActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => resetPomodoro(pomodoroMode)}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white rounded-xl transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AI Burnout & Energy Predictor */}
            <AiBurnoutPredictor />

            {/* Main Grid: Left Tasks + Right Analytics */}
            <div className="flex items-center gap-2 border-t border-white/5 pt-2 text-[10px]">
              <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <select
                value={logTaskId}
                onChange={e => setLogTaskId(e.target.value)}
                className="w-full bg-transparent text-gray-400 focus:outline-none truncate font-medium"
              >
                <option value="">No Active Target Task Selected</option>
                {activeTodaysTasks.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Hydration Wave Tracker Widget */}
          <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-[180px] relative overflow-hidden group">
            
            {/* Wave Animation Background */}
            <div 
              className="absolute inset-x-0 bottom-0 bg-blue-500/10 transition-all duration-500 ease-out"
              style={{ height: `${Math.min(100, (waterIntake / 3000) * 100)}%` }}
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-blue-400/20 animate-pulse" />
            </div>

            <div className="relative z-10 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-blue-400" /> Daily Hydration
              </span>
              <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full">
                Target: 3.0L
              </span>
            </div>

            <div className="relative z-10 my-2">
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                {(waterIntake / 1000).toFixed(2)}L <span className="text-xs font-semibold text-gray-500">/ 3,000ml</span>
              </h3>
              <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Checked today</span>
            </div>

            <div className="relative z-10 flex gap-2 border-t border-white/5 pt-2">
              <button
                onClick={() => logWater(250)}
                className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-glow flex items-center justify-center gap-1"
              >
                <span>+ 250ml</span>
              </button>
              <button
                onClick={() => logWater(-250)}
                className="py-1.5 px-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-xs transition-colors"
              >
                - Cup
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Row 3: Daily Agenda, Habit checklist, and Category Smart Insights Desk */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Today's Checklist */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Today's Agenda</h3>
            </div>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">
              {todaysTasks.length} Tasks
            </span>
          </div>

          <form onSubmit={handleQuickAddTask} className="flex gap-2">
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Quick add a task due today..."
              className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/40"
            />
            <button 
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-glow"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-2 overflow-y-auto max-h-56 pr-1 scrollbar-thin">
            {todaysTasks.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">No tasks due today. Hurray!</p>
            ) : (
              todaysTasks.map(t => (
                <div 
                  key={t.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 transition-all group"
                >
                  <input
                    type="checkbox"
                    checked={t.status === 'completed'}
                    onChange={() => {
                      updateTask({ 
                        ...t, 
                        status: t.status === 'completed' ? 'not_started' : 'completed',
                        completedDate: t.status === 'completed' ? undefined : today
                      });
                    }}
                    className="w-4 h-4 rounded border-gray-600 text-blue-600 bg-transparent focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className={`block text-[11px] font-semibold truncate ${
                      t.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-200'
                    }`}>
                      {t.title}
                    </span>
                  </div>
                  
                  {/* Task Quick Action Buttons */}
                  {t.status !== 'completed' && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleQuickFocus(t)}
                        title="Focus now"
                        className="p-1 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white rounded text-[10px]"
                      >
                        <Play className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={() => handleRescheduleOneDay(t)}
                        title="Postpone +1 Day"
                        className="px-1 py-0.5 text-blue-400 bg-blue-500/10 hover:bg-blue-500 hover:text-white rounded text-[9px] font-extrabold"
                      >
                        +1d
                      </button>
                    </div>
                  )}

                  <span className={`text-[8px] font-bold uppercase px-1 rounded shrink-0 ${
                    t.priority === 'high' ? 'bg-rose-500/10 text-rose-400' : t.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {t.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Habit tracker today */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Today's Habits</h3>
            </div>
            <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-bold">
              {metrics.habitsCompletedToday}/{habits.length} Done
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-72 pr-1 scrollbar-thin">
            {habits.map(h => {
              const checked = !!h.completedDays[today];
              return (
                <button
                  key={h.id}
                  onClick={() => toggleHabitDay(h.id, today)}
                  className={`flex items-center justify-between w-full p-2.5 rounded-xl border text-left transition-all ${
                    checked 
                      ? 'bg-orange-500/10 border-orange-500/20 text-orange-300' 
                      : 'bg-white/[0.01] hover:bg-white/[0.03] border-white/5 text-gray-300'
                  }`}
                >
                  <span className="text-xs font-semibold truncate max-w-[180px]">{h.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-gray-500 font-semibold">{h.streak}d streak</span>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      checked ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-600'
                    }`}>
                      {checked && <span className="text-[9px] font-bold">✓</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Insights & Recommendation Desk (Replaces Upcoming Tasks on Dashboard) */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <ActiveInsightIcon className={`w-4 h-4 ${activeInsight.color}`} />
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">{activeInsight.title}</h3>
              </div>
              <span className="text-[9px] text-gray-500 font-bold">AI Analytics</span>
            </div>

            {/* Category Select Ticker buttons */}
            <div className="flex justify-between bg-white/[0.02] border border-white/5 p-1 rounded-xl gap-1 overflow-x-auto scrollbar-none">
              <button 
                onClick={() => setActiveInsightCat('college')}
                className={`px-2 py-1 text-[9px] font-bold rounded-lg transition-all ${
                  activeInsightCat === 'college' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Acad
              </button>
              <button 
                onClick={() => setActiveInsightCat('coding')}
                className={`px-2 py-1 text-[9px] font-bold rounded-lg transition-all ${
                  activeInsightCat === 'coding' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Code
              </button>
              <button 
                onClick={() => setActiveInsightCat('work')}
                className={`px-2 py-1 text-[9px] font-bold rounded-lg transition-all ${
                  activeInsightCat === 'work' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/20' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Work
              </button>
              <button 
                onClick={() => setActiveInsightCat('health')}
                className={`px-2 py-1 text-[9px] font-bold rounded-lg transition-all ${
                  activeInsightCat === 'health' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/20' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Health
              </button>
              <button 
                onClick={() => setActiveInsightCat('finance')}
                className={`px-2 py-1 text-[9px] font-bold rounded-lg transition-all ${
                  activeInsightCat === 'finance' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/20' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Budget
              </button>
            </div>

            {/* Smart Metrics specific to category */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {activeInsight.stats.map((s, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#060813] border border-white/5">
                  <span className="block text-[8px] text-gray-500 font-bold uppercase tracking-wider">{s.label}</span>
                  <span className="text-xs font-bold text-gray-200 mt-0.5 block">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Warn message box */}
            <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 text-[11px] text-gray-400 leading-relaxed">
              {activeInsight.warning}
            </div>
          </div>

          <div className="border-t border-white/5 pt-2 text-[10px] text-gray-500 font-semibold italic flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
            <span>{activeInsight.tip}</span>
          </div>
        </div>

      </div>

      {/* Quick notes pad - moved to dashboard bottom for workspace completeness */}
      <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-36">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
          <Notebook className="w-4 h-4 text-yellow-400" />
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Scratch Notes Pad</h3>
        </div>
        <textarea
          value={quickNote}
          onChange={handleNoteChange}
          placeholder="Type quick thoughts, phone numbers, lists, or ideas. Saved automatically in local storage..."
          className="flex-1 mt-2.5 w-full bg-white/[0.01] hover:bg-white/[0.02] focus:bg-[#090d16]/30 border border-white/5 rounded-2xl p-3 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50 resize-none transition-all"
        />
      </div>

    </div>
  );
};
