import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  History, 
  Search, 
  Trash2, 
  Clock, 
  PlusCircle, 
  CheckCircle, 
  Edit3, 
  Droplet,
  BellRing
} from 'lucide-react';

export const ActivityLogView: React.FC = () => {
  const { activities, logActivity } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const filteredLogs = activities.filter(act => {
    const matchesSearch = act.taskTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterAction === 'all' || act.action === filterAction;
    return matchesSearch && matchesFilter;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <PlusCircle className="w-4 h-4 text-emerald-400" />;
      case 'edited':
        return <Edit3 className="w-4 h-4 text-blue-400" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />;
      case 'deleted':
        return <Trash2 className="w-4 h-4 text-rose-400" />;
      case 'started':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'water_logged':
        return <Droplet className="w-4 h-4 text-sky-400" />;
      case 'reminder_sent':
        return <BellRing className="w-4 h-4 text-purple-400" />;
      default:
        return <History className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'created': return 'Created Item';
      case 'edited': return 'Edited / Updated';
      case 'completed': return 'Completed Task 🎉';
      case 'deleted': return 'Deleted Item';
      case 'started': return 'In Progress';
      case 'water_logged': return 'Logged Hydration';
      case 'reminder_sent': return 'Reminder Alerted';
      default: return action;
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-lg font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <History className="w-5 h-5 text-blue-400" /> Life Engine Activity Log
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">A complete audit log of your life scheduler, completed tasks, and system reminders.</p>
      </div>

      {/* Filters card */}
      <div className="p-4 rounded-3xl border border-white/5 glass-panel flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search activities..."
            className="w-full bg-[#060813] border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-300 focus:outline-none"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none w-full md:w-44"
          >
            <option value="all">All Actions</option>
            <option value="created">Created Items</option>
            <option value="edited">Edited Items</option>
            <option value="completed">Completed Items</option>
            <option value="deleted">Deleted Items</option>
            <option value="water_logged">Hydration Logs</option>
            <option value="started">In Progress Transitions</option>
          </select>
        </div>
      </div>

      {/* Timeline table */}
      <div className="rounded-3xl border border-white/5 glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-5 py-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">Action</th>
                <th className="px-5 py-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">Title / Scope</th>
                <th className="px-5 py-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">Operator</th>
                <th className="px-5 py-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-500">
                    No matching activity logs recorded yet. Tasks actions automatically record here!
                  </td>
                </tr>
              ) : (
                filteredLogs.map(act => (
                  <tr key={act.id} className="hover:bg-white/[0.01] transition-all">
                    <td className="px-5 py-3.5 flex items-center gap-2">
                      {getActionIcon(act.action)}
                      <span className="font-semibold text-gray-300">{getActionLabel(act.action)}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 font-medium">
                      {act.taskTitle}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      <span className="bg-white/5 px-2 py-0.5 rounded text-[10px]">
                        {act.user}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 flex items-center gap-1.5 font-mono">
                      <span>{act.date}</span>
                      <span className="text-[10px] text-gray-600">|</span>
                      <span>{act.time}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
