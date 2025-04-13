import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Prescription, Medication } from '../../models/prescription.model';

@Component({
  selector: 'app-prescription-form',
  templateUrl: './prescription-form.component.html',
  styleUrls: ['./prescription-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PrescriptionFormComponent implements OnInit, OnChanges {
  @Input() prescription: Prescription | null = null;
  @Output() prescriptionSaved = new EventEmitter<Prescription>();
  @Output() cancelled = new EventEmitter<void>();

  prescriptionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.prescriptionForm = this.createForm();
  }

  ngOnInit() {
    if (this.prescription) {
      this.populateForm(this.prescription);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prescription'] && changes['prescription'].currentValue) {
      this.populateForm(changes['prescription'].currentValue);
    }
  }

  get medications() {
    return this.prescriptionForm.get('medications') as FormArray;
  }

  createForm(): FormGroup {
    return this.fb.group({
      doctor: this.fb.group({
        name: ['', Validators.required],
        specialization: [''],
        registrationNumber: ['', Validators.required],
        clinicName: [''],
        address: [''],
        phone: ['']
      }),
      patient: this.fb.group({
        name: ['', Validators.required],
        age: [null, [Validators.required, Validators.min(0), Validators.max(120)]],
        gender: [''],
        address: [''],
        phone: ['']
      }),
      diagnosis: ['', Validators.required],
      symptoms: [''],
      medications: this.fb.array([]),
      nextVisitDate: [''],
      followUpInstructions: [''],
      signature: [''],
      date: [new Date().toISOString()]
    });
  }

  populateForm(prescription: Prescription) {
    // Clear the medications array before populating
    while (this.medications.length) {
      this.medications.removeAt(0);
    }

    // Set the form values
    this.prescriptionForm.patchValue({
      doctor: prescription.doctor,
      patient: prescription.patient,
      diagnosis: prescription.diagnosis,
      symptoms: prescription.symptoms ? prescription.symptoms.join(', ') : '',
      nextVisitDate: prescription.nextVisitDate || '',
      followUpInstructions: prescription.followUpInstructions || '',
      signature: prescription.signature || '',
      date: prescription.date || new Date().toISOString()
    });

    // Add medications
    if (prescription.medications && prescription.medications.length > 0) {
      prescription.medications.forEach((med: Medication) => {
        this.addMedication(med);
      });
    }
  }

  addMedication(medication?: Medication) {
    const medicationForm = this.fb.group({
      name: [medication?.name || '', Validators.required],
      dosage: [medication?.dosage || '', Validators.required],
      frequency: [medication?.frequency || '', Validators.required],
      duration: [medication?.duration || '', Validators.required],
      instructions: [medication?.instructions || ''],
      route: [medication?.route || ''],
      timing: [medication?.timing || ''],
      withFood: [medication?.withFood || false]
    });

    this.medications.push(medicationForm);
  }

  removeMedication(index: number) {
    this.medications.removeAt(index);
  }

  onSubmit() {
    if (this.prescriptionForm.valid) {
      const formValue = this.prescriptionForm.value;
      
      // Convert symptoms string to array if it exists
      const symptoms = formValue.symptoms ? 
        formValue.symptoms.split(',').map((s: string) => s.trim()) : 
        [];

      const prescription: Prescription = {
        ...(this.prescription || { status: 'Active', priority: 'Normal' }),
        doctor: formValue.doctor,
        patient: formValue.patient,
        diagnosis: formValue.diagnosis,
        symptoms: symptoms,
        medications: formValue.medications,
        nextVisitDate: formValue.nextVisitDate,
        followUpInstructions: formValue.followUpInstructions,
        signature: formValue.signature,
        date: formValue.date || new Date().toISOString(),
        prescriptionId: this.prescription?.prescriptionId || `PRES-${Date.now()}`,
        status: this.prescription?.status || 'Active',
        priority: this.prescription?.priority || 'Normal'
      };

      this.prescriptionSaved.emit(prescription);
    }
  }

  onCancel() {
    this.cancelled.emit();
  }
}
