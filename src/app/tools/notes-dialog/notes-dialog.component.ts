import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export interface NotesDialogData {
  title: string;
  message: string;
  defaultValue?: string;
  placeholder?: string;
}

@Component({
  selector: 'app-notes-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './notes-dialog.component.html',
  styleUrl: './notes-dialog.component.scss'
})
export class NotesDialogComponent {
  notes: string = '';

  constructor(
    public dialogRef: MatDialogRef<NotesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NotesDialogData
  ) {
    this.notes = data.defaultValue || '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.notes.trim()) {
      this.dialogRef.close(this.notes.trim());
    }
  }

  canSave(): boolean {
    return this.notes.trim().length > 0;
  }
}

