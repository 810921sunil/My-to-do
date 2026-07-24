# ZenithLife OS - Free GitHub Actions Cloud APK Build Guide

This guide explains how to get your compiled `.apk` file using GitHub's free Cloud Build servers without installing Android Studio or downloading heavy JDK tools locally.

---

## ⚡ How it Works (3 Easy Steps)

### Step 1: Push Code to GitHub
Open Git terminal in your project directory and run:
```bash
git add .
git commit -m "Add GitHub Actions Android Cloud Build Workflow"
git push origin main
```

---

### Step 2: Cloud Build Triggers Automatically
1. Go to your GitHub repository in your web browser.
2. Click on the **Actions** tab at the top.
3. You will see a job running: **"Build ZenithLife Android APK"**.
4. GitHub's cloud servers (Ubuntu Linux) will automatically:
   - Install Java 17 & Node.js
   - Run `npm run build`
   - Run Gradle `assembleDebug`
   - Build `ZenithLife-Android-App.apk` in ~2 minutes!

---

### Step 3: Download APK directly to your Phone
1. Once the green checkmark (✓) appears under **Actions**, click on the completed workflow run.
2. Scroll down to the **Artifacts** section at the bottom.
3. Click on **`ZenithLife-Android-App`** to download the ~15MB `.zip` containing your `app-debug.apk` file!
4. Send the `.apk` file to your Android Phone and tap **Install**!

---

## 🚀 Key Advantages
- **0 MB Computer Data Wasted:** Your computer doesn't download 3GB Android Studio or 500MB Gradle zips.
- **Fast Cloud Servers:** GitHub builds the APK on fast cloud servers in ~2 minutes.
- **100% Free & Automatic:** Every time you commit code, a fresh APK is built automatically!
