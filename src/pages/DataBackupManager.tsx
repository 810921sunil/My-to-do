import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  HardDrive, 
  ShieldCheck, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  FileCode,
  Sparkles
} from 'lucide-react';

export const DataBackupManager: React.FC = () => {
  const [backupStatus, setBackupStatus] = useState<string>('');
  const [storageUsedKB, setStorageUsedKB] = useState<number>(0);
  const [totalKeysCount, setTotalKeysCount] = useState<number>(0);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  useEffect(() => {
    calculateStorageUsage();
  }, []);

  const calculateStorageUsage = () => {
    let totalBytes = 0;
    let keysCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keysCount++;
        const val = localStorage.getItem(key) || '';
        totalBytes += key.length + val.length;
      }
    }
    setStorageUsedKB(Math.round(totalBytes / 1024));
    setTotalKeysCount(keysCount);
  };

  // 1-Click Export JSON File
  const handleExportData = () => {
    try {
      const exportPayload: Record<string, any> = {
        exportDate: new Date().toISOString(),
        version: '1.0.1',
        appName: 'Life OS',
        data: {}
      };

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const rawVal = localStorage.getItem(key);
          try {
            exportPayload.data[key] = JSON.parse(rawVal || '');
          } catch (e) {
            exportPayload.data[key] = rawVal;
          }
        }
      }

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `life-os-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setBackupStatus('✅ Full workspace backup downloaded successfully!');
      setTimeout(() => setBackupStatus(''), 4000);
    } catch (err) {
      setBackupStatus('❌ Backup failed. Please try again.');
    }
  };

  // 1-Click Import JSON File
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed && parsed.data) {
          Object.keys(parsed.data).forEach(key => {
            const val = parsed.data[key];
            if (typeof val === 'object') {
              localStorage.setItem(key, JSON.stringify(val));
            } else {
              localStorage.setItem(key, String(val));
            }
          });

          setBackupStatus('✅ Data restored successfully! Reloading session...');
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setBackupStatus('❌ Invalid backup file format.');
        }
      } catch (err) {
        setBackupStatus('❌ Error reading backup file.');
      }
    };
    reader.readAsText(file);
  };

  // Factory Reset Workspace
  const handleFactoryReset = () => {
    localStorage.clear();
    setShowResetModal(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950/60 via-[#0B0F19] to-blue-950/40 border border-white/10 glass-panel shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-glow">
              <Database className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              1-Click Data Backup & Disaster Recovery
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Export all your tasks, habits, notes, and finance records to a secure local JSON file.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <label className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer">
            <Upload className="w-4 h-4 text-blue-400" />
            <span>Restore JSON Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>

          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl text-xs font-bold shadow-glow transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Full Backup</span>
          </button>
        </div>
      </div>

      {/* Backup Status Toast Alert */}
      {backupStatus && (
        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{backupStatus}</span>
        </div>
      )}

      {/* Storage Health & Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel border border-teal-500/20 bg-teal-500/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Local Storage Used</span>
            <HardDrive className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{storageUsedKB}</span>
            <span className="text-xs text-teal-400 font-bold">KB</span>
          </div>
          <p className="text-[10px] text-gray-500">100% stored securely on client device</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-blue-500/20 bg-blue-500/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Data Keys Registered</span>
            <FileCode className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalKeysCount}</span>
            <span className="text-xs text-blue-400 font-bold">Modules</span>
          </div>
          <p className="text-[10px] text-gray-500">Includes tasks, habits, notes, and finance</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-purple-500/20 bg-purple-500/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Disaster Recovery</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">Active</span>
          </div>
          <p className="text-[10px] text-gray-500">Instant 1-click JSON backup & restore</p>
        </div>

      </div>

      {/* Main Container: Export / Import Details + Danger Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Backup & Restore Instructions */}
        <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-4 bg-white/[0.01]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            How Workspace Backup Works
          </h3>

          <ul className="space-y-3 text-xs text-gray-300 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
              <span><strong>Full JSON Export:</strong> Generates a complete structured snapshot of all your tasks, habits, courses, notes, and settings.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
              <span><strong>Cross-Device Restore:</strong> You can upload this backup file on your phone, tablet, or another computer to instantly mirror your workspace.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
              <span><strong>Offline Privacy:</strong> All data remains local. No sensitive information is sent to third-party tracking servers.</span>
            </li>
          </ul>
        </div>

        {/* Danger Zone: Factory Reset */}
        <div className="p-6 rounded-3xl glass-panel border border-rose-500/20 bg-rose-500/[0.01] space-y-4">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Danger Zone — Reset Workspace
          </h3>

          <p className="text-xs text-gray-400 leading-relaxed">
            Resetting your workspace will permanently clear all local data from your browser storage. Make sure to download a backup JSON first!
          </p>

          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-500 text-rose-300 hover:text-white rounded-2xl text-xs font-bold transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Factory Reset Workspace</span>
          </button>
        </div>

      </div>

      {/* Factory Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel border border-rose-500/30 bg-[#070b14] space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold">Confirm Workspace Reset?</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to clear all tasks, notes, habits, and finance entries? This action cannot be undone unless you have a JSON backup file.
            </p>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFactoryReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-glow"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
