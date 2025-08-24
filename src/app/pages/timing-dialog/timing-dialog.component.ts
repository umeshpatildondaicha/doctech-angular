import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
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
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
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

  // New scheduling type options
  schedulingTypeOptions = [
    { value: 'slots', label: 'Fixed Time Slots', description: 'Predefined time slots with specific durations' },
    { value: 'flexible', label: 'Flexible Time', description: 'First come, first served with max appointments per day' }
  ];

  timingData: any = {
    timeFor: 'daily',
    selectedDays: [],
    selectedDate: null,
    startTime: '10:00',
    endTime: '18:00',
    bufferTime: 90,
    schedulingType: 'slots', // New field
    maxAppointmentsPerDay: 20, // New field for flexible scheduling
    slotDuration: 30, // New field for slot-based scheduling
    maxAppointmentsPerSlot: 1, // New field for slot-based scheduling
  };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TimingDialogComponent>,
    private cdr: ChangeDetectorRef,
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

  // Getter methods for template
  get isSlotBasedScheduling(): boolean {
    return this.timingForm.get('schedulingType')?.value === 'slots';
  }

  get isFlexibleScheduling(): boolean {
    return this.timingForm.get('schedulingType')?.value === 'flexible';
  }

  get currentSchedulingType(): string {
    return this.timingForm.get('schedulingType')?.value || 'slots';
  }

  private initForm() {
    this.timingForm = this.fb.group({
      timeFor: ['daily', Validators.required],
      selectedDays: [[]],
      selectedDate: [null],
      startTime: ['10:00', Validators.required],
      endTime: ['18:00', Validators.required],
      breaks: this.fb.array([]),
      bufferTime: [90, Validators.required],
      slotPrioritization: ['emergency', Validators.required],
      reason: [''],
      // New fields for enhanced scheduling
      schedulingType: ['slots', Validators.required],
      maxAppointmentsPerDay: [20, [Validators.required, Validators.min(1), Validators.max(100)]],
      slotDuration: [30, [Validators.required, Validators.min(15), Validators.max(120)]],
      maxAppointmentsPerSlot: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });

    // Add initial break
    this.addBreak();

    // Initialize timingData with form values
    this.timingData = { ...this.timingData, ...this.timingForm.value };

    // Initial validation
    setTimeout(() => {
      this.validateBreakTimes();
    }, 200);

    // Listen to timeFor changes
    this.timingForm.get('timeFor')?.valueChanges.subscribe(value => {
      this.timingData.timeFor = value;
      this.onTimeForChange(value);
      this.cdr.detectChanges();
    });

    // Listen to schedulingType changes
    this.timingForm.get('schedulingType')?.valueChanges.subscribe(value => {
      this.timingData.schedulingType = value; // Update timingData
      this.onSchedulingTypeChange(value);
      this.cdr.detectChanges(); // Force change detection
    });

    // Listen to all form value changes to keep timingData in sync
    this.timingForm.valueChanges.subscribe(value => {
      this.timingData = { ...this.timingData, ...value };
      this.cdr.detectChanges();
    });

    // Listen to slot duration and max appointments per slot changes for calculations
    this.timingForm.get('slotDuration')?.valueChanges.subscribe(() => {
      this.updateCalculations();
    });

    this.timingForm.get('maxAppointmentsPerSlot')?.valueChanges.subscribe(() => {
      this.updateCalculations();
    });

    // Listen to working hours changes for break validation
    this.timingForm.get('startTime')?.valueChanges.subscribe(() => {
      this.validateBreakTimes();
    });

    this.timingForm.get('endTime')?.valueChanges.subscribe(() => {
      this.validateBreakTimes();
    });

    // Listen to breaks array changes for validation
    this.breaks.valueChanges.subscribe(() => {
      this.validateBreakTimes();
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

  private onSchedulingTypeChange(schedulingType: string) {
    const maxAppointmentsPerDayControl = this.timingForm.get('maxAppointmentsPerDay');
    const slotDurationControl = this.timingForm.get('slotDuration');
    const maxAppointmentsPerSlotControl = this.timingForm.get('maxAppointmentsPerSlot');

    if (schedulingType === 'flexible') {
      // For flexible scheduling, focus on max appointments per day
      maxAppointmentsPerDayControl?.setValidators([Validators.required, Validators.min(1), Validators.max(100)]);
      slotDurationControl?.clearValidators();
      maxAppointmentsPerSlotControl?.clearValidators();
    } else {
      // For slot-based scheduling, focus on slot duration and max per slot
      maxAppointmentsPerDayControl?.clearValidators();
      slotDurationControl?.setValidators([Validators.required, Validators.min(15), Validators.max(120)]);
      maxAppointmentsPerSlotControl?.setValidators([Validators.required, Validators.min(1), Validators.max(10)]);
    }

    // Update validators
    maxAppointmentsPerDayControl?.updateValueAndValidity();
    slotDurationControl?.updateValueAndValidity();
    maxAppointmentsPerSlotControl?.updateValueAndValidity();

    // Update calculations
    this.updateCalculations();
  }

  private updateCalculations() {
    // This will trigger template updates for calculations
    setTimeout(() => {
      this.timingForm.updateValueAndValidity();
      this.cdr.detectChanges();
    }, 0);
  }

  // Validate working hours
  private validateWorkingHours(): boolean {
    const startTime = this.timingForm.get('startTime')?.value;
    const endTime = this.timingForm.get('endTime')?.value;
    
    if (!startTime || !endTime) {
      return false;
    }

    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);
    
    // Check if end time is after start time
    if (endMinutes <= startMinutes) {
      this.timingForm.get('endTime')?.setErrors({ invalidTimeRange: true });
      return false;
    }
    
    // Clear any existing errors
    this.timingForm.get('endTime')?.setErrors(null);
    return true;
  }

  // Validate break times
  private validateBreakTimes() {
    if (!this.validateWorkingHours()) {
      return;
    }

    const workingStartMinutes = this.timeToMinutes(this.timingForm.get('startTime')?.value);
    const workingEndMinutes = this.timeToMinutes(this.timingForm.get('endTime')?.value);
    
    this.breaks.controls.forEach((breakControl, index) => {
      const breakStartTime = breakControl.get('startTime')?.value;
      const breakEndTime = breakControl.get('endTime')?.value;
      
      if (!breakStartTime || !breakEndTime) {
        breakControl.setErrors(null);
        return;
      }

      const breakStartMinutes = this.timeToMinutes(breakStartTime);
      const breakEndMinutes = this.timeToMinutes(breakEndTime);
      
      let hasError = false;
      const errors: any = {};

      // Check if break start time is within working hours
      if (breakStartMinutes < workingStartMinutes) {
        errors.breakStartBeforeWork = true;
        hasError = true;
      }

      // Check if break end time is within working hours
      if (breakEndMinutes > workingEndMinutes) {
        errors.breakEndAfterWork = true;
        hasError = true;
      }

      // Check if break end time is after break start time
      if (breakEndMinutes <= breakStartMinutes) {
        errors.invalidBreakTimeRange = true;
        hasError = true;
      }

      // Check for overlapping breaks
      let hasOverlap = false;
      this.breaks.controls.forEach((otherBreakControl, otherIndex) => {
        if (index === otherIndex) return;
        
        const otherBreakStartTime = otherBreakControl.get('startTime')?.value;
        const otherBreakEndTime = otherBreakControl.get('endTime')?.value;
        
        if (!otherBreakStartTime || !otherBreakEndTime) return;
        
        const otherBreakStartMinutes = this.timeToMinutes(otherBreakStartTime);
        const otherBreakEndMinutes = this.timeToMinutes(otherBreakEndTime);
        
        // Check for overlap: if one break starts before another ends AND ends after another starts
        if (breakStartMinutes < otherBreakEndMinutes && breakEndMinutes > otherBreakStartMinutes) {
          hasOverlap = true;
        }
      });

      if (hasOverlap) {
        errors.breakOverlap = true;
        hasError = true;
      }

      if (hasError) {
        breakControl.setErrors(errors);
      } else {
        breakControl.setErrors(null);
      }
    });
  }

  // Get validation error messages
  getBreakValidationErrors(breakIndex: number): string[] {
    const breakControl = this.breaks.at(breakIndex);
    const errors = breakControl.errors;
    const errorMessages: string[] = [];

    if (errors) {
      if (errors['breakStartBeforeWork']) {
        errorMessages.push('Break start time cannot be before working hours');
      }
      if (errors['breakEndAfterWork']) {
        errorMessages.push('Break end time cannot be after working hours');
      }
      if (errors['invalidBreakTimeRange']) {
        errorMessages.push('Break end time must be after break start time');
      }
      if (errors['breakOverlap']) {
        errorMessages.push('Break time overlaps with another break');
      }
    }

    return errorMessages;
  }

  // Get working hours validation error
  getWorkingHoursValidationError(): string | null {
    const endTimeControl = this.timingForm.get('endTime');
    if (endTimeControl?.errors?.['invalidTimeRange']) {
      return 'End time must be after start time';
    }
    return null;
  }

  private patchFormValues() {
    if (this.data.timing) {
      const formValues = {
        timeFor: this.data.timing.timeFor || 'daily',
        selectedDays: this.data.timing.selectedDays || [],
        selectedDate: this.data.timing.selectedDate,
        startTime: this.data.timing.startTime || '10:00',
        endTime: this.data.timing.endTime || '18:00',
        bufferTime: this.data.timing.bufferTime || 90,
        slotPrioritization: this.data.timing.slotPrioritization || 'emergency',
        schedulingType: this.data.timing.schedulingType || 'slots',
        maxAppointmentsPerDay: this.data.timing.maxAppointmentsPerDay || 20,
        slotDuration: this.data.timing.slotDuration || 30,
        maxAppointmentsPerSlot: this.data.timing.maxAppointmentsPerSlot || 1
      };
      
      this.timingForm.patchValue(formValues);
      this.timingData = { ...this.timingData, ...formValues };

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
    // Calculate a reasonable default break time within working hours
    const startTime = this.timingForm.get('startTime')?.value || '09:00';
    const endTime = this.timingForm.get('endTime')?.value || '17:00';
    
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);
    const totalMinutes = endMinutes - startMinutes;
    
    // Default break: 1 hour in the middle of the day
    const breakStartMinutes = startMinutes + Math.floor(totalMinutes * 0.4);
    const breakEndMinutes = breakStartMinutes + 60; // 1 hour break
    
    const breakStartTime = this.minutesToTime(breakStartMinutes);
    const breakEndTime = this.minutesToTime(breakEndMinutes);
    
    const breakGroup = this.fb.group({
      reason: ['Break', Validators.required],
      startTime: [breakStartTime, Validators.required],
      endTime: [breakEndTime, Validators.required]
    });
    this.breaks.push(breakGroup);
    
    // Validate break times after adding
    setTimeout(() => {
      this.validateBreakTimes();
    }, 100);
  }

  removeBreak(index: number) {
    if (this.breaks.length > 1) {
      this.breaks.removeAt(index);
      
      // Validate break times after removing
      setTimeout(() => {
        this.validateBreakTimes();
      }, 100);
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

  // New method to calculate available slots for slot-based scheduling
  calculateAvailableSlots(): number {
    const startTime = this.timingForm.get('startTime')?.value;
    const endTime = this.timingForm.get('endTime')?.value;
    const slotDuration = this.timingForm.get('slotDuration')?.value;
    
    if (startTime && endTime && slotDuration) {
      const startMinutes = this.timeToMinutes(startTime);
      const endMinutes = this.timeToMinutes(endTime);
      const totalMinutes = endMinutes - startMinutes;
      
      // Subtract break times
      let breakMinutes = 0;
      this.breaks.controls.forEach(breakControl => {
        const breakStart = this.timeToMinutes(breakControl.get('startTime')?.value);
        const breakEnd = this.timeToMinutes(breakControl.get('endTime')?.value);
        breakMinutes += (breakEnd - breakStart);
      });
      
      const availableMinutes = totalMinutes - breakMinutes;
      return Math.floor(availableMinutes / slotDuration);
    }
    return 0;
  }

  // New method to calculate total appointments for slot-based scheduling
  calculateTotalAppointments(): number {
    const availableSlots = this.calculateAvailableSlots();
    const maxAppointmentsPerSlot = this.timingForm.get('maxAppointmentsPerSlot')?.value || 1;
    return availableSlots * maxAppointmentsPerSlot;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
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
        availableSlots: this.calculateAvailableSlots(),
        totalAppointments: this.calculateTotalAppointments(),
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

  getSchedulingTypeLabel(): string {
    const schedulingType = this.timingForm.get('schedulingType')?.value;
    const option = this.schedulingTypeOptions.find(opt => opt.value === schedulingType);
    return option ? option.label : 'Fixed Time Slots';
  }

  getSchedulingTypeDescription(): string {
    const schedulingType = this.timingForm.get('schedulingType')?.value;
    const option = this.schedulingTypeOptions.find(opt => opt.value === schedulingType);
    return option ? option.description : '';
  }

  toggleAdvancedOptions() {
    this.advancedOptionsExpanded = !this.advancedOptionsExpanded;
  }

  // Helper method to check if form is valid for current scheduling type
  isFormValidForSchedulingType(): boolean {
    const schedulingType = this.timingData.schedulingType;
    
    if (schedulingType === 'flexible') {
      return this.timingForm.get('maxAppointmentsPerDay')?.valid || false;
    } else {
      return (this.timingForm.get('slotDuration')?.valid || false) && (this.timingForm.get('maxAppointmentsPerSlot')?.valid || false);
    }
  }

  // Public method to manually trigger validation (for testing)
  triggerValidation() {
    this.validateBreakTimes();
  }
} 