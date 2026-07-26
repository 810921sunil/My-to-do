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
  contextInfo?: string,
  conversationHistory?: Array<{ sender: 'user' | 'ai'; text: string }>
): Promise<GeminiParsedResponse> {
  const apiKey = getGeminiApiKey();
  const currentDate = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Format conversation history for context
  const historyText = conversationHistory
    ?.slice(-6)
    ?.map(m => `${m.sender.toUpperCase()}: ${m.text}`)
    ?.join('\n') || 'No previous messages';

  const systemInstruction = `You are Life OS AI Copilot, an intelligent productivity assistant for students and professionals.
You understand Hinglish, Hindi, and English natural language fluently.
Current Date: ${currentDate} (${new Date().toLocaleDateString('en-US', { weekday: 'long' })}). Current Time: ${currentTime}.

Recent Conversation History:
${historyText}

User Query: "${userQuery}"
Context Data / Tasks Vault: ${contextInfo || 'No tasks listed'}

CRITICAL CLASSIFICATION & SANITIZATION RULES:

1. QUESTION / INQUIRY PRECEDENCE (NEVER CREATE A TASK WHEN USER IS ASKING A QUESTION):
   - If the query contains question markers or inquiry words (e.g. "keya", "kya", "kyaa", "thaa", "tha", "kab", "kabv", "kaun", "kahan", "kyun", "kyu", "bataw", "batao", "dikhao", "check", "when", "what", "where", "why", "how", "tell", "show", "list"):
     - DO NOT CREATE A TASK. Set "action": "list_tasks" or "chat".
     - Search the Context Data / Tasks Vault for tasks matching any date specified in the query (e.g. "25/07/2026").
     - List all matching tasks clearly (showing if completed or pending).

2. TASK CREATION INTENT (ONLY WHEN USER EXPLICITLY COMMANDS CREATION):
   - If the user explicitly commands to add, set, or remind (e.g. "27/07/2026 add a task for call guests", "add math homework tomorrow"):
     - Extract a CLEAN title: Strip filler phrases like "add a task for", "task for", "a task of", "remind me to", "please".
     - Example: "27/07/2026 add a task for call gastes" -> Clean Title: "Call Guests"
     - Convert dates to YYYY-MM-DD format (Default: "${currentDate}").
     - Set "action": "create_task".

3. Return ONLY a valid JSON object matching this structure:
{
  "action": "create_task" or "chat" or "list_tasks",
  "task": {
    "title": "Clean Sanitized Title",
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
      console.warn(`Gemini API ${model} failed, running local intelligent parser fallback...`);
    }
  }

  // Fallback intelligent parser if API call fails or key is unverified
  return fallbackIntelligentParser(userQuery, currentDate, contextInfo, conversationHistory);
}

function fallbackIntelligentParser(
  query: string, 
  currentDate: string, 
  contextInfo?: string,
  conversationHistory?: Array<{ sender: 'user' | 'ai'; text: string }>
): GeminiParsedResponse {
  const lower = query.toLowerCase().trim();

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

  // Question / Inquiry Markers (EXPANDED PHONETIC HINGLISH MATCHER)
  const questionWords = [
    'keya', 'kya', 'kyaa', 'thaa', 'tha', 'thi', 'hoga', 'hogi',
    'kab', 'kabv', 'kaun', 'kahan', 'kaha', 'kyun', 'kyu', 
    'bataw', 'batao', 'batawo', 'bata', 'bataiye', 'bataao', 
    'dikhao', 'dikaw', 'dekho', 'dekhna', 'show', 'list', 'tell', 
    'what', 'when', 'where', 'why', 'how', 'which', 'check', 'view', 
    'dikhaye', 'aaj ke', 'task bata', 'konsa', 'kon sa'
  ];

  const isQuestion = questionWords.some(w => lower.includes(w));

  // 1. If it's a question (e.g. "25/07/2026 ko keya task thaa", "yh kabv add kiyaa")
  if (isQuestion) {
    // Check if asking about when a task was added or conversation context
    if (lower.includes('kab') || lower.includes('kabv') || lower.includes('when')) {
      const lastAiMessage = conversationHistory?.filter(m => m.sender === 'ai').slice(-1)[0];
      if (lastAiMessage && lastAiMessage.text.includes('add kar diya hai')) {
        return {
          action: 'chat',
          replyMessage: `💡 Yeh task abhi aapke request par ${currentDate} को High Priority के साथ आपके Task Manager में add किया गया था!`
        };
      }
    }

    // Search contextInfo for matching tasks for targetDate
    let matchingTasks: string[] = [];
    if (contextInfo) {
      const lines = contextInfo.split('\n');
      matchingTasks = lines.filter(l => l.includes(targetDate));
    }

    let reply = `📋 **${targetDate} ke aapke tasks:**\n`;
    if (matchingTasks.length > 0) {
      reply += matchingTasks.map((t, idx) => `${idx + 1}. ${t.replace(/^- /, '')}`).join('\n');
    } else {
      reply += `Is date (${targetDate}) par koi task list nahi mila. Aap "add task" kehkar naya task add kar sakte hain!`;
    }

    return {
      action: 'list_tasks',
      replyMessage: reply
    };
  }

  // 2. Task Creation (Only when NOT a question AND contains explicit add action)
  const addVerbs = ['add', 'remind', 'create', 'set', 'bana', 'karna', 'karo', 'kar do', 'daal do', 'shamil'];
  const isExplicitAdd = addVerbs.some(v => lower.includes(v));

  if (isExplicitAdd) {
    let cleanTitle = query
      .replace(/\b(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{4})\b/gi, '')
      .replace(/\b(add a task for|add task for|a task for|task for|a task to|add task to|add a task|add task|remind me to|remind me|create task|set task|task of|please|pls)\b/gi, '')
      .replace(/\b(ko|bhi|bhe|karo|kar|do|bana|de|daal|karna)\b/gi, '')
      .trim();

    if (!cleanTitle || cleanTitle.length < 2) {
      cleanTitle = `Scheduled Task for ${targetDate}`;
    }

    const formattedTitle = cleanTitle.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

    return {
      action: 'create_task',
      task: {
        title: formattedTitle,
        dueDate: targetDate,
        priority: 'high',
        category: lower.includes('gym') || lower.includes('water') ? 'health' : 'college'
      },
      replyMessage: `✅ Maine "${formattedTitle}" ko ${targetDate} ke liye High Priority ke saath aapke Task Manager me add kar diya hai!`
    };
  }

  // 3. General Conversational Advice Fallback
  let adviceReply = `✨ **Life OS Copilot Guidance:**\n`;
  if (lower.includes('study') || lower.includes('padh') || lower.includes('exam')) {
    adviceReply += `Consistent study sessions with 45-min Pomodoro blocks generate maximum retention. Schedule 2 hours today for core subjects!`;
  } else if (lower.includes('dsa') || lower.includes('coding') || lower.includes('leetcode')) {
    adviceReply += `For DSA & Coding: Focus on 2 Medium LeetCode problems daily. Start with Arrays & HashMaps before Binary Trees!`;
  } else {
    adviceReply += `Main aapki har query me help kar sakta hu! Aap keh sakte hain "25/07/2026 ko keya task thaa", "add math assignment tomorrow", ya koi bhi question pooch sakte hain.`;
  }

  return {
    action: 'chat',
    replyMessage: adviceReply
  };
}
