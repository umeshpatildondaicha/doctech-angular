import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppInputComponent, AppButtonComponent, AppSelectboxComponent } from '../../../tools';

export interface FollowUpRule {
  day: number;
  price: number;
}

export interface PricingItemData {
  name: string;
  category: 'Consultation' | 'Follow-up' | 'Emergency' | 'Online' | 'Dressing' | 'Treatment' | 'Other';
  unit: 'Flat' | 'Per cm';
  price: number;
  followUpNeeded: boolean;
  followUps: FollowUpRule[];
}

@Component({
  selector: 'app-pricing-item-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    AppInputComponent,
    AppButtonComponent,
    AppSelectboxComponent
  ],
  templateUrl: './pricing-item-dialog.component.html',
  styleUrls: ['./pricing-item-dialog.component.scss']
})
export class PricingItemDialogComponent {
  form: FormGroup;
  readonly categories = ['Consultation', 'Follow-up', 'Emergency', 'Online', 'Dressing', 'Treatment', 'Other'];
  readonly units = ['Flat', 'Per cm'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<PricingItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Partial<PricingItemData>
  ) {
    this.form = this.fb.group({
      name: [data?.name ?? '', [Validators.required, Validators.minLength(2)]],
      category: [data?.category ?? 'Consultation', Validators.required],
      unit: [data?.unit ?? 'Flat', Validators.required],
      price: [data?.price ?? 0, [Validators.required, Validators.min(0)]],
      followUpNeeded: [data?.followUpNeeded ?? false],
      followUps: this.fb.array([])
    });

    if (data?.followUps?.length) {
      data.followUps.forEach(r => this.addFollowUp(r));
    }
  }

  get followUpsArray(): FormArray {
    return this.form.get('followUps') as FormArray;
  }

  addFollowUp(rule?: FollowUpRule) {
    this.followUpsArray.push(this.fb.group({
      day: [rule?.day ?? 1, [Validators.required, Validators.min(1)]],
      price: [rule?.price ?? 0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeFollowUp(index: number) {
    this.followUpsArray.removeAt(index);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value as PricingItemData);
  }
}


