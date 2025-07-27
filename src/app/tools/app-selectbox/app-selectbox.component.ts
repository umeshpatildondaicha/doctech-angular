import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-selectbox',
  standalone: true,
  imports: [CommonModule, MatSelectModule, FormsModule, MatFormFieldModule, MatOptionModule, ReactiveFormsModule],
  templateUrl: './app-selectbox.component.html',
  styleUrl: './app-selectbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppSelectboxComponent),
      multi: true
    }
  ]
})
export class AppSelectboxComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() displayExpr: string = '';
  @Input() valueField: string = '';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() formControlName: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  formControl: FormControl = new FormControl('');
  control: FormControl = new FormControl('');
  @Input() data: any;
  @Output() dataChange = new EventEmitter<any>();

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor() {
    this.formGroup.addControl(this.formControlName, this.formControl);
  }

  onSelectionChange(value: any) {
    this.data = value;
    this.dataChange.emit(this.data);
    this.onChange(value);
    this.onTouched();
  }

  getDisplay(option: any): string {
    return this.displayExpr ? option?.[this.displayExpr] : option;
  }

  getValue(option: any): any {
    return this.valueField ? option?.[this.valueField] : option;
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.data = value;
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
}
