import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Zap, 
  Wifi, 
  MapPin, 
  BatteryCharging, 
  VolumeX, 
  Plus, 
  Trash2, 
  CheckCircle2,
  Sliders,
  Play
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  triggerType: 'location' | 'wifi' | 'battery' | 'schedule';
  condition: string;
  action: string;
  enabled: boolean;
}

export const SmartAutomations: React.FC = () => {
  const { addTask, earnReward, logActivity } = useData();

  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: 'rule_1',
      name: 'Auto Silent in College Campus',
      triggerType: 'location',
      condition: 'Entering College Geo-Fence (Lat: 28.6, Lon: 77.2)',
      action: 'Enable Mute & Switch to Student Mode',
      enabled: true
    },
    {
      id: 'rule_2',
      name: 'Evening Homework Wi-Fi Alert',
      triggerType: 'wifi',
      condition: 'Connected to "Home_5G_WiFi"',
      action: 'Remind: Complete Pending College Assignments',
      enabled: true
    },
    {
      id: 'rule_3',
      name: 'Low Battery Alert Task',
      triggerType: 'battery',
      condition: 'Battery Level Drops Below 20%',
      action: 'Create Task: Charge Device for Evening Study',
      enabled: true
    },
    {
      id: 'rule_4',
      name: 'Night Routine Charger Trigger',
      triggerType: 'battery',
      condition: 'Device Plugged into Charger after 10 PM',
      action: 'Start Night Sleep Routine & Mute Notifications',
      enabled: false
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [ruleType, setRuleType] = useState<AutomationRule['triggerType']>('location');
  const [ruleCondition, setRuleCondition] = useState('');
  const [ruleAction, setRuleAction] = useState('');

  const handleToggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim() || !ruleCondition.trim() || !ruleAction.trim()) return;

    setRules(prev => [
      ...prev,
      {
        id: 'rule_' + Date.now(),
        name: ruleName,
        triggerType: ruleType,
        condition: ruleCondition,
        action: ruleAction,
        enabled: true
      }
    ]);

    setRuleName('');
    setRuleCondition('');
    setRuleAction('');
    setShowAddModal(false);
  };

  const runTestTrigger = (rule: AutomationRule) => {
    const today = new Date().toISOString().split('T')[0];
    addTask({
      title: `[Automated] ${rule.name}`,
      description: `Triggered by rule: ${rule.condition}`,
      category: 'general',
      priority: 'high',
      dueDate: today,
      status: 'not_started',
      subTasks: []
    });

    earnReward(30, 3);
    logActivity('created', `Triggered automation rule: ${rule.name}`);
    alert(`⚡ Trigger Execution Success! Simulated "${rule.name}" and auto-created a task on your board.`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" /> Smart Automation & Triggers
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Automate tasks and mute settings based on Location, Wi-Fi, and Battery events.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Automation Rule</span>
        </button>
      </div>

      {/* Rules list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rules.map(rule => {
          const getIcon = () => {
            if (rule.triggerType === 'location') return <MapPin className="w-5 h-5 text-rose-400" />;
            if (rule.triggerType === 'wifi') return <Wifi className="w-5 h-5 text-blue-400" />;
            if (rule.triggerType === 'battery') return <BatteryCharging className="w-5 h-5 text-emerald-400" />;
            return <Sliders className="w-5 h-5 text-purple-400" />;
          };

          return (
            <div 
              key={rule.id}
              className={`p-5 rounded-3xl border transition-all space-y-4 relative group ${
                rule.enabled ? 'glass-panel border-white/10' : 'bg-white/[0.01] border-white/5 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                    {getIcon()}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-200">{rule.name}</h3>
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">{rule.triggerType} trigger</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className={`w-9 h-5 rounded-full appearance-none relative cursor-pointer outline-none transition-colors ${
                      rule.enabled ? 'bg-emerald-600' : 'bg-white/10'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.75 left-0.75 ${
                      rule.enabled ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>

                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-1 text-gray-500 hover:text-rose-400 rounded opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-3 text-xs">
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-[10px] font-bold uppercase text-gray-500 w-16">Condition:</span>
                  <span className="text-gray-300 font-medium truncate">{rule.condition}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-[10px] font-bold uppercase text-gray-500 w-16">Action:</span>
                  <span className="text-emerald-400 font-bold truncate">{rule.action}</span>
                </div>
              </div>

              <button
                onClick={() => runTestTrigger(rule)}
                className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-[10px] font-bold border border-white/5 transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Simulate Trigger Test</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* --- ADD AUTOMATION RULE MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Add Smart Automation Rule</h3>
            <form onSubmit={handleAddRule} className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={ruleName}
                  onChange={e => setRuleName(e.target.value)}
                  placeholder="e.g. Mute during Library Visit"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Trigger Sensor Type</label>
                <select
                  value={ruleType}
                  onChange={e => setRuleType(e.target.value as any)}
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
                >
                  <option value="location">GPS Location / Geo-Fence</option>
                  <option value="wifi">Wi-Fi Connection SSID</option>
                  <option value="battery">Battery Level / Charging</option>
                  <option value="schedule">Schedule Time Window</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Trigger Condition</label>
                <input
                  type="text"
                  required
                  value={ruleCondition}
                  onChange={e => setRuleCondition(e.target.value)}
                  placeholder="e.g. Entering Library Area"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Automated Action</label>
                <input
                  type="text"
                  required
                  value={ruleAction}
                  onChange={e => setRuleAction(e.target.value)}
                  placeholder="e.g. Auto Silent & Start Study Timer"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-glow"
                >
                  Save Automation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
