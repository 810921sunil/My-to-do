import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  BookOpen, 
  Code2, 
  Cpu, 
  Layers,
  ThumbsUp,
  Award
} from 'lucide-react';

interface Flashcard {
  id: string;
  category: 'dsa' | 'os_dbms' | 'webdev' | 'custom';
  question: string;
  answer: string;
  nextReviewDays: number;
}

const defaultCards: Flashcard[] = [
  {
    id: 'f1',
    category: 'dsa',
    question: 'What is the time and space complexity of QuickSort?',
    answer: 'Average Time: O(N log N), Worst Time: O(N^2) when pivot selection is poor.\nSpace Complexity: O(log N) for recursion stack.',
    nextReviewDays: 1
  },
  {
    id: 'f2',
    category: 'os_dbms',
    question: 'What is the difference between Process and Thread?',
    answer: 'Process is an independent program in execution with its own memory space.\nThread is a lightweight subset of a process sharing the same address space.',
    nextReviewDays: 3
  },
  {
    id: 'f3',
    category: 'webdev',
    question: 'What is React UseCallback vs UseMemo?',
    answer: 'useCallback caches a callback function instance between renders.\nuseMemo caches the computed return result of a function.',
    nextReviewDays: 7
  }
];

export const AiFlashcardGenerator: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('z_flashcards');
    return saved ? JSON.parse(saved) : defaultCards;
  });

  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const [newCat, setNewCat] = useState<'dsa' | 'os_dbms' | 'webdev' | 'custom'>('custom');

  useEffect(() => {
    localStorage.setItem('z_flashcards', JSON.stringify(cards));
  }, [cards]);

  const filtered = selectedCat === 'all' 
    ? cards 
    : cards.filter(c => c.category === selectedCat);

  const activeCard = filtered[currentIdx] || cards[0];

  const handleReviewRating = (days: number) => {
    setIsFlipped(false);
    if (activeCard) {
      setCards(prev => prev.map(c => c.id === activeCard.id ? { ...c, nextReviewDays: days } : c));
    }
    setCurrentIdx(prev => (prev + 1) % filtered.length);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ.trim() || !newA.trim()) return;

    setCards(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        category: newCat,
        question: newQ.trim(),
        answer: newA.trim(),
        nextReviewDays: 1
      }
    ]);

    setNewQ('');
    setNewA('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-[#0B0F19] to-purple-950/40 border border-white/10 glass-panel shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-glow">
              <Brain className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              AI Study Flashcards & Spaced Repetition
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Active recall flashcard decks with Anki-style spaced repetition for maximum exam retention.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-glow transition-all z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Card</span>
        </button>
      </div>

      {/* Subject Deck Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs">
        {[
          { id: 'all', label: 'All Cards', icon: BookOpen },
          { id: 'dsa', label: 'DSA & Algorithms', icon: Code2 },
          { id: 'os_dbms', label: 'OS & DBMS', icon: Cpu },
          { id: 'webdev', label: 'Web Development', icon: Layers }
        ].map(cat => {
          const IconComp = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCat(cat.id);
                setCurrentIdx(0);
                setIsFlipped(false);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
                selectedCat === cat.id 
                  ? 'bg-blue-600 text-white shadow-glow' 
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive 3D Flip Card Container */}
      <div className="max-w-xl mx-auto space-y-4">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`min-h-[300px] p-8 rounded-3xl glass-panel border transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-2xl relative ${
            isFlipped 
              ? 'border-purple-500/40 bg-purple-500/[0.03]' 
              : 'border-blue-500/40 bg-blue-500/[0.03] hover:border-blue-500/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="px-2.5 py-0.5 rounded-full bg-white/5 font-bold uppercase tracking-wider text-[10px]">
              {activeCard?.category?.toUpperCase()}
            </span>
            <span className="flex items-center gap-1 font-bold text-blue-400">
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'Answer Side' : 'Question Side (Tap to Flip)'}</span>
            </span>
          </div>

          <div className="my-auto text-center space-y-3">
            {!isFlipped ? (
              <h3 className="text-lg font-extrabold text-white leading-relaxed">
                {activeCard?.question}
              </h3>
            ) : (
              <div className="text-sm text-gray-200 leading-relaxed font-sans bg-white/5 p-4 rounded-2xl border border-white/10 text-left whitespace-pre-wrap">
                {activeCard?.answer}
              </div>
            )}
          </div>

          <div className="text-center text-[10px] text-gray-500 font-mono">
            Card {currentIdx + 1} of {filtered.length}
          </div>
        </div>

        {/* Spaced Repetition Interval Rating Buttons */}
        {isFlipped && (
          <div className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-center gap-3 animate-in fade-in">
            <button
              onClick={() => handleReviewRating(1)}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all"
            >
              Hard (+1 Day)
            </button>
            <button
              onClick={() => handleReviewRating(3)}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all"
            >
              Good (+3 Days)
            </button>
            <button
              onClick={() => handleReviewRating(7)}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all"
            >
              Easy (+7 Days)
            </button>
          </div>
        )}
      </div>

      {/* Add Custom Flashcard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel border border-white/10 bg-[#070b14] space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-400" />
              Add Custom Study Flashcard
            </h3>

            <form onSubmit={handleAddCard} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Question / Concept Title</label>
                <input
                  type="text"
                  required
                  value={newQ}
                  onChange={e => setNewQ(e.target.value)}
                  placeholder="e.g. What is CAP Theorem in Distributed Databases?"
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Category</label>
                <select
                  value={newCat}
                  onChange={e => setNewCat(e.target.value as any)}
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="dsa">DSA & Algorithms</option>
                  <option value="os_dbms">OS & DBMS</option>
                  <option value="webdev">Web Development</option>
                  <option value="custom">Custom Subject</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Answer / Explanation</label>
                <textarea
                  rows={3}
                  required
                  value={newA}
                  onChange={e => setNewA(e.target.value)}
                  placeholder="Detailed answer or key bullet points..."
                  className="w-full bg-[#060813] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-glow"
                >
                  Save Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
