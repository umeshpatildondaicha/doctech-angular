import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppInputComponent, AppButtonComponent } from '../../../tools';

export interface PricingDialogData {
  consultationFee: number | string | null;
  followUpFee: number | string | null;
  emergencyFee: number | string | null;
  onlineConsultationFee: number | string | null;
  insuranceAccepted: boolean;
  paymentMethods: string[];
}

@Component({
  selector: 'app-pricing-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    AppInputComponent,
    AppButtonComponent
  ],
  templateUrl: './pricing-dialog.component.html',
  styleUrls: ['./pricing-dialog.component.scss']
})
export class PricingDialogComponent {
  form: FormGroup;
  readonly paymentOptions = ['Cash', 'Credit Card', 'Insurance', 'Online Payment'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PricingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PricingDialogData
  ) {
    this.form = this.fb.group({
      consultationFee: [data?.consultationFee ?? '', [Validators.min(0)]],
      followUpFee: [data?.followUpFee ?? '', [Validators.min(0)]],
      emergencyFee: [data?.emergencyFee ?? '', [Validators.min(0)]],
      onlineConsultationFee: [data?.onlineConsultationFee ?? '', [Validators.min(0)]],
      insuranceAccepted: [data?.insuranceAccepted ?? false],
      paymentMethods: [data?.paymentMethods ?? []]
    });
  }

  togglePaymentMethod(option: string) {
    const current: string[] = this.form.get('paymentMethods')?.value || [];
    const exists = current.includes(option);
    const updated = exists ? current.filter(m => m !== option) : [...current, option];
    this.form.patchValue({ paymentMethods: updated });
  }

  isPaymentSelected(option: string): boolean {
    const current: string[] = this.form.get('paymentMethods')?.value || [];
    return current.includes(option);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }
}


