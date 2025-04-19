import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-ipd-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    DatePipe
  ],
  templateUrl: './ipd-management.component.html',
  styleUrls: ['./ipd-management.component.css']
})
export class IpdManagementComponent {
  @Input() patient: any;
  @Input() upcomingCareActivities: any[] = [];
  
  today = new Date();
  
  // Calculate days left until discharge
  getDaysLeft(): number {
    if (!this.patient?.wardInfo?.expectedDischarge) return 0;
    
    const discharge = new Date(this.patient.wardInfo.expectedDischarge);
    const today = new Date();
    
    // Calculate difference in days
    const diffTime = discharge.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 3600 * 24));
  }
  
  // Calculate length of stay
  getLengthOfStay(): number {
    if (!this.patient?.wardInfo?.admissionDate) return 0;
    
    const admission = new Date(this.patient.wardInfo.admissionDate);
    const today = new Date();
    
    // Calculate difference in days
    const diffTime = today.getTime() - admission.getTime();
    return Math.floor(diffTime / (1000 * 3600 * 24));
  }
} 