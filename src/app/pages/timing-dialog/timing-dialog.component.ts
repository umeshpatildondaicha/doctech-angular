import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { AppInputComponent } from '../../tools/app-input/app-input.component';
import { AppSelectboxComponent } from '../../tools/app-selectbox/app-selectbox.component';
import { DatePickerComponent } from '../../tools/date-picker/date-picker.component';
import { IconComponent } from '../../tools/app-icon/icon.component';

export interface TimingDialogData {
  mode: 'create' | 'edit' | 'view';
  timing?: any;
}

export interface Break {
  reason: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-timing-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppButtonComponent,
    AppInputComponent,
    AppSelectboxComponent,
    DatePickerComponent,
    IconComponent
  ],
  templateUrl: './timing-dialog.component.html',
  styleUrl: './timing-dialog.component.scss'
})
export class TimingDialogComponent implements OnInit {
  timingForm!: FormGroup;
  isViewMode: boolean;
  submitButtonText: string;
  advancedOptionsExpanded = true;

  // Options for dropdowns
  timeForOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'specific_day', label: 'Specific Day' },
    { value: 'leave', label: 'Leave' }
  ];

  dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  priorityOptions = [
    { value: 'emergency', label: 'Emergency' },
    { value: 'normal', label: 'Normal' },
    { value: 'low', label: 'Low Priority' }
  ];

  timingData: any={
    timeFor: 'daily',
    selectedDays: [],
    selectedDate: null,
    startTime: '10:00',
    endTime: '18:00',
    appointmentDuration: 20,
    bufferTime: 90,
  };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TimingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TimingDialogData
  ) {
    this.isViewMode = data.mode === 'view';
    this.submitButtonText = this.getSubmitButtonText();
    this.initForm();
    if (this.isViewMode) {
      this.timingForm.disable();
    }
  }

  ngOnInit() {
    if (this.data.timing) {
      this.patchFormValues();
    }
  }

  private initForm() {
    this.timingForm = this.fb.group({
      timeFor: ['daily', Validators.required],
      selectedDays: [[]],
      selectedDate: [null],
      startTime: ['10:00', Validators.required],
      endTime: ['18:00', Validators.required],
      appointmentDuration: [20, Validators.required],
      breaks: this.fb.array([]),
      bufferTime: [90, Validators.required],
      maxAppointmentsPerSlot: [1, Validators.required],
      slotPrioritization: ['emergency', Validators.required],
      reason: ['']
    });

    // Add initial break
    this.addBreak();

    // Listen to timeFor changes
    this.timingForm.get('timeFor')?.valueChanges.subscribe(value => {
      this.onTimeForChange(value);
    });
  }

  private onTimeForChange(timeFor: string) {
    // Reset related fields when timeFor changes
    this.timingForm.patchValue({
      selectedDays: [],
      selectedDate: null,
      reason: ''
    });

    // Update validators based on selection
    const selectedDaysControl = this.timingForm.get('selectedDays');
    const selectedDateControl = this.timingForm.get('selectedDate');
    const reasonControl = this.timingForm.get('reason');

    // Remove all validators first
    selectedDaysControl?.clearValidators();
    selectedDateControl?.clearValidators();
    reasonControl?.clearValidators();

    // Add validators based on selection
    switch (timeFor) {
      case 'weekly':
        selectedDaysControl?.setValidators([Validators.required]);
        break;
      case 'specific_day':
        selectedDateControl?.setValidators([Validators.required]);
        break;
      case 'leave':
        reasonControl?.setValidators([Validators.required]);
        break;
    }

    // Update validators
    selectedDaysControl?.updateValueAndValidity();
    selectedDateControl?.updateValueAndValidity();
    reasonControl?.updateValueAndValidity();
  }

  private patchFormValues() {
    if (this.data.timing) {
      this.timingForm.patchValue({
        timeFor: this.data.timing.timeFor || 'daily',
        selectedDays: this.data.timing.selectedDays || [],
        selectedDate: this.data.timing.selectedDate,
        startTime: this.data.timing.startTime || '10:00',
        endTime: this.data.timing.endTime || '18:00',
        appointmentDuration: this.data.timing.appointmentDuration || 20,
        bufferTime: this.data.timing.bufferTime || 90,
        maxAppointmentsPerSlot: this.data.timing.maxAppointmentsPerSlot || 1,
        slotPrioritization: this.data.timing.slotPrioritization || 'emergency'
      });

      // Patch breaks
      if (this.data.timing.breaks && this.data.timing.breaks.length > 0) {
        this.breaks.clear();
        this.data.timing.breaks.forEach((breakItem: Break) => {
          this.breaks.push(this.fb.group({
            reason: [breakItem.reason, Validators.required],
            startTime: [breakItem.startTime, Validators.required],
            endTime: [breakItem.endTime, Validators.required]
          }));
        });
      }
    }
  }

  private getSubmitButtonText(): string {
    switch (this.data.mode) {
      case 'create':
        return 'Create Timing';
      case 'edit':
        return 'Update Timing';
      case 'view':
        return 'Close';
      default:
        return 'Submit';
    }
  }

  get breaks(): FormArray {
    return this.timingForm.get('breaks') as FormArray;
  }

  addBreak() {
    const breakGroup = this.fb.group({
      reason: ['Lunch Break', Validators.required],
      startTime: ['13:00', Validators.required],
      endTime: ['14:00', Validators.required]
    });
    this.breaks.push(breakGroup);
  }

  removeBreak(index: number) {
    if (this.breaks.length > 1) {
      this.breaks.removeAt(index);
    }
  }

  getAppointmentTimeRange(): string {
    const startTime = this.timingForm.get('startTime')?.value;
    const endTime = this.timingForm.get('endTime')?.value;
    
    if (startTime && endTime) {
      const startFormatted = this.formatTime(startTime);
      const endFormatted = this.formatTime(endTime);
      return `${startFormatted} - ${endFormatted}`;
    }
    return '';
  }

  private formatTime(time: string): string {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  onSubmit() {
    if (this.timingForm.valid && !this.isViewMode) {
      const formValue = this.timingForm.value;
      
      // Format the data
      const timingData = {
        ...formValue,
        appointmentTimeRange: this.getAppointmentTimeRange(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      this.dialogRef.close(timingData);
    } else if (this.isViewMode) {
      this.onCancel();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  getTimeForLabel(): string {
    const timeFor = this.timingForm.get('timeFor')?.value;
    const option = this.timeForOptions.find(opt => opt.value === timeFor);
    return option ? option.label : 'Daily';
  }


  toggleAdvancedOptions() {
    this.advancedOptionsExpanded = !this.advancedOptionsExpanded;
  }
} 