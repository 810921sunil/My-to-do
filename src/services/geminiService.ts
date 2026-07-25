// Gemini API Service for Life OS

const DEFAULT_GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || '';

export interface GeminiParsedResponse {
  action: 'create_task' | 'chat' | 'list_tasks';
  task?: {
    title: string;
    dueDate?: string;
    dueTime?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    category?: 'college' | 'skill' | 'health' | 'personal' | 'general';
  };
  replyMessage: string;
}

export const getGeminiApiKey = (): string => {
  const storedKey = localStorage.getItem('z_gemini_api_key');
  if (storedKey && storedKey.trim().length > 0) return storedKey;
  return DEFAULT_GEMINI_KEY;
};

export const setGeminiApiKey = (key: string): void => {
  localStorage.setItem('z_gemini_api_key', key.trim());
};

export async function askGeminiAI(
  userQuery: string,
  contextInfo?: string
): Promise<GeminiParsedResponse> {
  const apiKey = getGeminiApiKey();
  const currentDate = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const systemInstruction = `You are Life OS AI Copilot, an intelligent productivity assistant for students and professionals.
You understand Hinglish, Hindi, and English natural language fluently.
Current Date: ${currentDate} (${new Date().toLocaleDateString('en-US', { weekday: 'long' })}). Current Time: ${currentTime}.

User Query: "${userQuery}"
Context Data / Active Tasks: ${contextInfo || 'No active tasks listed'}

Instructions:
1. Analyze the user's intent carefully:
   - If the user is asking to VIEW, LIST, SHOW, or ASK about tasks on today or any date (e.g. "bataw", "batao", "batawo", "show tasks", "aaj ke task", "27/07/2026 ke task bataw"):
     - Do NOT create a task. Set "action": "list_tasks".
     - Construct a helpful summary of active tasks matching that date from the Context Data.

   - If the user explicitly asks to ADD, REMIND, SCHEDULE, or CREATE a task (e.g. "add math homework", "kal 5 baje gym", "28/07/2026 ko assignment submit kar do"):
     - Extract a clean title (e.g. "Math Homework", "Gym Session").
     - Convert dates to YYYY-MM-DD format (Default: "${currentDate}").
     - Set "action": "create_task".

   - If the user asks a general question, advice, or greeting (e.g. "how to study 3 hours", "hello", "productivity tip"):
     - Set "action": "chat".
     - Provide a warm, intelligent, helpful answer in Hinglish or English.

2. Return ONLY a valid JSON object matching this structure:
{
  "action": "create_task" or "chat" or "list_tasks",
  "task": {
    "title": "Clean Task Title",
    "dueDate": "YYYY-MM-DD",
    "dueTime": "HH:MM",
    "priority": "high",
    "category": "college"
  },
  "replyMessage": "Friendly, clear response in Hinglish/English."
}`;

  // Try API endpoints in sequence
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemInstruction }] }]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
          const parsed: GeminiParsedResponse = JSON.parse(cleanJson);
          return parsed;
        } catch (jsonErr) {
          return {
            action: 'chat',
            replyMessage: rawText || "Request processed."
          };
        }
      }
    } catch (err) {
      console.warn(`Gemini API ${model} failed, trying next model...`);
    }
  }

  // Fallback intelligent parser if API call fails or key is unverified
  return fallbackIntelligentParser(userQuery, currentDate, contextInfo);
}

function fallbackIntelligentParser(query: string, currentDate: string, contextInfo?: string): GeminiParsedResponse {
  const lower = query.toLowerCase();

  // Extract target date if present in query
  let targetDate = currentDate;
  const dateMatch = query.match(/(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})/);
  if (dateMatch) {
    const day = dateMatch[1].padStart(2, '0');
    const month = dateMatch[2].padStart(2, '0');
    const year = dateMatch[3];
    targetDate = `${year}-${month}-${day}`;
  } else if (lower.includes('kal') || lower.includes('tomorrow')) {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    targetDate = tmr.toISOString().split('T')[0];
  }

  // Question / List / View Intent matching across all Hinglish spellings
  const questionWords = [
    'bataw', 'batao', 'batawo', 'bata', 'bataiye', 'bataao', 
    'dikhao', 'dikaw', 'dekho', 'dekhna', 'show', 'list', 'tell', 
    'kya', 'what', 'check', 'view', 'dikhaye', 'aaj ke', 'task bata'
  ];

  const isQuestionOrList = questionWords.some(w => lower.includes(w));

  if (isQuestionOrList) {
    let reply = `📋 **${targetDate} ke aapke tasks:**\n`;
    
    if (contextInfo && contextInfo.includes('Active Tasks:')) {
      const tasksSection = contextInfo.split('Active Tasks:')[1];
      reply += tasksSection.trim();
    } else {
      reply += `1. Morning Routine & Hydration Check\n2. College Lecture & Notes Review\n3. Daily Focus Session (45 mins)`;
    }

    return {
      action: 'list_tasks',
      replyMessage: reply
    };
  }

  // Explicit Add Intent: MUST contain action verb like add, remind, set, create, karna, bana
  const addVerbs = ['add', 'remind', 'create', 'set', 'bana', 'karna', 'karo', 'kar do', 'daal do', 'shamil'];
  const isExplicitAdd = addVerbs.some(v => lower.includes(v));

  if (isExplicitAdd) {
    let cleanTitle = query
      .replace(/\b(ko|bhi|bhe|add|karo|kar|do|pls|please|remind|me|to|set|bana|de|daal|karna)\b/gi, '')
      .replace(/\b(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{4})\b/g, '')
      .trim();

    if (!cleanTitle || cleanTitle.length < 2) {
      cleanTitle = `Scheduled Task for ${targetDate}`;
    }

    return {
      action: 'create_task',
      task: {
        title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
        dueDate: targetDate,
        priority: 'high',
        category: lower.includes('gym') || lower.includes('water') ? 'health' : 'college'
      },
      replyMessage: `✅ Maine "${cleanTitle}" ko ${targetDate} ke liye High Priority ke saath aapke Task Manager me add kar diya hai!`
    };
  }

  // General Chat Advice Fallback
  let adviceReply = `✨ **Gemini Copilot Guidance:**\n`;
  if (lower.includes('study') || lower.includes('padh') || lower.includes('exam')) {
    adviceReply += `Consistent study sessions with 45-min Pomodoro blocks generate maximum retention. Try scheduling 2 hours today for core subjects!`;
  } else if (lower.includes('dsa') || lower.includes('coding') || lower.includes('leetcode')) {
    adviceReply += `For DSA & Coding: Focus on 2 Medium LeetCode problems daily. Start with Arrays & HashMaps before Binary Trees!`;
  } else {
    adviceReply += `Main aapki har query me help kar sakta hu! Aap keh sakte hain "aaj ke task bataw", "add physics lab report tomorrow", ya koi bhi question pooch sakte hain.`;
  }

  return {
    action: 'chat',
    replyMessage: adviceReply
  };
}
