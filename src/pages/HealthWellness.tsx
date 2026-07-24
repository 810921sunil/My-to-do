import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  Dumbbell, 
  Flame, 
  Droplet, 
  Moon, 
  Scale, 
  Plus, 
  Trash2,
  Brain
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const HealthWellness: React.FC = () => {
  const { tasks, habits, updateTask, addTask, deleteTask } = useData();

  // Water Intake State
  const [waterGlasses, setWaterGlasses] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`z_water_${today}`);
    return saved ? parseInt(saved) : 0;
  });

  const addWater = () => {
    const today = new Date().toISOString().split('T')[0];
    const val = waterGlasses + 1;
    setWaterGlasses(val);
    localStorage.setItem(`z_water_${today}`, val.toString());
  };

  const resetWater = () => {
    const today = new Date().toISOString().split('T')[0];
    setWaterGlasses(0);
    localStorage.setItem(`z_water_${today}`, '0');
  };

  // Sleep Logger State
  const [sleepLogs, setSleepLogs] = useState<{ date: string; hours: number }[]>(() => {
    const saved = localStorage.getItem('z_sleep_logs');
    return saved ? JSON.parse(saved) : [
      { date: '07-17', hours: 7 },
      { date: '07-18', hours: 6.5 },
      { date: '07-19', hours: 8 },
      { date: '07-20', hours: 5.5 },
      { date: '07-21', hours: 7.5 },
      { date: '07-22', hours: 7 },
      { date: '07-23', hours: 8 },
    ];
  });

  const [inputSleep, setInputSleep] = useState('');
  
  const handleAddSleep = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputSleep);
    if (isNaN(val) || val <= 0) return;
    const todayStr = new Date().toISOString().slice(5, 10); // MM-DD
    const list = [...sleepLogs.slice(-6), { date: todayStr, hours: val }];
    setSleepLogs(list);
    localStorage.setItem('z_sleep_logs', JSON.stringify(list));
    setInputSleep('');
  };

  // Weight Logger State
  const [weightLogs, setWeightLogs] = useState<{ date: string; weight: number }[]>(() => {
    const saved = localStorage.getItem('z_weight_logs');
    return saved ? JSON.parse(saved) : [
      { date: '07-01', weight: 75.2 },
      { date: '07-08', weight: 74.8 },
      { date: '07-15', weight: 74.3 },
      { date: '07-22', weight: 73.9 },
    ];
  });

  const [inputWeight, setInputWeight] = useState('');

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputWeight);
    if (isNaN(val) || val <= 0) return;
    const todayStr = new Date().toISOString().slice(5, 10);
    const list = [...weightLogs.slice(-6), { date: todayStr, weight: val }];
    setWeightLogs(list);
    localStorage.setItem('z_weight_logs', JSON.stringify(list));
    setInputWeight('');
  };

  // Workout / Gym Tasks
  const healthTasks = tasks.filter(t => t.category === 'health');

  // New Workout Task State
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutCategory, setWorkoutCategory] = useState('Gym'); // Gym, Yoga, Meditation, Cardio

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutTitle.trim()) return;
    addTask({
      title: workoutTitle,
      category: 'health',
      subCategory: workoutCategory,
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'not_started',
      subTasks: []
    });
    setWorkoutTitle('');
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Grid Row 1: Water and Workout Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Animated Water Intake Glass */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-96 relative overflow-hidden">
          <div className="glow-bg-blue top-[-50px] right-[-50px] opacity-30"></div>
          
          <div className="flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Hydration Monitor</h3>
            </div>
            <button 
              onClick={resetWater}
              className="text-[10px] text-gray-500 hover:text-gray-300 font-semibold"
            >
              Reset Today
            </button>
          </div>

          {/* Graphical Water Cup */}
          <div className="flex flex-col items-center justify-center my-6 z-10 space-y-4">
            <div className="relative w-28 h-40 border-4 border-gray-700/80 rounded-b-3xl overflow-hidden flex items-end">
              {/* Animated wave height */}
              <div 
                className="w-full bg-gradient-to-t from-blue-600 to-sky-400 opacity-80 transition-all duration-500 ease-out"
                style={{ height: `${Math.min(100, (waterGlasses / 12) * 100)}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-extrabold text-white bg-black/25 px-2.5 py-1 rounded-xl">
                  {waterGlasses} / 12
                </span>
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-bold text-gray-200">{(waterGlasses * 250) / 1000} Liters Logged</h4>
              <p className="text-xs text-gray-500 font-medium">Daily Goal: 3.0 Liters (12 Glasses)</p>
            </div>
          </div>

          <button
            onClick={addWater}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-glow flex items-center justify-center gap-1.5 z-10 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Drink 250ml Glass</span>
          </button>
        </div>

        {/* Workout Tracker Checklist */}
        <div className="xl:col-span-2 p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-96">
          <div className="space-y-4 flex-1 overflow-y-auto pr-1 scrollbar-thin">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Workout Tracker</h3>
              </div>
              <span className="text-[10px] text-gray-500 font-bold">Today's Exercises</span>
            </div>

            <form onSubmit={handleAddWorkout} className="flex gap-2">
              <input
                type="text"
                required
                value={workoutTitle}
                onChange={e => setWorkoutTitle(e.target.value)}
                placeholder="Log workout routine (e.g. 5x5 Bench Press 60kg)..."
                className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/40"
              />
              <select
                value={workoutCategory}
                onChange={e => setWorkoutCategory(e.target.value)}
                className="bg-white/[0.02] border border-white/5 rounded-xl px-2.5 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/40"
              >
                <option value="Gym">Gym</option>
                <option value="Yoga">Yoga</option>
                <option value="Cardio">Cardio</option>
                <option value="Meditation">Meditation</option>
              </select>
              <button 
                type="submit"
                className="px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-glow"
              >
                Add
              </button>
            </form>

            <div className="space-y-2">
              {healthTasks.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-10">No workout programs recorded. Time to get moving!</p>
              ) : (
                healthTasks.map(t => (
                  <div 
                    key={t.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={t.status === 'completed'}
                        onChange={() => {
                          updateTask({
                            ...t,
                            status: t.status === 'completed' ? 'not_started' : 'completed'
                          });
                        }}
                        className="w-4 h-4 rounded border-gray-600 text-rose-600 bg-transparent focus:ring-0 cursor-pointer"
                      />
                      <div>
                        <span className={`text-xs font-semibold ${
                          t.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-200'
                        }`}>
                          {t.title}
                        </span>
                        <span className="block text-[9px] text-gray-500 font-semibold uppercase mt-0.5">
                          {t.subCategory}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-1 text-gray-500 hover:text-rose-400 rounded opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Grid Row 2: Sleep and Weight Trackers with Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sleep Tracker */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Sleep Duration Log</h3>
            </div>
            <form onSubmit={handleAddSleep} className="flex gap-2">
              <input
                type="number"
                step="0.5"
                required
                value={inputSleep}
                onChange={e => setInputSleep(e.target.value)}
                placeholder="Hrs (e.g. 7.5)"
                className="w-20 bg-white/[0.02] border border-white/5 rounded-xl px-2.5 py-1 text-xs text-gray-300 focus:outline-none focus:border-blue-500/40"
              />
              <button 
                type="submit"
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-glow"
              >
                Log
              </button>
            </form>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sleepLogs} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis domain={[4, 10]} stroke="#6b7280" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-gray-500 text-center font-semibold">
            Average Sleep this Week: {(sleepLogs.reduce((a, b) => a + b.hours, 0) / sleepLogs.length).toFixed(1)} Hours
          </div>
        </div>

        {/* Weight Tracker */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Weight Scale Log</h3>
            </div>
            <form onSubmit={handleAddWeight} className="flex gap-2">
              <input
                type="number"
                step="0.1"
                required
                value={inputWeight}
                onChange={e => setInputWeight(e.target.value)}
                placeholder="kg (e.g. 73.5)"
                className="w-20 bg-white/[0.02] border border-white/5 rounded-xl px-2.5 py-1 text-xs text-gray-300 focus:outline-none focus:border-blue-500/40"
              />
              <button 
                type="submit"
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-glow"
              >
                Log
              </button>
            </form>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#6b7280" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-gray-500 text-center font-semibold">
            Latest recorded Weight: {weightLogs[weightLogs.length - 1]?.weight} kg
          </div>
        </div>

      </div>

    </div>
  );
};
