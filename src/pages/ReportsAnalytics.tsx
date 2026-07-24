import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  Clock, 
  Award, 
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Download
} from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { tasks, habits, getProductivityMetrics, earnReward } = useData();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const metrics = getProductivityMetrics();
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.filter(t => t.status !== 'completed').length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Task Status distribution data for Pie Chart
  const taskStatusData = [
    { name: 'Completed', value: completedCount, color: '#10b981' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: '#f59e0b' },
    { name: 'Not Started', value: tasks.filter(t => t.status === 'not_started').length, color: '#3b82f6' },
    { name: 'Overdue/Missed', value: tasks.filter(t => t.status === 'overdue' || t.status === 'missed').length, color: '#f43f5e' }
  ].filter(item => item.value > 0);

  // Weekly Trend Data
  const trendData = [
    { day: 'Mon', score: 75, study: 4.5, focus: 2.5, screen: 5.2 },
    { day: 'Tue', score: 82, study: 5.0, focus: 3.0, screen: 4.8 },
    { day: 'Wed', score: 68, study: 3.5, focus: 2.0, screen: 6.1 },
    { day: 'Thu', score: 90, study: 6.0, focus: 4.0, screen: 3.9 },
    { day: 'Fri', score: 85, study: 5.5, focus: 3.5, screen: 4.5 },
    { day: 'Sat', score: 94, study: 7.0, focus: 5.0, screen: 3.2 },
    { day: 'Sun', score: metrics.productivityScore, study: 6.5, focus: 4.2, screen: 5.4 }
  ];

  // Category Breakdown Data
  const categoryData = [
    { cat: 'College Hub', tasks: tasks.filter(t => t.category === 'college').length },
    { cat: 'Skills & Dev', tasks: tasks.filter(t => t.category === 'skill' || t.category === 'course').length },
    { cat: 'Health & Workout', tasks: tasks.filter(t => t.category === 'health').length },
    { cat: 'Personal', tasks: tasks.filter(t => t.category === 'personal' || t.category === 'reading').length }
  ];

  const exportReportCSV = () => {
    earnReward(20, 2);
    alert('📊 Report downloaded! Exported daily productivity statistics summary.');
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Executive Analytics & Reports
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Comprehensive reports on study hours, screen time, habits, and productivity scores.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex bg-white/[0.02] border border-white/5 p-1 rounded-2xl">
            {(['daily', 'weekly', 'monthly'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
                  timeRange === range ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={exportReportCSV}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-glow transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-2">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Productivity Score</span>
          <div className="flex justify-between items-baseline">
            <h3 className="text-3xl font-extrabold text-emerald-400">{metrics.productivityScore}%</h3>
            <span className="text-xs text-emerald-400 font-bold">↑ +8% this week</span>
          </div>
          <p className="text-[10px] text-gray-500">Based on task completions and habit streaks</p>
        </div>

        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-2">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Study Hours Logged</span>
          <div className="flex justify-between items-baseline">
            <h3 className="text-3xl font-extrabold text-blue-400">38.5 hrs</h3>
            <span className="text-xs text-blue-400 font-bold">Avg 5.5 hrs/day</span>
          </div>
          <p className="text-[10px] text-gray-500">Includes college lectures & focus sessions</p>
        </div>

        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-2">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tasks Completion Rate</span>
          <div className="flex justify-between items-baseline">
            <h3 className="text-3xl font-extrabold text-purple-400">{completionRate}%</h3>
            <span className="text-xs text-purple-400 font-bold">{completedCount} Tasks Done</span>
          </div>
          <p className="text-[10px] text-gray-500">{pendingCount} tasks pending execution</p>
        </div>

        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-2">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Habit Consistency</span>
          <div className="flex justify-between items-baseline">
            <h3 className="text-3xl font-extrabold text-amber-400">86%</h3>
            <span className="text-xs text-amber-400 font-bold">{habits.length} Active Habits</span>
          </div>
          <p className="text-[10px] text-gray-500">Daily habit checks adherence rate</p>
        </div>

      </div>

      {/* Row 2: Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Productivity Trend Line Chart */}
        <div className="lg:col-span-2 p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Productivity & Focus Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} name="Score (%)" />
                <Line type="monotone" dataKey="focus" stroke="#6366f1" strokeWidth={2} name="Focus Hrs" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Distribution Pie Chart */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Task Status Breakdown</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-3">
            {taskStatusData.map(item => (
              <div key={item.name} className="flex items-center gap-2 text-[10px]">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-gray-400 font-semibold truncate">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Category Tasks Distribution Bar Chart */}
      <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Workload Distribution by Workspace</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="cat" stroke="#6b7280" fontSize={10} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }} />
              <Bar dataKey="tasks" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} name="Total Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
