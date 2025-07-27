import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';

export interface PatientQueueItem {
  id: string;
  name: string;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  estimatedTime: string;
  avatar?: string;
  reason: string;
  room?: string;
}

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatBadgeModule,
    IconComponent,
    AppButtonComponent
  ],
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss'
})
export class RightSidebarComponent {
  @Input() opened: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();

  patientQueue: PatientQueueItem[] = [
    {
      id: '1',
      name: 'John Doe',
      status: 'waiting',
      priority: 'medium',
      estimatedTime: '10:30 AM',
      reason: 'Regular checkup',
      room: '101',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: '2',
      name: 'Sarah Smith',
      status: 'in-progress',
      priority: 'high',
      estimatedTime: '10:45 AM',
      reason: 'Follow-up consultation',
      room: '102',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      status: 'waiting',
      priority: 'low',
      estimatedTime: '11:00 AM',
      reason: 'Prescription refill',
      room: '103',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
      id: '4',
      name: 'Emily Davis',
      status: 'waiting',
      priority: 'emergency',
      estimatedTime: 'ASAP',
      reason: 'Chest pain',
      room: '104',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    {
      id: '5',
      name: 'Robert Wilson',
      status: 'completed',
      priority: 'medium',
      estimatedTime: '10:15 AM',
      reason: 'Blood test results',
      room: '105',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
    }
  ];

  onClose() {
    this.closeSidebar.emit();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'waiting': return '#ff9800';
      case 'in-progress': return '#2196f3';
      case 'completed': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#888';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      case 'emergency': return '#9c27b0';
      default: return '#888';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'waiting': return 'schedule';
      case 'in-progress': return 'play_circle';
      case 'completed': return 'check_circle';
      case 'cancelled': return 'cancel';
      default: return 'help';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'low': return 'arrow_downward';
      case 'medium': return 'remove';
      case 'high': return 'arrow_upward';
      case 'emergency': return 'warning';
      default: return 'help';
    }
  }

  getFilteredPatients(status?: string): PatientQueueItem[] {
    if (!status) return this.patientQueue;
    return this.patientQueue.filter(patient => patient.status === status);
  }

  getStatusCount(status: string): number {
    return this.patientQueue.filter(patient => patient.status === status).length;
  }

  onPatientClick(patient: PatientQueueItem) {
    console.log('Patient clicked:', patient);
    // Handle patient selection
  }
} 