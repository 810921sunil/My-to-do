import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  HelpCircle, 
  CheckCircle2, 
  ChevronRight, 
  RotateCcw, 
  Award, 
  Code2, 
  Database, 
  Terminal, 
  Cpu, 
  BookOpen,
  Eye,
  Star
} from 'lucide-react';

interface QuestionItem {
  id: string;
  category: 'dsa' | 'react_node' | 'system_design' | 'dbms_os';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title: string;
  question: string;
  hint: string;
  solution: string;
}

const mockQuestions: QuestionItem[] = [
  {
    id: 'q1',
    category: 'dsa',
    difficulty: 'Medium',
    title: 'Two Sum & Hash Map Lookup',
    question: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target in O(N) time complexity.',
    hint: 'Use a HashMap to store each number and its index while iterating through the array in a single pass.',
    solution: '```typescript\nfunction twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp)!, i];\n    map.set(nums[i], i);\n  }\n  return [];\n}\n```'
  },
  {
    id: 'q2',
    category: 'react_node',
    difficulty: 'Medium',
    title: 'React Virtual DOM & Reconciliation',
    question: 'Explain how React Reconciliation and the Diffing Algorithm work under the hood, and why key props are mandatory in lists.',
    hint: 'Focus on Fiber nodes, O(N) heuristic tree diffing, and how keys prevent unnecessary DOM node element re-renders.',
    solution: 'React uses a virtual DOM representation. During updates, the reconciliation algorithm compares the new VDOM tree with the previous one. Unique keys help React identify which list items were added, removed, or reordered without re-rendering the whole DOM tree.'
  },
  {
    id: 'q3',
    category: 'system_design',
    difficulty: 'Hard',
    title: 'URL Shortener System Architecture',
    question: 'How would you design a scalable URL Shortener service (like bit.ly) handling 100M daily active requests?',
    hint: 'Discuss Base62 encoding of auto-incrementing auto IDs, Redis caching layer, and database sharding.',
    solution: 'Architecture:\n1. API Gateway handles incoming traffic.\n2. In-memory Redis Cache stores popular short URLs (Cache Hit ratio ~90%).\n3. Base62 encoding converts 64-bit integer IDs to 6-7 char strings (e.g. 62^7 = ~3.5 Trillion URLs).\n4. Relational/NoSQL database with master-replica replication.'
  },
  {
    id: 'q4',
    category: 'dbms_os',
    difficulty: 'Medium',
    title: 'ACID Properties in Databases',
    question: 'Define Atomicity, Consistency, Isolation, and Durability in DBMS with real-world banking transaction examples.',
    hint: 'Atomicity = All or Nothing; Consistency = Valid State; Isolation = Concurrent Transactions; Durability = Permanent WAL log.',
    solution: 'Atomicity ensures that a bank transfer (deducting from Account A and adding to Account B) executes completely or fails entirely. Isolation ensures concurrent transfers do not corrupt data using locks/MVCC.'
  }
];

export const AiInterviewPrep: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [scoreCount, setScoreCount] = useState<number>(0);

  const filtered = selectedCat === 'all' 
    ? mockQuestions 
    : mockQuestions.filter(q => q.category === selectedCat);

  const currentQ = filtered[currentIdx] || mockQuestions[0];

  const handleNext = () => {
    setShowHint(false);
    setShowSolution(false);
    setCurrentIdx(prev => (prev + 1) % filtered.length);
  };

  const handleSelfGrade = (points: number) => {
    setScoreCount(prev => prev + points);
    handleNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-[#0B0F19] to-purple-950/40 border border-white/10 glass-panel shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-glow">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              AI Technical Interview Simulator
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Practice real DSA, React, System Design, and CS fundamental interview questions with AI model answers.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <div className="p-3 rounded-2xl glass-panel border border-amber-500/20 bg-amber-500/[0.02] flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-extrabold text-white">{scoreCount} Mastery XP</span>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        {[
          { id: 'all', label: 'All Topics', icon: BookOpen },
          { id: 'dsa', label: 'DSA & Algorithms', icon: Code2 },
          { id: 'react_node', label: 'React & Node.js', icon: Terminal },
          { id: 'system_design', label: 'System Design', icon: Cpu },
          { id: 'dbms_os', label: 'DBMS & OS', icon: Database }
        ].map(cat => {
          const IconComp = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCat(cat.id);
                setCurrentIdx(0);
                setShowHint(false);
                setShowSolution(false);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
                selectedCat === cat.id 
                  ? 'bg-indigo-600 text-white shadow-glow' 
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Question Card Player */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-5 bg-white/[0.01]">
        
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
              {currentQ.category.toUpperCase()}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
              currentQ.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
              currentQ.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {currentQ.difficulty}
            </span>
          </div>

          <span className="text-xs text-gray-400 font-mono font-bold">
            Question {currentIdx + 1} of {filtered.length}
          </span>
        </div>

        {/* Title & Question text */}
        <div className="space-y-2">
          <h2 className="text-base font-extrabold text-white tracking-wide">
            {currentQ.title}
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed font-sans bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
            {currentQ.question}
          </p>
        </div>

        {/* Action Toggles: Hint & Model Solution */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
          </button>

          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showSolution ? 'Hide Model Answer' : 'Reveal Model Answer'}</span>
          </button>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed animate-in fade-in space-y-1">
            <strong className="block font-bold">💡 Technical Hint:</strong>
            <p>{currentQ.hint}</p>
          </div>
        )}

        {/* Model Solution Box */}
        {showSolution && (
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs leading-relaxed font-mono whitespace-pre-wrap animate-in fade-in space-y-2">
            <strong className="block font-bold text-indigo-300 font-sans">🧠 AI Model Solution & Explanation:</strong>
            <p className="bg-[#060813] p-3 rounded-xl border border-white/10 text-gray-200">{currentQ.solution}</p>
          </div>
        )}

        {/* Self Assessment Score Buttons */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-gray-400">Rate your answer performance:</span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelfGrade(10)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold transition-all"
            >
              Need Review (+10 XP)
            </button>

            <button
              onClick={() => handleSelfGrade(50)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-glow transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Nailed It! (+50 XP)</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
