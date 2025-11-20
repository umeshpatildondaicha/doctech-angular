import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-medication-assign-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './medication-assign-dialog.component.html',
  styleUrls: ['./medication-assign-dialog.component.scss']
})
export class MedicationAssignDialogComponent {
  @Input() activeTab: 'medicines' | 'template' = 'medicines';
  @Input() availableMedicines: any[] = [];
  @Input() selectedMedicines: any[] = [];
  @Input() medicationTemplates: { id: string; name: string; medicineIds: string[] }[] = [];
  @Input() today: Date = new Date();

  @Output() activeTabChange = new EventEmitter<'medicines' | 'template'>();
  @Output() close = new EventEmitter<void>();
  @Output() addMedicineToForm = new EventEmitter<any>(); // When clicking add icon, opens form
  @Output() addMedicineToCart = new EventEmitter<any>(); // When clicking Add button in form
  @Output() editSelected = new EventEmitter<any>();
  @Output() removeSelected = new EventEmitter<string>();
  @Output() selectTemplate = new EventEmitter<string>(); // When clicking a template
  @Output() assign = new EventEmitter<void>();

  // Form state
  selectedMedicineForForm: any = null;
  medicineSearchText = '';
  templateSearchText = '';

  // Form fields
  formData = {
    medicineName: '',
    dosage: '',
    frequency: { beforeMeal: false, afterMeal: false, every8Hours: false },
    quantity: '',
    timing: '',
    route: '',
    reasonForRequest: '',
    currentSymptoms: ''
  };

  setTab(tab: 'medicines' | 'template'): void {
    this.activeTabChange.emit(tab);
    this.selectedMedicineForForm = null; // Reset form when switching tabs
  }

  onClose(): void {
    this.close.emit();
    this.resetForm();
  }

  onAddMedicineClick(med: any): void {
    // Open form with this medicine pre-filled
    this.selectedMedicineForForm = med;
    this.formData.medicineName = med.name;
    this.formData.dosage = med.dosage || '';
    this.formData.frequency = { beforeMeal: false, afterMeal: false, every8Hours: false };
    this.addMedicineToForm.emit(med);
  }

  onAddToCart(): void {
    // Add medicine to cart with form data
    const medicineToAdd = {
      id: this.selectedMedicineForForm?.id || `M-${Date.now()}`,
      name: this.formData.medicineName || this.selectedMedicineForForm?.name,
      dosage: this.formData.dosage,
      frequency: this.getFrequencyText(),
      quantity: this.formData.quantity,
      timing: this.formData.timing,
      route: this.formData.route,
      reason: this.formData.reasonForRequest,
      symptoms: this.formData.currentSymptoms
    };
    this.addMedicineToCart.emit(medicineToAdd);
    this.resetForm();
  }

  onSelectTemplate(templateId: string): void {
    this.selectTemplate.emit(templateId);
  }

  onAssign(): void {
    this.assign.emit();
  }

  getFrequencyText(): string {
    const parts: string[] = [];
    if (this.formData.frequency.beforeMeal) parts.push('Before Meal');
    if (this.formData.frequency.afterMeal) parts.push('After Meal');
    if (this.formData.frequency.every8Hours) parts.push('Every 8 hours');
    return parts.join(', ') || 'As needed';
  }

  resetForm(): void {
    this.selectedMedicineForForm = null;
    this.formData = {
      medicineName: '',
      dosage: '',
      frequency: { beforeMeal: false, afterMeal: false, every8Hours: false },
      quantity: '',
      timing: '',
      route: '',
      reasonForRequest: '',
      currentSymptoms: ''
    };
  }

  get filteredMedicines(): any[] {
    if (!this.medicineSearchText.trim()) return this.availableMedicines;
    const search = this.medicineSearchText.toLowerCase();
    return this.availableMedicines.filter(m =>
      m.name?.toLowerCase().includes(search) ||
      m.dosage?.toLowerCase().includes(search) ||
      m.frequency?.toLowerCase().includes(search)
    );
  }

  get filteredTemplates(): any[] {
    if (!this.templateSearchText.trim()) return this.medicationTemplates;
    const search = this.templateSearchText.toLowerCase();
    return this.medicationTemplates.filter(t =>
      t.name?.toLowerCase().includes(search)
    );
  }
}


