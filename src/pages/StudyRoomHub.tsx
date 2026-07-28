import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  Clock, 
  MessageSquare, 
  Send, 
  Plus, 
  CheckCircle2, 
  Flame, 
  Headphones,
  Zap,
  Play,
  Pause
} from 'lucide-react';

interface StudyRoom {
  id: string;
  title: string;
  topic: string;
  activeCount: number;
  timerMinutes: number;
  category: 'coding' | 'exam' | 'reading' | 'casual';
  hostName: string;
}

const sampleRooms: StudyRoom[] = [
  { id: 'r1', title: '⚔️ 100 Days of Code Sprint', topic: 'React, Node & DSA Practice', activeCount: 14, timerMinutes: 25, category: 'coding', hostName: 'Sunil C.' },
  { id: 'r2', title: '📚 GATE & Technical Exam Squad', topic: 'Operating Systems & DBMS', activeCount: 8, timerMinutes: 50, category: 'exam', hostName: 'Rohan K.' },
  { id: 'r3', title: '☕ Late Night Study & Focus Lounge', topic: 'Silent Deep Work Session', activeCount: 22, timerMinutes: 45, category: 'casual', hostName: 'Ananya S.' }
];

export const StudyRoomHub: React.FC = () => {
  const [rooms, setRooms] = useState<StudyRoom[]>(sampleRooms);
  const [activeRoom, setActiveRoom] = useState<StudyRoom | null>(null);
  const [roomMessages, setRoomMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Rohan K.', text: 'Hey team! Working on 5 Medium LeetCode problems today.', time: '11:40 AM' },
    { sender: 'Ananya S.', text: 'Awesome! Let\'s hit 25 mins of total silence focus.', time: '11:42 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Timer State for active room
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    setRoomMessages(prev => [
      ...prev,
      { sender: 'You', text: inputMsg.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputMsg('');
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRoom: StudyRoom = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      topic: newTopic.trim() || 'General Focus Session',
      activeCount: 1,
      timerMinutes: 25,
      category: 'coding',
      hostName: 'You'
    };

    setRooms(prev => [newRoom, ...prev]);
    setActiveRoom(newRoom);
    setShowCreateModal(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-[#0B0F19] to-blue-950/40 border border-white/10 glass-panel shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-glow">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              Peer Study & Virtual Focus Rooms
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Join live focus rooms, study together with peers, and conquer study goals.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold shadow-glow transition-all z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Create Study Room</span>
        </button>
      </div>

      {/* Main Grid: Active Room View or Rooms Directory */}
      {activeRoom ? (
        /* Joined Room View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Room Left Panel: Live Pomodoro Timer & Details */}
          <div className="lg:col-span-7 p-6 rounded-3xl glass-panel border border-indigo-500/30 bg-indigo-500/[0.02] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase">
                  Active Focus Sprint
                </span>
                <h2 className="text-lg font-extrabold text-white mt-1">{activeRoom.title}</h2>
                <p className="text-xs text-gray-400">{activeRoom.topic}</p>
              </div>

              <button
                onClick={() => setActiveRoom(null)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-400 font-bold"
              >
                Leave Room
              </button>
            </div>

            {/* Big Timer */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#060813] text-center space-y-4 shadow-2xl">
              <div className="text-5xl font-mono font-black text-white tracking-widest">
                {formatTime(timeLeft)}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-extrabold text-white shadow-glow transition-all ${
                    isTimerRunning ? 'bg-rose-600 hover:bg-rose-500' : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTimerRunning ? 'Pause Sprint' : 'Start Focus Sprint'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Room Right Panel: Peer Live Chat */}
          <div className="lg:col-span-5 p-6 rounded-3xl glass-panel border border-white/10 space-y-4 bg-white/[0.01] flex flex-col justify-between min-h-[400px]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
              Room Chat ({activeRoom.activeCount} Online)
            </h3>

            <div className="space-y-3 overflow-y-auto max-h-[250px] pr-2 text-xs">
              {roomMessages.map((msg, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                    <span className="text-indigo-400">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-gray-200">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-white/5">
              <input
                type="text"
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                placeholder="Send encouragement or progress update..."
                className="flex-1 bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      ) : (
        /* Rooms Directory Cards */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div
              key={room.id}
              className="p-5 rounded-3xl glass-panel border border-white/5 bg-white/[0.01] hover:border-indigo-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase">
                    {room.category}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {room.activeCount} Online
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-white leading-snug">{room.title}</h3>
                <p className="text-xs text-gray-400">{room.topic}</p>
              </div>

              <button
                onClick={() => {
                  setActiveRoom(room);
                  setTimeLeft(room.timerMinutes * 60);
                }}
                className="w-full py-2.5 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-2xl text-xs font-bold transition-all shadow-glow"
              >
                Join Focus Room
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel border border-white/10 bg-[#070b14] space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Create Focus Room
            </h3>

            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Room Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. 🚀 Full-Stack React & Node Sprint"
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Session Goal / Topic</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  placeholder="e.g. Building REST APIs and solving 3 DSA problems"
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-glow"
                >
                  Create & Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
