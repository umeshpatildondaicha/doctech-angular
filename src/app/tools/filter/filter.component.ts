import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSelectboxComponent } from '../app-selectbox/app-selectbox.component';
import { AppButtonComponent } from '../app-button/app-button.component';
import { AppInputComponent } from '../app-input/app-input.component';

interface Filter {
  field: string;
  operator: string;
  value: string;
  inputType: 'select' | 'input';
}

interface FieldOption {
  label: string;
  value: string;
  inputType: 'select' | 'input';
}

interface OperatorOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, AppSelectboxComponent, AppButtonComponent, AppInputComponent],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  fields: FieldOption[] = [];
  operators: OperatorOption[] = [];
  valuesMap: { [key: string]: string[] } = {};

  filters: Filter[] = [];
  logic: 'AND' | 'OR' = 'AND';

  constructor(@Inject('dialogData') public data: any) {
    if (data) {
      this.fields = data.fields || [];
      this.operators = data.operators || [];
      this.valuesMap = data.valuesMap || {};
      // Optionally, set initial filters if provided
      if (data.filters) {
        this.filters = data.filters;
      } else if (this.fields.length) {
        this.filters = [{ field: this.fields[0].value, operator: this.operators[0]?.value || '', value: '', inputType: this.fields[0].inputType }];
      }
    }
  }

  getValues(field: string): string[] {
    return this.valuesMap[field] || [];
  }

  getInputType(field: string): 'select' | 'input' {
    return this.fields.find(f => f.value === field)?.inputType || 'input';
  }

  addFilter() {
    const firstField = this.fields[0];
    this.filters.push({ field: firstField.value, operator: this.operators[0]?.value || '', value: '', inputType: firstField.inputType });
  }

  removeFilter(idx: number) {
    this.filters.splice(idx, 1);
  }

  setLogic(logic: 'AND' | 'OR') {
    this.logic = logic;
  }

  reset() {
    const firstField = this.fields[0];
    this.filters = [{ field: firstField.value, operator: this.operators[0]?.value || '', value: '', inputType: firstField.inputType }];
    this.logic = 'AND';
  }

  onFieldChange(filter: Filter) {
    filter.inputType = this.getInputType(filter.field);
    filter.value = '';
  }

  apply() {
    // Emit or handle filter logic here
    // e.g., this.dialogRef.close({ filters: this.filters, logic: this.logic });
  }
} 