import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Bell, 
  ShoppingBag,
  ExternalLink,
  ClipboardList
} from 'lucide-react';

export const PersonalReading: React.FC = () => {
  const { 
    books, 
    tasks, 
    addBook, 
    updateBookProgress, 
    deleteBook, 
    addTask, 
    updateTask, 
    deleteTask 
  } = useData();

  // Sub tabs: 'reading' | 'personal'
  const [subTab, setSubTab] = useState<'reading' | 'personal'>('reading');

  // Book Modal States
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookType, setBookType] = useState<'book' | 'article' | 'research_paper' | 'pdf'>('book');
  const [bookPages, setBookPages] = useState(250);

  // Personal task Modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubCat, setTaskSubCat] = useState('Shopping'); // Shopping, Birthday, Travel, Medical

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim() || !bookAuthor.trim() || bookPages <= 0) return;
    addBook({
      title: bookTitle,
      author: bookAuthor,
      type: bookType,
      totalPages: bookPages,
      currentPage: 0
    });
    setBookTitle('');
    setBookAuthor('');
    setBookPages(250);
    setShowBookModal(false);
  };

  const handleAddPersonalTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      title: taskTitle,
      category: 'personal',
      subCategory: taskSubCat,
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'not_started',
      subTasks: []
    });
    setTaskTitle('');
    setShowTaskModal(false);
  };

  const personalTasks = tasks.filter(t => t.category === 'personal');

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Sub navigation tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex gap-2 bg-white/[0.02] border border-white/5 p-1 rounded-2xl">
          <button
            onClick={() => setSubTab('reading')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              subTab === 'reading' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Bookshelf</span>
          </button>
          <button
            onClick={() => setSubTab('personal')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              subTab === 'personal' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Birthdays & Personal Reminders</span>
          </button>
        </div>

        {subTab === 'reading' ? (
          <button
            onClick={() => setShowBookModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-glow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book / PDF</span>
          </button>
        ) : (
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-glow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
        )}
      </div>

      {/* --- Reading bookshelf view --- */}
      {subTab === 'reading' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {books.map(b => {
            const progressPercent = b.totalPages > 0 ? Math.round((b.currentPage / b.totalPages) * 100) : 0;
            return (
              <div key={b.id} className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-56 relative group">
                
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="px-1.5 py-0.5 text-[8px] font-bold text-indigo-400 bg-indigo-500/10 rounded uppercase">
                      {b.type.replace('_', ' ')}
                    </span>
                    <h3 className="text-xs font-bold text-gray-200 truncate max-w-[200px]">{b.title}</h3>
                    <span className="text-[10px] text-gray-500 font-semibold block">{b.author}</span>
                  </div>
                  <button
                    onClick={() => deleteBook(b.id)}
                    className="p-1 text-gray-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="space-y-2 my-2">
                  <div className="flex justify-between items-end text-[11px] font-semibold text-gray-400">
                    <span>Progress</span>
                    <span>{b.currentPage} / {b.totalPages} pages ({progressPercent}%)</span>
                  </div>
                  <div className="w-full bg-white/[0.04] rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Progress updater */}
                <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateBookProgress(b.id, b.currentPage - 10)}
                      disabled={b.currentPage <= 0}
                      className="w-6 h-6 flex items-center justify-center bg-white/5 text-gray-400 hover:text-white rounded-lg text-[10px] font-bold disabled:opacity-30"
                    >
                      -10
                    </button>
                    <button
                      onClick={() => updateBookProgress(b.id, b.currentPage + 10)}
                      disabled={b.currentPage >= b.totalPages}
                      className="w-6 h-6 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold disabled:opacity-30"
                    >
                      +10
                    </button>
                    <span className="text-[10px] text-gray-500 font-medium">Pages read</span>
                  </div>

                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-lg ${
                    b.status === 'completed' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : b.status === 'reading' ? 'bg-amber-500/10 text-amber-400' : 'bg-white/5 text-gray-500'
                  }`}>
                    {b.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* --- Personal Alerts & Reminders view --- */}
      {subTab === 'personal' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Columns categorized by tag */}
          {['Birthday', 'Medical', 'Shopping', 'Travel'].map(subCat => {
            const catTasks = personalTasks.filter(t => t.subCategory === subCat);
            const getColIcon = () => {
              if (subCat === 'Birthday') return <Bell className="w-4 h-4 text-pink-400" />;
              if (subCat === 'Shopping') return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
              return <ClipboardList className="w-4 h-4 text-indigo-400" />;
            };

            return (
              <div key={subCat} className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    {getColIcon()}
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">{subCat} Alerts</h3>
                  </div>
                  <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full font-bold">
                    {catTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {catTasks.length === 0 ? (
                    <p className="text-[11px] text-gray-500 italic py-4">No active reminders.</p>
                  ) : (
                    catTasks.map(t => (
                      <div 
                        key={t.id}
                        className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3 relative group transition-all"
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
                            className={`px-2 py-0.5 text-[9px] font-bold rounded-lg border transition-all ${
                              t.status === 'completed'
                                ? 'bg-emerald-500/10 border-emerald-500/10 text-emerald-400'
                                : 'bg-[#060813] border-white/5 text-gray-400 hover:text-gray-200'
                            }`}
                          >
                            {t.status === 'completed' ? 'Done' : 'Complete'}
                          </button>
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

      {/* --- ADD BOOK MODAL --- */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Add Book / Paper to Shelf</h3>
            <form onSubmit={handleAddBook} className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={bookTitle}
                  onChange={e => setBookTitle(e.target.value)}
                  placeholder="e.g. Atomic Habits"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Author</label>
                <input
                  type="text"
                  required
                  value={bookAuthor}
                  onChange={e => setBookAuthor(e.target.value)}
                  placeholder="e.g. James Clear"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Type</label>
                  <select
                    value={bookType}
                    onChange={e => setBookType(e.target.value as any)}
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="book">Book</option>
                    <option value="pdf">PDF File</option>
                    <option value="research_paper">Research Paper</option>
                    <option value="article">Web Article</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Total Pages</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={bookPages}
                    onChange={e => setBookPages(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="flex-1 py-2 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-glow"
                >
                  Put on Shelf
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD PERSONAL REMINDER MODAL --- */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Add Personal Alert Reminder</h3>
            <form onSubmit={handleAddPersonalTask} className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Reminder Detail</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="e.g. Call Grandpa for birthday wishes"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Reminder Type</label>
                <select
                  value={taskSubCat}
                  onChange={e => setTaskSubCat(e.target.value)}
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                >
                  <option value="Birthday">Birthday Follow-up</option>
                  <option value="Medical">Medicine / Doctor Alert</option>
                  <option value="Shopping">Shopping Checklist</option>
                  <option value="Travel">Travel / Hotel Ticket</option>
                </select>
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
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
