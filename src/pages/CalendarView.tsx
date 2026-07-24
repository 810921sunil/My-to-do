import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar as CalendarIcon, Info, Check, AlertCircle } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { tasks, updateTask } = useData();
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  // Convert tasks to FullCalendar event format
  const events = tasks.map(t => {
    const startStr = t.dueTime ? `${t.dueDate}T${t.dueTime}` : t.dueDate;
    
    // Choose colors matching our aesthetic (Emerald for done, Red for High priority, Amber for Medium, Blue for low)
    let color = '#3b82f6';
    if (t.status === 'completed') {
      color = '#10b981';
    } else if (t.priority === 'high') {
      color = '#f43f5e';
    } else if (t.priority === 'medium') {
      color = '#f59e0b';
    }

    return {
      id: t.id,
      title: t.title,
      start: startStr,
      allDay: !t.dueTime,
      backgroundColor: color,
      borderColor: color,
      textColor: '#ffffff',
      extendedProps: {
        task: t
      }
    };
  });

  // Handle Drag & Drop
  const handleEventDrop = (info: any) => {
    const task = info.event.extendedProps.task;
    const newDate = info.event.startStr.split('T')[0];
    const newTime = info.event.startStr.includes('T') 
      ? info.event.startStr.split('T')[1].substring(0, 5) 
      : undefined;

    updateTask({
      ...task,
      dueDate: newDate,
      dueTime: newTime || task.dueTime
    });
  };

  // Handle Event Click
  const handleEventClick = (info: any) => {
    setSelectedTask(info.event.extendedProps.task);
  };

  const handleToggleTaskStatus = () => {
    if (!selectedTask) return;
    const newStatus = selectedTask.status === 'completed' ? 'todo' : 'completed';
    const updated = { ...selectedTask, status: newStatus };
    updateTask(updated);
    setSelectedTask(updated);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Top Banner Info */}
      <div className="p-4 rounded-3xl border border-white/5 glass-panel flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Dynamic Schedule Calendar</h3>
            <p className="text-[10px] text-gray-500 font-medium">Drag and drop cards to reschedule tasks. Green events are completed.</p>
          </div>
        </div>
      </div>

      {/* Calendar Area */}
      <div className="p-5 rounded-3xl border border-white/5 glass-panel bg-gray-900/10">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          editable={true}
          selectable={true}
          events={events}
          eventDrop={handleEventDrop}
          eventClick={handleEventClick}
          height="70vh"
        />
      </div>

      {/* Task details modal popups */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-white/5 text-gray-400 rounded uppercase">
                  {selectedTask.category}
                </span>
                <h3 className="text-sm font-bold text-gray-200 mt-1">{selectedTask.title}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                selectedTask.priority === 'high' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
              }`}>
                {selectedTask.priority} Priority
              </span>
            </div>

            {selectedTask.description && (
              <p className="text-xs text-gray-400 leading-relaxed bg-white/[0.01] p-3 rounded-2xl border border-white/5">
                {selectedTask.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-3 text-xs">
              <div>
                <span className="block text-[9px] text-gray-500 font-bold uppercase">Deadline</span>
                <span className="text-gray-300 font-semibold">{selectedTask.dueDate} {selectedTask.dueTime && `| ${selectedTask.dueTime}`}</span>
              </div>
              <div>
                <span className="block text-[9px] text-gray-500 font-bold uppercase">Status</span>
                <span className={`font-semibold capitalize ${
                  selectedTask.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {selectedTask.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="flex-1 py-2 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
              >
                Close details
              </button>
              <button
                onClick={handleToggleTaskStatus}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all shadow-glow flex items-center justify-center gap-1.5 ${
                  selectedTask.status === 'completed'
                    ? 'bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {selectedTask.status === 'completed' ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Mark Unfinished</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Complete Task</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
