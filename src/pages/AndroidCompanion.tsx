import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  Smartphone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed, 
  Bell, 
  BatteryCharging, 
  Wifi, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Footprints, 
  MapPin, 
  Cpu, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Volume2, 
  CheckCircle2
} from 'lucide-react';

interface CallRecord {
  id: string;
  name: string;
  number: string;
  type: 'incoming' | 'outgoing' | 'missed';
  time: string;
  duration: string;
}

interface NotificationItem {
  id: string;
  app: string;
  title: string;
  text: string;
  time: string;
  priority: 'normal' | 'high' | 'urgent';
}

export const AndroidCompanion: React.FC = () => {
  const { addTask, earnReward, logActivity } = useData();

  // Live Sync state
  const [deviceConnected, setDeviceConnected] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [isCharging, setIsCharging] = useState(true);

  // Calls Log State
  const [callsList, setCallsList] = useState<CallRecord[]>([
    { id: 'c1', name: 'Prof. Sharma (College)', number: '+91 9876543210', type: 'incoming', time: '10:45 AM', duration: '3m 12s' },
    { id: 'c2', name: 'Piyush (Classmate)', number: '+91 9812345678', type: 'missed', time: '11:30 AM', duration: '0s' },
    { id: 'c3', name: 'Mom', number: '+91 9988776655', type: 'outgoing', time: '01:15 PM', duration: '5m 45s' }
  ]);

  // Notifications Stream State
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([
    { id: 'n1', app: 'College Portal', title: 'New Physics Assignment Uploaded', text: 'Due date set to 28/07/2026', time: '11:40 AM', priority: 'high' },
    { id: 'n2', app: 'WhatsApp', title: 'Study Group (5 messages)', text: 'Piyush: Are we meeting at library today?', time: '12:05 PM', priority: 'normal' },
    { id: 'n3', app: 'ZenithLife Alert', title: 'Pomodoro Focus Session Completed', text: 'You earned 100 XP + 10 Coins!', time: '12:30 PM', priority: 'high' }
  ]);

  // Health Fit Metrics
  const [stepCount, setStepCount] = useState(7420);
  const [caloriesBurned, setCaloriesBurned] = useState(380);
  const [distanceKm, setDistanceKm] = useState(5.2);
  const [sleepHours, setSleepHours] = useState(7.5);

  // Manual Refresh Simulation
  const handleForceSync = () => {
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    earnReward(10, 1);
    logActivity('completed', 'Manually synchronized Android Companion Phone Data.');
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-400" /> Android Companion App Live Sync Hub
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Real-time phone activity tracking: Calls, Notifications, Screen Time, Alarms, and Health data.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Companion App Connected</span>
          </div>

          <button
            onClick={handleForceSync}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-glow transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Force Sync Now</span>
          </button>
        </div>
      </div>

      {/* Row 1: Realtime Device Health & Connectivity Dials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Battery Monitor */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span>Battery Health</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex justify-between items-baseline">
            <h3 className="text-3xl font-extrabold text-emerald-400">{batteryLevel}%</h3>
            <span className="text-xs text-emerald-400 font-bold">{isCharging ? '⚡ Charging' : 'Discharging'}</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${batteryLevel}%` }} />
          </div>
          <span className="text-[9.5px] text-gray-500 block">Temp: 31°C | Health: Good</span>
        </div>

        {/* Network & Connectivity */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span>Connectivity</span>
            <Wifi className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-1">
            <h3 className="text-sm font-bold text-gray-200">Home_5G_WiFi</h3>
            <span className="text-[10px] text-blue-400 font-bold block mt-0.5">Cellular: 5G Full Signal</span>
          </div>
          <div className="flex gap-2 text-[9px] font-bold text-gray-400 pt-1">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Bluetooth: ON</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Airplane: OFF</span>
          </div>
        </div>

        {/* Location & Geo-Fence */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span>Live Location</span>
            <MapPin className="w-4 h-4 text-rose-400" />
          </div>
          <div className="my-1">
            <h3 className="text-xs font-bold text-gray-200">College Campus Geo-Fence</h3>
            <span className="text-[10px] text-rose-400 font-bold block mt-0.5">📍 Inside Campus (Auto Silent Mode ON)</span>
          </div>
          <span className="text-[9.5px] text-gray-500 block">Frequently Visited: Home, College Library</span>
        </div>

        {/* Device Performance (RAM & Storage) */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span>Performance</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-1">
            <h3 className="text-sm font-bold text-gray-200">6.4 GB / 12 GB RAM</h3>
            <span className="text-[10px] text-purple-400 font-bold block mt-0.5">Storage: 142 GB Free</span>
          </div>
          <span className="text-[9.5px] text-gray-500 block">CPU Usage: 14% | Phone Status: Optimal</span>
        </div>

      </div>

      {/* Row 2: Calls Log & Notifications Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Calls Tracking Log */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <PhoneIncoming className="w-4 h-4 text-blue-400" /> Phone Calls Log
            </h3>
            <span className="text-[10px] text-gray-500 font-bold">{callsList.length} Calls Recorded Today</span>
          </div>

          <div className="space-y-3">
            {callsList.map(call => (
              <div key={call.id} className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${
                    call.type === 'incoming' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    call.type === 'outgoing' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {call.type === 'incoming' && <PhoneIncoming className="w-4 h-4" />}
                    {call.type === 'outgoing' && <PhoneOutgoing className="w-4 h-4" />}
                    {call.type === 'missed' && <PhoneMissed className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-200">{call.name}</h4>
                    <span className="text-[10px] text-gray-500 block">{call.number} • {call.time}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-bold block ${call.type === 'missed' ? 'text-rose-400' : 'text-gray-300'}`}>
                    {call.type === 'missed' ? 'Missed Call' : call.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Notifications Stream */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" /> Notifications Stream
            </h3>
            <span className="text-[10px] text-gray-500 font-bold">{notificationsList.length} Notifications Synced</span>
          </div>

          <div className="space-y-3">
            {notificationsList.map(notif => (
              <div key={notif.id} className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    {notif.app}
                  </span>
                  <span className="text-[9px] text-gray-500">{notif.time}</span>
                </div>
                <h4 className="text-xs font-bold text-gray-200">{notif.title}</h4>
                <p className="text-[10px] text-gray-400 line-clamp-1">{notif.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Health & Fitness Sync (Google Fit / Health Connect) */}
      <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <Footprints className="w-4 h-4 text-emerald-400" /> Google Fit / Health Connect Live Metrics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Daily Step Count</span>
            <div className="text-2xl font-extrabold text-emerald-400">{stepCount.toLocaleString()} Steps</div>
            <span className="text-[9.5px] text-gray-400 block">Goal: 10,000 steps (74% completed)</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Walking Distance</span>
            <div className="text-2xl font-extrabold text-blue-400">{distanceKm} km</div>
            <span className="text-[9.5px] text-gray-400 block">Active Walk Time: 48 mins</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Calories Burned</span>
            <div className="text-2xl font-extrabold text-rose-400">{caloriesBurned} kcal</div>
            <span className="text-[9.5px] text-gray-400 block">Active Gym & Walk sessions</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Sleep Duration</span>
            <div className="text-2xl font-extrabold text-purple-400">{sleepHours} hrs</div>
            <span className="text-[9.5px] text-gray-400 block">Deep Sleep: 2h 15m | Optimal</span>
          </div>
        </div>
      </div>

    </div>
  );
};
