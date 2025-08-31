import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { MatFormFieldModule, MatFormFieldAppearance } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatAutocompleteModule, FormsModule, HttpClientModule],
  templateUrl: './app-input.component.html',
  styleUrl: './app-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInputComponent),
      multi: true
    }
  ]
})
export class AppInputComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() label: string = '';
  @Input() errorMessage: string = '';
  @Input() multiline: boolean = false;
  @Input() rows: number = 1;
  @Input() prefixIconName?: string;
  @Input() prefixIconSize: string = '24px';
  @Input() suffixIconName?: string;
  @Input() suffixIconSize: string = '24px';
  @Input() search: boolean = false;
  @Input() searchUrl: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() searchResults = new EventEmitter<any[]>();

  searchOptions: any[] = [];
  private searchSubject = new Subject<string>();

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private http: HttpClient) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchValue: string) => {
        if (this.search && this.searchUrl && searchValue) {
          const url = this.searchUrl.replace('${searchValue}', encodeURIComponent(searchValue));
          return this.http.get<any[]>(url);
        }
        return of([]);
      })
    ).subscribe(results => {
      this.searchOptions = results;
      this.searchResults.emit(results);
    });
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.valueChange.emit(input.value);
    this.onChange(input.value);
    this.onTouched();
    
    if (this.search) {
      this.searchSubject.next(input.value);
    }
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.value = value || '';
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

  // Handle form control value changes
  onFormControlChange(value: any): void {
    this.value = value;
    this.onChange(value);
  }
}
