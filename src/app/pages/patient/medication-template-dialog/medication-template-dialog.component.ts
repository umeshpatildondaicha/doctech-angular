import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Lightweight shape used only for displaying selected medicines in the template dialog
interface TemplateMedicationView {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

@Component({
  selector: 'app-medication-template-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './medication-template-dialog.component.html',
  styleUrls: ['./medication-template-dialog.component.scss']
})
export class MedicationTemplateDialogComponent {
  @Input() selectedMedications: TemplateMedicationView[] = [];
  @Input() templateName = '';

  @Output() templateNameChange = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  onNameInput(value: string): void {
    this.templateName = value;
    this.templateNameChange.emit(value);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSave(): void {
    this.save.emit();
  }
}


