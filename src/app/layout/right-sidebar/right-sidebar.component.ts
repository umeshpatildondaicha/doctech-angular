import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBadgeModule } from '@angular/material/badge';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatBadgeModule,
    FlexLayoutServerModule,
  ],
})
export class RightSidebarComponent {
  isOpen = false;
  // activeTab: string = 'All';
  waitingPatients = [
    {
      queueNumber: 1,
      name: 'John Doe',
      problem: 'Fever',
      contactNumber: '123-456-7890',
      waitTime: '15 mins',
      notification: 2,
      photoUrl: '../../../assets/default-avatar.jpg'
    },
    {
      queueNumber: 2,
      name: 'Jane Smith',
      problem: 'Headache',
      contactNumber: '234-567-8901',
      waitTime: '25 mins',
      notification: 3,
      photoUrl: '../../../assets/default-avatar.jpg'
    },
    {
      queueNumber: 3,
      name: 'Bob Wilson',
      problem: 'Back Pain',
      contactNumber: '345-678-9012',
      waitTime: '35 mins',
      notification: 5,
      photoUrl: '../../../assets/default-avatar.jpg'
    },
    {
      queueNumber: 4,
      name: 'Robert Hook',
      problem: 'Fever',
      contactNumber: '123-456-7890',
      waitTime: '15 mins',
      notification: 2,
      photoUrl: '../../../assets/default-avatar.jpg'
    },
  ];

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
