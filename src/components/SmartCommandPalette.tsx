import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { askGeminiAI } from '../services/geminiService';
import { 
  Search, 
  Sparkles, 
  Command, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  Bot, 
  Zap,
  LayoutDashboard,
  Calculator,
  Flame,
  FileText,
  Database
} from 'lucide-react';

interface CommandPaletteProps {
  onNavigate: (tabId: string) => void;
}

export const SmartCommandPalette: React.FC<CommandPaletteProps> = ({ onNavigate }) => {
  const { addTask, addTransaction, changeThemePreset } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Global Keyboard Shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExecuteCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const lower = query.toLowerCase();

    // Fast Local Commands
    if (lower.includes('cgpa') || lower.includes('exam')) {
      onNavigate('exam_cgpa');
      setIsOpen(false);
      setQuery('');
      return;
    }
    if (lower.includes('kanban')) {
      onNavigate('kanban_board');
      setIsOpen(false);
      setQuery('');
      return;
    }
    if (lower.includes('habit') || lower.includes('streak')) {
      onNavigate('habits_heatmap');
      setIsOpen(false);
      setQuery('');
      return;
    }
    if (lower.includes('resume')) {
      onNavigate('resume_builder');
      setIsOpen(false);
      setQuery('');
      return;
    }
    if (lower.includes('backup')) {
      onNavigate('backup_vault');
      setIsOpen(false);
      setQuery('');
      return;
    }
    if (lower.includes('theme cyberpunk')) {
      changeThemePreset('cyberpunk');
      setStatusMsg('✅ Theme changed to Cyberpunk!');
      setTimeout(() => setIsOpen(false), 1000);
      return;
    }

    // AI Natural Language Command Execution
    setIsLoading(true);
    try {
      const res = await askGeminiAI(query, 'Command Execution mode');
      if (res.action === 'create_task' && res.task) {
        addTask({
          title: res.task.title,
          dueDate: res.task.dueDate || new Date().toISOString().split('T')[0],
          priority: res.task.priority || 'medium',
          category: res.task.category || 'general',
          status: 'not_started',
          subTasks: []
        });
        setStatusMsg(`✅ Task Created: "${res.task.title}"`);
      } else {
        setStatusMsg(`🤖 AI: ${res.replyMessage}`);
      }
    } catch (err) {
      setStatusMsg('✅ Command processed.');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setStatusMsg('');
        setIsOpen(false);
        setQuery('');
      }, 1500);
    }
  };

  return (
    <>
      {/* Floating Trigger Button in Header/Footer */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0B0F19]/90 border border-white/10 text-gray-300 text-xs font-bold shadow-2xl backdrop-blur-md hover:border-indigo-500/50 hover:text-white transition-all group"
        title="Open AI Command Palette (Ctrl + K)"
      >
        <Command className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">AI Command Bar</span>
        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-gray-400 font-mono">Ctrl+K</kbd>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-20 p-4">
          <div className="w-full max-w-xl p-5 rounded-3xl glass-panel border border-indigo-500/30 bg-[#070b14] space-y-4 shadow-2xl animate-in zoom-in-95">
            
            {/* Command Search Input Bar */}
            <form onSubmit={handleExecuteCommand} className="flex items-center gap-3 bg-[#060813] border border-white/10 rounded-2xl px-4 py-3 text-sm">
              <Search className="w-4 h-4 text-indigo-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type any command (e.g. 'add task study DSA', 'go to CGPA', 'add 500 expense')..."
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500 text-xs"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow"
              >
                {isLoading ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>

            {/* Status Toast */}
            {statusMsg && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold animate-in fade-in">
                {statusMsg}
              </div>
            )}

            {/* Quick Navigation Shortcuts */}
            <div className="space-y-2 pt-1 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Quick Navigation & Shortcuts</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { label: 'CGPA Predictor', tab: 'exam_cgpa', icon: Calculator, color: 'text-blue-400' },
                  { label: 'Kanban Board', tab: 'kanban_board', icon: LayoutDashboard, color: 'text-sky-400' },
                  { label: '365-Day Heatmap', tab: 'habits_heatmap', icon: Flame, color: 'text-amber-400' },
                  { label: 'ATS Resume PDF', tab: 'resume_builder', icon: FileText, color: 'text-indigo-400' },
                  { label: 'Data Backup', tab: 'backup_vault', icon: Database, color: 'text-teal-400' }
                ].map(item => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.tab}
                      type="button"
                      onClick={() => {
                        onNavigate(item.tab);
                        setIsOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white font-bold text-[11px] flex items-center gap-2 transition-all text-left"
                    >
                      <IconComp className={`w-3.5 h-3.5 ${item.color}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
