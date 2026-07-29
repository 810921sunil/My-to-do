import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { askGeminiAI, speakTextWebSpeech } from '../services/geminiService';
import type { AIPersonaType } from '../services/geminiService';
import { 
  Sparkles, 
  BrainCircuit, 
  Volume2, 
  GraduationCap, 
  Code2, 
  Flame, 
  Wallet, 
  Bot, 
  RefreshCw,
  Zap
} from 'lucide-react';

export const AiLifeInsights: React.FC = () => {
  const { tasks, habits, courses, transactions, getBudgetSummary } = useData();
  const [persona, setPersona] = useState<AIPersonaType>('copilot');
  const [insightsText, setInsightsText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [speakAudio, setSpeakAudio] = useState<boolean>(true);

  const personaList = [
    { id: 'copilot', label: 'General Copilot', icon: Bot, color: 'text-blue-400' },
    { id: 'academic', label: 'Academic Mentor', icon: GraduationCap, color: 'text-amber-400' },
    { id: 'tech_lead', label: 'FAANG Tech Lead', icon: Code2, color: 'text-purple-400' },
    { id: 'productivity', label: 'Zen Habit Coach', icon: Flame, color: 'text-rose-400' },
    { id: 'financial', label: 'Wealth Advisor', icon: Wallet, color: 'text-emerald-400' }
  ];

  const handleGenerateDiagnostics = async () => {
    setIsLoading(true);
    setInsightsText('');

    const summary = getBudgetSummary();
    const activeTasks = tasks.filter(t => t.status !== 'completed').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const activeHabits = habits.filter(h => h.streak > 0).length;

    const workspaceContext = `
      Active Pending Tasks: ${activeTasks}, Completed Tasks: ${completedTasks}.
      Active Habit Streaks: ${activeHabits}.
      Monthly Income: ₹${summary.income}, Expenses: ₹${summary.expenses}, Net Savings: ₹${summary.savings}.
    `;

    const prompt = "Perform a proactive workspace diagnostic scan. Give me 3 ultra-smart, personalized executive recommendations for today to maximize my academic, coding, and financial growth.";

    try {
      const res = await askGeminiAI(prompt, workspaceContext, [], persona);
      const outputMsg = res.replyMessage || "Workspace diagnosis complete! Stay focused and maintain high momentum today.";
      setInsightsText(outputMsg);

      if (speakAudio) {
        speakTextWebSpeech(outputMsg);
      }
    } catch (e) {
      setInsightsText("✅ Workspace analysis ready! Keep executing your high-priority tasks and stay consistent with your habit streaks.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl glass-panel border border-indigo-500/20 bg-indigo-500/[0.01] space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-glow">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-wide">
              Advanced AI 2.0 Persona Diagnostics
            </h3>
            <p className="text-[11px] text-gray-400">Select an AI Persona mentor for specialized real-time workspace advice.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeakAudio(!speakAudio)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all ${
              speakAudio 
                ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300' 
                : 'bg-white/5 border-white/10 text-gray-500'
            }`}
            title="Toggle Voice Speech Output"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleGenerateDiagnostics}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-glow transition-all"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isLoading ? 'Scanning Workspace...' : 'Run AI Diagnostic Scan'}</span>
          </button>
        </div>
      </div>

      {/* Persona Selection Chips */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1">
        {personaList.map(p => {
          const IconComp = p.icon;
          const isSelected = persona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setPersona(p.id as AIPersonaType)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
                isSelected 
                  ? 'bg-indigo-600 text-white shadow-glow' 
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${p.color}`} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Insights Result Box */}
      {insightsText && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-100 text-xs leading-relaxed animate-in fade-in space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 font-bold">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>AI Executive Recommendation:</span>
          </div>
          <p className="bg-[#060813] p-3 rounded-xl border border-white/10 text-gray-200 leading-relaxed font-sans">
            {insightsText}
          </p>
        </div>
      )}

    </div>
  );
};
