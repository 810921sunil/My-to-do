// Advanced Gemini AI Engine for Life OS

const DEFAULT_GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || '';

export interface GeminiParsedResponse {
  action: 'create_task' | 'complete_task' | 'delete_task' | 'list_tasks' | 'chat';
  task?: {
    title: string;
    dueDate?: string;
    dueTime?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    category?: 'college' | 'skill' | 'health' | 'personal' | 'general';
  };
  targetTaskTitle?: string;
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

  const systemInstruction = `You are Advanced Life OS AI Copilot, a high-intelligence productivity engine.
You understand Hinglish, Hindi, and English natural language fluently.
Current Date: ${currentDate} (${new Date().toLocaleDateString('en-US', { weekday: 'long' })}). Current Time: ${currentTime}.

Recent Conversation History:
${historyText}

User Query: "${userQuery}"
Context Data / Tasks Vault: ${contextInfo || 'No tasks listed'}

ADVANCED MULTI-ACTION INTENT RULES:

1. MARK TASK COMPLETE ("complete", "done", "ho gaya", "kar diya", "finish"):
   - Set "action": "complete_task".
   - Extract "targetTaskTitle": Clean name of the task to mark done.

2. DELETE TASK ("delete", "remove", "hatao", "hata do"):
   - Set "action": "delete_task".
   - Extract "targetTaskTitle": Clean name of the task to delete.

3. QUESTION / INQUIRY PRECEDENCE (NEVER CREATE A TASK WHEN USER IS ASKING A QUESTION):
   - If query contains question words ("keya", "kya", "thaa", "tha", "kab", "kabv", "bataw", "batao", "dikhao", "check", "when", "what", "where", "how", "tell", "show"):
     - Set "action": "list_tasks" or "chat".
     - List matching tasks from Tasks Vault.

4. CREATE TASK (ONLY ON EXPLICIT ADD COMMANDS):
   - Set "action": "create_task".
   - Extract a clean sanitized title (strip "add a task for", "remind me to", etc.).

5. Return ONLY a valid JSON object matching this structure:
{
  "action": "create_task" | "complete_task" | "delete_task" | "list_tasks" | "chat",
  "task": { "title": "Clean Title", "dueDate": "YYYY-MM-DD", "priority": "high" },
  "targetTaskTitle": "Clean Target Task Name",
  "replyMessage": "Friendly, clear response in Hinglish/English."
}`;

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
      console.warn(`Gemini API ${model} failed, running advanced local parser fallback...`);
    }
  }

  return fallbackIntelligentParser(userQuery, currentDate, contextInfo, conversationHistory);
}

function fallbackIntelligentParser(
  query: string, 
  currentDate: string, 
  contextInfo?: string,
  conversationHistory?: Array<{ sender: 'user' | 'ai'; text: string }>
): GeminiParsedResponse {
  const lower = query.toLowerCase().trim();

  // Smart Relative & Absolute Date Resolver
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
  } else if (lower.includes('parso') || lower.includes('day after tomorrow')) {
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    targetDate = dayAfter.toISOString().split('T')[0];
  }

  // 1. Task Completion Intent
  if (lower.includes('complete') || lower.includes('kar diya') || lower.includes('ho gaya') || lower.includes('finish') || lower.includes('done')) {
    const cleanTarget = query
      .replace(/\b(complete|kar diya|ho gaya|finish|done|task|ko|bhi|karo|kar|do)\b/gi, '')
      .trim();
    return {
      action: 'complete_task',
      targetTaskTitle: cleanTarget || 'Task',
      replyMessage: `🎉 Maine "${cleanTarget || 'Task'}" ko Task Manager me COMPLETED mark kar diya hai!`
    };
  }

  // 2. Task Deletion Intent
  if (lower.includes('delete') || lower.includes('remove') || lower.includes('hatao') || lower.includes('hata do')) {
    const cleanTarget = query
      .replace(/\b(delete|remove|hatao|hata do|task|ko|bhi|karo|kar|do)\b/gi, '')
      .trim();
    return {
      action: 'delete_task',
      targetTaskTitle: cleanTarget || 'Task',
      replyMessage: `🗑️ Maine "${cleanTarget || 'Task'}" ko aapke Task Manager se delete kar diya hai!`
    };
  }

  // 3. Question / Inquiry Markers (QUESTION PRECEDENCE)
  const questionWords = [
    'keya', 'kya', 'kyaa', 'thaa', 'tha', 'thi', 'hoga', 'hogi',
    'kab', 'kabv', 'kaun', 'kahan', 'kaha', 'kyun', 'kyu', 
    'bataw', 'batao', 'batawo', 'bata', 'bataiye', 'bataao', 
    'dikhao', 'dikaw', 'dekho', 'dekhna', 'show', 'list', 'tell', 
    'what', 'when', 'where', 'why', 'how', 'which', 'check', 'view', 
    'dikhaye', 'aaj ke', 'task bata', 'konsa', 'kon sa'
  ];

  const isQuestion = questionWords.some(w => lower.includes(w));

  if (isQuestion) {
    if (lower.includes('kab') || lower.includes('kabv') || lower.includes('when')) {
      const lastAiMessage = conversationHistory?.filter(m => m.sender === 'ai').slice(-1)[0];
      if (lastAiMessage && lastAiMessage.text.includes('add kar diya hai')) {
        return {
          action: 'chat',
          replyMessage: `💡 Yeh task abhi aapke request par ${currentDate} ko High Priority ke saath add kiya gaya tha!`
        };
      }
    }

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

  // 4. Task Creation Intent
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

  // 5. Advanced Life Coaching Advice Fallback
  let adviceReply = `✨ **Advanced Life OS Copilot Guidance:**\n`;
  if (lower.includes('study') || lower.includes('padh') || lower.includes('exam')) {
    adviceReply += `Consistent study sessions with 45-min Pomodoro blocks generate maximum retention. Schedule 2 hours today for core subjects!`;
  } else if (lower.includes('dsa') || lower.includes('coding') || lower.includes('leetcode')) {
    adviceReply += `For DSA & Coding: Focus on 2 Medium LeetCode problems daily. Start with Arrays & HashMaps before Binary Trees!`;
  } else {
    adviceReply += `Main aapki har query me help kar sakta hu! Aap keh sakte hain "25/07/2026 ko keya task thaa", "math task complete kar diya", ya "add physics assignment tomorrow"!`;
  }

  return {
    action: 'chat',
    replyMessage: adviceReply
  };
}
