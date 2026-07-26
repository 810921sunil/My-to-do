---
title: Life OS Architecture Overview
tags:
  - life-os
  - architecture
  - vite
  - capacitor
date: 2026-07-26
---

# 🏗️ Life OS Architecture Overview

Back to [[00 - Life OS Vault Hub]]

**Life OS** is built as a high-performance cross-platform application targeting Web Browsers and Native Android devices via **Capacitor CLI**.

---

## 📐 Technology Stack & System Design

```
+-------------------------------------------------------------+
|                      LIFE OS CLIENT                         |
|  (React 18 + TypeScript + Tailwind CSS + Lucide Icons)      |
+------------------------------+------------------------------+
                               |
               +---------------+---------------+
               |                               |
               v                               v
   +-----------------------+       +-----------------------+
   |   Web App Layer       |       |  Android Capacitor    |
   | (Vite relative base)  |       |  (androidScheme: https|
   |   http://localhost    |       |   cleartext: true)    |
   +-----------+-----------+       +-----------+-----------+
               |                               |
               +---------------+---------------+
                               |
                               v
               +-------------------------------+
               |    Firebase Cloud Platform    |
               | (Auth + Cloud Firestore DB)   |
               +-------------------------------+
```

---

## ⚡ Key Configuration Decisions

### 1. Vite Relative Base Path (`vite.config.ts`)
To prevent Android Capacitor WebViews from displaying a **blank/white screen** due to absolute pathing errors (`/assets/index.js`), Vite is configured with `base: './'`:

```typescript
// vite.config.ts
export default defineConfig({
  base: './',
  plugins: [react(), removeCrossorigin()],
  build: {
    modulePreload: false,
    target: 'es2015',
  }
})
```

### 2. Capacitor Android WebView Scheme (`capacitor.config.ts`)
```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.zenithlife.app',
  appName: 'Life OS',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  }
};
```

---

## 🔗 Related Notes
- [[02 - Firebase Authentication & Security]]
- [[03 - Android APK & Keystore Guide]]
- [[05 - Bug Diagnostics & Fixes Log]]
