import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class GenericModalService {
  constructor(private dialog: MatDialog) {}

  openDialog(component: any, config: any): MatDialogRef<any> {
    return this.dialog.open(component, {
      minHeight: config.minHeight || '300px',
      height: config.height || 'auto',
      minWidth: config.minWidth || '300px',
      data: config.data || {},
    });
  }
}
