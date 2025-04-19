import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-patient-info-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './patient-info-card.component.html',
  styleUrls: ['./patient-info-card.component.css']
})
export class PatientInfoCardComponent {
  @Input() patient: any;
  @Input() patientStats: any[] = [];
  
  // Function to handle toggling admission status
  @Input() toggleAdmissionStatus: () => void = () => {};
  
  // Helper function to parse numbers for displaying change indicators
  parseNumber(value: any): number {
    return parseFloat(value);
  }
} 