import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Task, Habit, Goal, FinanceTransaction, Course, 
  CollegeClass, DailyWorkLog, ClientCRM, Book, Note, FileItem, FolderItem, WeatherInfo,
  ActivityLog, VisionItem, PlacementApplication
} from '../types';

interface DataContextType {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeThemePreset: 'glass' | 'cyberpunk' | 'hacker' | 'apple';
  changeThemePreset: (preset: 'glass' | 'cyberpunk' | 'hacker' | 'apple') => void;

  // Weather & Quote
  weather: WeatherInfo;
  quote: { text: string; author: string };
  refreshWeather: () => void;

  // Central Lists
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  transactions: FinanceTransaction[];
  courses: Course[];
  classes: CollegeClass[];
  workLogs: DailyWorkLog[];
  crmClients: ClientCRM[];
  books: Book[];
  notes: Note[];
  files: FileItem[];
  folders: FolderItem[];

  // CRUD Operations - Tasks
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  logTaskTime: (taskId: string, hours: number) => void;

  // CRUD Operations - Habits
  addHabit: (habit: Omit<Habit, 'id' | 'completedDays' | 'streak' | 'isActive'>) => void;
  toggleHabitDay: (habitId: string, date: string) => void;
  deleteHabit: (id: string) => void;

  // CRUD Operations - Goals
  addGoal: (goal: Omit<Goal, 'id' | 'status'>) => void;
  toggleGoalStatus: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  deleteGoal: (id: string) => void;

  // CRUD Operations - Finance
  addTransaction: (tx: Omit<FinanceTransaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  getBudgetSummary: () => { income: number; expenses: number; savings: number; budgetUsedPercent: number };

  // CRUD Operations - College / Learning
  addClass: (cls: Omit<CollegeClass, 'id'>) => void;
  updateClassAttendance: (classId: string, attended: boolean) => void;
  deleteClass: (id: string) => void;
  addCourse: (course: Omit<Course, 'id' | 'remainingLectures' | 'isCompleted'>) => void;
  updateCourseProgress: (courseId: string, completedLectures: number) => void;
  deleteCourse: (id: string) => void;

  // CRUD Operations - Work / CRM
  addWorkLog: (log: Omit<DailyWorkLog, 'id'>) => void;
  deleteWorkLog: (id: string) => void;
  addCrmClient: (client: Omit<ClientCRM, 'id'>) => void;
  updateCrmClientStage: (clientId: string, stage: ClientCRM['pipelineStage']) => void;
  deleteCrmClient: (id: string) => void;

  // CRUD Operations - Reading
  addBook: (book: Omit<Book, 'id' | 'status'>) => void;
  updateBookProgress: (bookId: string, currentPage: number) => void;
  deleteBook: (id: string) => void;

  // CRUD Operations - Notes
  addNote: (note: Omit<Note, 'id' | 'dateCreated' | 'dateUpdated'>) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;

  // File Manager Operations
  addFolder: (name: string, parentFolderId: string | null) => void;
  addFile: (file: Omit<FileItem, 'id' | 'dateUploaded'>) => void;
  deleteFile: (id: string) => void;
  deleteFolder: (id: string) => void;

  // Statistics & Reports
  getProductivityMetrics: () => {
    productivityScore: number;
    tasksCompletedToday: number;
    habitsCompletedToday: number;
    totalWorkingHours: number;
    studyHours: number;
    codingHours: number;
    exerciseHours: number;
  };
  
  // Settings & Sync
  apiSettings: { geminiApiKey: string; firebaseConfig: string; backendUrl: string };
  updateApiSettings: (settings: { geminiApiKey: string; firebaseConfig: string; backendUrl: string }) => void;
  syncWithCloud: () => Promise<boolean>;

  // Hydration Tracker
  waterIntake: number;
  logWater: (amount: number) => void;

  // Onboarding Layout Mode
  userMode: 'student' | 'professional' | null;
  changeUserMode: (mode: 'student' | 'professional') => void;

  // Activity Logs History
  activities: ActivityLog[];
  logActivity: (action: ActivityLog['action'], taskTitle: string) => void;

  // Job Placements Pipeline
  placements: PlacementApplication[];
  addPlacement: (p: Omit<PlacementApplication, 'id'>) => void;
  updatePlacementStage: (id: string, stage: PlacementApplication['stage']) => void;
  deletePlacement: (id: string) => void;

  // Vision Board
  visions: VisionItem[];
  addVision: (v: Omit<VisionItem, 'id'>) => void;
  deleteVision: (id: string) => void;

  // Gamification Engine
  xp: number;
  level: number;
  coins: number;
  earnReward: (xpEarned: number, coinsEarned: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Premium Seed Data
const defaultHabits: Habit[] = [
  { id: 'h1', name: 'Wake Up Early (6:00 AM)', category: 'health', completedDays: {}, streak: 0, isActive: true },
  { id: 'h2', name: 'Drink 3L Water', category: 'health', completedDays: {}, streak: 0, isActive: true },
  { id: 'h3', name: 'Gym / Yoga / Cardio', category: 'health', completedDays: {}, streak: 0, isActive: true },
  { id: 'h4', name: '10 Min Meditation', category: 'health', completedDays: {}, streak: 0, isActive: true },
  { id: 'h5', name: 'Read 15 Pages of Book', category: 'personal', completedDays: {}, streak: 0, isActive: true },
  { id: 'h6', name: 'Solve 2 LeetCode Problems', category: 'coding', completedDays: {}, streak: 0, isActive: true },
  { id: 'h7', name: 'Study College Lectures', category: 'study', completedDays: {}, streak: 0, isActive: true },
  { id: 'h8', name: 'No Social Media before 6 PM', category: 'personal', completedDays: {}, streak: 0, isActive: true },
  { id: 'h9', name: 'Write Daily Journal', category: 'personal', completedDays: {}, streak: 0, isActive: true },
];

const defaultTasks = (): Task[] => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrow = tomorrowObj.toISOString().split('T')[0];
  const yesterdayObj = new Date();
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterday = yesterdayObj.toISOString().split('T')[0];

  return [
    {
      id: 't1',
      title: 'Prepare Presentation for AI Semester Exam Viva',
      description: 'Highlighting deep learning architectures and NLP models implemented in the project.',
      category: 'college',
      subCategory: 'Presentation',
      status: 'not_started',
      priority: 'high',
      dueDate: today,
      dueTime: '14:00',
      subTasks: [
        { id: 's1', title: 'Design slides in Figma', completed: true },
        { id: 's2', title: 'Write talking points', completed: false },
        { id: 's3', title: 'Do a mock run-through', completed: false }
      ]
    },
    {
      id: 't2',
      title: 'Complete Chemistry Lab Practical File',
      description: 'Write up reports for experiments 5, 6 and 7.',
      category: 'college',
      subCategory: 'Practical Files',
      status: 'not_started',
      priority: 'medium',
      dueDate: tomorrow,
      subTasks: []
    },
    {
      id: 't3',
      title: 'Fix React 19 Hydration Errors in MERN Stack',
      description: 'Check custom layout SSR configurations.',
      category: 'skill',
      subCategory: 'MERN Stack',
      status: 'in_progress',
      priority: 'high',
      dueDate: today,
      studyHours: 1,
      codingHours: 2,
      timeSpent: 3
    },
    {
      id: 't4',
      title: 'Study Udemy Course: Section 12 on Docker',
      description: 'Watch 4 remaining lectures and complete practice exercise.',
      category: 'course',
      subCategory: 'Udemy',
      status: 'not_started',
      priority: 'low',
      dueDate: today,
      studyHours: 1
    },
    {
      id: 't5',
      title: 'Client Demo: Acme Corp CRM Project',
      description: 'Present sales pipeline dashboard mockups.',
      category: 'business',
      subCategory: 'Client Work',
      status: 'not_started',
      priority: 'high',
      dueDate: today,
      dueTime: '10:30'
    },
    {
      id: 't6',
      title: 'Weekly SIP Investment Execution',
      description: 'Auto-transfer to Mutual Fund.',
      category: 'finance',
      subCategory: 'SIP',
      status: 'completed',
      priority: 'medium',
      dueDate: yesterday,
      completedDate: yesterday
    },
    {
      id: 't7',
      title: 'Buy Groceries & Organic Whey Protein',
      description: 'Need spinach, eggs, chicken breast, oats, and protein powder.',
      category: 'personal',
      subCategory: 'Shopping',
      status: 'not_started',
      priority: 'low',
      dueDate: today
    }
  ];
};

const defaultGoals: Goal[] = [
  {
    id: 'g1',
    title: 'Achieve 8.5+ SGPA this Semester',
    category: 'yearly',
    status: 'pending',
    targetDate: '2026-12-15',
    milestones: [
      { id: 'm1', title: 'Complete all assignments on time', completed: true },
      { id: 'm2', title: 'Score 85%+ in mid-semester exams', completed: true },
      { id: 'm3', title: 'Present premium final projects', completed: false }
    ]
  },
  {
    id: 'g2',
    title: 'Complete 100 LeetCode Problems',
    category: 'monthly',
    status: 'pending',
    targetDate: '2026-08-31',
    milestones: [
      { id: 'm4', title: '30 Easy problems', completed: true },
      { id: 'm5', title: '50 Medium problems', completed: false },
      { id: 'm6', title: '20 Hard problems', completed: false }
    ]
  },
  {
    id: 'g3',
    title: 'Launch ZenithLife SaaS Application',
    category: 'life',
    status: 'pending',
    targetDate: '2027-06-01',
    milestones: [
      { id: 'm7', title: 'Complete local-first architecture', completed: true },
      { id: 'm8', title: 'Build Express AI scheduling assistant', completed: false },
      { id: 'm9', title: 'Launch beta to 100 users', completed: false }
    ]
  }
];

const defaultTransactions: FinanceTransaction[] = [
  { id: 'tx1', description: 'Freelance Frontend Contract - Acme', amount: 850, type: 'income', category: 'business', date: '2026-07-20' },
  { id: 'tx2', description: 'Monthly Gym Membership', amount: 45, type: 'expense', category: 'other', date: '2026-07-01' },
  { id: 'tx3', description: 'Rent Payment', amount: 950, type: 'expense', category: 'rent', date: '2026-07-02' },
  { id: 'tx4', description: 'Groceries & Meal Prep', amount: 120, type: 'expense', category: 'food', date: '2026-07-22' },
  { id: 'tx5', description: 'Mutual Fund SIP Transfer', amount: 200, type: 'expense', category: 'sip', date: '2026-07-15' },
  { id: 'tx6', description: 'Udemy Course Purchase', amount: 15, type: 'expense', category: 'bills', date: '2026-07-05' },
  { id: 'tx7', description: 'Stripe Payoneer Payout', amount: 2500, type: 'income', category: 'salary', date: '2026-07-01' }
];

const defaultCourses: Course[] = [
  { id: 'c1', name: 'Docker & Kubernetes Bootcamp', platform: 'Udemy', totalLectures: 50, completedLectures: 35, remainingLectures: 15, isCompleted: false },
  { id: 'c2', name: 'Machine Learning Specialization', platform: 'Coursera', totalLectures: 40, completedLectures: 12, remainingLectures: 28, isCompleted: false },
  { id: 'c3', name: 'Web Dev Simplified React Hooks', platform: 'YouTube', totalLectures: 15, completedLectures: 15, remainingLectures: 0, isCompleted: true, certificateUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800' }
];

const defaultClasses: CollegeClass[] = [
  { id: 'cls1', name: 'Artificial Intelligence', attended: 21, total: 24, days: ['Monday', 'Wednesday'], time: '09:00', room: 'Lab 402' },
  { id: 'cls2', name: 'Database Management Systems', attended: 18, total: 20, days: ['Tuesday', 'Thursday'], time: '11:00', room: 'LHC-101' },
  { id: 'cls3', name: 'Compiler Design', attended: 12, total: 16, days: ['Monday', 'Friday'], time: '13:00', room: 'Block C-202' }
];

const defaultWorkLogs: DailyWorkLog[] = [
  { id: 'wl1', date: '2026-07-22', companyName: 'Uber Technologies (Intern)', description: 'Updated landing page headers, optimized page speeds using code-splitting, fixed mobile menu click handlers.', hoursWorked: 6, deliverables: 'PR merged #342' },
  { id: 'wl2', date: '2026-07-21', companyName: 'Uber Technologies (Intern)', description: 'Participated in Sprint Planning, created test cases for core authentication widgets.', hoursWorked: 7 }
];

const defaultCRMClients: ClientCRM[] = [
  { id: 'crm1', clientName: 'Alice Green', company: 'Nexus Retail', pipelineStage: 'active', value: 4500, email: 'alice@nexus.io', lastContact: '2026-07-22' },
  { id: 'crm2', clientName: 'Bob Vance', company: 'Vance Refrigeration', pipelineStage: 'proposal', value: 1200, email: 'bob@vance.com', lastContact: '2026-07-18' },
  { id: 'crm3', clientName: 'Charlie Brown', company: 'Peanuts Media', pipelineStage: 'lead', value: 800, email: 'charlie@peanuts.co', lastContact: '2026-07-23' }
];

const defaultBooks: Book[] = [
  { id: 'b1', title: 'Atomic Habits', author: 'James Clear', type: 'book', totalPages: 320, currentPage: 180, status: 'reading' },
  { id: 'b2', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', type: 'book', totalPages: 610, currentPage: 200, status: 'reading' },
  { id: 'b3', title: 'Attention Is All You Need', author: 'Vaswani et al.', type: 'research_paper', totalPages: 15, currentPage: 15, status: 'completed', review: 'Foundational transformer paper, highly recommended for ML starters.' }
];

const defaultNotes: Note[] = [
  {
    id: 'n1',
    title: '🧠 Welcome to ZenithLife dashboard!',
    content: 'ZenithLife is designed to manage complex lives. Inside, you will find tabs to structure your classes, manage freelance businesses, track gym weights, monitor finance SIPs, log habits, write notes, and analyze your productivity scores. Explore the tabs in the left sidebar to manage everything in one interface!',
    isPinned: true,
    tags: ['Welcome', 'Guide'],
    dateCreated: '2026-07-23',
    dateUpdated: '2026-07-23'
  },
  {
    id: 'n2',
    title: '🚀 MERN Project Architecture Ideas',
    content: '1. Local-first indexing using SQLite inside browser\n2. Synced with Firestore via background workers\n3. Fully responsive using CSS glass panels.',
    isPinned: false,
    tags: ['Project', 'WebDev'],
    dateCreated: '2026-07-22',
    dateUpdated: '2026-07-23'
  }
];

const defaultFolders: FolderItem[] = [
  { id: 'f_root1', name: 'University Documents', parentFolderId: null },
  { id: 'f_root2', name: 'Freelance Invoices', parentFolderId: null }
];

const defaultFiles: FileItem[] = [
  { id: 'file1', name: 'AI_Presentation_Draft.pdf', size: 1048576, type: 'pdf', url: '#', parentFolderId: 'f_root1', dateUploaded: '2026-07-23' },
  { id: 'file2', name: 'Microsoft_Offer_Letter.pdf', size: 2097152, type: 'pdf', url: '#', parentFolderId: null, dateUploaded: '2026-07-15' },
  { id: 'file3', name: 'Gym_Routine.jpeg', size: 524288, type: 'image', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400', parentFolderId: null, dateUploaded: '2026-07-18' }
];

const quotes = [
  { text: "Your focus determines your reality.", author: "Qui-Gon Jinn" },
  { text: "Atomic habits compound over time. 1% better every day means 37x better in a year.", author: "James Clear" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Do not search for healing at the feet of those who broke you.", author: "Rupi Kaur" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [darkMode, setDarkMode] = useState(true);
  const [activeThemePreset, setActiveThemePreset] = useState<'glass' | 'cyberpunk' | 'hacker' | 'apple'>('glass');

  // Weather State
  const [weather, setWeather] = useState<WeatherInfo>({
    temp: 24,
    condition: 'Partly Cloudy',
    icon: 'CloudSun',
    location: 'New Delhi, India'
  });

  // Quote State
  const [quote, setQuote] = useState({ text: quotes[1].text, author: quotes[1].author });

  // DB States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<CollegeClass[]>([]);
  const [workLogs, setWorkLogs] = useState<DailyWorkLog[]>([]);
  const [crmClients, setCrmClients] = useState<ClientCRM[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);

  // User Mode Layout
  const [userMode, setUserMode] = useState<'student' | 'professional' | null>(() => {
    return (localStorage.getItem('zenith_usermode') as any) || 'student';
  });

  // Activities Log
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // Placements Pipeline
  const [placements, setPlacements] = useState<PlacementApplication[]>([]);

  // Vision Board Items
  const [visions, setVisions] = useState<VisionItem[]>([]);

  // Gamification Engine
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [coins, setCoins] = useState(0);

  // API Configuration Settings
  const [apiSettings, setApiSettings] = useState({
    geminiApiKey: '',
    firebaseConfig: '',
    backendUrl: 'http://localhost:5000'
  });

  // Load Initial Data
  useEffect(() => {
    // Theme
    const savedTheme = localStorage.getItem('zenith_theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    const savedPreset = localStorage.getItem('zenith_theme_preset') || 'glass';
    setActiveThemePreset(savedPreset as any);
    if (savedPreset !== 'glass') {
      document.documentElement.classList.add(`theme-${savedPreset}`);
    }

    // Load Lists or Seed
    const loadOrSeed = <T,>(key: string, seeder: T | (() => T)): T => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try { return JSON.parse(stored); } catch (e) { console.error(e); }
      }
      const defaultValue = typeof seeder === 'function' ? (seeder as Function)() : seeder;
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    };

    setTasks(loadOrSeed('z_tasks', defaultTasks));
    setHabits(loadOrSeed('z_habits', defaultHabits));
    setGoals(loadOrSeed('z_goals', defaultGoals));
    setTransactions(loadOrSeed('z_transactions', defaultTransactions));
    setCourses(loadOrSeed('z_courses', defaultCourses));
    setClasses(loadOrSeed('z_classes', defaultClasses));
    setWorkLogs(loadOrSeed('z_worklogs', defaultWorkLogs));
    setCrmClients(loadOrSeed('z_crm', defaultCRMClients));
    setBooks(loadOrSeed('z_books', defaultBooks));
    setNotes(loadOrSeed('z_notes', defaultNotes));
    setFiles(loadOrSeed('z_files', defaultFiles));
    setFolders(loadOrSeed('z_folders', defaultFolders));

    // Load onboarding layout mode
    const storedUserMode = localStorage.getItem('zenith_user_mode');
    if (storedUserMode) {
      setUserMode(storedUserMode as any);
    }

    // Load Gamification stats
    setXp(parseInt(localStorage.getItem('z_xp') || '0') || 0);
    setLevel(parseInt(localStorage.getItem('z_level') || '1') || 1);
    setCoins(parseInt(localStorage.getItem('z_coins') || '0') || 0);

    // Load activities, placements, visions
    setActivities(loadOrSeed('z_activities', []));
    setPlacements(loadOrSeed('z_placements', []));
    setVisions(loadOrSeed('z_visions', [
      { id: 'v1', title: 'Land Software Engineer Intern Offer', type: 'company', targetValue: 'FAANG' },
      { id: 'v2', title: 'Achieve 8.5+ SGPA this Semester', type: 'college', targetValue: '8.5' }
    ]));

    // Load water log
    const today = new Date().toISOString().split('T')[0];
    const storedWater = localStorage.getItem(`z_water_${today}`);
    if (storedWater) {
      setWaterIntake(parseInt(storedWater) || 0);
    }

    // API settings
    const storedSettings = localStorage.getItem('z_api_settings');
    if (storedSettings) {
      try { setApiSettings(JSON.parse(storedSettings)); } catch(e) {}
    }

    // Select random quote
    const randQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randQuote);
  }, []);

  const logWater = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    setWaterIntake(prev => {
      const newVal = Math.max(0, prev + amount);
      localStorage.setItem(`z_water_${today}`, newVal.toString());
      return newVal;
    });
    logActivity('water_logged', `${amount > 0 ? '+' : ''}${amount}ml Water`);
  };

  const changeUserMode = (mode: 'student' | 'professional') => {
    setUserMode(mode);
    localStorage.setItem('zenith_user_mode', mode);
  };

  const changeThemePreset = (preset: 'glass' | 'cyberpunk' | 'hacker' | 'apple') => {
    setActiveThemePreset(preset);
    localStorage.setItem('zenith_theme_preset', preset);
    document.documentElement.classList.remove('theme-cyberpunk', 'theme-hacker', 'theme-apple', 'theme-glass');
    if (preset !== 'glass') {
      document.documentElement.classList.add(`theme-${preset}`);
    }
  };

  const logActivity = (action: ActivityLog['action'], taskTitle: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newAct: ActivityLog = {
      id: 'act_' + Date.now(),
      action,
      taskTitle,
      date: todayStr,
      time: timeStr,
      user: userMode === 'student' ? 'Student Dev' : 'Professional Client'
    };
    setActivities(prev => {
      const list = [newAct, ...prev].slice(0, 100);
      syncStorage('z_activities', list);
      return list;
    });
  };

  const addPlacement = (p: Omit<PlacementApplication, 'id'>) => {
    const newP: PlacementApplication = { ...p, id: 'place_' + Date.now() };
    setPlacements(prev => {
      const list = [...prev, newP];
      syncStorage('z_placements', list);
      return list;
    });
  };

  const updatePlacementStage = (id: string, stage: PlacementApplication['stage']) => {
    setPlacements(prev => {
      const list = prev.map(p => p.id === id ? { ...p, stage, lastContactDate: new Date().toISOString().split('T')[0] } : p);
      syncStorage('z_placements', list);
      return list;
    });
  };

  const deletePlacement = (id: string) => {
    setPlacements(prev => {
      const list = prev.filter(p => p.id !== id);
      syncStorage('z_placements', list);
      return list;
    });
  };

  const addVision = (v: Omit<VisionItem, 'id'>) => {
    const newV: VisionItem = { ...v, id: 'v_' + Date.now() };
    setVisions(prev => {
      const list = [...prev, newV];
      syncStorage('z_visions', list);
      return list;
    });
  };

  const deleteVision = (id: string) => {
    setVisions(prev => {
      const list = prev.filter(v => v.id !== id);
      syncStorage('z_visions', list);
      return list;
    });
  };

  const earnReward = (xpEarned: number, coinsEarned: number) => {
    setXp(prevXp => {
      const totalXp = prevXp + xpEarned;
      const nextLevel = Math.floor(totalXp / 500) + 1;
      localStorage.setItem('z_xp', totalXp.toString());
      
      setLevel(prevLevel => {
        if (nextLevel > prevLevel) {
          localStorage.setItem('z_level', nextLevel.toString());
        }
        return nextLevel;
      });

      return totalXp;
    });

    setCoins(prevCoins => {
      const totalCoins = prevCoins + coinsEarned;
      localStorage.setItem('z_coins', totalCoins.toString());
      return totalCoins;
    });
  };

  // Save to LocalStorage helper
  const syncStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zenith_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zenith_theme', 'light');
    }
  };

  const refreshWeather = () => {
    const temps = [22, 24, 25, 27, 28, 26];
    const conds = ['Sunny', 'Partly Cloudy', 'Clear Sky', 'Light Rain'];
    const icons = ['Sun', 'CloudSun', 'Moon', 'CloudRain'];
    const idx = Math.floor(Math.random() * conds.length);
    setWeather({
      temp: temps[Math.floor(Math.random() * temps.length)],
      condition: conds[idx],
      icon: icons[idx],
      location: 'New Delhi, India'
    });
  };

  // --- Task CRUD ---
  const addTask = (newTask: Omit<Task, 'id'>) => {
    const taskWithId: Task = { 
      ...newTask, 
      id: 't_' + Date.now(),
      createdDate: new Date().toISOString().split('T')[0],
      numTimesEdited: 0,
      delayCount: 0
    };
    const list = [taskWithId, ...tasks];
    setTasks(list);
    syncStorage('z_tasks', list);
    logActivity('created', newTask.title);
    earnReward(10, 1);
  };

  const updateTask = (updatedTask: Task) => {
    const originalTask = tasks.find(t => t.id === updatedTask.id);
    let finalTask = { ...updatedTask };
    
    if (originalTask) {
      if (originalTask.status !== 'completed' && updatedTask.status === 'completed') {
        earnReward(100, 10);
        logActivity('completed', updatedTask.title);
        finalTask.completedDate = new Date().toISOString().split('T')[0];
      } else if (originalTask.status === 'completed' && updatedTask.status !== 'completed') {
        logActivity('started', updatedTask.title);
        finalTask.completedDate = undefined;
      } else if (originalTask.status !== updatedTask.status) {
        logActivity('started', updatedTask.title);
      } else {
        logActivity('edited', updatedTask.title);
      }

      if (originalTask.dueDate && updatedTask.dueDate && originalTask.dueDate < updatedTask.dueDate) {
        finalTask.delayCount = (originalTask.delayCount || 0) + 1;
      }
      
      finalTask.numTimesEdited = (originalTask.numTimesEdited || 0) + 1;
    }

    const list = tasks.map(t => t.id === updatedTask.id ? finalTask : t);
    setTasks(list);
    syncStorage('z_tasks', list);
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      logActivity('deleted', task.title);
    }
    const list = tasks.filter(t => t.id !== id);
    setTasks(list);
    syncStorage('z_tasks', list);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const list = tasks.map(t => {
      if (t.id === taskId && t.subTasks) {
        const updatedSubs = t.subTasks.map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subTasks: updatedSubs };
      }
      return t;
    });
    setTasks(list);
    syncStorage('z_tasks', list);
  };

  const logTaskTime = (taskId: string, hours: number) => {
    const list = tasks.map(t => {
      if (t.id === taskId) {
        const curTime = t.timeSpent || 0;
        let study = t.studyHours || 0;
        let coding = t.codingHours || 0;
        let exercise = t.exerciseHours || 0;

        if (t.category === 'college' || t.category === 'course') study += hours;
        if (t.category === 'skill') coding += hours;
        if (t.category === 'health') exercise += hours;

        return {
          ...t,
          timeSpent: curTime + hours,
          studyHours: study,
          codingHours: coding,
          exerciseHours: exercise
        };
      }
      return t;
    });
    setTasks(list);
    syncStorage('z_tasks', list);
  };

  // --- Habit CRUD ---
  const addHabit = (newHabit: Omit<Habit, 'id' | 'completedDays' | 'streak' | 'isActive'>) => {
    const habit: Habit = {
      ...newHabit,
      id: 'h_' + Date.now(),
      completedDays: {},
      streak: 0,
      isActive: true
    };
    const list = [...habits, habit];
    setHabits(list);
    syncStorage('z_habits', list);
  };

  const toggleHabitDay = (habitId: string, date: string) => {
    const list = habits.map(h => {
      if (h.id === habitId) {
        const completed = { ...h.completedDays };
        const currentlyChecked = !!completed[date];
        
        if (currentlyChecked) {
          delete completed[date];
        } else {
          completed[date] = true;
        }

        // Calculate streaks (simplified)
        let curStreak = h.streak;
        if (!currentlyChecked) {
          curStreak += 1;
        } else {
          curStreak = Math.max(0, curStreak - 1);
        }

        return { ...h, completedDays: completed, streak: curStreak };
      }
      return h;
    });
    setHabits(list);
    syncStorage('z_habits', list);
  };

  const deleteHabit = (id: string) => {
    const list = habits.filter(h => h.id !== id);
    setHabits(list);
    syncStorage('z_habits', list);
  };

  // --- Goal CRUD ---
  const addGoal = (newGoal: Omit<Goal, 'id' | 'status'>) => {
    const goal: Goal = {
      ...newGoal,
      id: 'g_' + Date.now(),
      status: 'pending'
    };
    const list = [...goals, goal];
    setGoals(list);
    syncStorage('z_goals', list);
  };

  const toggleGoalStatus = (id: string) => {
    const list = goals.map(g => {
      if (g.id === id) {
        const newStatus = g.status === 'completed' ? 'pending' : 'completed';
        // Toggle all milestones matching status
        const milestones = g.milestones.map(m => ({ ...m, completed: newStatus === 'completed' }));
        return { ...g, status: newStatus as any, milestones };
      }
      return g;
    });
    setGoals(list);
    syncStorage('z_goals', list);
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const list = goals.map(g => {
      if (g.id === goalId) {
        const milestones = g.milestones.map(m => 
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const allDone = milestones.length > 0 && milestones.every(m => m.completed);
        return { 
          ...g, 
          milestones, 
          status: (allDone ? 'completed' : 'pending') as any 
        };
      }
      return g;
    });
    setGoals(list);
    syncStorage('z_goals', list);
  };

  const deleteGoal = (id: string) => {
    const list = goals.filter(g => g.id !== id);
    setGoals(list);
    syncStorage('z_goals', list);
  };

  // --- Finance CRUD ---
  const addTransaction = (newTx: Omit<FinanceTransaction, 'id'>) => {
    const tx: FinanceTransaction = { ...newTx, id: 'tx_' + Date.now() };
    const list = [tx, ...transactions];
    setTransactions(list);
    syncStorage('z_transactions', list);
  };

  const deleteTransaction = (id: string) => {
    const list = transactions.filter(tx => tx.id !== id);
    setTransactions(list);
    syncStorage('z_transactions', list);
  };

  const getBudgetSummary = () => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyTxs = transactions.filter(t => t.date.startsWith(currentMonth));
    
    let income = 0;
    let expenses = 0;
    monthlyTxs.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expenses += t.amount;
    });

    const budgetLimit = 1500; // default budget limit
    const budgetUsedPercent = Math.min(100, Math.round((expenses / budgetLimit) * 100));

    return {
      income,
      expenses,
      savings: income - expenses,
      budgetUsedPercent
    };
  };

  // --- College Classes CRUD ---
  const addClass = (newCls: Omit<CollegeClass, 'id'>) => {
    const cls: CollegeClass = { ...newCls, id: 'cls_' + Date.now() };
    const list = [...classes, cls];
    setClasses(list);
    syncStorage('z_classes', list);
  };

  const updateClassAttendance = (classId: string, attended: boolean) => {
    const list = classes.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          attended: c.attended + (attended ? 1 : 0),
          total: c.total + 1
        };
      }
      return c;
    });
    setClasses(list);
    syncStorage('z_classes', list);
  };

  const deleteClass = (id: string) => {
    const list = classes.filter(c => c.id !== id);
    setClasses(list);
    syncStorage('z_classes', list);
  };

  // --- Courses CRUD ---
  const addCourse = (newCourse: Omit<Course, 'id' | 'remainingLectures' | 'isCompleted'>) => {
    const course: Course = {
      ...newCourse,
      id: 'c_' + Date.now(),
      remainingLectures: newCourse.totalLectures - newCourse.completedLectures,
      isCompleted: newCourse.completedLectures >= newCourse.totalLectures
    };
    const list = [...courses, course];
    setCourses(list);
    syncStorage('z_courses', list);
  };

  const updateCourseProgress = (courseId: string, completedLectures: number) => {
    const list = courses.map(c => {
      if (c.id === courseId) {
        const completed = Math.min(c.totalLectures, completedLectures);
        return {
          ...c,
          completedLectures: completed,
          remainingLectures: c.totalLectures - completed,
          isCompleted: completed >= c.totalLectures
        };
      }
      return c;
    });
    setCourses(list);
    syncStorage('z_courses', list);
  };

  const deleteCourse = (id: string) => {
    const list = courses.filter(c => c.id !== id);
    setCourses(list);
    syncStorage('z_courses', list);
  };

  // --- Work Log CRUD ---
  const addWorkLog = (newLog: Omit<DailyWorkLog, 'id'>) => {
    const log: DailyWorkLog = { ...newLog, id: 'wl_' + Date.now() };
    const list = [log, ...workLogs];
    setWorkLogs(list);
    syncStorage('z_worklogs', list);
  };

  const deleteWorkLog = (id: string) => {
    const list = workLogs.filter(w => w.id !== id);
    setWorkLogs(list);
    syncStorage('z_worklogs', list);
  };

  // --- CRM Client CRUD ---
  const addCrmClient = (newClient: Omit<ClientCRM, 'id'>) => {
    const client: ClientCRM = { ...newClient, id: 'crm_' + Date.now() };
    const list = [...crmClients, client];
    setCrmClients(list);
    syncStorage('z_crm', list);
  };

  const updateCrmClientStage = (clientId: string, stage: ClientCRM['pipelineStage']) => {
    const list = crmClients.map(c => c.id === clientId ? { ...c, pipelineStage: stage } : c);
    setCrmClients(list);
    syncStorage('z_crm', list);
  };

  const deleteCrmClient = (id: string) => {
    const list = crmClients.filter(c => c.id !== id);
    setCrmClients(list);
    syncStorage('z_crm', list);
  };

  // --- Books Reading CRUD ---
  const addBook = (newBook: Omit<Book, 'id' | 'status'>) => {
    const book: Book = {
      ...newBook,
      id: 'b_' + Date.now(),
      status: newBook.currentPage >= newBook.totalPages 
        ? 'completed' 
        : newBook.currentPage > 0 ? 'reading' : 'to_read'
    };
    const list = [...books, book];
    setBooks(list);
    syncStorage('z_books', list);
  };

  const updateBookProgress = (bookId: string, currentPage: number) => {
    const list = books.map(b => {
      if (b.id === bookId) {
        const pages = Math.min(b.totalPages, currentPage);
        return {
          ...b,
          currentPage: pages,
          status: (pages >= b.totalPages ? 'completed' : pages > 0 ? 'reading' : 'to_read') as any
        };
      }
      return b;
    });
    setBooks(list);
    syncStorage('z_books', list);
  };

  const deleteBook = (id: string) => {
    const list = books.filter(b => b.id !== id);
    setBooks(list);
    syncStorage('z_books', list);
  };

  // --- Notes CRUD ---
  const addNote = (newNote: Omit<Note, 'id' | 'dateCreated' | 'dateUpdated'>) => {
    const nowStr = new Date().toISOString().split('T')[0];
    const note: Note = {
      ...newNote,
      id: 'n_' + Date.now(),
      dateCreated: nowStr,
      dateUpdated: nowStr
    };
    const list = [note, ...notes];
    setNotes(list);
    syncStorage('z_notes', list);
  };

  const updateNote = (updatedNote: Note) => {
    const list = notes.map(n => 
      n.id === updatedNote.id 
        ? { ...updatedNote, dateUpdated: new Date().toISOString().split('T')[0] } 
        : n
    );
    setNotes(list);
    syncStorage('z_notes', list);
  };

  const deleteNote = (id: string) => {
    const list = notes.filter(n => n.id !== id);
    setNotes(list);
    syncStorage('z_notes', list);
  };

  // --- File Manager ---
  const addFolder = (name: string, parentFolderId: string | null) => {
    const f: FolderItem = { id: 'f_' + Date.now(), name, parentFolderId };
    const list = [...folders, f];
    setFolders(list);
    syncStorage('z_folders', list);
  };

  const addFile = (newFile: Omit<FileItem, 'id' | 'dateUploaded'>) => {
    const file: FileItem = {
      ...newFile,
      id: 'file_' + Date.now(),
      dateUploaded: new Date().toISOString().split('T')[0]
    };
    const list = [...files, file];
    setFiles(list);
    syncStorage('z_files', list);
  };

  const deleteFile = (id: string) => {
    const list = files.filter(f => f.id !== id);
    setFiles(list);
    syncStorage('z_files', list);
  };

  const deleteFolder = (id: string) => {
    // Delete folder and recursively all subfolders and files inside it
    const listFolders = folders.filter(f => f.id !== id);
    const listFiles = files.filter(f => f.parentFolderId !== id);
    
    setFolders(listFolders);
    setFiles(listFiles);
    
    syncStorage('z_folders', listFolders);
    syncStorage('z_files', listFiles);
  };

  // --- Statistics Computing ---
  const getProductivityMetrics = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Tasks due today
    const todaysTasks = tasks.filter(t => t.dueDate === today);
    const tasksCompletedToday = todaysTasks.filter(t => t.status === 'completed').length;
    const totalTasksToday = todaysTasks.length;

    // Habits checked today
    const habitsCompletedToday = habits.filter(h => !!h.completedDays[today]).length;
    const totalHabitsToday = habits.length;

    // Productivity Score (0 - 100)
    let taskScore = totalTasksToday > 0 ? (tasksCompletedToday / totalTasksToday) * 100 : 100;
    let habitScore = totalHabitsToday > 0 ? (habitsCompletedToday / totalHabitsToday) * 100 : 100;
    
    // If no habits and no tasks, default to 100
    let productivityScore = Math.round((taskScore + habitScore) / 2);
    if (totalTasksToday === 0 && totalHabitsToday === 0) productivityScore = 0;

    // Track hours from logs
    let totalWorkingHours = 0;
    let studyHours = 0;
    let codingHours = 0;
    let exerciseHours = 0;

    // Calculate from work logs
    const currentWeekStart = new Date();
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay()); // Sunday
    const weekStartStr = currentWeekStart.toISOString().split('T')[0];

    workLogs.forEach(w => {
      if (w.date >= weekStartStr) {
        totalWorkingHours += w.hoursWorked;
      }
    });

    // Calculate from tasks
    tasks.forEach(t => {
      studyHours += t.studyHours || 0;
      codingHours += t.codingHours || 0;
      exerciseHours += t.exerciseHours || 0;
    });

    // Calculate from completed courses
    courses.forEach(c => {
      studyHours += c.completedLectures * 0.75; // assume each lecture is 45 mins
    });

    return {
      productivityScore,
      tasksCompletedToday,
      habitsCompletedToday,
      totalWorkingHours: Math.round(totalWorkingHours),
      studyHours: Math.round(studyHours),
      codingHours: Math.round(codingHours),
      exerciseHours: Math.round(exerciseHours)
    };
  };

  // --- Settings & Sync ---
  const updateApiSettings = (settings: { geminiApiKey: string; firebaseConfig: string; backendUrl: string }) => {
    setApiSettings(settings);
    localStorage.setItem('z_api_settings', JSON.stringify(settings));
  };

  const syncWithCloud = async () => {
    try {
      const response = await fetch(`${apiSettings.backendUrl}/api/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          habits,
          goals,
          transactions,
          courses,
          classes,
          workLogs,
          crmClients,
          books,
          notes
        })
      });
      return response.ok;
    } catch (e) {
      console.warn('Backend sync failed, running in offline backup mode', e);
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        weather,
        quote,
        refreshWeather,
        tasks,
        habits,
        goals,
        transactions,
        courses,
        classes,
        workLogs,
        crmClients,
        books,
        notes,
        files,
        folders,
        addTask,
        updateTask,
        deleteTask,
        toggleSubtask,
        logTaskTime,
        addHabit,
        toggleHabitDay,
        deleteHabit,
        addGoal,
        toggleGoalStatus,
        toggleMilestone,
        deleteGoal,
        addTransaction,
        deleteTransaction,
        getBudgetSummary,
        addClass,
        updateClassAttendance,
        deleteClass,
        addCourse,
        updateCourseProgress,
        deleteCourse,
        addWorkLog,
        deleteWorkLog,
        addCrmClient,
        updateCrmClientStage,
        deleteCrmClient,
        addBook,
        updateBookProgress,
        deleteBook,
        addNote,
        updateNote,
        deleteNote,
        addFolder,
        addFile,
        deleteFile,
        deleteFolder,
        getProductivityMetrics,
        apiSettings,
        updateApiSettings,
        syncWithCloud,
        waterIntake,
        logWater,
        userMode,
        changeUserMode,
        activities,
        logActivity,
        placements,
        addPlacement,
        updatePlacementStage,
        deletePlacement,
        visions,
        addVision,
        deleteVision,
        xp,
        level,
        coins,
        earnReward,
        activeThemePreset,
        changeThemePreset
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
