import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { Task } from '../types';
import { 
  Kanban, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Tag
} from 'lucide-react';

export const ProjectKanbanBoard: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [newCategory, setNewCategory] = useState<'college' | 'skill' | 'health' | 'personal' | 'general'>('college');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);

  // Group tasks by status
  const todoTasks = tasks.filter(t => t.status === 'not_started');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const handleMoveStatus = (task: Task, nextStatus: 'not_started' | 'in_progress' | 'completed') => {
    updateTask({
      ...task,
      status: nextStatus
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle.trim(),
      priority: newPriority,
      category: newCategory,
      dueDate: newDueDate,
      status: targetStatus,
      subTasks: []
    });

    setNewTitle('');
    setShowAddModal(false);
  };

  const getPriorityColor = (p: string) => {
    if (p === 'critical') return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    if (p === 'high') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (p === 'medium') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const renderTaskCard = (task: Task) => (
    <div 
      key={task.id}
      className="p-4 rounded-2xl glass-panel border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all space-y-3 shadow-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>
        <button 
          onClick={() => deleteTask(task.id)}
          className="text-gray-500 hover:text-rose-400 p-1 rounded-lg transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[10px]">
        <span className={`px-2 py-0.5 rounded-full border font-bold uppercase ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-400 font-bold uppercase">
          {task.category}
        </span>
        {task.dueDate && (
          <span className="text-gray-400 flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-blue-400" />
            {task.dueDate}
          </span>
        )}
      </div>

      {/* Movement Controls */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
        {task.status !== 'not_started' ? (
          <button
            onClick={() => handleMoveStatus(task, task.status === 'completed' ? 'in_progress' : 'not_started')}
            className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white font-bold transition-all"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Move Left</span>
          </button>
        ) : <div />}

        {task.status !== 'completed' ? (
          <button
            onClick={() => handleMoveStatus(task, task.status === 'not_started' ? 'in_progress' : 'completed')}
            className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 font-bold transition-all ml-auto"
          >
            <span>Move Right</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        ) : <div />}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-[#0B0F19] to-indigo-950/40 border border-white/10 glass-panel shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-glow">
              <Kanban className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              Visual Project Kanban Board
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Track task progression across To-Do, In-Progress, and Completed lifecycles.
          </p>
        </div>

        <button
          onClick={() => {
            setTargetStatus('not_started');
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-glow transition-all z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task Card</span>
        </button>
      </div>

      {/* 3-Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: To-Do */}
        <div className="p-5 rounded-3xl glass-panel border border-white/5 bg-white/[0.01] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">To Do ({todoTasks.length})</h3>
            </div>
            <button
              onClick={() => {
                setTargetStatus('not_started');
                setShowAddModal(true);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {todoTasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500 border border-dashed border-white/10 rounded-2xl">
                No tasks to do.
              </div>
            ) : todoTasks.map(renderTaskCard)}
          </div>
        </div>

        {/* Column 2: In-Progress */}
        <div className="p-5 rounded-3xl glass-panel border border-blue-500/20 bg-blue-500/[0.01] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">In Progress ({inProgressTasks.length})</h3>
            </div>
            <button
              onClick={() => {
                setTargetStatus('in_progress');
                setShowAddModal(true);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {inProgressTasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500 border border-dashed border-white/10 rounded-2xl">
                No active tasks in progress.
              </div>
            ) : inProgressTasks.map(renderTaskCard)}
          </div>
        </div>

        {/* Column 3: Completed */}
        <div className="p-5 rounded-3xl glass-panel border border-emerald-500/20 bg-emerald-500/[0.01] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Completed ({completedTasks.length})</h3>
            </div>
            <button
              onClick={() => {
                setTargetStatus('completed');
                setShowAddModal(true);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {completedTasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500 border border-dashed border-white/10 rounded-2xl">
                No completed tasks yet.
              </div>
            ) : completedTasks.map(renderTaskCard)}
          </div>
        </div>

      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel border border-white/10 bg-[#070b14] space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Kanban className="w-4 h-4 text-blue-400" />
              Add Task to Kanban Board
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Design Landing Page Wireframes"
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                    className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="college">College</option>
                    <option value="skill">Skill</option>
                    <option value="health">Health</option>
                    <option value="personal">Personal</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
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
                  Save Task Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
