import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Ensure backup folder exists
const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// 1. Sync Backup Route
app.post('/api/sync', (req, res) => {
  try {
    const data = req.body;
    const backupPath = path.join(backupDir, 'latest_backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('✓ Successfully synced workspace state to local backup.json');
    res.status(200).json({ success: true, message: 'Sync successful' });
  } catch (error) {
    console.error('Error saving backup:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. AI Planner Route (Gemini Integration)
app.post('/api/ai/planner', async (req, res) => {
  const { tasks, habits, metrics, apiKey } = req.body;
  const geminiKey = apiKey || process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    console.log('No Gemini API Key supplied. Falling back to local deterministic rule model.');
    return generateLocalPlan(tasks, habits, metrics, res);
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
You are an expert AI Life Coach and Productivity Assistant. Analyze the user's active life management dashboard and return a JSON object containing optimized schedules, urgency scores, study plans, and a weekly performance analysis report.

Here is the current user workspace data:
- Tasks List: ${JSON.stringify(tasks)}
- Habits List: ${JSON.stringify(habits)}
- Current Performance Metrics: ${JSON.stringify(metrics)}

Your response MUST be a single raw JSON object matching this exact TypeScript structure:
interface Response {
  optimizedSchedule: { taskId: string; timeSlot: string; reason: string }[];
  priorities: { taskId: string; urgencyScore: number; reason: string }[];
  productivityTips: string[];
  studyPlan: { subject: string; hoursSuggested: number; focusTopics: string[] }[];
  weeklyReport: string;
}

Constraints:
1. "optimizedSchedule" should order today's active pending tasks (dueDate is today) and allocate realistic hour blocks (e.g. 09:00 AM - 10:30 AM). Offer specific behavioral coaching reasons based on priority.
2. "priorities" must evaluate all pending tasks (urgent vs important) and give an urgencyScore (0 to 100) with a rationale.
3. "productivityTips" should include 3 actionable tips matching the users stats.
4. "studyPlan" must suggest specific hours and focus areas for study/skill/course categories.
5. "weeklyReport" must be a neat paragraph analyzing metrics.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse response
    const parsedData = JSON.parse(responseText);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error communicating with Gemini API:', error);
    // Fallback if API fails
    generateLocalPlan(tasks, habits, metrics, res);
  }
});

// Deterministic AI rule generator fallback
function generateLocalPlan(tasks, habits, metrics, res) {
  const today = new Date().toISOString().split('T')[0];
  const pendingToday = tasks.filter(t => t.dueDate === today && t.status !== 'completed');

  // Schedule optimized slots
  const slots = ['09:00 AM - 10:30 AM', '11:00 AM - 12:30 PM', '02:00 PM - 03:30 PM', '04:00 PM - 05:30 PM'];
  const optimizedSchedule = pendingToday.map((t, index) => {
    return {
      taskId: t.id,
      timeSlot: slots[index % slots.length],
      reason: t.priority === 'high' 
        ? 'Allocated in morning high-attention block to avoid decision fatigue.' 
        : 'Placed in mid-afternoon block. Keep steady operational speed.'
    };
  });

  // Eisenhower urgency metrics
  const priorities = tasks.filter(t => t.status !== 'completed').map(t => {
    let score = 55;
    let reason = 'Moderate importance task. Schedule into daily flow.';
    if (t.priority === 'high') {
      score = 90;
      reason = 'High-priority target with critical deadline requirements.';
    } else if (t.category === 'college') {
      score = 75;
      reason = 'Academic homework due. High impact on attendance / grades.';
    }
    return {
      taskId: t.id,
      urgencyScore: score,
      reason
    };
  });

  // Study plans suggestions
  const studyPlan = [
    {
      subject: 'Coding & Skill Development',
      hoursSuggested: 3,
      focusTopics: ['DSA trees & arrays', 'Master MERN routing controllers']
    },
    {
      subject: 'Academics & Semester prep',
      hoursSuggested: 2,
      focusTopics: ['Compile lab work reports', 'Review syllabus exams formulas']
    }
  ];

  // Productivity tips
  const productivityTips = [
    `Your productivity score is currently ${metrics.productivityScore || 0}%. Let's strive to hit 80% today.`,
    'Drink 250ml water every 2 hours to avoid dehydration headaches.',
    'Log your study and coding hours under tasks to improve weekly analytics metrics.'
  ];

  const weeklyReport = `Weekly Zenith Report:
You logged ${metrics.totalWorkingHours || 0} hours of focus sessions. Your primary focus was coding. Consider balancing study hours and keeping habits checked before 8 PM.`;

  res.status(200).json({
    optimizedSchedule,
    priorities,
    productivityTips,
    studyPlan,
    weeklyReport
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ZenithLife backend listening on port ${PORT} (0.0.0.0)`);
});
