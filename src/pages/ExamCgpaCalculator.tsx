import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Calculator, 
  BookOpen, 
  Clock, 
  Plus, 
  Trash2, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface SubjectCourse {
  id: string;
  code: string;
  name: string;
  credits: number;
  gradePoint: number; // 10, 9, 8, 7, 6, 5, 0
  chaptersDone: number;
  totalChapters: number;
}

interface ExamItem {
  id: string;
  subject: string;
  examType: 'Mid-Term' | 'End-Term' | 'Practical' | 'Quiz';
  date: string;
  time: string;
}

export const ExamCgpaCalculator: React.FC = () => {
  // Saved Subjects state
  const [subjects, setSubjects] = useState<SubjectCourse[]>(() => {
    const saved = localStorage.getItem('z_cgpa_subjects');
    return saved ? JSON.parse(saved) : [
      { id: '1', code: 'CS301', name: 'Data Structures & Algorithms', credits: 4, gradePoint: 9, chaptersDone: 7, totalChapters: 10 },
      { id: '2', code: 'CS302', name: 'Database Management Systems', credits: 3, gradePoint: 10, chaptersDone: 5, totalChapters: 8 },
      { id: '3', code: 'CS303', name: 'Operating Systems', credits: 4, gradePoint: 8, chaptersDone: 4, totalChapters: 9 },
      { id: '4', code: 'MA301', name: 'Discrete Mathematics', credits: 3, gradePoint: 9, chaptersDone: 6, totalChapters: 7 }
    ];
  });

  // Saved Exams state
  const [exams, setExams] = useState<ExamItem[]>(() => {
    const saved = localStorage.getItem('z_cgpa_exams');
    return saved ? JSON.parse(saved) : [
      { id: 'e1', subject: 'Data Structures & Algorithms', examType: 'End-Term', date: '2026-08-15', time: '10:00 AM' },
      { id: 'e2', subject: 'Database Systems Lab', examType: 'Practical', date: '2026-08-10', time: '02:00 PM' }
    ];
  });

  const [previousCgpa, setPreviousCgpa] = useState<number>(8.2);
  const [previousCredits, setPreviousCredits] = useState<number>(45);

  // New Subject Form Modal State
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCredits, setNewCredits] = useState(4);
  const [newGrade, setNewGrade] = useState(10);
  const [newChapters, setNewChapters] = useState(8);

  // New Exam Form Modal State
  const [showAddExam, setShowAddExam] = useState(false);
  const [examSubject, setExamSubject] = useState('');
  const [examType, setExamType] = useState<'Mid-Term' | 'End-Term' | 'Practical' | 'Quiz'>('End-Term');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('10:00 AM');

  useEffect(() => {
    localStorage.setItem('z_cgpa_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('z_cgpa_exams', JSON.stringify(exams));
  }, [exams]);

  // Calculate SGPA
  const totalCurrentCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const totalWeightedGradePoints = subjects.reduce((sum, s) => sum + (s.credits * s.gradePoint), 0);
  const currentSgpa = totalCurrentCredits > 0 ? (totalWeightedGradePoints / totalCurrentCredits) : 0;

  // Calculate Overall Target CGPA
  const overallCredits = previousCredits + totalCurrentCredits;
  const overallPoints = (previousCgpa * previousCredits) + totalWeightedGradePoints;
  const projectedCgpa = overallCredits > 0 ? (overallPoints / overallCredits) : currentSgpa;

  // Add Subject
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setSubjects(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        code: newCode.trim().toUpperCase() || 'SUB101',
        name: newName.trim(),
        credits: Number(newCredits),
        gradePoint: Number(newGrade),
        chaptersDone: 0,
        totalChapters: Number(newChapters) || 10
      }
    ]);

    setNewCode('');
    setNewName('');
    setShowAddSubject(false);
  };

  // Add Exam
  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examSubject.trim() || !examDate) return;

    setExams(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        subject: examSubject.trim(),
        examType,
        date: examDate,
        time: examTime
      }
    ]);

    setExamSubject('');
    setExamDate('');
    setShowAddExam(false);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const handleDeleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateChapter = (id: string, delta: number) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === id) {
        const next = Math.max(0, Math.min(s.totalChapters, s.chaptersDone + delta));
        return { ...s, chaptersDone: next };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-[#0B0F19] to-purple-950/40 border border-white/10 glass-panel shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              Exam Prep & CGPA Predictor
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Calculate your semester SGPA, forecast target CGPA, and track chapter preparation.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setShowAddExam(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-xs font-bold transition-all"
          >
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Add Exam Schedule</span>
          </button>

          <button
            onClick={() => setShowAddSubject(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Semester SGPA */}
        <div className="p-5 rounded-2xl glass-panel border border-blue-500/20 bg-blue-500/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated SGPA</span>
            <Calculator className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{currentSgpa.toFixed(2)}</span>
            <span className="text-xs text-blue-400 font-bold">/ 10.0</span>
          </div>
          <p className="text-[10px] text-gray-500">Based on {totalCurrentCredits} current semester credits</p>
        </div>

        {/* Target Overall CGPA */}
        <div className="p-5 rounded-2xl glass-panel border border-purple-500/20 bg-purple-500/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Projected CGPA</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{projectedCgpa.toFixed(2)}</span>
            <span className="text-xs text-purple-400 font-bold">/ 10.0</span>
          </div>
          <p className="text-[10px] text-gray-500">Cumulative for {overallCredits} total credits</p>
        </div>

        {/* Previous CGPA Config */}
        <div className="p-5 rounded-2xl glass-panel border border-white/5 bg-white/[0.01] space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prev Semesters CGPA</span>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="number"
              step="0.01"
              max="10"
              value={previousCgpa}
              onChange={e => setPreviousCgpa(Number(e.target.value))}
              className="w-20 bg-[#060813] border border-white/10 rounded-xl px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
            />
            <span className="text-xs text-gray-400">CGPA</span>
          </div>
        </div>

        {/* Total Earned Credits */}
        <div className="p-5 rounded-2xl glass-panel border border-white/5 bg-white/[0.01] space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prior Earned Credits</span>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="number"
              value={previousCredits}
              onChange={e => setPreviousCredits(Number(e.target.value))}
              className="w-20 bg-[#060813] border border-white/10 rounded-xl px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
            />
            <span className="text-xs text-gray-400">Credits</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Subjects Grade Predictor + Exam Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Subjects & Grade Calculator (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Semester Course Subjects ({subjects.length})
            </h3>
          </div>

          <div className="space-y-3">
            {subjects.map(subject => {
              const prepPercent = Math.round((subject.chaptersDone / subject.totalChapters) * 100) || 0;
              return (
                <div 
                  key={subject.id}
                  className="p-4 rounded-2xl glass-panel border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold">
                          {subject.code}
                        </span>
                        <h4 className="text-xs font-bold text-white">{subject.name}</h4>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {subject.credits} Credits • Grade Target: {subject.gradePoint} Points
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Grade Selector */}
                      <select
                        value={subject.gradePoint}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setSubjects(prev => prev.map(s => s.id === subject.id ? { ...s, gradePoint: val } : s));
                        }}
                        className="bg-[#060813] border border-white/10 text-xs font-bold text-blue-400 rounded-xl px-2.5 py-1.5 focus:outline-none"
                      >
                        <option value={10}>O (10.0)</option>
                        <option value={9}>A+ (9.0)</option>
                        <option value={8}>A (8.0)</option>
                        <option value={7}>B+ (7.0)</option>
                        <option value={6}>B (6.0)</option>
                        <option value={5}>C (5.0)</option>
                        <option value={0}>F (0.0)</option>
                      </select>

                      <button
                        onClick={() => handleDeleteSubject(subject.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Chapter Preparation Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-medium text-gray-400">
                      <span>Syllabus Covered: {subject.chaptersDone}/{subject.totalChapters} Chapters</span>
                      <span className="font-bold text-gray-200">{prepPercent}%</span>
                    </div>

                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex items-center">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${prepPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleUpdateChapter(subject.id, -1)}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 font-bold"
                      >
                        - Chapter
                      </button>
                      <button
                        onClick={() => handleUpdateChapter(subject.id, 1)}
                        className="px-2 py-0.5 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[10px] font-bold"
                      >
                        + Chapter
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Upcoming Exam Schedules (1 col) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            Upcoming Exams ({exams.length})
          </h3>

          <div className="space-y-3">
            {exams.length === 0 ? (
              <div className="p-6 rounded-2xl glass-panel border border-white/5 text-center text-xs text-gray-500">
                No exam schedules added. Tap "Add Exam Schedule" to stay ahead!
              </div>
            ) : (
              exams.map(exam => {
                const daysLeft = Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                return (
                  <div 
                    key={exam.id}
                    className="p-4 rounded-2xl glass-panel border border-purple-500/20 bg-purple-500/[0.02] space-y-2 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                        {exam.examType}
                      </span>
                      <h4 className="text-xs font-bold text-white">{exam.subject}</h4>
                      <p className="text-[10px] text-gray-400">
                        {exam.date} at {exam.time}
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className={`text-xs font-extrabold px-2.5 py-1 rounded-xl block ${
                        daysLeft <= 3 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {daysLeft > 0 ? `${daysLeft} Days Left` : 'Today'}
                      </span>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="text-[10px] text-gray-500 hover:text-rose-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel border border-white/10 bg-[#070b14] space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Add Course Subject
            </h3>

            <form onSubmit={handleAddSubject} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Subject Code</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  placeholder="e.g. CS301"
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newCredits}
                    onChange={e => setNewCredits(Number(e.target.value))}
                    className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Total Chapters</label>
                  <input
                    type="number"
                    min="1"
                    value={newChapters}
                    onChange={e => setNewChapters(Number(e.target.value))}
                    className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubject(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-glow"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {showAddExam && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel border border-white/10 bg-[#070b14] space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              Add Exam Schedule
            </h3>

            <form onSubmit={handleAddExam} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={examSubject}
                  onChange={e => setExamSubject(e.target.value)}
                  placeholder="e.g. Operating Systems"
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Exam Type</label>
                  <select
                    value={examType}
                    onChange={e => setExamType(e.target.value as any)}
                    className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Mid-Term">Mid-Term</option>
                    <option value="End-Term">End-Term</option>
                    <option value="Practical">Practical</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExam(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-glow"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
