import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = 'Select date';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() startView: 'month' | 'year' | 'multi-year' = 'month';

  value: Date | null = null;
  touched = false;

  // ControlValueAccessor methods
  onChange = (value: Date | null) => {};
  onTouched = () => {};

  ngOnInit() {
    // Convert string inputs to Date objects if needed
    if (this.minDate && typeof this.minDate === 'string') {
      this.minDate = new Date(this.minDate);
    }
    if (this.maxDate && typeof this.maxDate === 'string') {
      this.maxDate = new Date(this.maxDate);
    }
  }

  writeValue(value: Date | null): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDateChange(date: Date | null): void {
    this.value = date;
    this.onChange(date);
    this.markAsTouched();
  }

  onDateInput(event: any): void {
    const date = event.target.value ? new Date(event.target.value) : null;
    this.onDateChange(date);
  }

  markAsTouched(): void {
    if (!this.touched) {
      this.touched = true;
      this.onTouched();
    }
  }
} 