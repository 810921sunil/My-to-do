import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { askGeminiAI } from '../services/geminiService';
import { 
  Sparkles, 
  Bot, 
  Send, 
  X, 
  Mic, 
  Maximize2, 
  Minimize2,
  CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const FloatingAssistant: React.FC = () => {
  const { tasks, addTask, getProductivityMetrics, earnReward } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'ai',
      text: "👋 Hi! Main Gemini AI Copilot hu. Aap pooch sakte hain: 'muej aaj ke task batawo' ya 'add math assignment tomorrow'",
      time: 'Just now'
    }
  ]);

  const metrics = getProductivityMetrics();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryText = inputText.trim();
    if (!queryText) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const todayTasksList = tasks
        .filter(t => t.dueDate === todayStr || t.status === 'not_started' || t.status === 'in_progress')
        .map((t, i) => `${i + 1}. ${t.title} (${t.priority} priority, status: ${t.status})`)
        .slice(0, 6)
        .join('\n');

      const contextStr = `Productivity Score: ${metrics.productivityScore}%\nActive Tasks:\n${todayTasksList || 'No active tasks today'}`;
      const aiResult = await askGeminiAI(queryText, contextStr);

      if (aiResult.action === 'create_task' && aiResult.task) {
        const today = new Date().toISOString().split('T')[0];
        addTask({
          title: aiResult.task.title,
          category: aiResult.task.category || 'college',
          priority: aiResult.task.priority || 'high',
          dueDate: aiResult.task.dueDate || today,
          dueTime: aiResult.task.dueTime,
          status: 'not_started',
          subTasks: []
        });
        earnReward(15, 2);
      }

      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: aiResult.replyMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'ai_err_' + Date.now(),
          sender: 'ai',
          text: "Maaf kijiyega, main isko process nahi kar paaya. Kripya firse koshish karein!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Orb Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border border-white/20 shadow-glow"
        >
          <div className="absolute -inset-1 rounded-full bg-blue-500/30 blur-md group-hover:bg-blue-500/50 transition-all animate-pulse" />
          <Sparkles className="w-6 h-6 text-white relative z-10 animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
        </button>
      ) : (
        /* Floating Chat Window */
        <div className="w-80 sm:w-96 rounded-3xl bg-[#0b0f24]/95 border border-white/15 backdrop-blur-2xl shadow-2xl p-4 flex flex-col h-[460px] animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-glow">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-200">Zenith AI Assistant</h3>
                <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online Assistant
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3 scrollbar-thin px-1">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-glow'
                      : 'bg-white/5 border border-white/5 text-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[8px] text-gray-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-semibold animate-pulse w-fit">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Gemini AI natural language processing...</span>
              </div>
            )}
          </div>

          {/* Prompt Chips */}
          <div className="flex gap-1.5 overflow-x-auto py-2 border-t border-white/5 text-[9px] no-scrollbar">
            <button 
              onClick={() => setInputText('Add math assignment tomorrow')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 whitespace-nowrap border border-white/5"
            >
              + Add Math Task
            </button>
            <button 
              onClick={() => setInputText('What is my productivity score?')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 whitespace-nowrap border border-white/5"
            >
              📊 Productivity Score
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-white/5">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Ask AI or type command..."
              className="flex-1 bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-glow transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
