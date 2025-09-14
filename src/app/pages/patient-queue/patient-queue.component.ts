import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PatientQueueDisplay, QueueStatistics } from '../../interfaces/patient-queue.interface';
import { CustomEventsService } from '../../services/custom-events.service';
import { PatientQueueService } from '../../services/patient-queue.service';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { NotesDialogComponent } from '../../tools/notes-dialog';
import { AppointmentRescheduleComponent } from '../appointment-reschedule/appointment-reschedule.component';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-patient-queue',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    IconComponent
  ],
  templateUrl: './patient-queue.component.html',
  styleUrl: './patient-queue.component.scss'
})
export class PatientQueueComponent implements OnInit, OnDestroy {
  
  // Queue data
  patientQueue: PatientQueueDisplay[] = [];
  currentPatient: PatientQueueDisplay | null = null;
  queueStatistics: QueueStatistics = {
    totalPatients: 0,
    waiting: 0,
    inProgress: 0,
    completed: 0,
    averageWaitTime: 0,
    estimatedCompletionTime: '',
    doctorWorkload: []
  };

  // UI state
  selectedPatient: PatientQueueDisplay | null = null;
  showPatientDetails = false;
  searchTerm = '';
  filterStatus: string = 'ALL';
  sortBy: string = 'queuePosition';
  isRefreshing = false;



  private refreshInterval: any;
  private delayUpdateInterval: any;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly customEventsService: CustomEventsService,
    private readonly patientQueueService: PatientQueueService
  ) {}

  ngOnInit(): void {
    this.setupBreadcrumb();
    this.syncFiltersFromUrl();
    this.loadQueueData();
    this.startAutoRefresh();
    this.startDelayUpdate();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.delayUpdateInterval) {
      clearInterval(this.delayUpdateInterval);
    }
  }

  private setupBreadcrumb(): void {
    this.customEventsService.breadcrumbEvent.emit({
      isAppend: false,
      breadcrum: [{
        title: 'Patient Queue',
        url: '/patient-queue'
      }]
    });
  }

  private loadQueueData(): void {
    // Subscribe to service data
    this.patientQueueService.getQueueData().subscribe(data => {
      this.patientQueue = data;
    });
    
    this.patientQueueService.getCurrentPatient().subscribe(patient => {
      this.currentPatient = patient;
    });
    
    this.patientQueueService.getStatistics().subscribe(stats => {
      this.queueStatistics = stats;
    });
  }

  // Persist filters to URL and restore on load
  private syncFiltersFromUrl(): void {
    this.route.queryParamMap.subscribe((params) => {
      const status = params.get('status');
      const sort = params.get('sort');
      const search = params.get('q');

      if (status) this.filterStatus = status;
      if (sort) this.sortBy = sort;
      if (search !== null) this.searchTerm = search;
    });
  }

  onFiltersChanged(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        status: this.filterStatus !== 'ALL' ? this.filterStatus : null,
        sort: this.sortBy !== 'queuePosition' ? this.sortBy : null,
        q: this.searchTerm || null
      },
      queryParamsHandling: 'merge'
    });
  }

  private startAutoRefresh(): void {
    this.refreshInterval = setInterval(() => {
      this.refreshQueue();
    }, 30000); // Refresh every 30 seconds
  }

  private refreshQueue(): void {
    this.isRefreshing = true;
    this.patientQueueService.refreshQueue().subscribe(() => {
      this.isRefreshing = false;
    });
  }



  // Queue Management Methods
  callPatient(patient: PatientQueueDisplay): void {
    this.snackBar.open(`Calling ${patient.firstName} ${patient.lastName}`, 'OK', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
    
    this.patientQueueService.callPatient(patient.patientId);
  }

  startConsultation(patient: PatientQueueDisplay): void {
    this.navigateToPatientProfile(patient);
  }

  completeConsultation(patient: PatientQueueDisplay): void {
    this.patientQueueService.completeConsultation(patient.patientId);
    
    // Show completion message
    this.snackBar.open(`Consultation completed for ${patient.firstName} ${patient.lastName}`, 'OK', {
      duration: 3000
    });

    // Check if there's a next patient and show notification
    setTimeout(() => {
      this.checkAndNotifyNextPatient();
    }, 1000);
  }

  private checkAndNotifyNextPatient(): void {
    this.patientQueueService.currentPatient$.subscribe(currentPatient => {
      if (currentPatient) {
        this.snackBar.open(
          `Next patient: ${currentPatient.firstName} ${currentPatient.lastName} is now ready for consultation`, 
          'OK', 
          {
            duration: 5000,
            panelClass: ['success-snackbar']
          }
        );
      }
    }).unsubscribe();
  }

  isAutoProgressed(patient: PatientQueueDisplay): boolean {
    // Check if patient was recently started (within last 30 seconds)
    if (!patient.queueInfo.actualStartTime) {
      return false;
    }
    
    const startTime = new Date(`1970-01-01 ${patient.queueInfo.actualStartTime}`);
    const currentTime = new Date();
    const timeDiff = (currentTime.getTime() - startTime.getTime()) / 1000; // in seconds
    
    return timeDiff <= 30; // Show indicator for 30 seconds after auto-start
  }

  reschedulePatient(patient: PatientQueueDisplay): void {
    const dialogRef = this.dialog.open(AppointmentRescheduleComponent, {
      width: '60%',
      data: { 
        appointment: {
          appointment_id: patient.queueInfo.appointmentId,
          patient_id: patient.patientId,
          patientName: `${patient.firstName} ${patient.lastName}`,
          appointment_date_time: new Date().toISOString(), // Mock date
          notes: patient.queueInfo.reasonForVisit,
          status: 'SCHEDULED',
          doctor_id: patient.queueInfo.doctorId,
          slot_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(`Appointment rescheduled for ${patient.firstName} ${patient.lastName}`, 'OK', {
          duration: 3000
        });
        // Refresh queue data
        this.refreshQueue();
      }
    });
  }

  addNotes(patient: PatientQueueDisplay): void {
    const dialogRef = this.dialog.open(NotesDialogComponent, {
      width: '500px',
      data: {
        title: 'Add Notes',
        message: `Add notes for ${patient.firstName} ${patient.lastName}`,
        defaultValue: patient.queueInfo.notes || '',
        placeholder: 'Enter medical notes, observations, or instructions...'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== patient.queueInfo.notes) {
        this.patientQueueService.updatePatientNotes(patient.patientId, result);
        this.snackBar.open('Notes updated successfully', 'OK', {
          duration: 2000
        });
      }
    });
  }

  viewPatientDetails(patient: PatientQueueDisplay): void {
    this.navigateToPatientProfile(patient);
  }

  closePatientDetails(): void {
    this.showPatientDetails = false;
    this.selectedPatient = null;
  }

  private navigateToPatientProfile(patient: PatientQueueDisplay): void {
    this.router.navigate(['/patient', patient.patientId], {
      queryParams: { 
        patientId: patient.patientId,
        patientName: `${patient.firstName} ${patient.lastName}`,
        queueId: patient.queueInfo.queueId,
        fromQueue: 'true'
      }
    });
  }

  /**
   * Calculate delay time for a patient
   */
  getDelayTime(patient: PatientQueueDisplay): number {
    if (!patient.queueInfo.appointmentTime) {
      return 0;
    }

    const appointmentTime = new Date(patient.queueInfo.appointmentTime);
    const currentTime = new Date();
    
    // If current time is past appointment time, calculate delay
    if (currentTime > appointmentTime) {
      const delayMs = currentTime.getTime() - appointmentTime.getTime();
      return Math.floor(delayMs / (1000 * 60)); // Convert to minutes
    }
    
    return 0;
  }

  /**
   * Update delay times for all patients in real-time
   */
  private updateDelayTimes(): void {
    this.patientQueue.forEach(patient => {
      const delayTime = this.getDelayTime(patient);
      patient.queueInfo.delayTime = delayTime;
    });
  }

  /**
   * Start the delay update timer
   */
  private startDelayUpdate(): void {
    // Update delay times every minute
    this.delayUpdateInterval = setInterval(() => {
      this.updateDelayTimes();
    }, 60000); // 60 seconds
  }

  // Filtering and Sorting
  get filteredQueue(): PatientQueueDisplay[] {
    let filtered = this.patientQueue;

    // Filter by status
    if (this.filterStatus !== 'ALL') {
      filtered = filtered.filter(p => p.queueInfo.status === this.filterStatus);
    }

    // Filter by search term
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.firstName.toLowerCase().includes(search) ||
        p.lastName.toLowerCase().includes(search) ||
        p.queueInfo.reasonForVisit?.toLowerCase().includes(search)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'queuePosition':
          return a.queueInfo.queuePosition - b.queueInfo.queuePosition;
        case 'priority': {
          const priorityOrder: Record<string, number> = { 'EMERGENCY': 4, 'HIGH': 3, 'NORMAL': 2, 'LOW': 1 };
          return priorityOrder[b.queueInfo.priority] - priorityOrder[a.queueInfo.priority];
        }
        case 'waitTime':
          return b.queueInfo.waitTime - a.queueInfo.waitTime;
        case 'checkInTime':
          return a.queueInfo.checkInTime.localeCompare(b.queueInfo.checkInTime);
        default:
          return 0;
      }
    });

    return filtered;
  }

  // Priority color mapping
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'EMERGENCY': return '#dc2626';
      case 'HIGH': return '#ea580c';
      case 'NORMAL': return '#2563eb';
      case 'LOW': return '#059669';
      default: return '#6b7280';
    }
  }

  // Status color mapping
  getStatusColor(status: string): string {
    switch (status) {
      case 'IN_PROGRESS': return '#2563eb';
      case 'WAITING': return '#d97706';
      case 'COMPLETED': return '#059669';
      case 'NO_SHOW': return '#dc2626';
      case 'CANCELLED': return '#6b7280';
      default: return '#6b7280';
    }
  }

  // Manual refresh
  manualRefresh(): void {
    this.refreshQueue();
  }

  // Export queue data
  exportQueue(): void {
    const exportData = this.patientQueueService.exportQueueData();
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-queue-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.snackBar.open('Queue data exported successfully', 'OK', {
      duration: 2000
    });
  }

  // Utility methods
  getAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  getPatientPhoto(patient: PatientQueueDisplay): string {
    if (patient.profilePhoto && patient.profilePhoto.trim() !== '') {
      return patient.profilePhoto;
    }
    return 'assets/avatars/default-avatar.jpg';
  }

  getPatientInitials(patient: PatientQueueDisplay): string {
    const firstName = patient.firstName?.charAt(0) || '';
    const lastName = patient.lastName?.charAt(0) || '';
    return (firstName + lastName).toUpperCase();
  }

  getProfileIcon(patient: PatientQueueDisplay): string {
    if (patient.gender?.toLowerCase() === 'female') {
      return 'face_woman';
    } else if (patient.gender?.toLowerCase() === 'male') {
      return 'face_man';
    }
    return 'person';
  }

  hasValidPhoto(patient: PatientQueueDisplay): boolean {
    return !!(patient.profilePhoto && patient.profilePhoto.trim() !== '');
  }

  onImageError(event: any): void {
    // If image fails to load, hide the image container and show fallback
    const target = event.target as HTMLImageElement;
    const container = target.closest('.avatar-container, .avatar-container-large') as HTMLElement;
    if (container) {
      container.style.display = 'none';
    }
  }

  trackByPatientId(index: number, patient: PatientQueueDisplay): number {
    return patient.patientId;
  }

  // Drag & Drop reordering
  drop(event: CdkDragDrop<PatientQueueDisplay[]>): void {
    // Only allow reordering when not filtered to avoid ambiguity
    if (this.filterStatus !== 'ALL' || this.searchTerm) {
      this.snackBar.open('Clear filters to reorder the full queue', 'OK', { duration: 2000 });
      return;
    }

    moveItemInArray(this.patientQueue, event.previousIndex, event.currentIndex);

    // Recompute positions sequentially
    const reordered = this.patientQueue.map((p, idx) => ({
      ...p,
      queueInfo: { ...p.queueInfo, queuePosition: idx + 1 }
    }));
    this.patientQueueService.reorderQueue(reordered);
  }

  // Wait time severity class
  getWaitBadgeClass(waitMinutes: number): string {
    if (waitMinutes >= 30) return 'critical';
    if (waitMinutes >= 20) return 'high';
    if (waitMinutes >= 10) return 'medium';
    return 'low';
  }
}
