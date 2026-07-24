import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  Smartphone, 
  Clock, 
  Unlock, 
  ShieldAlert, 
  UserCheck, 
  Footprints, 
  Volume2, 
  CheckCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const DigitalWellbeing: React.FC = () => {
  const { addTask, earnReward, logActivity } = useData();

  // Screen time state
  const [screenTime, setScreenTime] = useState(324); // 5h 24m in minutes
  const [unlocks, setUnlocks] = useState(42);
  const [focusTime, setFocusTime] = useState(120); // 2 hours

  // App blocker state
  const [blockedApps, setBlockedApps] = useState<string[]>(['Instagram', 'YouTube']);
  const [tempBlockedActive, setTempBlockedActive] = useState(false);
  const [blockDuration, setBlockDuration] = useState(30); // minutes

  // Alarm & Routines states
  const [alarmTime, setAlarmTime] = useState('07:00');
  const [alarmRinging, setAlarmRinging] = useState(false);
  const [routinesList, setRoutinesList] = useState<string[]>([
    'Drink Water', 
    'Exercise', 
    'Meditation', 
    'Study Session'
  ]);
  
  // Awake verification test state
  const [verificationStep, setVerificationStep] = useState<'idle' | 'steps' | 'math' | 'success'>('idle');
  const [mockSteps, setMockSteps] = useState(0);
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathSolved, setMathSolved] = useState(false);

  // App Usage data
  const appUsageData = [
    { name: 'Instagram', time: 110, limit: 60, icon: '📱' },
    { name: 'VS Code', time: 140, limit: 240, icon: '💻' },
    { name: 'YouTube', time: 90, limit: 45, icon: '🎥' },
    { name: 'LeetCode', time: 80, limit: 120, icon: '⚡' },
    { name: 'WhatsApp', time: 45, limit: 30, icon: '💬' }
  ];

  // Usage trends data
  const trendsData = [
    { day: 'Mon', screen: 340, focus: 90 },
    { day: 'Tue', screen: 290, focus: 120 },
    { day: 'Wed', screen: 410, focus: 60 },
    { day: 'Thu', screen: 310, focus: 150 },
    { day: 'Fri', screen: 380, focus: 80 },
    { day: 'Sat', screen: 450, focus: 45 },
    { day: 'Sun', screen: 324, focus: 120 }
  ];

  // Alarm simulation trigger loop
  useEffect(() => {
    let timer: any;
    if (tempBlockedActive) {
      timer = setTimeout(() => {
        setTempBlockedActive(false);
        alert('Focus Block has ended! Apps are now unblocked.');
      }, blockDuration * 1000); // simulate minutes as seconds
    }
    return () => clearTimeout(timer);
  }, [tempBlockedActive]);

  const triggerAlarmMock = () => {
    setAlarmRinging(true);
    setVerificationStep('steps');
    setMockSteps(0);
    setMathSolved(false);
    setMathAnswer('');
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-200.wav');
      audio.volume = 0.4;
      audio.play();
    } catch (e) {}
  };

  const handleStepShake = () => {
    if (mockSteps >= 14) {
      setVerificationStep('math');
    } else {
      setMockSteps(prev => prev + 2);
    }
  };

  const handleMathVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (mathAnswer === '12') {
      setMathSolved(true);
      setVerificationStep('success');
      setAlarmRinging(false);
      
      // Auto-create morning routine tasks in global state
      const today = new Date().toISOString().split('T')[0];
      
      // Add Wake Up Task completed
      addTask({
        title: `Morning Routine: Wake Up (${alarmTime})`,
        category: 'health',
        subCategory: 'Meditation',
        priority: 'high',
        dueDate: today,
        status: 'completed',
        completedDate: today,
        subTasks: []
      });

      // Add other routines
      routinesList.forEach(routine => {
        addTask({
          title: `Morning Routine: ${routine}`,
          category: 'health',
          subCategory: 'Gym',
          priority: 'medium',
          dueDate: today,
          status: 'not_started',
          subTasks: []
        });
      });

      earnReward(100, 10);
      logActivity('completed', `Wake-up routine tasks registered successfully.`);
    } else {
      alert('Wrong answer! Try again to prove you are awake.');
    }
  };

  const formatMins = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-400" /> Digital Wellbeing & usage
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Monitor phone screen time, manage routines, and configure focus blocks.</p>
        </div>

        <button
          onClick={triggerAlarmMock}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-glow transition-all"
        >
          <Volume2 className="w-4 h-4 animate-bounce" />
          <span>Simulate Morning Alarm</span>
        </button>
      </div>

      {/* Row 1: Wellbeing metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Screen Time dials */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-44 relative">
          <div className="glow-bg-blue top-[-40px] left-[-30px] opacity-20"></div>
          <div className="flex justify-between items-center z-10">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Screen Time</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-2 z-10">
            <h3 className="text-3xl font-extrabold text-white">{formatMins(screenTime)}</h3>
            <span className="text-[10px] text-gray-500 font-semibold block mt-0.5">Average usage limit: 4h 00m</span>
          </div>
          <div className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-1 rounded-xl w-fit z-10 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Over usage limit by {formatMins(screenTime - 240)}!</span>
          </div>
        </div>

        {/* Phone Unlocks */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-44">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Unlocks Count</span>
            <Unlock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-2">
            <h3 className="text-3xl font-extrabold text-white">{unlocks} Unlocks</h3>
            <span className="text-[10px] text-gray-500 font-semibold block mt-0.5">Target: Under 30 unlocks daily</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1">
            <div className="bg-indigo-500 h-1 rounded-full" style={{ width: `${Math.min(100, (unlocks / 30) * 100)}%` }} />
          </div>
        </div>

        {/* Deep Work Focus Hours */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-44">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Focus Time Logged</span>
            <span className="text-xl">🎯</span>
          </div>
          <div className="my-2">
            <h3 className="text-3xl font-extrabold text-white">{formatMins(focusTime)}</h3>
            <span className="text-[10px] text-gray-500 font-semibold block mt-0.5">Aiming for 3 hours daily target</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl w-fit">
            ✓ Unlocked 60% of focus goals
          </div>
        </div>

      </div>

      {/* Row 2: Blocker & Alarm simulator */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* App limits & Blocker simulator */}
        <div className="xl:col-span-2 p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">App-wise usage limits</h3>
          
          <div className="space-y-4">
            {appUsageData.map(app => {
              const isOverLimit = app.time > app.limit;
              const percent = Math.round((app.time / app.limit) * 100);
              return (
                <div key={app.name} className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl">{app.icon}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-200">{app.name}</h4>
                      <span className="text-[10px] text-gray-500 block">{formatMins(app.time)} used / {formatMins(app.limit)} limit</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-1 max-w-xs sm:max-w-md">
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full transition-all ${isOverLimit ? 'bg-rose-500' : 'bg-blue-600'}`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-extrabold shrink-0 w-8 text-right ${isOverLimit ? 'text-rose-400' : 'text-gray-400'}`}>
                      {percent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="space-y-0.5 text-left">
              <span className="text-xs font-bold text-gray-300">Temp App-Block Shield</span>
              <p className="text-[10px] text-gray-500">Lock distraction apps (Instagram, YouTube) for focus hours.</p>
            </div>

            <div className="flex gap-2 items-center w-full sm:w-auto">
              <select
                value={blockDuration}
                onChange={e => setBlockDuration(parseInt(e.target.value) || 30)}
                className="bg-white/5 border border-white/5 rounded-xl px-2 py-1.5 text-xs text-gray-300 focus:outline-none"
              >
                <option value={10}>10 Seconds (Mock)</option>
                <option value={30}>30 Seconds (Mock)</option>
                <option value={60}>60 Seconds (Mock)</option>
              </select>
              
              <button
                onClick={() => setTempBlockedActive(!tempBlockedActive)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-glow transition-all ${
                  tempBlockedActive ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {tempBlockedActive ? 'Disable Shield' : 'Lock Apps Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Morning Alarm Configuration Desk */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              ⏰ Morning Alarms & routines
            </h3>

            <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-gray-500 font-bold uppercase">Wake Up alarm</span>
                <input 
                  type="time" 
                  value={alarmTime}
                  onChange={e => setAlarmTime(e.target.value)}
                  className="bg-transparent text-xl font-bold text-white focus:outline-none w-24 border-b border-white/5 pb-0.5"
                />
              </div>
              <span className="text-xl">🔔</span>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block"> morning tasks list</span>
              {routinesList.map(r => (
                <div key={r} className="flex justify-between items-center text-xs text-gray-300 p-2 rounded-xl bg-white/[0.01] border border-white/5">
                  <span>{r}</span>
                  <button 
                    onClick={() => setRoutinesList(prev => prev.filter(item => item !== r))}
                    className="text-rose-400 font-bold hover:underline"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const taskName = prompt('Enter routine task name (e.g. Journaling):');
                  if (taskName) setRoutinesList(prev => [...prev, taskName]);
                }}
                className="text-[10px] text-indigo-400 hover:underline font-bold"
              >
                + Add Routine Task option
              </button>
            </div>
          </div>

          <p className="text-[9.5px] text-gray-500 leading-relaxed border-t border-white/5 pt-3">
            Intelligent Wake-up: When alarm rings, complete steps simulator & math questions verification to automatically mark morning tasks done!
          </p>
        </div>

      </div>

      {/* Row 3: Daily Screen Time graphs */}
      <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Weekly screen time trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#6b7280" fontSize={10} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }} />
              <Bar dataKey="screen" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={24} name="Screen Time (Mins)" />
              <Bar dataKey="focus" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} name="Focus Time (Mins)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- ALARM RINGING WIDGET MODAL OVERLAY --- */}
      {alarmRinging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 bg-[#0b0f24] p-6 space-y-6 text-center shadow-2xl relative border-l-4 border-l-indigo-500 animate-pulse">
            
            <div className="space-y-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider animate-bounce block">🚨 Alarm ringing 🚨</span>
              <h2 className="text-3xl font-black text-white font-mono">{alarmTime} AM</h2>
              <p className="text-xs text-gray-400">Prove you are awake by solving validation tasks!</p>
            </div>

            {verificationStep === 'steps' && (
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex justify-center text-4xl">🚶</div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-200">Activity Motion Check</h4>
                  <p className="text-[10px] text-gray-500">Walk or shake phone to complete 15 steps</p>
                </div>
                <div className="text-xl font-bold text-white">{mockSteps} / 15 Steps</div>
                <button
                  onClick={handleStepShake}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow flex items-center justify-center gap-1"
                >
                  <Footprints className="w-4 h-4" />
                  <span>Simulate Walk Step</span>
                </button>
              </div>
            )}

            {verificationStep === 'math' && (
              <form onSubmit={handleMathVerify} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex justify-center text-4xl">🧠</div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-200">Mental Alertness Quiz</h4>
                  <p className="text-[10px] text-gray-500">Solve equations to confirm alertness level</p>
                </div>
                <div className="text-lg font-bold text-indigo-300">4 x 3 = ?</div>
                <input
                  type="number"
                  required
                  value={mathAnswer}
                  onChange={e => setMathAnswer(e.target.value)}
                  placeholder="Enter Answer"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-center text-xs text-gray-300 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow flex items-center justify-center gap-1"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Verify Awake Status</span>
                </button>
              </form>
            )}

            {verificationStep === 'success' && (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-4 text-center">
                <div className="text-4xl text-emerald-400">🎉</div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-emerald-400">Verification complete!</h4>
                  <p className="text-[10px] text-gray-400">Good morning! Morning routines have been automatically registered to your tasks checklist.</p>
                </div>
                <button
                  onClick={() => setAlarmRinging(false)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow"
                >
                  Confirm & Dismiss Alarm
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
