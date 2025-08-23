import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSelectboxComponent } from '../app-selectbox/app-selectbox.component';
import { AppButtonComponent } from '../app-button/app-button.component';
import { AppInputComponent } from '../app-input/app-input.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { trigger, style, transition, animate } from '@angular/animations';

interface Filter {
  field: string;
  operator: string;
  value: any;
  valueTo?: any;
  inputType: 'select' | 'input' | 'number' | 'date' | 'boolean';
}

interface FieldOption {
  label: string;
  value: string;
  inputType: 'select' | 'input' | 'number' | 'date' | 'boolean';
}

interface OperatorOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppSelectboxComponent,
    AppButtonComponent,
    AppInputComponent,
    DatePickerComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class FilterComponent {
  fields: FieldOption[] = [];
  operators: OperatorOption[] = [];
  operatorsMap: { [key: string]: OperatorOption[] } = {};
  valuesMap: { [key: string]: any[] } = {};

  // New state management for sidebar approach
  selectedField: string = '';
  selectedFieldObj: FieldOption | null = null;
  appliedFilters: { [field: string]: any } = {};
  showAdvanced: boolean = false;
  dataTitle: string = 'All Data';

  // Legacy support
  filters: Filter[] = [];
  logic: 'AND' | 'OR' = 'AND';

  constructor(
    @Inject('dialogData') public data: any,
    private readonly dialogRef: MatDialogRef<any>
  ) {
    if (data) {
      this.fields = data.fields || [];
      this.operators = data.operators || [];
      this.operatorsMap = data.operatorsMap || {};
      this.valuesMap = data.valuesMap || {};
      this.dataTitle = data.title || 'All Data';
      
      // Initialize with first field if available
      if (this.fields.length > 0 && !this.selectedField) {
        this.selectField(this.fields[0]);
      }

      // Convert legacy filters if provided
      if (data.filters && data.filters.length > 0) {
        this.convertLegacyFilters(data.filters);
      }
    }
  }

  // Field Selection
  selectField(field: FieldOption) {
    this.selectedField = field.value;
    this.selectedFieldObj = field;
  }

  // Get field-specific values
  getValues(field: string): any[] {
    return this.valuesMap[field] || [];
  }

  // Get field icon based on input type
  getFieldIcon(inputType: string): string {
    switch (inputType) {
      case 'select': return '📋';
      case 'boolean': return '☑️';
      case 'date': return '📅';
      case 'number': return '🔢';
      case 'input':
      default: return '📝';
    }
  }

  // Get field description
  getFieldDescription(field: FieldOption): string {
    switch (field.inputType) {
      case 'select': return `Select one or more ${field.label.toLowerCase()} options`;
      case 'boolean': return `Choose true or false for ${field.label.toLowerCase()}`;
      case 'date': return `Set date range for ${field.label.toLowerCase()}`;
      case 'number': return `Set numeric range for ${field.label.toLowerCase()}`;
      case 'input':
      default: return `Enter text to search in ${field.label.toLowerCase()}`;
    }
  }

  // Option Selection for Select fields
  isOptionSelected(field: string, option: any): boolean {
    const fieldFilters = this.appliedFilters[field];
    if (!fieldFilters || !fieldFilters.values) return false;
    return fieldFilters.values.includes(option);
  }

  toggleOption(field: string, option: any) {
    if (!this.appliedFilters[field]) {
      this.appliedFilters[field] = { type: 'select', values: [] };
    }
    
    const values = this.appliedFilters[field]?.values || [];
    const index = values.indexOf(option);
    
    if (index > -1) {
      values.splice(index, 1);
      if (values.length === 0) {
        delete this.appliedFilters[field];
      }
    } else {
      values.push(option);
    }
  }

  // Boolean Selection
  isBooleanSelected(field: string, value: boolean): boolean {
    const fieldFilter = this.appliedFilters[field];
    return fieldFilter && fieldFilter.value === value;
  }

  setBooleanValue(field: string, value: boolean) {
    if (this.isBooleanSelected(field, value)) {
      delete this.appliedFilters[field];
    } else {
      this.appliedFilters[field] = { type: 'boolean', value };
    }
  }

  // Range Values (Number/Date)
  getRangeValue(field: string, type: 'min' | 'max'): any {
    const fieldFilter = this.appliedFilters[field];
    if (!fieldFilter || fieldFilter.type !== 'range') return '';
    return fieldFilter[type] || '';
  }

  setRangeMinValue(field: string, event: any) {
    this.setRangeValueInternal(field, 'min', event.target.value);
  }

  setRangeMaxValue(field: string, event: any) {
    this.setRangeValueInternal(field, 'max', event.target.value);
  }

  private setRangeValueInternal(field: string, type: 'min' | 'max', value: any) {
    if (!this.appliedFilters[field]) {
      this.appliedFilters[field] = { type: 'range' };
    }
    
    this.appliedFilters[field][type] = value;
    
    // Remove if both min and max are empty
    if (!this.appliedFilters[field].min && !this.appliedFilters[field].max) {
      delete this.appliedFilters[field];
    }
  }

  // Text Values
  getTextValue(field: string): string {
    const fieldFilter = this.appliedFilters[field];
    return fieldFilter && fieldFilter.type === 'text' ? fieldFilter.value : '';
  }

  setTextValue(field: string, event: any) {
    const value = event.target.value;
    
    if (!value.trim()) {
      delete this.appliedFilters[field];
    } else {
      this.appliedFilters[field] = { type: 'text', value };
    }
  }

  // Get filters for a specific field
  getFieldFilters(field: string): any[] {
    const fieldFilter = this.appliedFilters[field];
    if (!fieldFilter) return [];
    
    switch (fieldFilter.type) {
      case 'select':
        return fieldFilter.values || [];
      case 'boolean':
        return [fieldFilter.value];
      case 'range':
        const parts = [];
        if (fieldFilter.min) parts.push(`≥ ${fieldFilter.min}`);
        if (fieldFilter.max) parts.push(`≤ ${fieldFilter.max}`);
        return parts;
      case 'text':
        return [fieldFilter.value];
      default:
        return [];
    }
  }

  // Remove field filter
  removeFieldFilter(field: string, filter: any) {
    const fieldFilter = this.appliedFilters[field];
    if (!fieldFilter) return;
    
    if (fieldFilter.type === 'select') {
      const index = fieldFilter.values.indexOf(filter);
      if (index > -1) {
        fieldFilter.values.splice(index, 1);
        if (fieldFilter.values.length === 0) {
          delete this.appliedFilters[field];
        }
      }
    } else {
      delete this.appliedFilters[field];
    }
  }

  // Get display text for filter
  getFilterDisplayText(filter: any): string {
    return String(filter);
  }

  // Get active filter fields
  getActiveFilterFields(): string[] {
    return Object.keys(this.appliedFilters);
  }

  // Get field label by field name
  getFieldLabel(fieldName: string): string {
    const field = this.fields.find(f => f.value === fieldName);
    return field ? field.label : fieldName;
  }

  // Clear all filters
  clearAllFilters() {
    this.appliedFilters = {};
  }

  // Count active filters
  getActiveFiltersCount(): number {
    return Object.keys(this.appliedFilters).length;
  }

  // Get data title
  getDataTitle(): string {
    return this.dataTitle;
  }

  // Advanced options
  hasAdvancedOptions(field: FieldOption): boolean {
    return field.inputType === 'input' || field.inputType === 'number';
  }

  toggleAdvanced() {
    this.showAdvanced = !this.showAdvanced;
  }

  // Filter summary
  getFilterSummary(): string {
    const count = this.getActiveFiltersCount();
    if (count === 0) return '';
    
    if (count === 1) {
      return '1 active filter';
    }
    
    return `${count} filters applied`;
  }

  // Estimated results (mock implementation)
  getEstimatedResults(): string {
    // This would be replaced with actual count logic
    const baseCount = 2240;
    const filterReduction = this.getActiveFiltersCount() * 0.3;
    const estimated = Math.floor(baseCount * (1 - filterReduction));
    return estimated.toLocaleString();
  }

  // Convert to legacy format for backward compatibility
  private convertToLegacyFilters(): Filter[] {
    const legacyFilters: Filter[] = [];
    
    Object.entries(this.appliedFilters).forEach(([field, filter]) => {
      const fieldObj = this.fields.find(f => f.value === field);
      if (!fieldObj) return;
      
      switch (filter.type) {
        case 'select':
          filter.values.forEach((value: any) => {
            legacyFilters.push({
              field,
              operator: 'eq',
              value,
              inputType: 'select'
            });
          });
          break;
        case 'boolean':
          legacyFilters.push({
            field,
            operator: 'eq',
            value: filter.value,
            inputType: 'boolean'
          });
          break;
        case 'range': {
          if (filter.min && filter.max) {
            legacyFilters.push({
              field,
              operator: 'between',
              value: filter.min,
              valueTo: filter.max,
              inputType: fieldObj.inputType
            });
          } else if (filter.min) {
            legacyFilters.push({
              field,
              operator: 'gte',
              value: filter.min,
              inputType: fieldObj.inputType
            });
          } else if (filter.max) {
            legacyFilters.push({
              field,
              operator: 'lte',
              value: filter.max,
              inputType: fieldObj.inputType
            });
          }
          break;
        }
        case 'text':
          legacyFilters.push({
            field,
            operator: 'contains',
            value: filter.value,
            inputType: 'input'
          });
          break;
      }
    });
    
    return legacyFilters;
  }

  // Convert legacy filters to new format
  private convertLegacyFilters(legacyFilters: Filter[]) {
    legacyFilters.forEach(filter => {
      const field = filter.field;
      
      switch (filter.inputType) {
        case 'select':
          if (!this.appliedFilters[field]) {
            this.appliedFilters[field] = { type: 'select', values: [] };
          }
          if (!this.appliedFilters[field].values.includes(filter.value)) {
            this.appliedFilters[field].values.push(filter.value);
          }
          break;
        case 'boolean':
          this.appliedFilters[field] = { type: 'boolean', value: filter.value };
          break;
        case 'number':
        case 'date':
          if (filter.operator === 'between') {
            this.appliedFilters[field] = { 
              type: 'range', 
              min: filter.value, 
              max: filter.valueTo 
            };
          } else if (filter.operator === 'gte' || filter.operator === 'gt') {
            if (!this.appliedFilters[field]) {
              this.appliedFilters[field] = { type: 'range' };
            }
            this.appliedFilters[field].min = filter.value;
          } else if (filter.operator === 'lte' || filter.operator === 'lt') {
            if (!this.appliedFilters[field]) {
              this.appliedFilters[field] = { type: 'range' };
            }
            this.appliedFilters[field].max = filter.value;
          }
          break;
        case 'input':
          this.appliedFilters[field] = { type: 'text', value: filter.value };
          break;
      }
    });
  }

  // Dialog actions
  cancel() {
    this.dialogRef.close();
  }

  apply() {
    const legacyFilters = this.convertToLegacyFilters();
    this.dialogRef.close({ 
      filters: legacyFilters, 
      logic: this.logic,
      appliedFilters: this.appliedFilters 
    });
  }

  // Legacy method support
  reset() {
    this.appliedFilters = {};
    this.selectedField = '';
    this.selectedFieldObj = null;
    if (this.fields.length > 0) {
      this.selectField(this.fields[0]);
    }
  }
} 