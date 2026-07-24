// Smart Task Notification Engine & Escalation Daemon for ZenithLife OS

export interface NotificationLogItem {
  id: string;
  taskId: string;
  taskTitle: string;
  sentTime: string;
  status: 'sent' | 'read' | 'dismissed' | 'snoozed' | 'completed' | 'ignored';
  priority: 'low' | 'medium' | 'high' | 'critical';
  channel: 'browser' | 'android_push' | 'sound' | 'popup' | 'desktop';
}

class NotificationEngine {
  private activeTimers: Map<string, any> = new Map();
  private notificationHistory: NotificationLogItem[] = [];

  // Initialize notification daemon loop
  public startDaemon(
    tasks: any[],
    onTaskStartAlert: (task: any) => void,
    onOverdueAlert: (task: any) => void
  ) {
    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentDateStr = now.toISOString().split('T')[0];
      const currentH = now.getHours().toString().padStart(2, '0');
      const currentM = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentH}:${currentM}`;

      tasks.forEach(task => {
        if (task.status === 'completed' || task.status === 'missed') return;

        // 1. Task Start Exact Time Check
        if (task.dueDate === currentDateStr && task.dueTime === currentTimeStr) {
          if (!task.alertFired) {
            task.alertFired = true;
            this.playNotificationSound();
            onTaskStartAlert(task);
            this.logNotification(task.id, task.title, 'sent', task.priority || 'high');
          }
        }

        // 2. Overdue Check
        if (task.dueDate < currentDateStr || (task.dueDate === currentDateStr && task.dueTime && task.dueTime < currentTimeStr)) {
          if (task.status !== 'overdue') {
            onOverdueAlert(task);
            this.logNotification(task.id, task.title, 'ignored', 'critical');
          }
        }
      });
    }, 15000); // Check every 15 seconds

    return () => clearInterval(checkInterval);
  }

  public playNotificationSound() {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-200.wav');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {}
  }

  public logNotification(
    taskId: string,
    taskTitle: string,
    status: NotificationLogItem['status'],
    priority: NotificationLogItem['priority']
  ) {
    const item: NotificationLogItem = {
      id: 'notif_' + Date.now(),
      taskId,
      taskTitle,
      sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status,
      priority,
      channel: 'popup'
    };

    this.notificationHistory.unshift(item);
    if (this.notificationHistory.length > 50) this.notificationHistory.pop();
  }

  public getHistory(): NotificationLogItem[] {
    return this.notificationHistory;
  }
}

export const notificationEngine = new NotificationEngine();
