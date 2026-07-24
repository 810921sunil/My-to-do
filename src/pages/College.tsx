import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Calendar,
  BookOpen,
  ClipboardList
} from 'lucide-react';

export const College: React.FC = () => {
  const { 
    classes, 
    tasks, 
    addClass, 
    deleteClass, 
    updateClassAttendance, 
    addTask, 
    updateTask, 
    deleteTask 
  } = useData();

  // Active Hub Tab
  const [hubTab, setHubTab] = useState<'attendance' | 'assignments' | 'exams'>('attendance');

  // Modal / Form States
  const [showClassModal, setShowClassModal] = useState(false);
  const [className, setClassName] = useState('');
  const [classRoom, setClassRoom] = useState('');
  const [classDays, setClassDays] = useState<string[]>([]);
  const [classTime, setClassTime] = useState('');

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubCat, setTaskSubCat] = useState('Assignments'); // Assignments, Exams, Practical Files, Present, Viva
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [includeTime, setIncludeTime] = useState(false);
  const [taskDueTime, setTaskDueTime] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const collegeTasks = tasks.filter(t => t.category === 'college');
  const assignments = collegeTasks.filter(t => t.subCategory === 'Assignments' || t.subCategory === 'Practical Files');
  const exams = collegeTasks.filter(t => t.subCategory === 'Semester Exams' || t.subCategory === 'Internal Exams' || t.subCategory === 'Viva');

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || classDays.length === 0 || !classTime) return;
    addClass({
      name: className,
      room: classRoom || undefined,
      days: classDays,
      time: classTime,
      attended: 0,
      total: 0
    });
    // Reset
    setClassName('');
    setClassRoom('');
    setClassDays([]);
    setClassTime('');
    setShowClassModal(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDueDate) return;
    addTask({
      title: taskTitle,
      category: 'college',
      subCategory: taskSubCat,
      priority: taskPriority,
      dueDate: taskDueDate,
      dueTime: (includeTime && taskDueTime) ? taskDueTime : undefined,
      status: 'not_started',
      subTasks: []
    });
    setTaskTitle('');
    setTaskDueDate('');
    setIncludeTime(false);
    setTaskDueTime('');
    setShowTaskModal(false);
  };

  const toggleDay = (day: string) => {
    if (classDays.includes(day)) {
      setClassDays(classDays.filter(d => d !== day));
    } else {
      setClassDays([...classDays, day]);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Tab Navigation header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex gap-2 bg-white/[0.02] border border-white/5 p-1 rounded-2xl">
          <button
            onClick={() => setHubTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              hubTab === 'attendance' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Attendance Tracker</span>
          </button>
          <button
            onClick={() => setHubTab('assignments')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              hubTab === 'assignments' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Assignments & Practicals</span>
          </button>
          <button
            onClick={() => setHubTab('exams')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              hubTab === 'exams' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Exams & Vivas</span>
          </button>
        </div>

        {hubTab === 'attendance' ? (
          <button
            onClick={() => setShowClassModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-glow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class Schedule</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setTaskSubCat(hubTab === 'assignments' ? 'Assignments' : 'Internal Exams');
              setShowTaskModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-glow"
          >
            <Plus className="w-4 h-4" />
            <span>Add College Item</span>
          </button>
        )}
      </div>

      {/* --- Attendance Hub --- */}
      {hubTab === 'attendance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {classes.length === 0 ? (
            <div className="col-span-full py-16 text-center border border-dashed border-white/5 rounded-3xl">
              <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-medium">No class schedules found. Click "Add Class Schedule" to start tracking attendance.</p>
            </div>
          ) : (
            classes.map(c => {
              const attendancePercent = c.total > 0 ? Math.round((c.attended / c.total) * 100) : 100;
              const isBelowThreshold = attendancePercent < 75;

              return (
                <div key={c.id} className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-56 relative overflow-hidden group">
                  {/* Attendance alarm background color */}
                  {isBelowThreshold && c.total > 0 && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full filter blur-xl pointer-events-none" />
                  )}

                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-200 truncate max-w-[180px]">{c.name}</h3>
                      <span className="text-[10px] text-gray-500 font-semibold block mt-0.5">
                        {c.time} | Room: {c.room || 'N/A'}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteClass(c.id)}
                      className="p-1.5 text-gray-500 hover:text-rose-400 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Attendance Metrics */}
                  <div className="flex items-end justify-between my-3">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Attendance Rate</span>
                      <span className={`text-3xl font-extrabold tracking-tight ${
                        isBelowThreshold && c.total > 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {attendancePercent}%
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-400 font-semibold">
                        {c.attended} / {c.total} attended
                      </span>
                      <span className="text-[10px] text-gray-500 block">Classes logged</span>
                    </div>
                  </div>

                  {/* Threshold Alert or Ok */}
                  <div className="flex items-center gap-2 border-t border-white/5 pt-3">
                    {isBelowThreshold && c.total > 0 ? (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded-lg w-full">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Warning: Drop below 75% threshold!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg w-full">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>Attendance is safe (&gt;= 75%)</span>
                      </div>
                    )}
                  </div>

                  {/* Log Action Buttons */}
                  <div className="flex gap-2 mt-3 pt-1 border-t border-white/5">
                    <button
                      onClick={() => updateClassAttendance(c.id, true)}
                      className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wide bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg transition-all"
                    >
                      Attended
                    </button>
                    <button
                      onClick={() => updateClassAttendance(c.id, false)}
                      className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wide bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition-all"
                    >
                      Skipped
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* --- Assignments Hub --- */}
      {hubTab === 'assignments' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main assignments table */}
          <div className="xl:col-span-2 p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Assignments Checklist</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-2.5">Status</th>
                    <th>Assignment Name</th>
                    <th>Topic</th>
                    <th>Deadline</th>
                    <th>Priority</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-gray-500">
                        No pending assignments or practical files. Great job!
                      </td>
                    </tr>
                  ) : (
                    assignments.map(a => (
                      <tr key={a.id} className="text-xs text-gray-300 hover:bg-white/[0.01]">
                        <td className="py-3">
                          <input
                            type="checkbox"
                            checked={a.status === 'completed'}
                            onChange={() => {
                              updateTask({
                                ...a,
                                status: a.status === 'completed' ? 'not_started' : 'completed',
                                completedDate: a.status === 'completed' ? undefined : today
                              });
                            }}
                            className="w-4 h-4 rounded border-gray-600 text-blue-600 bg-transparent focus:ring-0 cursor-pointer"
                          />
                        </td>
                        <td className="font-semibold text-gray-200">{a.title}</td>
                        <td>
                          <span className="px-2 py-0.5 text-[9px] font-bold bg-white/5 rounded text-gray-400">
                            {a.subCategory}
                          </span>
                        </td>
                        <td className="text-gray-400 font-semibold">{a.dueDate}</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            a.priority === 'high' ? 'bg-rose-500/10 text-rose-400' : a.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {a.priority}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => deleteTask(a.id)}
                            className="p-1 text-gray-500 hover:text-rose-400 rounded hover:bg-white/5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick instructions / Info card */}
          <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4 h-fit">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Aesthetic Study Tips</h3>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="p-3 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <h4 className="font-semibold text-blue-300 mb-1">Pomodoro Technique</h4>
                <p className="leading-relaxed">Work for 25 minutes, then rest for 5. Repeat 4 times and take a longer break. It enhances cognitive focus.</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                <h4 className="font-semibold text-purple-300 mb-1">Active Recall</h4>
                <p className="leading-relaxed">Close your books and write down everything you remember about a chapter before studying it again.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Exams & Vivas Hub --- */}
      {hubTab === 'exams' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Exams & Vivas Dates</h3>
            <div className="space-y-3">
              {exams.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">No college exams or viva tests scheduled. Enjoy your peaceful week!</p>
              ) : (
                exams.map(e => (
                  <div key={e.id} className="p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-bold uppercase">
                          {e.subCategory}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          e.priority === 'high' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {e.priority}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-gray-200">{e.title}</h4>
                      <p className="text-[10px] text-gray-500">{e.description}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-left sm:text-right">
                        <span className="block text-[10px] text-gray-500 font-semibold uppercase">Exam Date</span>
                        <span className="text-xs font-bold text-gray-300">{e.dueDate} {e.dueTime && `| ${e.dueTime}`}</span>
                      </div>
                      <button
                        onClick={() => deleteTask(e.id)}
                        className="p-1.5 text-gray-500 hover:text-rose-400 rounded-lg hover:bg-white/5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4 h-fit">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Academics Quick Reminders</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Always set internal exam reminders 1 week early. For Vivas and Presentations, upload files inside the "Notes & Files" section for instant access on slides day.
            </p>
          </div>
        </div>
      )}

      {/* --- ADD CLASS SCHEDULE MODAL --- */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Add Class Schedule</h3>
            <form onSubmit={handleAddClass} className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Room No.</label>
                  <input
                    type="text"
                    value={classRoom}
                    onChange={e => setClassRoom(e.target.value)}
                    placeholder="e.g. LHC-402"
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Class Time</label>
                  <input
                    type="time"
                    required
                    value={classTime}
                    onChange={e => setClassTime(e.target.value)}
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1.5">Schedule Days</label>
                <div className="flex flex-wrap gap-1.5">
                  {daysOfWeek.map(day => {
                    const active = classDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border transition-all ${
                          active 
                            ? 'bg-blue-600/15 border-blue-500/30 text-blue-400' 
                            : 'bg-[#060813] border-white/5 text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="flex-1 py-2 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-glow"
                >
                  Add Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD COLLEGE TASK MODAL --- */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Add College Hub Item</h3>
            <form onSubmit={handleAddTask} className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="e.g. Design slide deck for Cyber Sec viva"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Item Category</label>
                  <select
                    value={taskSubCat}
                    onChange={e => setTaskSubCat(e.target.value)}
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="Assignments">Assignment</option>
                    <option value="Practical Files">Practical File</option>
                    <option value="Internal Exams">Internal Exam</option>
                    <option value="Semester Exams">Semester Exam</option>
                    <option value="Viva">Viva Test</option>
                    <option value="Presentation">Presentation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as any)}
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 p-3 rounded-2xl bg-white/[0.01] border border-white/5">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="includeCollegeTime"
                    checked={includeTime}
                    onChange={e => setIncludeTime(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-blue-600 bg-transparent focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="includeCollegeTime" className="text-xs text-gray-400 select-none cursor-pointer">
                    Specify exact due time
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Due Date</label>
                    <input
                      type="date"
                      required
                      value={taskDueDate}
                      onChange={e => setTaskDueDate(e.target.value)}
                      className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  {includeTime && (
                    <div>
                      <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Due Time</label>
                      <input
                        type="time"
                        required={includeTime}
                        value={taskDueTime}
                        onChange={e => setTaskDueTime(e.target.value)}
                        className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 py-2 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-glow"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
