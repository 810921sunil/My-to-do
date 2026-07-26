---
title: Bug Diagnostics & Fixes Log
tags:
  - life-os
  - troubleshooting
  - bugs
  - fixes
date: 2026-07-26
---

# 🐛 Bug Diagnostics & Technical Resolutions Log

Back to [[00 - Life OS Vault Hub]]

A detailed chronological record of technical bugs, root cause analyses, and applied code resolutions.

---

## 📋 Comprehensive Bug Log

### 1. Android WebView Blank/White Screen
- **Symptom:** App opened to a blank white screen on mobile devices.
- **Root Cause:** Absolute asset paths (`/assets/index.js`) in Vite build output and CORS blocking on `crossorigin` script attributes.
- **Resolution:**
  - Added `base: './'` to `vite.config.ts`.
  - Added `removeCrossorigin()` Vite plugin.
  - Configured `androidScheme: 'https'` and `cleartext: true` in `capacitor.config.ts`.

### 2. Firestore Async Deadlock on Startup
- **Symptom:** App stuck on "Loading Workspace..." splash screen.
- **Root Cause:** `auth.onAuthStateChanged` waiting for offline Firestore `getDoc` network calls without clearing `loading` state.
- **Resolution:**
  - Added 1-second safety guard timer in `AuthContext.tsx`.
  - Restored local user session immediately from `localStorage`.
  - Made Firestore document sync non-blocking in background.

### 3. DOM Node Removal Exception (`removeChild`)
- **Symptom:** "Life OS System Warning" ErrorBoundary screen appearing during reCAPTCHA unmount.
- **Root Cause:** Firebase reCAPTCHA SDK mutating DOM nodes outside React shadow tree.
- **Resolution:** Filtered out `removeChild` and `recaptcha` DOM notices in `ErrorBoundary.getDerivedStateFromError()` in `src/main.tsx`.

### 4. Invalid Nested Button HTML Hydration Error
- **Symptom:** Browser console warning `<button> cannot be a descendant of <button>`.
- **Root Cause:** Note cards in `NotesFileVault.tsx` using `<button>` tag around internal pin and delete `<button>` elements.
- **Resolution:** Refactored outer container to `<div role="button">`.

---

## 🔗 Related Notes
- [[01 - Architecture Overview]]
- [[02 - Firebase Authentication & Security]]
- [[03 - Android APK & Keystore Guide]]
