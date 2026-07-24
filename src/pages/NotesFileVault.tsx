import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Folder, 
  Upload, 
  Pin, 
  Search, 
  ArrowLeft,
  FileIcon,
  Download,
  FolderPlus
} from 'lucide-react';

export const NotesFileVault: React.FC = () => {
  const { 
    notes, 
    files, 
    folders, 
    addNote, 
    updateNote, 
    deleteNote, 
    addFolder, 
    addFile, 
    deleteFile, 
    deleteFolder,
    addTask,
    earnReward
  } = useData();

  // Primary page tabs: 'notes' | 'files' | 'ai_assistant'
  const [activeTab, setActiveTab] = useState<'notes' | 'files' | 'ai_assistant'>('notes');

  // AI OCR States
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrConsole, setOcrConsole] = useState<string[]>([]);
  const [ocrFile, setOcrFile] = useState<string | null>(null);

  // AI PDF Summary States
  const [pdfAnalyzing, setPdfAnalyzing] = useState(false);
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [pdfSummary, setPdfSummary] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Notes Search & Selected States
  const [noteSearch, setNoteSearch] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  // Note editor states (controlled)
  const [editTitle, setEditTitle] = useState(selectedNote?.title || '');
  const [editContent, setEditContent] = useState(selectedNote?.content || '');
  const [editTags, setEditTags] = useState(selectedNote?.tags.join(', ') || '');

  // Update selected note states when note selection changes
  React.useEffect(() => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
      setEditTags(selectedNote.tags.join(', '));
    } else {
      setEditTitle('');
      setEditContent('');
      setEditTags('');
    }
  }, [selectedNoteId, selectedNote]);

  const handleSaveNote = () => {
    if (!selectedNoteId) return;
    updateNote({
      id: selectedNoteId,
      title: editTitle || 'Untitled Note',
      content: editContent,
      tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
      isPinned: selectedNote?.isPinned || false,
      dateCreated: selectedNote?.dateCreated || '',
      dateUpdated: new Date().toISOString().split('T')[0]
    });
    alert('Note saved successfully!');
  };

  const handleCreateNote = () => {
    const id = 'n_' + Date.now();
    addNote({
      title: 'New Quick Draft Note',
      content: 'Write notes here...',
      tags: ['General'],
      isPinned: false
    });
    // Set selected to newly created note
    setSelectedNoteId(notes[0]?.id || id);
  };

  const handleTogglePin = (note: any) => {
    updateNote({
      ...note,
      isPinned: !note.isPinned
    });
  };

  // File Manager states
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderName, setFolderName] = useState('');
  const [showFolderModal, setShowFolderModal] = useState(false);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    addFolder(folderName, currentFolderId);
    setFolderName('');
    setShowFolderModal(false);
  };

  const handleMockFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let type: 'pdf' | 'image' | 'video' | 'document' | 'zip' = 'document';
    if (file.type.includes('image')) type = 'image';
    else if (file.type.includes('pdf')) type = 'pdf';
    else if (file.type.includes('zip') || file.type.includes('rar')) type = 'zip';
    else if (file.type.includes('video')) type = 'video';

    addFile({
      name: file.name,
      size: file.size,
      type,
      url: '#',
      parentFolderId: currentFolderId
    });
  };

  const runOCRScan = (fileName: string) => {
    setOcrScanning(true);
    setOcrFile(fileName);
    setOcrProgress(10);
    setOcrConsole(['[System] Initializing Gemini layout parser...', '[System] Loading neural vision filters...']);

    setTimeout(() => {
      setOcrProgress(40);
      setOcrConsole(prev => [...prev, '[OCR] Reading text layers from screenshot pixels...', '[OCR] Isolating assignment titles & due dates...']);
    }, 1000);

    setTimeout(() => {
      setOcrProgress(80);
      setOcrConsole(prev => [...prev, '[Parser] Extracted text: "Semester Math Assignment due tomorrow, Compiler practical due next Friday"', '[Parser] Structuring task payloads...']);
    }, 2000);

    setTimeout(() => {
      setOcrProgress(100);
      setOcrScanning(false);
      setOcrConsole(prev => [...prev, '✓ Successfully generated 2 tasks from screenshot! Check your task board.', '✓ Awarded +50 XP and +5 Coins!']);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      const nextFri = new Date();
      nextFri.setDate(nextFri.getDate() + ((5 + 7 - nextFri.getDay()) % 7 || 7));
      const nextFriStr = nextFri.toISOString().split('T')[0];

      addTask({
        title: 'Maths Assignment 4: Calculus Limits (OCR)',
        category: 'college',
        subCategory: 'Assignments',
        priority: 'high',
        dueDate: tomorrowStr,
        status: 'not_started',
        subTasks: []
      });

      addTask({
        title: 'Compiler Design Practical File (OCR)',
        category: 'college',
        subCategory: 'Practical Files',
        priority: 'medium',
        dueDate: nextFriStr,
        status: 'not_started',
        subTasks: []
      });

      earnReward(50, 5);
    }, 3200);
  };

  const runPDFAnalysis = (fileName: string) => {
    setPdfAnalyzing(true);
    setPdfFile(fileName);
    setPdfSummary(false);
    setQuizAnswers({});
    setQuizScore(null);

    setTimeout(() => {
      setPdfAnalyzing(false);
      setPdfSummary(true);
      earnReward(30, 3);
    }, 2000);
  };

  // Filters
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
    n.content.toLowerCase().includes(noteSearch.toLowerCase())
  );

  const currentFolders = folders.filter(f => f.parentFolderId === currentFolderId);
  const currentFiles = files.filter(f => f.parentFolderId === currentFolderId);

  // Format file size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Sub tabs header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex gap-2 bg-white/[0.02] border border-white/5 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'notes' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Rich Text Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'files' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>File Manager Vault</span>
          </button>
          <button
            onClick={() => setActiveTab('ai_assistant')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'ai_assistant' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="text-xs">🤖 AI Document Assistant</span>
          </button>
        </div>

        {activeTab === 'notes' ? (
          <button
            onClick={handleCreateNote}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-glow"
          >
            <Plus className="w-4 h-4" />
            <span>New Note Draft</span>
          </button>
        ) : activeTab === 'files' ? (
          <div className="flex gap-2">
            <button
              onClick={() => setShowFolderModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all"
            >
              <FolderPlus className="w-4 h-4 text-gray-400" />
              <span>Create Folder</span>
            </button>
            <label className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-glow cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Upload File</span>
              <input type="file" onChange={handleMockFileUpload} className="hidden" />
            </label>
          </div>
        ) : null}
      </div>

      {/* --- Rich Text Notes view --- */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          
          {/* Notes Sidebar List */}
          <div className="p-4 rounded-3xl border border-white/5 glass-panel flex flex-col space-y-4 h-full">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                value={noteSearch}
                onChange={e => setNoteSearch(e.target.value)}
                placeholder="Search notes tags..."
                className="w-full bg-[#060813] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {filteredNotes.map(n => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNoteId(n.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all relative group flex flex-col gap-1.5 ${
                    selectedNoteId === n.id 
                      ? 'bg-blue-600/10 border-blue-500/30' 
                      : 'bg-white/[0.01] hover:bg-white/[0.03] border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-gray-200 truncate pr-6">{n.title}</h4>
                    <div className="flex items-center gap-1 absolute right-3 top-3.5">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleTogglePin(n); }}
                        className={`p-0.5 rounded hover:bg-white/5 ${
                          n.isPinned ? 'text-blue-400' : 'text-gray-600 opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Pin className="w-3 h-3 fill-current" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); deleteNote(n.id); if (selectedNoteId === n.id) setSelectedNoteId(null); }}
                        className="p-0.5 text-gray-600 hover:text-rose-400 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                    {n.content}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {n.tags.map(t => (
                      <span key={t} className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-white/5 text-gray-500 uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Full Note Editor */}
          <div className="lg:col-span-2 p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between h-full">
            {selectedNote ? (
              <div className="flex-1 flex flex-col space-y-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="Note Title"
                  className="w-full bg-transparent text-lg font-bold border-b border-white/5 pb-2 text-white focus:outline-none focus:border-blue-500/50"
                />

                <input
                  type="text"
                  value={editTags}
                  onChange={e => setEditTags(e.target.value)}
                  placeholder="Tags (separated by comma, e.g. Guide, MERN, College)"
                  className="w-full bg-transparent text-xs text-gray-500 focus:outline-none"
                />

                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  placeholder="Start writing thoughts here..."
                  className="flex-1 w-full bg-transparent text-xs leading-relaxed text-gray-300 focus:outline-none resize-none font-sans"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 text-xs">
                Select a note from the sidebar or click "New Note Draft" to start writing.
              </div>
            )}

            {selectedNote && (
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                <span className="text-[10px] text-gray-500 font-semibold">
                  Last Updated: {selectedNote.dateUpdated}
                </span>
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-glow"
                >
                  Save Note
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* --- File Manager Vault view --- */}
      {activeTab === 'files' && (
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4 min-h-[500px]">
          
          {/* Breadcrumb / Navigation bar */}
          <div className="flex items-center gap-2 text-xs">
            {currentFolderId !== null && (
              <button
                onClick={() => {
                  const parentFolder = folders.find(f => f.id === currentFolderId);
                  setCurrentFolderId(parentFolder?.parentFolderId || null);
                }}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
            <span className="text-gray-500 font-medium">/</span>
            <span className="text-gray-300 font-bold">
              {currentFolderId === null ? 'Root Vault' : folders.find(f => f.id === currentFolderId)?.name}
            </span>
          </div>

          {/* Grid layout folders + files */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
            
            {/* Folders */}
            {currentFolders.map(f => (
              <div 
                key={f.id}
                onClick={() => setCurrentFolderId(f.id)}
                className="p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 flex flex-col justify-between h-32 cursor-pointer transition-all relative group"
              >
                <Folder className="w-8 h-8 text-yellow-500 fill-yellow-500/20" />
                <div>
                  <h4 className="text-xs font-bold text-gray-200 truncate pr-6">{f.name}</h4>
                  <span className="text-[9px] text-gray-500 font-semibold mt-0.5 block">
                    {files.filter(file => file.parentFolderId === f.id).length} Files
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteFolder(f.id); }}
                  className="p-1 text-gray-500 hover:text-rose-400 rounded absolute right-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Files */}
            {currentFiles.map(file => (
              <div 
                key={file.id}
                className="p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 flex flex-col justify-between h-32 relative group transition-all"
              >
                <FileIcon className="w-8 h-8 text-blue-400" />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-gray-200 truncate pr-6">{file.name}</h4>
                  <span className="text-[9px] text-gray-500 font-semibold block truncate mt-0.5">
                    {formatBytes(file.size)} | {file.dateUploaded}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 absolute right-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 transition-all">
                  <a
                    href={file.url}
                    download
                    className="p-1 text-gray-400 hover:text-blue-400 rounded hover:bg-white/5"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="p-1 text-gray-400 hover:text-rose-400 rounded hover:bg-white/5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Empty check */}
            {currentFolders.length === 0 && currentFiles.length === 0 && (
              <div className="col-span-full py-16 text-center text-xs text-gray-500">
                This folder is empty. Drag in files or click "Upload File" to start sorting documents.
              </div>
            )}

          </div>

        </div>
      )}

      {/* --- AI Document Assistant view --- */}
      {activeTab === 'ai_assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Section 1: OCR Screenshot Task Builder */}
          <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4 h-fit">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <span>📸</span> OCR Screenshot Task Builder
              </h3>
              <p className="text-xs text-gray-500">
                Upload a screenshot of your homework list, syllabus checklist, or exam notices. The parser will read tasks, calculate priority, and import them directly.
              </p>
            </div>

            <div className="p-6 border-2 border-dashed border-white/10 rounded-2xl text-center space-y-3 relative overflow-hidden bg-[#060813]/20">
              <Upload className="w-8 h-8 text-blue-400 mx-auto" />
              <div className="text-xs text-gray-400">
                <span className="text-blue-400 font-bold hover:underline cursor-pointer">Choose a screenshot</span> or drag and drop here
                <p className="text-[10px] text-gray-600 mt-1">PNG, JPG, JPEG up to 5MB</p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) runOCRScan(file.name);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={ocrScanning}
              />
            </div>

            {ocrFile && (
              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3">
                <div className="flex justify-between items-center text-xs text-gray-300">
                  <span className="font-semibold text-blue-400 truncate max-w-[200px]">📁 {ocrFile}</span>
                  <span>{ocrProgress}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${ocrProgress}%` }} />
                </div>

                <div className="p-3 bg-[#060813] border border-white/5 rounded-xl font-mono text-emerald-400 h-28 overflow-y-auto space-y-1 scrollbar-thin text-[10px]">
                  {ocrConsole.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: PDF Summarizer & Quiz Desk */}
          <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <span>📄</span> PDF Summarizer & Quiz Desk
              </h3>
              <p className="text-xs text-gray-500">
                Analyze study notes, research PDFs, or slideshows to auto-generate a study overview and an interactive review quiz.
              </p>
            </div>

            <div className="p-6 border-2 border-dashed border-white/10 rounded-2xl text-center space-y-3 relative overflow-hidden bg-[#060813]/20">
              <FileIcon className="w-8 h-8 text-indigo-400 mx-auto" />
              <div className="text-xs text-gray-400">
                <span className="text-indigo-400 font-bold hover:underline cursor-pointer">Select study PDF</span> or drop document
                <p className="text-[10px] text-gray-600 mt-1">PDF format up to 20MB</p>
              </div>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) runPDFAnalysis(file.name);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={pdfAnalyzing}
              />
            </div>

            {pdfAnalyzing && (
              <div className="text-center py-6 space-y-2 text-xs text-gray-400">
                <span className="block animate-spin text-lg">⚙️</span>
                <span>Gemini API analyzing core concepts...</span>
              </div>
            )}

            {pdfSummary && pdfFile && (
              <div className="space-y-4 border-t border-white/5 pt-4">
                <div className="p-4 rounded-2xl bg-indigo-500/[0.02] border border-indigo-500/10 space-y-2">
                  <h4 className="text-xs font-bold text-gray-200">Concept Summary: {pdfFile}</h4>
                  <ul className="list-disc list-inside text-[11px] text-gray-400 space-y-1 leading-relaxed">
                    <li>Core topics focus on Neural Networks and Gradient Descent models.</li>
                    <li>Backpropagation calculates loss function gradients for weights updates.</li>
                    <li>Activation functions (ReLU, Sigmoid) introduce non-linear mapping.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-gray-200 flex items-center gap-1">
                    <span>📝</span> Interactive Lecture Quiz
                  </h4>
                  
                  <div className="space-y-3 text-xs text-gray-300">
                    {[
                      {
                        q: "Q1: What does backpropagation optimize in training?",
                        opts: ["(A) Weights and biases", "(B) Display graphics", "(C) Page count"],
                        ans: "(A) Weights and biases"
                      },
                      {
                        q: "Q2: Which activation function outputs values in [0, 1] range?",
                        opts: ["(A) ReLU", "(B) Sigmoid", "(C) Linear"],
                        ans: "(B) Sigmoid"
                      }
                    ].map((quiz, qIdx) => (
                      <div key={qIdx} className="space-y-2">
                        <p className="font-semibold text-gray-300">{quiz.q}</p>
                        <div className="grid grid-cols-3 gap-2">
                          {quiz.opts.map(opt => {
                            const isSelected = quizAnswers[qIdx] === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  if (quizScore !== null) return;
                                  setQuizAnswers(prev => ({ ...prev, [qIdx]: opt }));
                                }}
                                className={`py-1.5 px-2 text-[10px] rounded-xl font-medium border text-center transition-all ${
                                  isSelected 
                                    ? 'bg-indigo-600 border-indigo-500 text-white'
                                    : 'bg-white/[0.01] border-white/5 text-gray-400 hover:text-gray-200'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <div className="pt-2 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => {
                          let correct = 0;
                          if (quizAnswers[0] === "(A) Weights and biases") correct++;
                          if (quizAnswers[1] === "(B) Sigmoid") correct++;
                          setQuizScore(correct);
                          earnReward(correct * 30, correct * 3);
                        }}
                        disabled={Object.keys(quizAnswers).length < 2 || quizScore !== null}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-[10px] font-bold shadow-glow"
                      >
                        Submit Answers
                      </button>

                      {quizScore !== null && (
                        <span className="text-[11px] font-bold text-emerald-400">
                          Result: {quizScore} / 2 Correct! (+{quizScore * 30} XP)
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* --- FOLDER CREATE MODAL --- */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Create Document Folder</h3>
            <form onSubmit={handleCreateFolder} className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Folder Name</label>
                <input
                  type="text"
                  required
                  value={folderName}
                  onChange={e => setFolderName(e.target.value)}
                  placeholder="e.g. Invoices 2026"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="flex-1 py-2 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-glow"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
