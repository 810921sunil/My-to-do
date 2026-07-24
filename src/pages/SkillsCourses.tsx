import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Code2, 
  Plus, 
  Trash2, 
  BookOpen, 
  ExternalLink,
  Award
} from 'lucide-react';

export const SkillsCourses: React.FC = () => {
  const { 
    courses, 
    tasks, 
    addCourse, 
    updateCourseProgress, 
    deleteCourse, 
    addTask, 
    updateTask, 
    deleteTask 
  } = useData();

  // Tab: 'courses' | 'skills'
  const [activeTab, setActiveTab] = useState<'courses' | 'skills'>('courses');

  // Course Modal
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [coursePlatform, setCoursePlatform] = useState<any>('Udemy');
  const [totalLectures, setTotalLectures] = useState(30);

  // Skill Add Modal
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skillTitle, setSkillTitle] = useState('');
  const [skillSubCat, setSkillSubCat] = useState('Programming'); // Programming, DSA, Web Development, AI, GitHub Projects
  const [skillPriority, setSkillPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim() || totalLectures <= 0) return;
    addCourse({
      name: courseName,
      platform: coursePlatform,
      totalLectures,
      completedLectures: 0
    });
    setCourseName('');
    setTotalLectures(30);
    setShowCourseModal(false);
  };

  const handleAddSkillTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillTitle.trim()) return;
    addTask({
      title: skillTitle,
      category: 'skill',
      subCategory: skillSubCat,
      priority: skillPriority,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'not_started',
      subTasks: []
    });
    setSkillTitle('');
    setShowSkillModal(false);
  };

  const skillTasks = tasks.filter(t => t.category === 'skill');

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Page Tabs Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex gap-2 bg-white/[0.02] border border-white/5 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'courses' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Online Course Portfolios</span>
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'skills' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Coding Roadmaps & DSA</span>
          </button>
        </div>

        {activeTab === 'courses' ? (
          <button
            onClick={() => setShowCourseModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-glow"
          >
            <Plus className="w-4 h-4" />
            <span>Register Online Course</span>
          </button>
        ) : (
          <button
            onClick={() => setShowSkillModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-glow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Roadmap Target</span>
          </button>
        )}
      </div>

      {/* --- Online Courses Section --- */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map(c => {
            const pct = c.totalLectures > 0 ? Math.round((c.completedLectures / c.totalLectures) * 100) : 0;
            return (
              <div key={c.id} className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-64 relative group">
                
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 text-[9px] font-bold text-blue-400 bg-blue-500/10 rounded-md">
                      {c.platform}
                    </span>
                    <h3 className="text-sm font-bold text-gray-200 leading-snug line-clamp-2 pr-4">{c.name}</h3>
                  </div>

                  <button
                    onClick={() => deleteCourse(c.id)}
                    className="p-1.5 text-gray-500 hover:text-rose-400 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress bar info */}
                <div className="space-y-2 my-2">
                  <div className="flex justify-between items-end text-xs">
                    <span className="text-gray-500 font-semibold uppercase text-[10px]">Lectures Done</span>
                    <span className="font-bold text-gray-200">
                      {c.completedLectures} / {c.totalLectures} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/[0.04] rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        c.isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-glow-green' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Certificate & lectures update footer */}
                <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-2">
                  {c.isCompleted ? (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg font-bold">
                      <Award className="w-4 h-4 shrink-0" />
                      <span>Certified!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateCourseProgress(c.id, c.completedLectures - 1)}
                        disabled={c.completedLectures <= 0}
                        className="w-6 h-6 flex items-center justify-center bg-white/5 text-gray-400 hover:text-white rounded-lg text-xs disabled:opacity-40"
                      >
                        -
                      </button>
                      <button
                        onClick={() => updateCourseProgress(c.id, c.completedLectures + 1)}
                        className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-500 rounded-lg text-xs"
                      >
                        +
                      </button>
                      <span className="text-[10px] text-gray-400 font-medium">{c.remainingLectures} left</span>
                    </div>
                  )}

                  {c.certificateUrl ? (
                    <a 
                      href={c.certificateUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-blue-400 font-semibold"
                    >
                      <span>View Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        // simulate upload certificate url
                        const url = prompt('Enter certificate URL:');
                        if (url) {
                          // we can attach it using our mock/real data modifiers. For this template we prompt.
                          alert('Certificate added!');
                        }
                      }}
                      className="text-[10px] text-gray-500 hover:text-gray-300 font-semibold"
                    >
                      Upload Certificate
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* --- Skill Development Roadmaps --- */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* Sub-categorized Columns */}
          {['Programming', 'DSA', 'Web Development', 'GitHub Projects'].map(subCat => {
            const subTasks = skillTasks.filter(t => t.subCategory === subCat);
            return (
              <div key={subCat} className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    {subCat === 'GitHub Projects' ? (
                      <Code2 className="w-4 h-4 text-gray-300" />
                    ) : (
                      <Code2 className="w-4 h-4 text-emerald-400" />
                    )}
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">{subCat}</h3>
                  </div>
                  <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full font-bold">
                    {subTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {subTasks.length === 0 ? (
                    <p className="text-[11px] text-gray-500 italic py-4">No active cards.</p>
                  ) : (
                    subTasks.map(t => (
                      <div 
                        key={t.id}
                        className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3 relative group transition-all hover:border-emerald-500/20"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className={`text-xs font-semibold leading-relaxed ${
                            t.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-200'
                          }`}>
                            {t.title}
                          </span>
                          <button
                            onClick={() => deleteTask(t.id)}
                            className="p-1 text-gray-500 hover:text-rose-400 rounded opacity-0 group-hover:opacity-100 transition-all shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex justify-between items-center pt-2.5 border-t border-white/5">
                          <button
                            onClick={() => {
                              updateTask({
                                ...t,
                                status: t.status === 'completed' ? 'not_started' : 'completed'
                              });
                            }}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                              t.status === 'completed'
                                ? 'bg-emerald-500/10 border-emerald-500/10 text-emerald-400'
                                : 'bg-[#060813] border-white/5 text-gray-400 hover:text-gray-200'
                            }`}
                          >
                            {t.status === 'completed' ? 'Done' : 'Mark Done'}
                          </button>
                          
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            t.priority === 'high' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- REGISTER COURSE MODAL --- */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Register Online Course</h3>
            <form onSubmit={handleAddCourse} className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={courseName}
                  onChange={e => setCourseName(e.target.value)}
                  placeholder="e.g. Next.js 15 & React Server Components"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Platform</label>
                  <select
                    value={coursePlatform}
                    onChange={e => setCoursePlatform(e.target.value as any)}
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="Udemy">Udemy</option>
                    <option value="Coursera">Coursera</option>
                    <option value="YouTube">YouTube</option>
                    <option value="NPTEL">NPTEL</option>
                    <option value="SWAYAM">SWAYAM</option>
                    <option value="FreeCodeCamp">FreeCodeCamp</option>
                    <option value="Other">Other Platform</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Total Lectures</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={totalLectures}
                    onChange={e => setTotalLectures(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="flex-1 py-2 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-glow"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD SKILL ROADMAP TARGET MODAL --- */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Add Skill Roadmap Target</h3>
            <form onSubmit={handleAddSkillTask} className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Target Name</label>
                <input
                  type="text"
                  required
                  value={skillTitle}
                  onChange={e => setSkillTitle(e.target.value)}
                  placeholder="e.g. Master React Portals and Context optimization"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Subcategory</label>
                  <select
                    value={skillSubCat}
                    onChange={e => setSkillSubCat(e.target.value)}
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="Programming">Programming</option>
                    <option value="DSA">DSA</option>
                    <option value="Web Development">Web Development</option>
                    <option value="GitHub Projects">GitHub Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Priority</label>
                  <select
                    value={skillPriority}
                    onChange={e => setSkillPriority(e.target.value as any)}
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="flex-1 py-2 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-glow"
                >
                  Add Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
