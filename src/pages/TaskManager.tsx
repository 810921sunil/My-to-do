import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { Task, TaskCategory, TaskStatus, TaskPriority } from '../types';
import { 
  Plus, 
  Trash2, 
  List, 
  Layers, 
  Search, 
  Filter, 
  Calendar,
  CheckCircle,
  Clock,
  Play
} from 'lucide-react';
import { TimePicker12h, formatTime12h } from '../components/TimePicker12h';

export const TaskManager: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useData();

  // Layout mode: 'list' | 'kanban'
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');

  // Add Task Modal Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCat, setTaskCat] = useState<TaskCategory>('general');
  const [taskSubCat, setTaskSubCat] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskDueDate, setTaskDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [includeTime, setIncludeTime] = useState(false);
  const [taskDueTime, setTaskDueTime] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDueDate) return;

    addTask({
      title: taskTitle,
      description: taskDesc || undefined,
      category: taskCat,
      subCategory: taskSubCat || undefined,
      status: 'not_started',
      priority: taskPriority,
      dueDate: taskDueDate,
      dueTime: (includeTime && taskDueTime) ? taskDueTime : undefined,
      subTasks: []
    });

    // Reset Form
    setTaskTitle('');
    setTaskDesc('');
    setTaskCat('general');
    setTaskSubCat('');
    setTaskPriority('medium');
    setTaskDueDate(new Date().toISOString().split('T')[0]);
    setIncludeTime(false);
    setTaskDueTime('');
    setShowAddModal(false);
  };

  const handleUpdateStatus = (task: Task, newStatus: TaskStatus) => {
    updateTask({
      ...task,
      status: newStatus,
      completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined
    });
  };

  // Filtered task logic
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const columns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'not_started', label: '🟢 Not Started', color: 'border-blue-500/20 bg-blue-500/5 text-blue-300' },
    { id: 'in_progress', label: '🟡 In Progress', color: 'border-amber-500/20 bg-amber-500/5 text-amber-300' },
    { id: 'waiting', label: '🟠 Waiting', color: 'border-orange-500/20 bg-orange-500/5 text-orange-300' },
    { id: 'on_hold', label: '🔵 On Hold', color: 'border-purple-500/20 bg-purple-500/5 text-purple-300' },
    { id: 'review', label: '🟣 Review', color: 'border-indigo-500/20 bg-indigo-500/5 text-indigo-300' },
    { id: 'completed', label: '✅ Completed', color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300' },
    { id: 'missed', label: '❌ Missed', color: 'border-rose-500/20 bg-rose-500/5 text-rose-300' },
    { id: 'overdue', label: '⚠️ Overdue', color: 'border-red-500/20 bg-red-500/5 text-red-400' }
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-200 uppercase tracking-wider">Central Task Manager</h2>
          <p className="text-xs text-gray-500 mt-0.5">Filter, search, organize, and drag items into pipelines.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Toggles */}
          <div className="flex bg-white/[0.02] border border-white/5 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'list' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'kanban' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        </div>
      </div>

      {/* Filters Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-3xl border border-white/5 glass-panel">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-[#060813] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 bg-[#060813] border border-white/5 rounded-xl px-3 py-1">
          <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value as any)}
            className="w-full bg-transparent text-xs text-gray-300 focus:outline-none py-1.5"
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="college">College</option>
            <option value="skill">Skill Dev</option>
            <option value="course">Online Courses</option>
            <option value="business">Business</option>
            <option value="health">Health & Workout</option>
            <option value="finance">Finance</option>
            <option value="personal">Personal</option>
            <option value="reading">Reading Shelf</option>
          </select>
        </div>

        {/* Priority */}
        <div className="flex items-center gap-2 bg-[#060813] border border-white/5 rounded-xl px-3 py-1">
          <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value as any)}
            className="w-full bg-transparent text-xs text-gray-300 focus:outline-none py-1.5"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 bg-[#060813] border border-white/5 rounded-xl px-3 py-1">
          <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="w-full bg-transparent text-xs text-gray-300 focus:outline-none py-1.5"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

      </div>

      {/* --- List View Mode --- */}
      {viewMode === 'list' && (
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-2.5 w-10">Done</th>
                  <th>Task Title</th>
                  <th>Category</th>
                  <th>Sub-Category</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th className="text-right w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-xs text-gray-500">
                      No matching tasks found. Click "Create New Task" to inject one.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map(t => (
                    <tr key={t.id} className="text-xs text-gray-300 hover:bg-white/[0.01]">
                      <td className="py-3.5">
                        <input
                          type="checkbox"
                          checked={t.status === 'completed'}
                          onChange={() => {
                            handleUpdateStatus(t, t.status === 'completed' ? 'not_started' : 'completed');
                          }}
                          className="w-4 h-4 rounded border-gray-600 text-blue-600 bg-transparent focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="font-semibold text-gray-200">
                        <div className="space-y-0.5">
                          <span className={t.status === 'completed' ? 'line-through text-gray-500' : ''}>
                            {t.title}
                          </span>
                          {t.description && (
                            <span className="block text-[10px] text-gray-500 font-normal line-clamp-1">
                              {t.description}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-500/10 text-blue-400 rounded capitalize">
                          {t.category}
                        </span>
                      </td>
                      <td className="text-gray-400 italic">
                        {t.subCategory || '—'}
                      </td>
                      <td className="text-gray-400 font-semibold">{t.dueDate} {t.dueTime && `| ${formatTime12h(t.dueTime)}`}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          t.priority === 'high' ? 'bg-rose-500/10 text-rose-400' : t.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => deleteTask(t.id)}
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
      )}

      {/* --- Kanban Board View Mode --- */}
      {viewMode === 'kanban' && (
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin select-none">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="p-4 rounded-3xl border border-white/5 glass-panel flex flex-col space-y-4 min-h-[500px] flex-1 min-w-[280px] w-[280px]">
                <div className="flex justify-between items-center px-1 border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{col.label}</span>
                  <span className="text-[10px] bg-white/5 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin">
                  {colTasks.length === 0 ? (
                    <div className="py-12 border border-dashed border-white/5 rounded-2xl text-center text-[10px] text-gray-600">
                      Empty column.
                    </div>
                  ) : (
                    colTasks.map(t => (
                      <div 
                        key={t.id}
                        className="p-4 rounded-2xl bg-gray-900/40 hover:bg-gray-900/80 border border-white/5 space-y-3 transition-all relative group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 text-[8px] font-bold text-blue-400 bg-blue-500/10 rounded uppercase">
                              {t.category}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                              t.priority === 'high' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                            }`}>
                              {t.priority}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-200">{t.title}</h4>
                          {t.description && (
                            <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">
                              {t.description}
                            </p>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-2.5 border-t border-white/5 text-[9px] text-gray-500 font-semibold">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            {t.dueDate} {t.dueTime && `(${formatTime12h(t.dueTime)})`}
                          </span>
                          
                          <button
                            onClick={() => deleteTask(t.id)}
                            className="p-1 text-gray-500 hover:text-rose-400 rounded opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Status update pipeline selector */}
                        <div className="flex justify-between items-center pt-2.5 border-t border-white/5">
                          <span className="text-[9px] text-gray-500 font-bold uppercase">Status</span>
                          <select
                            value={t.status}
                            onChange={(e) => handleUpdateStatus(t, e.target.value as TaskStatus)}
                            className="bg-[#060813] border border-white/5 text-[9px] font-bold text-gray-400 rounded px-1.5 py-0.5 focus:outline-none"
                          >
                            <option value="not_started">Not Started</option>
                            <option value="in_progress">In Progress</option>
                            <option value="waiting">Waiting</option>
                            <option value="on_hold">On Hold</option>
                            <option value="review">Review</option>
                            <option value="completed">Completed</option>
                            <option value="missed">Missed</option>
                            <option value="overdue">Overdue</option>
                          </select>
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

      {/* --- ADD TASK MODAL OVERLAY --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Create Custom Workspace Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="e.g. Code database aggregation controllers"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Description (Optional)</label>
                <textarea
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  placeholder="Details, URLs, or notes..."
                  className="w-full h-20 bg-[#060813] border border-white/5 rounded-xl p-3 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50 resize-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Category</label>
                  <select
                    value={taskCat}
                    onChange={e => setTaskCat(e.target.value as any)}
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="general">General</option>
                    <option value="college">College Hub</option>
                    <option value="skill">Skill Dev</option>
                    <option value="course">Online Courses</option>
                    <option value="business">Business</option>
                    <option value="health">Health & workout</option>
                    <option value="finance">Finance</option>
                    <option value="personal">Personal</option>
                    <option value="reading">Reading Shelf</option>
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
                    id="includeTime"
                    checked={includeTime}
                    onChange={e => setIncludeTime(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-blue-600 bg-transparent focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="includeTime" className="text-xs text-gray-400 select-none cursor-pointer">
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
                      <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Due Time (12h AM/PM)</label>
                      <TimePicker12h
                        value={taskDueTime || '11:00'}
                        onChange={val24 => setTaskDueTime(val24)}
                        required={includeTime}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Subcategory Tag (Optional)</label>
                <input
                  type="text"
                  value={taskSubCat}
                  onChange={e => setTaskSubCat(e.target.value)}
                  placeholder="e.g. DSA, MERN, Gym, Bills"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
