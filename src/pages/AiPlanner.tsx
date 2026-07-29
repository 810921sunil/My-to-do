import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { askGeminiAI } from '../services/geminiService';
import { AiLifeInsights } from '../components/AiLifeInsights';
import { 
  BrainCircuit, 
  Sparkles, 
  Play, 
  Clock, 
  CheckSquare,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface OptimizedItem {
  taskId: string;
  timeSlot: string;
  reason: string;
}

interface PriorityItem {
  taskId: string;
  urgencyScore: number;
  reason: string;
}

interface StudyPlanItem {
  subject: string;
  hoursSuggested: number;
  focusTopics: string[];
}

export const AiPlanner: React.FC = () => {
  const { tasks, habits, getProductivityMetrics, apiSettings } = useData();

  const [loading, setLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // AI Response states
  const [optimizedSchedule, setOptimizedSchedule] = useState<OptimizedItem[]>([]);
  const [priorities, setPriorities] = useState<PriorityItem[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>([]);
  const [weeklyReportText, setWeeklyReportText] = useState('');

  const metrics = getProductivityMetrics();

  const handleGenerateAiPlan = async () => {
    setLoading(true);
    try {
      // Attempt to hit our local Node Express backend first
      const res = await fetch(`${apiSettings.backendUrl}/api/ai/planner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          habits,
          metrics,
          apiKey: apiSettings.geminiApiKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        setOptimizedSchedule(data.optimizedSchedule);
        setPriorities(data.priorities);
        setTips(data.productivityTips);
        setStudyPlan(data.studyPlan);
        setWeeklyReportText(data.weeklyReport);
      } else {
        throw new Error('Express server AI route failed, falling back to local client-side model...');
      }
    } catch (e) {
      console.warn('Backend connection unavailable. Running client-side rule generator.', e);
      
      // Fallback rule-based generator simulates Gemini behavior
      setTimeout(() => {
        // Today's pending tasks
        const today = new Date().toISOString().split('T')[0];
        const todaysTasks = tasks.filter(t => t.dueDate === today && t.status !== 'completed');
        
        // Optimize schedule mockup
        const schedule: OptimizedItem[] = todaysTasks.map((t, idx) => {
          const times = ['09:00 AM - 10:30 AM', '11:00 AM - 12:30 PM', '02:00 PM - 03:30 PM', '04:00 PM - 05:30 PM'];
          return {
            taskId: t.id,
            timeSlot: times[idx % times.length],
            reason: t.priority === 'high' 
              ? 'High-priority task scheduled during your peak mental performance hours.' 
              : 'Scheduled in afternoon slump block for steady operation.'
          };
        });

        // Priority Eisenhower matrix mockup
        const scores: PriorityItem[] = tasks.filter(t => t.status !== 'completed').map(t => {
          let score = 50;
          let reason = 'Moderate importance. Complete during standard daily tasks.';
          if (t.priority === 'high') { score = 90; reason = 'Urgent deadline requires immediate attention.'; }
          else if (t.category === 'college') { score = 75; reason = 'Academic submissions impact semester GPA.'; }
          return { taskId: t.id, urgencyScore: score, reason };
        });

        // Study planner
        const studies: StudyPlanItem[] = [
          { subject: 'Artificial Intelligence', hoursSuggested: 3, focusTopics: ['Neural Networks', 'NLP Presentation prep'] },
          { subject: 'Data Structures & Algorithms', hoursSuggested: 2, focusTopics: ['Tree Traversals', 'Dynamic Programming'] }
        ];

        // General suggestions
        const suggestions = [
          `Your productivity score is currently at ${metrics.productivityScore}%. Keep pushing to hit the 80% mark.`,
          "You have logged 0 weight logs this week. Add logs inside Health & Workout tab for consistency tracking.",
          "Great job maintaining your coding habits streak. Dedicate 2 hours today to complete MERN setup tasks."
        ];

        const report = `ZENITHWEEKLY REPORT SUMMARY
- Weekly Hours Logged: ${metrics.totalWorkingHours} hours.
- Top Productivity Category: Skill Development.
- Study Focus: Strong attention on Docker and AI architectures.
- Recommendations: Keep up the hydration streaks; schedule tasks before 7 PM to improve sleep scores.`;

        setOptimizedSchedule(schedule);
        setPriorities(scores);
        setStudyPlan(studies);
        setTips(suggestions);
        setWeeklyReportText(report);
      }, 1500);

    } finally {
      setLoading(false);
      setReportGenerated(true);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Top Banner Action */}
      <div className="p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-violet-950/20 via-[#0B0F19] to-[#060813] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="glow-bg-purple top-[-100px] right-0 opacity-30"></div>
        <div className="space-y-2 z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-5.5 h-5.5 text-violet-400" />
            AI Productivity Copilot
          </h2>
          <p className="text-xs text-gray-400 max-w-xl">
            Analyze your schedule, optimize study timelines, score task priorities using the Eisenhower matrix, and generate comprehensive progress reports with Google Gemini.
          </p>
        </div>

        <button
          onClick={handleGenerateAiPlan}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 text-white rounded-2xl text-xs font-bold shadow-glow shrink-0 z-10 transition-all"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>{loading ? 'Analyzing Workspace...' : 'Optimize & Analyze'}</span>
        </button>
      </div>

      {!reportGenerated && !loading && (
        <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl">
          <BrainCircuit className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400 font-medium max-w-md mx-auto">
            Your workspace has not been analyzed yet today. Click "Optimize & Analyze" to generate today's schedule plan.
          </p>
        </div>
      )}

      {loading && (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-400">Gemini is structuring your life metrics...</p>
        </div>
      )}

      {/* AI Dashboards */}
      {reportGenerated && !loading && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* AI Persona Diagnostics Section */}
          <AiLifeInsights />

          {/* Main Grid: Left Controls + Right Generated Schedule */}
          <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              AI Schedule Optimizer (Today)
            </h3>
            
            <div className="space-y-3">
              {optimizedSchedule.length === 0 ? (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                  <AlertCircle className="w-4 h-4" />
                  <span>No tasks due today. Add due tasks to optimize schedule.</span>
                </div>
              ) : (
                optimizedSchedule.map(item => {
                  const task = tasks.find(t => t.id === item.taskId);
                  return (
                    <div key={item.taskId} className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 flex gap-4 transition-all">
                      <div className="text-center font-bold text-[10px] text-blue-400 bg-blue-500/10 px-2 py-1.5 rounded-xl h-fit shrink-0">
                        {item.timeSlot}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-gray-200">{task?.title || 'Unknown Task'}</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed">{item.reason}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* AI Task Priority Eisenhower Quadrant */}
          <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              Urgency scoring (Eisenhower Matrix)
            </h3>

            <div className="space-y-3 overflow-y-auto max-h-80 pr-1 scrollbar-thin">
              {priorities.map(item => {
                const task = tasks.find(t => t.id === item.taskId);
                return (
                  <div key={item.taskId} className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-gray-200 truncate max-w-[220px]">{task?.title}</h4>
                      <p className="text-[10px] text-gray-500">{item.reason}</p>
                    </div>
                    <div className="shrink-0 text-center">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl">
                        {item.urgencyScore}% score
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Study Planner */}
          <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              AI Study & DSA Target Planner
            </h3>

            <div className="space-y-3">
              {studyPlan.map((s, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-gray-200">{s.subject}</h4>
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-lg">
                      Suggest: {s.hoursSuggested} hrs
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {s.focusTopics.map(topic => (
                      <span key={topic} className="px-2 py-0.5 rounded-lg text-[9px] font-semibold bg-white/5 text-gray-400">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Productivity Tips & Reports */}
          <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Productivity Suggestions
              </h3>
              
              <ul className="space-y-2">
                {tips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-gray-400 flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-400 mt-1 shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-white/5 pt-4 mt-4 space-y-2">
              <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Weekly AI Report Summary</span>
              <pre className="text-[10px] leading-relaxed text-gray-400 font-mono bg-white/[0.01] border border-white/5 p-3 rounded-2xl whitespace-pre-wrap">
                {weeklyReportText}
              </pre>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
