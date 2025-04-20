import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableConfigService, Column } from '../../services/table-config.service';

@Component({
  selector: 'app-table-modifier',
  templateUrl: './table-modifier.component.html',
  styleUrls: ['./table-modifier.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TableModifierComponent implements OnInit {
  data: any[] = [];
  columns: Column[] = [];
  editingColumn: Column | null = null;
  editingName: string = '';
  isAddingNewColumn: boolean = false;
  newColumnKey: string = '';
  availableColumns: string[] = [
    'id',
    'name',
    'email',
    'phone',
    'address',
    'city',
    'state',
    'zipCode',
    'country',
    'company',
    'department',
    'position',
    'salary',
    'startDate',
    'status'
  ];

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    // Check if click is outside any edit-dropdown and new-column-dialog
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('.edit-dropdown') && 
        !clickedElement.closest('.edit-btn') && 
        !clickedElement.closest('.new-column-dialog') &&
        !clickedElement.closest('.add-column')) {
      this.editingColumn = null;
      this.isAddingNewColumn = false;
    }
  }

  constructor(
    private router: Router,
    private tableConfigService: TableConfigService
  ) { }

  ngOnInit(): void {
    this.tableConfigService.getTableData().subscribe(data => {
      this.data = data;
      // Extract available columns from data if exists
      if (data && data.length > 0) {
        this.availableColumns = Object.keys(data[0]);
      }
    });

    this.tableConfigService.getTableColumns().subscribe(columns => {
      this.columns = columns;
    });
  }

  startEditing(column: Column): void {
    this.editingColumn = { ...column };
    this.editingName = column.name;
  }

  saveColumnEdit(): void {
    if (this.editingColumn) {
      const index = this.columns.findIndex(col => col.key === this.editingColumn?.key);
      if (index !== -1) {
        // If display name is empty, use the key as the name
        const displayName = this.editingName.trim() || this.editingColumn.key;
        this.columns[index] = { 
          ...this.editingColumn,
          name: displayName,
          type: this.getColumnType(this.editingColumn.key)
        };
      }
      this.editingColumn = null;
    }
  }

  getColumnType(key: string): 'text' | 'number' | 'date' {
    if (this.data && this.data.length > 0) {
      const value = this.data[0][key];
      if (typeof value === 'number') return 'number';
      if (value instanceof Date) return 'date';
      return 'text';
    }
    return 'text';
  }

  deleteColumn(column: Column): void {
    const index = this.columns.findIndex(col => col.key === column.key);
    if (index !== -1) {
      this.columns.splice(index, 1);
    }
  }

  addNewColumn(): void {
    // Close any existing edit dialog
    this.editingColumn = null;
    
    // Check if there are any unused columns available
    const unusedColumns = this.getUnusedColumns();
    if (unusedColumns.length === 0) {
      alert('All available columns have already been added to the table.');
      return;
    }

    // Show the new column dialog
    this.isAddingNewColumn = true;
    this.newColumnKey = '';
    this.editingName = '';
  }

  confirmAddColumn(): void {
    if (!this.newColumnKey) {
      return;
    }

    const newColumn: Column = {
      name: this.editingName.trim() || this.newColumnKey,
      type: 'text',
      key: this.newColumnKey
    };
    this.columns.push(newColumn);
    this.isAddingNewColumn = false;
  }

  cancelAddColumn(): void {
    this.isAddingNewColumn = false;
    this.newColumnKey = '';
    this.editingName = '';
  }

  saveConfiguration(): void {
    this.tableConfigService.setTableColumns(this.columns);
    this.router.navigate(['/table-view']);
  }

  // Get available columns that are not already used
  getUnusedColumns(): string[] {
    const usedKeys = new Set(this.columns.map(col => col.key));
    return this.availableColumns.filter(col => !usedKeys.has(col));
  }

  onColumnKeyChange(newKey: string): void {
    if (this.editingColumn) {
      this.editingColumn.key = newKey;
      // Update the display name if it hasn't been manually changed
      if (this.editingName === this.editingColumn.name) {
        this.editingName = newKey;
        this.editingColumn.name = newKey;
      }
    } else {
      this.newColumnKey = newKey;
      if (!this.editingName) {
        this.editingName = newKey;
      }
    }
  }
}
