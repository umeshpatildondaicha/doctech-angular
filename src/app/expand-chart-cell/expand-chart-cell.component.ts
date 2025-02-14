import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-expand-chart-cell',
  imports: [],
  templateUrl: './expand-chart-cell.component.html',
  styleUrl: './expand-chart-cell.component.css',
})
export class ExpandChartCellComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ExpandChartCellComponent>
  ) {}

  close(): void {
    this.dialogRef.close('Dialog Closed Successfully');
  }
}
