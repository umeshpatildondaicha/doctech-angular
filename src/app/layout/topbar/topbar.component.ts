import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AppInputComponent } from '../../tools/app-input/app-input.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { NotificationService } from '../notification/notification.service';
import { AuthService } from '../../services/auth.service';
import { CustomEventsService } from '../../services/custom-events.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    AppInputComponent,
    IconComponent
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {
  searchText: string = '';
  @Output() openPatientQueue = new EventEmitter<any>();

  breadcrum:any = [
    {
      title: 'Good Morning, Dr.Umesh!',
      url: '/dashboard'
    }
  ];

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private authService: AuthService,
    private customEventsService: CustomEventsService
  ) {}

  onNotificationClick(event: Event) {
    const targetElement = event.currentTarget as HTMLElement;
    const notifications = this.notificationService.getSampleNotifications();
    this.notificationService.openNotificationPanel(notifications, targetElement);
  }

  ngOnInit() {
    this.customEventsService.breadcrumbEvent.subscribe((event: any) => {
      if(event.isAppend){
        // Append only non-duplicate breadcrumbs
        event.breadcrum.forEach((item: any) => {
          if (!this.breadcrum.some((b: any) => b.title === item.title && b.url === item.url)) {
            this.breadcrum.push(item);
          }
        });
      }else{
        this.breadcrum = event.breadcrum;
      }
    });
  }

  showPatientQueue(event: Event) {
    this.openPatientQueue.emit(event);
  }

  onProfileClick(event: Event) {
    // This method is now handled by the mat-menu trigger
    console.log('Profile menu opened');
  }

  onProfileMenuClick() {
    this.router.navigate(['/profile']);
  }

  onSettingsMenuClick() {
    this.router.navigate(['/settings']);
  }

  onLogoutClick() {
    this.authService.logout();
  }

  onBreadcrumbClick(item: any) {
    this.router.navigate([item.url]);
  }
}
