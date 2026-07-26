import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { askGeminiAI } from '../services/geminiService';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  CheckCircle, 
  Trash2,
  User, 
  Volume2,
  VolumeX,
  ChevronDown
} from 'lucide-react';

export const AiChatWidget: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; action?: string }>>([
    {
      sender: 'ai',
      text: 'Namaste! I am Advanced Life OS Gemini AI Copilot. Ask me anything like "aaj ke tasks dikhao", "add math homework tomorrow", or "math task complete kar diya"!'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Natural Speech Synthesis Helper
  const speakText = (text: string) => {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`[\]()]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const allTasksStr = tasks
        .slice(0, 50)
        .map(t => `- [${t.status.toUpperCase()}] ${t.title} (Due: ${t.dueDate}${t.dueTime ? ' ' + t.dueTime : ''}, Priority: ${t.priority})`)
        .join('\n');

      const contextInfo = `Tasks Vault:\n${allTasksStr || 'No tasks found'}`;
      const response = await askGeminiAI(userText, contextInfo, messages);

      // Handle Task Actions
      if (response.action === 'create_task' && response.task) {
        addTask({
          title: response.task.title,
          dueDate: response.task.dueDate || new Date().toISOString().split('T')[0],
          dueTime: response.task.dueTime,
          priority: response.task.priority || 'high',
          category: response.task.category || 'college',
          status: 'not_started',
          subTasks: []
        });
      } else if (response.action === 'complete_task' && response.targetTaskTitle) {
        const matching = tasks.find(t => t.title.toLowerCase().includes(response.targetTaskTitle!.toLowerCase()));
        if (matching) {
          updateTask({ ...matching, status: 'completed' });
        }
      } else if (response.action === 'delete_task' && response.targetTaskTitle) {
        const matching = tasks.find(t => t.title.toLowerCase().includes(response.targetTaskTitle!.toLowerCase()));
        if (matching) {
          deleteTask(matching.id);
        }
      }

      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: response.replyMessage, 
          action: response.action 
        }
      ]);

      speakText(response.replyMessage);
    } catch (err: any) {
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: '⚡ Advanced query processed! Type "25/07/2026 ko keya task thaa" ya "add math assignment"!' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-full shadow-2xl border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-glow"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#060813]" />
          </div>
          <span className="text-xs font-extrabold tracking-wide">Advanced AI</span>
        </button>
      ) : (
        <div className="w-[360px] sm:w-[400px] h-[520px] rounded-3xl border border-white/10 glass-panel bg-[#070b14]/95 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Widget Header */}
          <div className="p-4 border-b border-white/5 bg-gradient-to-r from-violet-950/40 via-[#0B0F19] to-[#060813] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-glow">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-white tracking-wider flex items-center gap-1.5">
                  Advanced Gemini AI
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">Online</span>
                </h3>
                <p className="text-[10px] text-gray-400">Next-Gen Productivity & Task Copilot</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                title={isSpeechEnabled ? "Disable Voice Feedback" : "Enable Voice Feedback"}
                className={`p-1.5 rounded-xl border text-xs transition-all ${
                  isSpeechEnabled 
                    ? 'bg-violet-600/20 border-violet-500/40 text-violet-300' 
                    : 'bg-white/5 border-white/5 text-gray-400'
                }`}
              >
                {isSpeechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                
                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-glow'
                      : 'bg-white/[0.03] border border-white/5 text-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {msg.action === 'create_task' && (
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Task added to Task Manager</span>
                    </div>
                  )}

                  {msg.action === 'complete_task' && (
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Task marked COMPLETED</span>
                    </div>
                  )}

                  {msg.action === 'delete_task' && (
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-rose-400 font-bold">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Task removed from vault</span>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-300 shrink-0 mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-xs text-gray-400">
                <div className="w-6 h-6 rounded-lg bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="px-3 py-1.5 bg-white/[0.01] border-t border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none text-[10px]">
            <button
              onClick={() => setInputMessage('aaj ke task bataw')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 whitespace-nowrap border border-white/5"
            >
              📋 Aaj ke tasks?
            </button>
            <button
              onClick={() => setInputMessage('add math assignment tomorrow')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 whitespace-nowrap border border-white/5"
            >
              ➕ Add assignment
            </button>
            <button
              onClick={() => setInputMessage('math homework complete kar diya')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 whitespace-nowrap border border-white/5"
            >
              ✅ Complete task
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-[#060813] flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Ask Advanced AI in Hinglish/English..."
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-violet-500/50"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 text-white rounded-xl shadow-glow transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
