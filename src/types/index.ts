export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export type TaskCategory = 
  | 'college'
  | 'skill'
  | 'course'
  | 'internship'
  | 'business'
  | 'health'
  | 'finance'
  | 'personal'
  | 'reading'
  | 'general';

export type TaskStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'waiting' 
  | 'on_hold' 
  | 'review' 
  | 'completed' 
  | 'missed' 
  | 'overdue';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  isArchived?: boolean;
  title: string;
  description?: string;
  category: TaskCategory;
  subCategory?: string; // e.g., 'classes', 'assignments', 'dsa', 'marketing', 'gym', 'bills', etc.
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  completedDate?: string;
  createdDate?: string; // YYYY-MM-DD
  startDate?: string; // YYYY-MM-DD
  progressPercent?: number; // 0 to 100
  numTimesEdited?: number;
  delayCount?: number;
  isRecurring?: boolean;
  recurrenceRule?: 'daily' | 'weekdays' | 'weekly' | 'monthly' | 'yearly';
  reminderTime?: '5m' | '10m' | '15m' | '30m' | '1h' | '2h' | '1d' | 'custom' | 'none';
  reminderChannel?: 'browser' | 'sound' | 'popup' | 'email' | 'desktop' | 'all';
  subTasks?: SubTask[];
  studyHours?: number;
  codingHours?: number;
  exerciseHours?: number;
  timeSpent?: number; // total logged hours
  attachments?: string[]; // array of URLs or file names
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: 'health' | 'study' | 'coding' | 'personal' | 'general';
  completedDays: Record<string, boolean>; // key format: YYYY-MM-DD
  streak: number;
  isActive: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'life';
  status: 'pending' | 'completed';
  targetDate: string; // YYYY-MM-DD
  milestones: { id: string; title: string; completed: boolean }[];
}

export interface FinanceTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: 'food' | 'rent' | 'bills' | 'investments' | 'sip' | 'salary' | 'business' | 'other';
  date: string; // YYYY-MM-DD
  budgetThreshold?: number; // optional budget limit warning helper
}

export interface Course {
  id: string;
  name: string;
  platform: 'Udemy' | 'Coursera' | 'YouTube' | 'NPTEL' | 'SWAYAM' | 'FreeCodeCamp' | 'Other';
  totalLectures: number;
  completedLectures: number;
  certificateUrl?: string;
  remainingLectures: number;
  isCompleted: boolean;
  notes?: string;
}

export interface CollegeClass {
  id: string;
  name: string;
  attended: number;
  total: number;
  days: string[]; // ['Monday', 'Wednesday']
  time: string; // HH:MM
  room?: string;
}

export interface DailyWorkLog {
  id: string;
  date: string; // YYYY-MM-DD
  companyName: string;
  description: string;
  hoursWorked: number;
  deliverables?: string;
}

export interface ClientCRM {
  id: string;
  clientName: string;
  company: string;
  pipelineStage: 'lead' | 'contacted' | 'proposal' | 'contract' | 'active' | 'closed';
  value: number;
  email: string;
  lastContact: string; // YYYY-MM-DD
}

export interface Book {
  id: string;
  title: string;
  author: string;
  type: 'book' | 'article' | 'research_paper' | 'pdf';
  totalPages: number;
  currentPage: number;
  status: 'to_read' | 'reading' | 'completed';
  review?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  tags: string[];
  dateCreated: string;
  dateUpdated: string;
  attachments?: { name: string; type: string; url: string }[];
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: 'pdf' | 'image' | 'video' | 'document' | 'zip';
  url: string;
  parentFolderId: string | null; // null for root
  dateUploaded: string;
}

export interface FolderItem {
  id: string;
  name: string;
  parentFolderId: string | null;
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  icon: string;
  location: string;
}

export interface AiPlannerSuggestion {
  optimizedSchedule: { taskId: string; timeSlot: string; reason: string }[];
  priorities: { taskId: string; urgencyScore: number; reason: string }[];
  productivityTips: string[];
  studyPlan: { subject: string; hoursSuggested: number; focusTopics: string[] }[];
  weeklyReport: string;
}

export interface ActivityLog {
  id: string;
  action: 'created' | 'edited' | 'completed' | 'started' | 'paused' | 'deleted' | 'reminder_sent' | 'snoozed' | 'water_logged';
  taskTitle: string;
  date: string;
  time: string;
  user: string;
}

export interface VisionItem {
  id: string;
  title: string;
  type: 'college' | 'company' | 'salary' | 'house' | 'car' | 'travel';
  targetValue?: string;
  imageUrl?: string;
}

export interface PlacementApplication {
  id: string;
  companyName: string;
  roleName: string;
  stage: 'applied' | 'assessment' | 'interview' | 'offer' | 'rejected';
  salaryPackage?: string;
  deadlineDate?: string;
  lastContactDate?: string;
  notes?: string;
}
