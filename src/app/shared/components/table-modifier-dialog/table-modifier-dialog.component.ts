import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { TableConfigService, Column } from '../../services/table-config.service';

@Component({
  selector: 'app-table-modifier-dialog',
  templateUrl: './table-modifier-dialog.component.html',
  styleUrls: ['./table-modifier-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    DragDropModule
  ]
})
export class TableModifierDialogComponent implements OnInit {
  columns: Column[] = [];
  availableColumns: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<TableModifierDialogComponent>,
    private tableConfigService: TableConfigService
  ) {}

  ngOnInit(): void {
    this.tableConfigService.getTableColumns().subscribe(columns => {
      if (columns && columns.length > 0) {
        this.columns = columns.map(column => ({
          ...column,
          visible: column.visible ?? true
        }));
      } else {
        // If no columns are set, initialize with default columns
        this.columns = [
          { name: 'Status', type: 'text', key: 'status', visible: true },
          { name: 'Make', type: 'text', key: 'make', visible: true },
          { name: 'Model', type: 'text', key: 'model', visible: true },
          { name: 'Category', type: 'text', key: 'category', visible: true },
          { name: 'Version', type: 'text', key: 'version', visible: true },
          { name: 'Year', type: 'number', key: 'year', visible: true },
          { name: 'Price', type: 'number', key: 'price', visible: true }
        ];
      }
    });

    this.tableConfigService.getTableData().subscribe(data => {
      if (data && data.length > 0) {
        this.availableColumns = Object.keys(data[0]);
      }
    });
  }

  toggleColumnVisibility(column: Column): void {
    column.visible = !column.visible;
  }

  drop(event: CdkDragDrop<Column[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  saveChanges(): void {
    this.tableConfigService.setTableColumns(this.columns);
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }
} 