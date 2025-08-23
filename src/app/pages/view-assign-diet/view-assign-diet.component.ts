import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { AppInputComponent } from '../../tools/app-input/app-input.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { GridComponent } from '../../tools/grid/grid.component';
import { DietGroup } from '../../interfaces/diet-group.interface';
import { Diet } from '../../interfaces/diet.interface';
import { Mode } from '../../types/mode.type';
import { ColDef, GridOptions, GridApi, IRowNode } from 'ag-grid-community';
import { AppSelectboxComponent } from '../../tools';

@Component({
  selector: 'app-view-assign-diet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AppButtonComponent,
    AppInputComponent,
    IconComponent,
    GridComponent,
    AppSelectboxComponent
  ],
  templateUrl: './view-assign-diet.component.html',
  styleUrl: './view-assign-diet.component.scss'
})
export class ViewAssignDietComponent {

  dialogTitle: string = 'View Diet Details';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ViewAssignDietComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }


  onCancel() {
    this.dialogRef.close();
  }

} 