---
title: Gemini AI Integration & Copilot Architecture
tags:
  - life-os
  - ai
  - gemini
  - copilot
  - architecture
date: 2026-07-26
---

# 🤖 Gemini AI Integration & Copilot Architecture

Back to [[00 - Life OS Vault Hub]]

**Life OS** features an embedded **Google Gemini AI Productivity Copilot** capable of understanding natural language prompts in Hinglish, Hindi, and English to manage tasks, optimize daily schedules, and offer study guidance.

---

## 🧠 Advanced Intent Recognition & Precedence Rules

To prevent accidental task creation when users ask questions (e.g. *"yh kab add kiyaa"*), the parser enforces **Question Precedence**:

```
[User Input Query]
       |
       v
Has Question Markers? ("kab", "kya", "when", "what", "dikhao", "bataw", "check")
   |
   +---> YES ---> Force Intent: "chat" or "list_tasks" (NEVER create task)
   |
   +---> NO  ---> Contains Action Verbs? ("add", "create", "remind", "set")
                     |
                     +---> YES ---> Intent: "create_task"
                     |              Title Sanitizer: Strip "a task for", "remind me to", etc.
                     |
                     +---> NO  ---> Intent: "chat"
```

---

## 🧼 Natural Language Title Sanitizer Rules

When extracting titles from raw natural prompts:
- `"27/07/2026 add a task for call gastes"` ➔ **Clean Title:** `"Call Guests"`
- `"kal 5 baje add math assignment"` ➔ **Clean Title:** `"Math Assignment"`
- `"remind me to buy groceries on 28/07/2026"` ➔ **Clean Title:** `"Buy Groceries"`

---

## 💬 Supported Intent Actions

| Action Type | Intent Trigger Examples | System Output |
| :--- | :--- | :--- |
| **`list_tasks`** | `"aaj ke task bataw"`, `"27/07/2026 ke task dikhao"` | Formats and returns active tasks scheduled for target date. |
| **`create_task`** | `"add math homework tomorrow"`, `"27/07/2026 add a task for call gastes"` | Extracts clean title `"Call Guests"`, priority, date, and injects into `TaskManager`. |
| **`chat`** | `"yh kab add kiyaa"`, `"how to study 3 hours"`, `"DSA roadmap"` | Conversational answer using past message context without creating fake tasks. |

---

## 🔗 Related Notes
- [[00 - Life OS Vault Hub]]
- [[01 - Architecture Overview]]
- [[04 - Core Modules & Design System]]
- [[05 - Bug Diagnostics & Fixes Log]]
