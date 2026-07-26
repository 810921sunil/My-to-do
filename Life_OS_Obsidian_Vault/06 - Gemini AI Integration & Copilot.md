---
title: Real Google Gemini API Integration & Copilot Architecture
tags:
  - life-os
  - ai
  - gemini
  - live-api
  - copilot
date: 2026-07-26
---

# 🤖 Real Google Gemini API Integration & Architecture

Back to [[00 - Life OS Vault Hub]]

**Life OS** connects directly to **Google Generative AI REST API** (`gemini-2.0-flash` & `gemini-1.5-flash`) for real-time LLM inference, conversation memory, and year-level task vault search.

---

## 🔑 Live Gemini API Key Pipeline

```
+-----------------------------------------------------------+
|                      USER UI INPUT                        |
|  (AiChatWidget / Settings.tsx / Local Storage Vault)      |
+-----------------------------+-----------------------------+
                              |
                              v
+-----------------------------------------------------------+
|                  geminiService.ts Pipeline                |
|  1. Inspects localStorage('z_gemini_api_key')             |
|  2. Calls https://generativelanguage.googleapis.com       |
|  3. Relays to Express Backend (/api/ai/chat)              |
|  4. Applies Year-Level Date Parser ("2026 m keya tasks")  |
+-----------------------------------------------------------+
```

---

## 📆 Year & Month Level Date Parsing ("2026 m keya keya tasks h")

When users ask broad date queries (e.g. *"2026 m keya keya tasks h"* or *"July ke tasks"*):

- **Year Matching:** Filters tasks where `dueDate` starts with `2026-`.
- **Month Matching:** Filters tasks matching target month.
- **Output:** Grouped list of all tasks scheduled across the requested timeframe.

---

## 🔗 Related Notes
- [[00 - Life OS Vault Hub]]
- [[01 - Architecture Overview]]
- [[04 - Core Modules & Design System]]
- [[05 - Bug Diagnostics & Fixes Log]]
