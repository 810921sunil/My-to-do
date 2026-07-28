import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  TrendingUp, 
  Printer, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Calendar,
  FileText,
  ShieldCheck
} from 'lucide-react';

export const WeeklyLifeReport: React.FC = () => {
  const { tasks, habits, transactions, getBudgetSummary } = useData();

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length || 1;
  const taskCompletionRate = Math.round((completedTasks / totalTasks) * 100);

  const activeHabits = habits.filter(h => h.streak > 0).length;
  const totalHabits = habits.length || 1;
  const habitRate = Math.round((activeHabits / totalHabits) * 100);

  const summary = getBudgetSummary();

  // Compute Overall Performance Grade
  const overallScore = Math.round((taskCompletionRate * 0.5) + (habitRate * 0.5));
  
  const getGrade = (score: number) => {
    if (score >= 85) return { grade: 'A+', text: 'Exceptional Execution & High Consistency', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' };
    if (score >= 70) return { grade: 'A', text: 'Strong Performance & Steady Habits', color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' };
    if (score >= 50) return { grade: 'B', text: 'Good Progress, Room for Habit Scaling', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' };
    return { grade: 'C', text: 'Needs Focused Alignment Next Week', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' };
  };

  const gradeInfo = getGrade(overallScore);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Printable CSS Rules */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #weekly-report-print, #weekly-report-print * {
            visibility: visible;
          }
          #weekly-report-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Banner */}
      <div className="no-print p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#0B0F19] to-teal-950/40 border border-white/10 glass-panel shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-glow">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              Weekly Executive Performance Audit
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Sunday automated performance scorecard across task execution, habit consistency, and financial discipline.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-extrabold shadow-glow transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Export Audit PDF</span>
        </button>
      </div>

      {/* Printable Report Sheet */}
      <div 
        id="weekly-report-print"
        className="p-8 bg-white text-gray-900 rounded-3xl border border-gray-200 shadow-2xl space-y-6 font-sans max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="border-b border-gray-300 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
              WEEKLY PERFORMANCE AUDIT REPORT
            </h1>
            <p className="text-xs font-bold text-gray-600">Life OS Executive System Audit</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-gray-700">Audit Date: {new Date().toISOString().split('T')[0]}</span>
          </div>
        </div>

        {/* Executive Grade Banner */}
        <div className="p-6 rounded-2xl border bg-gray-50 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Overall Execution Grade</span>
            <h2 className="text-xl font-black text-gray-900">{gradeInfo.text}</h2>
            <p className="text-xs text-gray-600">Calculated from task completion rates and habit streak compliance.</p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-3xl font-black shadow-lg">
            {gradeInfo.grade}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-1">
            <span className="font-bold text-gray-500 uppercase">Tasks Completed</span>
            <div className="text-2xl font-black text-gray-900">{completedTasks} / {totalTasks}</div>
            <p className="text-[10px] text-emerald-600 font-bold">{taskCompletionRate}% Completion Rate</p>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-1">
            <span className="font-bold text-gray-500 uppercase">Active Habits</span>
            <div className="text-2xl font-black text-gray-900">{activeHabits} / {totalHabits}</div>
            <p className="text-[10px] text-blue-600 font-bold">{habitRate}% Routine Compliance</p>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-1">
            <span className="font-bold text-gray-500 uppercase">Monthly Savings</span>
            <div className="text-2xl font-black text-gray-900">₹{summary.savings.toLocaleString()}</div>
            <p className="text-[10px] text-gray-600 font-bold">Financial Health Neutral</p>
          </div>

        </div>

        {/* Executive AI Recommendations */}
        <div className="space-y-2 pt-2 border-t border-gray-200">
          <h3 className="text-xs font-black uppercase text-gray-900 tracking-wider">
            Executive Action Plan & Recommendations for Next Week
          </h3>

          <ul className="space-y-2 text-xs text-gray-700 leading-relaxed list-disc list-inside">
            <li><strong>High-Priority Task Focus:</strong> Prioritize top 3 critical tasks during your morning peak focus hours (9 AM - 12 PM).</li>
            <li><strong>Habit Chain Continuity:</strong> Maintain your 365-Day habit streaks by logging water intake and reading daily.</li>
            <li><strong>Skill Acceleration:</strong> Dedicate at least 45 minutes daily to full-stack project building and DSA practice.</li>
          </ul>
        </div>

      </div>

    </div>
  );
};
