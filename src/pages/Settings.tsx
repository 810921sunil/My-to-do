import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Settings as SettingsIcon, 
  Key, 
  Database, 
  CloudLightning,
  RefreshCw,
  Download,
  Upload,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { apiSettings, updateApiSettings, syncWithCloud, activeThemePreset, changeThemePreset } = useData();

  // Settings states
  const [geminiKey, setGeminiKey] = useState(apiSettings.geminiApiKey);
  const [fbConfig, setFbConfig] = useState(apiSettings.firebaseConfig);
  const [backendUrl, setBackendUrl] = useState(apiSettings.backendUrl);
  const [pinEnabled, setPinEnabled] = useState(() => {
    return localStorage.getItem('zenith_pin_lock_enabled') === 'true';
  });

  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateApiSettings({
      geminiApiKey: geminiKey,
      firebaseConfig: fbConfig,
      backendUrl: backendUrl
    });
    alert('API & Cloud Settings saved successfully!');
  };

  const handleCloudSync = async () => {
    setSyncing(true);
    setSyncStatus('idle');
    const success = await syncWithCloud();
    setSyncing(false);
    setSyncStatus(success ? 'success' : 'failed');
  };

  const handleResetDb = () => {
    const confirm = window.confirm('WARNING: This will delete all custom tasks, habits, courses, work logs, CRM clients, books, transactions and notes. It will restore the default ZenithLife templates. Proceed?');
    if (confirm) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const backup: Record<string, any> = {};
    const keys = ['z_tasks', 'z_habits', 'z_goals', 'z_transactions', 'z_courses', 'z_classes', 'z_worklogs', 'z_crm', 'z_books', 'z_notes', 'z_files', 'z_folders'];
    
    keys.forEach(key => {
      const val = localStorage.getItem(key);
      if (val) backup[key] = JSON.parse(val);
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `zenithlife_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        Object.keys(data).forEach(key => {
          localStorage.setItem(key, JSON.stringify(data[key]));
        });
        alert('Data backup imported successfully! Reloading...');
        window.location.reload();
      } catch (err) {
        alert('Failed to parse JSON file. Ensure file format is valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto pb-10">
      
      {/* settings forms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* API keys config */}
          <div className="p-6 rounded-3xl border border-white/5 glass-panel space-y-4">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-400" />
              API Key Configurations
            </h3>
            
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Google Gemini API Key</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={e => setGeminiKey(e.target.value)}
                  placeholder="AI Planner requires Gemini key (AI-xxx)..."
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Firebase Credentials Config</label>
                <textarea
                  value={fbConfig}
                  onChange={e => setFbConfig(e.target.value)}
                  placeholder='{"apiKey": "xxx", "authDomain": "xxx.firebaseapp.com", "projectId": "xxx"}'
                  className="w-full h-24 bg-[#060813] border border-white/5 rounded-xl p-3 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50 font-mono resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Express API Backend URL</label>
                <input
                  type="text"
                  value={backendUrl}
                  onChange={e => setBackendUrl(e.target.value)}
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-glow transition-all"
              >
                Save configurations
              </button>
            </form>
          </div>

          {/* Backup restore panel */}
          <div className="p-6 rounded-3xl border border-white/5 glass-panel space-y-4">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Backup & Database Utility
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Export */}
              <button
                onClick={handleExportData}
                className="p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 flex flex-col justify-between items-start h-28 text-left transition-all"
              >
                <Download className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="text-xs font-bold text-gray-300">Export All Data</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">Download full state as JSON backup.</p>
                </div>
              </button>

              {/* Import */}
              <label className="p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 flex flex-col justify-between items-start h-28 text-left transition-all cursor-pointer">
                <Upload className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-gray-300">Import Data</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">Upload a JSON backup file to overwrite database.</p>
                </div>
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
              </label>

            </div>
          </div>

        </div>

        {/* Right Side: status info */}
        <div className="space-y-6">
          
          {/* Theme Presets customizer */}
          <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <span>🎨</span>
              Visual Interface Theme
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'glass', label: 'Default Glass' },
                { id: 'cyberpunk', label: 'Cyberpunk Neon' },
                { id: 'hacker', label: 'Dark Hacker' },
                { id: 'apple', label: 'Apple Minimal' },
                { id: 'sunset', label: 'Sunset Amber' },
                { id: 'indigo', label: 'Deep Space' },
                { id: 'emerald', label: 'Emerald Forest' }
              ].map(theme => (
                <button
                  key={theme.id}
                  onClick={() => changeThemePreset(theme.id as any)}
                  className={`py-2 px-3 text-[11px] rounded-xl font-bold border transition-all ${
                    activeThemePreset === theme.id
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                      : 'bg-white/[0.01] border-white/5 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-3">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">♿ Accessibility Controls</h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-semibold">High Contrast Mode</span>
                <input 
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) document.documentElement.classList.add('high-contrast');
                    else document.documentElement.classList.remove('high-contrast');
                  }}
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                <span className="text-gray-400 font-semibold">Reduced Motion (No Animations)</span>
                <input 
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) document.documentElement.classList.add('reduce-motion');
                    else document.documentElement.classList.remove('reduce-motion');
                  }}
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Cloud Sync Stats */}
          <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <CloudLightning className="w-4 h-4 text-amber-400" />
              Cloud Sync Status
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase">Local Core Mode</span>
                  <span className="text-xs font-bold text-emerald-400">Offline-First (Active)</span>
                </div>
              </div>

              <button
                onClick={handleCloudSync}
                disabled={syncing}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold border border-white/5 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Syncing...' : 'Sync with Backend'}</span>
              </button>

              {syncStatus === 'success' && (
                <p className="text-[10px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg text-center font-bold">
                  ✓ Backend sync successful!
                </p>
              )}

              {syncStatus === 'failed' && (
                <p className="text-[10px] text-rose-400 bg-rose-500/10 p-2 rounded-lg text-center font-bold">
                  ✗ Sync failed. Backend server offline.
                </p>
              )}
            </div>
          </div>

          {/* PIN Lock Security setting */}
          <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-3">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">🔐 Passcode Security Lock</h3>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Enable lock screen protection. Prompt for 4-digit passcode check on app load.
            </p>
            <div className="flex items-center justify-between border-t border-white/5 pt-2">
              <span className="text-[10px] text-gray-400 font-semibold">Enable Lock Screen (Default: 1234)</span>
              <input 
                type="checkbox"
                checked={pinEnabled}
                onChange={(e) => {
                  const val = e.target.checked;
                  setPinEnabled(val);
                  localStorage.setItem('zenith_pin_lock_enabled', val ? 'true' : 'false');
                }}
                className="w-4 h-4 rounded border-gray-600 text-blue-600 bg-transparent focus:ring-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Reset System config */}
          <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-3">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Danger Zone</h3>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              If you want to clear your changes and restore all default items, you can restore mock templates below.
            </p>
            <button
              onClick={handleResetDb}
              className="w-full py-2 bg-rose-600/15 hover:bg-rose-600 text-rose-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-rose-500/25 flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database templates</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
