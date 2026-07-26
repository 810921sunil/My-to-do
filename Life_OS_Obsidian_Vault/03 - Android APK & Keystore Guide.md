---
title: Android APK Build & Keystore Guide
tags:
  - life-os
  - android
  - keystore
  - github-actions
date: 2026-07-26
---

# 📱 Android APK & Digital Keystore Setup

Back to [[00 - Life OS Vault Hub]]

To guarantee seamless 1-click updates on user devices without signature mismatches or data loss, **Life OS** uses a permanent RSA 2048-bit `debug.keystore`.

---

## 🔑 Permanent Digital Keystore Config (`android/app/build.gradle`)

```groovy
android {
    namespace "com.zenithlife.app"
    compileSdk 36

    defaultConfig {
        applicationId "com.zenithlife.app"
        minSdk 23
        targetSdk 36
        versionCode 2
        versionName "1.0.1"
    }

    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }

    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.debug
            minifyEnabled false
        }
    }
}
```

---

## 🤖 GitHub Actions Automated Cloud Pipeline (`.github/workflows/android-build.yml`)

1. **Trigger:** Push to `main` branch on repository `810921sunil/My-to-do`.
2. **Environment:** JDK 21, Node 22.
3. **Build Command:** `./gradlew assembleDebug`
4. **Artifact Upload:** `ZenithLife-Android-App`

---

## 🔗 Related Notes
- [[01 - Architecture Overview]]
- [[05 - Bug Diagnostics & Fixes Log]]
