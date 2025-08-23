import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AppButtonComponent, IconComponent } from '../../../../tools';
import { RoomsService } from '../../../../services/rooms.service';

interface Room {
  id: number;
  number: string;
  type: 'ICU' | 'General Ward' | 'Private' | 'Semi-Private';
  floor: number;
  wing: string;
  capacity: number;
  occupied: number;
  status: 'Available' | 'Full' | 'Maintenance';
  facilities?: { ac?: boolean; oxygen?: boolean; ventilator?: boolean; monitor?: boolean };
  icuLevel?: 'Level 1' | 'Level 2' | 'Level 3';
  ventilators?: number;
  monitors?: number;
  beds: Array<{
    id: string;
    status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance' | 'Reserved';
    facilities?: { oxygen?: boolean; monitor?: boolean };
    patient?: string;
    patientInfo?: {
      name: string;
      age: number;
      gender: string;
      admission: string;
      doctor: string;
      diagnosis: string;
      expectedDischarge: string;
      guardian: string;
    };
  }>;
}

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [CommonModule, AppButtonComponent, IconComponent],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.scss'
})
export class RoomDetailsComponent implements OnInit {
  room: Room | null = null;
  loading = true;
  selectedBed: any = null;
  showPatientDetails = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomsService: RoomsService
  ) {}

  ngOnInit() {
    const roomId = this.route.snapshot.paramMap.get('id');
    
    // Try to get room from navigation state first
    const navigationState = history.state;
    if (navigationState && navigationState.room) {
      this.room = navigationState.room;
      this.loading = false;
    } else if (roomId) {
      // Fallback: fetch room by ID (for direct navigation/refresh)
      this.room = this.roomsService.getRoomById(+roomId) || null;
      this.loading = false;
    }
    
    if (!this.room) {
      // Room not found, redirect back to rooms list
      this.router.navigate(['/admin/rooms']);
    }
  }

  back() {
    this.router.navigate(['/admin/rooms']);
  }

  onEditRoom() {
    console.log('Edit room:', this.room);
    // TODO: Navigate to edit room page
  }

  onBedClick(bed: any) {
    if (bed.status === 'Occupied' && bed.patientInfo) {
      this.selectedBed = bed;
      this.showPatientDetails = true;
    }
  }

  closePatientDetails() {
    this.showPatientDetails = false;
    this.selectedBed = null;
  }

  onBedAction(bed: any, action: string) {
    switch (action) {
      case 'assign':
        if (bed.status === 'Available') {
          bed.status = 'Reserved';
        }
        break;
      case 'unassign':
        if (bed.status === 'Reserved') {
          bed.status = 'Available';
        }
        break;
      case 'maintenance':
        bed.status = 'Maintenance';
        break;
      case 'clean':
        bed.status = 'Cleaning';
        break;
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'available': return 'status-available';
      case 'occupied': return 'status-occupied';
      case 'reserved': return 'status-reserved';
      case 'cleaning': return 'status-cleaning';
      case 'maintenance': return 'status-maintenance';
      default: return '';
    }
  }

  getBedTypeLabel(status: string): string {
    switch (status.toLowerCase()) {
      case 'available': return 'Normal Bed';
      case 'reserved': return 'Reserved';
      case 'cleaning': return 'Cleaning';
      case 'maintenance': return 'Maintenance';
      default: return 'Normal Bed';
    }
  }

  facilityIcons(f?: { ac?: boolean; oxygen?: boolean; ventilator?: boolean; monitor?: boolean }) {
    if (!f) return [];
    const icons: string[] = [];
    if (f.ac) icons.push('ac_unit');
    if (f.oxygen) icons.push('medication');
    if (f.ventilator) icons.push('air');
    if (f.monitor) icons.push('monitor_heart');
    return icons;
  }

  getBedStatusColor(status: string): string {
    switch (status) {
      case 'Available': return 'var(--room-available-color)';
      case 'Occupied': return 'var(--room-occupied-color)';
      case 'Cleaning': return 'var(--room-cleaning-color)';
      case 'Maintenance': return 'var(--room-maintenance-color)';
      case 'Reserved': return 'var(--room-reserved-color)';
      default: return 'var(--room-available-color)';
    }
  }

  getRoomStatusColor(status: string): string {
    switch (status) {
      case 'Available': return 'var(--room-available-color)';
      case 'Full': return 'var(--room-occupied-color)';
      case 'Maintenance': return 'var(--room-maintenance-color)';
      default: return 'var(--room-available-color)';
    }
  }

  getBedLabel(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, etc.
  }
}
