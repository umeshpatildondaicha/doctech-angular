import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { NotificationComponent, NotificationItem } from './notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private overlayRef: OverlayRef | null = null;

  constructor(
    private overlay: Overlay,
    private injector: Injector
  ) {}

  openNotificationPanel(notifications: NotificationItem[], targetElement: HTMLElement) {
    if (this.overlayRef) {
      this.closeNotificationPanel();
    }

    // Create overlay
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(targetElement)
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: 8
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetY: -8
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'notification-backdrop'
    });

    // Create component portal
    const portal = new ComponentPortal(NotificationComponent, null, this.injector);
    const componentRef = this.overlayRef.attach(portal);

    // Set notifications data
    componentRef.instance.notifications = notifications;

    // Handle close event
    componentRef.instance.closeNotification.subscribe(() => {
      this.closeNotificationPanel();
    });

    // Handle mark as read event
    componentRef.instance.markAsRead.subscribe((notificationId: string) => {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
      }
    });

    // Handle mark all as read event
    componentRef.instance.markAllAsRead.subscribe(() => {
      notifications.forEach(n => n.isRead = true);
    });

    // Close on backdrop click
    this.overlayRef.backdropClick().subscribe(() => {
      this.closeNotificationPanel();
    });

    return this.overlayRef;
  }

  closeNotificationPanel() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  // Sample notifications for testing
  getSampleNotifications(): NotificationItem[] {
    return [
      {
        id: '1',
        title: 'New Patient Appointment',
        message: 'Patient John Doe has scheduled an appointment for tomorrow at 10:00 AM',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        isRead: false,
        type: 'info',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      {
        id: '2',
        title: 'Lab Results Ready',
        message: 'Blood test results for patient Sarah Smith are now available',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isRead: false,
        type: 'success'
      },
      {
        id: '3',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: true,
        type: 'warning'
      },
      {
        id: '4',
        title: 'Emergency Alert',
        message: 'Patient in Room 302 requires immediate attention',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        isRead: false,
        type: 'error'
      },
      {
        id: '5',
        title: 'Prescription Refill',
        message: 'Patient Mike Johnson has requested a prescription refill',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        isRead: true,
        type: 'info',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
      }
    ];
  }
} 