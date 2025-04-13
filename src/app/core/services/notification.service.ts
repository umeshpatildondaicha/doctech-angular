import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration: number = 3000): void {
    this.showNotification({ message, type: 'success', duration });
  }

  error(message: string, duration: number = 5000): void {
    this.showNotification({ message, type: 'error', duration });
  }

  info(message: string, duration: number = 3000): void {
    this.showNotification({ message, type: 'info', duration });
  }

  warning(message: string, duration: number = 4000): void {
    this.showNotification({ message, type: 'warning', duration });
  }

  private showNotification(notification: Notification): void {
    const { message, type, duration } = notification;
    
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: [`snackbar-${type}`],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
  }

  clearNotifications(): void {
    this.notificationsSubject.next([]);
  }
} 