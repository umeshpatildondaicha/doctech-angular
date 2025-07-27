import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../tools/app-icon/icon.component';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
  avatar?: string;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  @Input() notifications: NotificationItem[] = [];
  @Output() closeNotification = new EventEmitter<void>();
  @Output() markAsRead = new EventEmitter<string>();
  @Output() markAllAsRead = new EventEmitter<void>();

  onClose() {
    this.closeNotification.emit();
  }

  onMarkAsRead(notificationId: string) {
    this.markAsRead.emit(notificationId);
  }

  onMarkAllAsRead() {
    this.markAllAsRead.emit();
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'success': return 'check_circle';
      default: return 'notifications';
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'info': return '#2196F3';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      case 'success': return '#4CAF50';
      default: return '#888';
    }
  }

  formatTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
} 