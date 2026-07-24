import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { PlacementApplication } from '../types';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Layers, 
  Terminal, 
  FileText, 
  Award, 
  Users,
  Search,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export const PlacementPrep: React.FC = () => {
  const { placements, addPlacement, updatePlacementStage, deletePlacement, earnReward } = useData();

  // Onscreen states
  const [showAddModal, setShowAddModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [salaryPackage, setSalaryPackage] = useState('');
  const [notes, setNotes] = useState('');
  const [deadlineDate, setDeadlineDate] = useState(() => new Date().toISOString().split('T')[0]);

  // DSA and Preparation stats
  const [dsaProblems, setDsaProblems] = useState(45);
  const [resumeScore, setResumeScore] = useState(82);
  const [aptitudeScore, setAptitudeScore] = useState(75);

  // Resume builder links
  const [resumes, setResumes] = useState([
    { id: 'res_1', version: 'SDE_Intern_v1.pdf', date: '2026-07-20', active: true },
    { id: 'res_2', version: 'Fullstack_Dev_v2.pdf', date: '2026-07-23', active: false }
  ]);

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleName.trim()) return;

    addPlacement({
      companyName,
      roleName,
      stage: 'applied',
      salaryPackage: salaryPackage || undefined,
      deadlineDate: deadlineDate || undefined,
      notes: notes || undefined
    });

    earnReward(50, 5); // award XP for applying

    // Reset
    setCompanyName('');
    setRoleName('');
    setSalaryPackage('');
    setNotes('');
    setDeadlineDate(new Date().toISOString().split('T')[0]);
    setShowAddModal(false);
  };

  const columns: { id: PlacementApplication['stage']; label: string; color: string }[] = [
    { id: 'applied', label: 'Applied', color: 'border-blue-500/20 bg-blue-500/5 text-blue-300' },
    { id: 'assessment', label: 'OA Test', color: 'border-purple-500/20 bg-purple-500/5 text-purple-300' },
    { id: 'interview', label: 'Interviews', color: 'border-amber-500/20 bg-amber-500/5 text-amber-300' },
    { id: 'offer', label: 'Offers / Hired', color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300' }
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" /> Career & Placement Prep Desk
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Track your resume edits, solve DSA codes, and manage your internship pipeline.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Grid Row 1: Preparation Trackers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* LeetCode & DSA Progress */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-48">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" /> DSA & LeetCode Target
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Streak: Active
            </span>
          </div>

          <div className="my-3">
            <h3 className="text-3xl font-extrabold text-white">{dsaProblems} / 100</h3>
            <span className="text-[11px] text-gray-400 font-semibold mt-0.5 block">Medium & Hard Problems Solved</span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full bg-white/[0.04] rounded-full h-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${dsaProblems}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 font-bold">
              <button 
                onClick={() => { setDsaProblems(prev => Math.min(100, prev + 1)); earnReward(20, 2); }}
                className="hover:text-emerald-400 transition-colors"
              >
                + Log 1 Problem Completed
              </button>
              <span>{100 - dsaProblems} remaining</span>
            </div>
          </div>
        </div>

        {/* Resume ATS Score Checker */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-48">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-blue-400" /> Resume Review Engine
            </span>
            <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full">
              ATS Optimized
            </span>
          </div>

          <div className="my-2 flex items-center gap-4">
            <h3 className="text-3xl font-extrabold text-white">{resumeScore}%</h3>
            <div className="space-y-0.5 text-[10px] text-gray-400">
              <span className="block font-semibold">Active: SDE_Intern_v1.pdf</span>
              <span className="block text-gray-500">Last updated: 1 day ago</span>
            </div>
          </div>

          <div className="border-t border-white/5 pt-2.5 flex items-center justify-between text-[10px]">
            <button 
              onClick={() => {
                const ver = prompt('Enter new resume file name:');
                if (ver) {
                  setResumes([...resumes, { id: 'res_' + Date.now(), version: ver, date: new Date().toISOString().split('T')[0], active: true }]);
                  setResumeScore(Math.floor(Math.random() * 15) + 80); // randomize ATS score
                  earnReward(30, 3);
                }
              }}
              className="text-blue-400 hover:text-blue-300 font-bold"
            >
              + Upload Revised Version
            </button>
            <span className="text-gray-500 font-semibold">{resumes.length} versions logged</span>
          </div>
        </div>

        {/* Aptitude & Interview Mock Stats */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-48">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-400" /> Mock Interviews & Aptitude
            </span>
            <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full">
              Level 4 prep
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-2">
            <div className="p-2 bg-[#060813] border border-white/5 rounded-xl text-center">
              <span className="block text-[8px] text-gray-500 font-bold uppercase">Mock Score</span>
              <span className="text-base font-bold text-purple-400">4.5 / 5.0</span>
            </div>
            <div className="p-2 bg-[#060813] border border-white/5 rounded-xl text-center">
              <span className="block text-[8px] text-gray-500 font-bold uppercase">Aptitude Score</span>
              <span className="text-base font-bold text-amber-400">{aptitudeScore}%</span>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-white/5 pt-2 text-[10px] text-gray-500">
            <button
              onClick={() => { setAptitudeScore(prev => Math.min(100, prev + 5)); earnReward(15, 1); }}
              className="hover:text-purple-400 transition-colors"
            >
              + Log Aptitude Test
            </button>
            <span className="font-semibold">Next Mock: Sunday</span>
          </div>
        </div>

      </div>

      {/* GitHub & DSA Study Heatmap Streak Grid */}
      <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>💻</span> GitHub & LeetCode Coding Activity Grid
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Study consistency heatmap matching daily coding commits and solved challenges.</p>
          </div>
          <span className="text-[10px] text-gray-400 font-bold">14-Day Streak Active 🔥</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {Array.from({ length: 48 }).map((_, idx) => {
            const levels = [
              'bg-white/5', 'bg-emerald-900/40', 'bg-emerald-700/60', 'bg-emerald-500/80', 'bg-emerald-400'
            ];
            const levelIdx = idx % 5 === 0 ? 0 : idx % 3 === 0 ? 1 : idx % 2 === 0 ? 2 : idx % 7 === 0 ? 4 : 3;
            return (
              <div 
                key={idx} 
                className={`w-6 h-6 rounded-md ${levels[levelIdx]} border border-white/[0.02] flex items-center justify-center text-[8px] text-white/40 font-bold hover:scale-110 transition-transform cursor-pointer`}
                title={`${levelIdx + 1} coding session(s)`}
              >
                {levelIdx > 0 ? `+${levelIdx}` : ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Row 2: Company Application Pipelines Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {columns.map(col => {
          const colApps = placements.filter(p => p.stage === col.id);
          return (
            <div key={col.id} className="p-4 rounded-3xl border border-white/5 glass-panel flex flex-col space-y-4 min-h-[420px]">
              
              {/* Header info */}
              <div className="flex justify-between items-center px-1 border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{col.label}</span>
                <span className="text-[10px] bg-white/5 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                  {colApps.length}
                </span>
              </div>

              {/* Cards pipeline */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin">
                {colApps.length === 0 ? (
                  <div className="py-12 border border-dashed border-white/5 rounded-2xl text-center text-[10px] text-gray-600">
                    No active applications.
                  </div>
                ) : (
                  colApps.map(p => (
                    <div 
                      key={p.id}
                      className="p-4 rounded-2xl bg-gray-900/40 hover:bg-gray-900/80 border border-white/5 space-y-3 transition-all relative group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-gray-200">{p.companyName}</h4>
                          <span className="text-[9px] text-blue-400 font-bold">{p.salaryPackage || 'TBD'}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-semibold">{p.roleName}</p>
                        {p.notes && (
                          <p className="text-[9px] text-gray-500 italic line-clamp-2 leading-relaxed">{p.notes}</p>
                        )}
                      </div>

                      {/* Timeline dates info */}
                      <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[9px] text-gray-500">
                        <span>Due: {p.deadlineDate || '—'}</span>
                        <button
                          onClick={() => deletePlacement(p.id)}
                          className="p-1 text-gray-500 hover:text-rose-400 rounded opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Transitions buttons */}
                      <div className="flex gap-1 pt-1 justify-end border-t border-white/5">
                        {col.id !== 'applied' && (
                          <button
                            onClick={() => {
                              const stages: PlacementApplication['stage'][] = ['applied', 'assessment', 'interview', 'offer'];
                              const curIdx = stages.indexOf(col.id);
                              updatePlacementStage(p.id, stages[curIdx - 1]);
                            }}
                            className="px-1 py-0.5 text-[8px] font-bold bg-white/5 hover:bg-white/10 rounded text-gray-400 transition-colors"
                          >
                            ◀ Back
                          </button>
                        )}
                        {col.id !== 'offer' && (
                          <button
                            onClick={() => {
                              const stages: PlacementApplication['stage'][] = ['applied', 'assessment', 'interview', 'offer'];
                              const curIdx = stages.indexOf(col.id);
                              updatePlacementStage(p.id, stages[curIdx + 1]);
                              if (stages[curIdx + 1] === 'offer') {
                                earnReward(200, 20); // big reward for offer
                                alert(`🎉 CONGRATULATIONS! You unlocked a job offer from ${p.companyName}!`);
                              }
                            }}
                            className="px-1 py-0.5 text-[8px] font-bold bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded transition-all"
                          >
                            Next stage ▶
                          </button>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* --- ADD JOB APPLICATION MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Log Career Application</h3>
            <form onSubmit={handleAddApplication} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Microsoft"
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Role Designation</label>
                  <input
                    type="text"
                    required
                    value={roleName}
                    onChange={e => setRoleName(e.target.value)}
                    placeholder="e.g. SDE-1 / Intern"
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">CTC / Package (Optional)</label>
                  <input
                    type="text"
                    value={salaryPackage}
                    onChange={e => setSalaryPackage(e.target.value)}
                    placeholder="e.g. $45/hr or 20 LPA"
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={deadlineDate}
                    onChange={e => setDeadlineDate(e.target.value)}
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Application Notes / Description</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Referral names, job codes, preparation links..."
                  className="w-full h-20 bg-[#060813] border border-white/5 rounded-xl p-3 text-xs text-gray-300 focus:outline-none resize-none font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-glow"
                >
                  Register Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
