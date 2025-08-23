import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererParams } from 'ag-grid-community';

interface StatusCellParams extends ICellRendererParams {
  statusField?: string;
  statusMapping?: { [key: string]: string };
}

@Component({
  selector: 'app-status-cell-renderer',
  template: `
    <span [class]="statusClass">
      {{ displayValue }}
    </span>
  `,
  standalone: true,
  imports: [CommonModule],
  styles: []
})
export class StatusCellRendererComponent {
  statusClass: string = 'status-chip status-neutral';
  displayValue: string = '';

  agInit(params: StatusCellParams): void {
    const value = params.value || '';
    const field = params.statusField || params.colDef?.field;
    const mapping = params.statusMapping || this.getDefaultMapping(field);
    
    this.displayValue = value.toString();
    this.statusClass = `status-chip ${mapping[value.toLowerCase()] || 'status-neutral'}`;
  }

  private getDefaultMapping(field?: string): { [key: string]: string } {
    // Default mappings based on field name or common patterns
    if (field?.toLowerCase().includes('availability') || field?.toLowerCase().includes('available')) {
      return {
        'available': 'status-available',
        'unavailable': 'status-unavailable',
        'busy': 'status-busy',
        'offline': 'status-offline',
        'online': 'status-available',
        'active': 'status-available',
        'inactive': 'status-offline'
      };
    }

    // General status mapping
    return {
      'active': 'status-success',
      'inactive': 'status-neutral',
      'pending': 'status-warning',
      'approved': 'status-success',
      'rejected': 'status-danger',
      'cancelled': 'status-danger',
      'completed': 'status-success',
      'in progress': 'status-info',
      'draft': 'status-neutral',
      'published': 'status-success',
      'archived': 'status-neutral',
      'enabled': 'status-success',
      'disabled': 'status-neutral',
      'online': 'status-success',
      'offline': 'status-neutral',
      'available': 'status-available',
      'unavailable': 'status-unavailable',
      'busy': 'status-busy'
    };
  }
}
