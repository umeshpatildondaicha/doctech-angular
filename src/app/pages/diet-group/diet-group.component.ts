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

export interface DialogData {
  dietGroup?: DietGroup;
  mode: Mode;
}

@Component({
  selector: 'app-diet-group',
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
    GridComponent
  ],
  templateUrl: './diet-group.component.html',
  styleUrl: './diet-group.component.scss'
})
export class DietGroupComponent {
  dietGroupForm: FormGroup;
  mode: Mode = 'create';
  submitButtonText: string = 'Create Diet Group';
  
  // Diet selection grid
  availableDiets: Diet[] = [];
  selectedDietIds: string[] = [];
  dietColumnDefs: ColDef[] = [];
  dietGridOptions: GridOptions = {};
  private gridApi?: GridApi;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DietGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.mode = data?.mode || 'create';
    this.submitButtonText = this.getSubmitButtonText();
    
    this.dietGroupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });

    // Initialize diet grid
    this.initializeDietGrid();
    this.loadAvailableDiets();

    // If editing or viewing existing diet group, populate form
    if (data?.dietGroup) {
      this.dietGroupForm.patchValue({
        name: data.dietGroup.name
      });

      // Set selected diets
      this.selectedDietIds = data.dietGroup.diets || [];

      // Disable form in view mode
      if (this.mode === 'view') {
        this.dietGroupForm.disable();
      }
    }
  }

  initializeDietGrid() {
    this.dietColumnDefs = [
      {
        headerName: '',
        field: 'selected',
        width: 50,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        pinned: 'left'
      },
      { 
        headerName: 'Diet Name', 
        field: 'name', 
        sortable: true, 
        filter: true,
        flex: 1
      },
      { 
        headerName: 'Type', 
        field: 'dietType', 
        sortable: true, 
        filter: true,
        width: 150
      },
      { 
        headerName: 'Calories', 
        field: 'calories', 
        sortable: true, 
        filter: true,
        width: 100,
        type: 'numericColumn'
      },
      { 
        headerName: 'Protein (g)', 
        field: 'protein', 
        sortable: true, 
        filter: true,
        width: 120,
        type: 'numericColumn'
      },
      { 
        headerName: 'Carbs (g)', 
        field: 'carbs', 
        sortable: true, 
        filter: true,
        width: 120,
        type: 'numericColumn'
      },
      { 
        headerName: 'Fat (g)', 
        field: 'fat', 
        sortable: true, 
        filter: true,
        width: 100,
        type: 'numericColumn'
      }
    ];

    this.dietGridOptions = {
      defaultColDef: {
        flex: 1,
        minWidth: 100,
      },
      columnDefs: this.dietColumnDefs,
      rowData: this.availableDiets,
      domLayout: 'autoHeight',
      animateRows: true,
      rowSelection: {
        mode:'multiRow'
      },
      suppressRowClickSelection: true,
      onGridReady: (params) => {
        this.gridApi = params.api;
        // Set pre-selected diets if editing
        if (this.selectedDietIds.length > 0) {
          setTimeout(() => {
            this.setSelectedDiets();
          }, 100);
        }
      },
      onSelectionChanged: () => {
        this.onDietSelectionChanged();
      }
    };
  }

  loadAvailableDiets() {
    // Mock data - replace with actual API call
    this.availableDiets = [
      {
        dietId: 'diet-1',
        name: 'Low Calorie Diet',
        description: 'A balanced low-calorie diet for weight loss',
        dietType: 'Weight Loss',
        calories: 1200,
        protein: 80,
        carbs: 120,
        fat: 40,
        fiber: 25,
        createdByDoctorId: 'doctor-001',
        createdAt: new Date('2024-01-01'),
        isActive: true
      },
      {
        dietId: 'diet-2',
        name: 'High Protein Diet',
        description: 'High protein diet for muscle building',
        dietType: 'High Protein',
        calories: 1800,
        protein: 150,
        carbs: 100,
        fat: 60,
        fiber: 20,
        createdByDoctorId: 'doctor-001',
        createdAt: new Date('2024-01-02'),
        isActive: true
      },
      {
        dietId: 'diet-3',
        name: 'Low Carb Diet',
        description: 'Low carbohydrate diet for ketosis',
        dietType: 'Low Carb',
        calories: 1400,
        protein: 100,
        carbs: 50,
        fat: 80,
        fiber: 15,
        createdByDoctorId: 'doctor-001',
        createdAt: new Date('2024-01-03'),
        isActive: true
      },
      {
        dietId: 'diet-4',
        name: 'Balanced Diet',
        description: 'Well-balanced diet for general health',
        dietType: 'Maintenance',
        calories: 2000,
        protein: 120,
        carbs: 200,
        fat: 70,
        fiber: 30,
        createdByDoctorId: 'doctor-001',
        createdAt: new Date('2024-01-04'),
        isActive: true
      },
      {
        dietId: 'diet-5',
        name: 'Diabetic Diet',
        description: 'Specialized diet for diabetes management',
        dietType: 'Diabetic',
        calories: 1600,
        protein: 90,
        carbs: 150,
        fat: 55,
        fiber: 35,
        createdByDoctorId: 'doctor-001',
        createdAt: new Date('2024-01-05'),
        isActive: true
      }
    ];

    this.dietGridOptions.rowData = this.availableDiets;
  }

  setSelectedDiets() {
    if (this.gridApi) {
      this.gridApi.forEachNode((node: IRowNode) => {
        if (this.selectedDietIds.includes(node.data.dietId)) {
          node.setSelected(true);
        }
      });
    }
  }

  onDietSelectionChanged() {
    if (this.gridApi) {
      const selectedNodes = this.gridApi.getSelectedNodes();
      this.selectedDietIds = selectedNodes.map((node: IRowNode) => node.data.dietId);
      console.log('Selected diet IDs:', this.selectedDietIds);
    }
  }

  onSubmit() {
    console.log('Form submitted, mode:', this.mode);
    console.log('Form valid:', this.dietGroupForm.valid);
    console.log('Selected diets:', this.selectedDietIds);
    
    if (this.dietGroupForm.valid && this.mode !== 'view') {
      const formValue = this.dietGroupForm.value;
      const dietGroupData: Partial<DietGroup> = {
        name: formValue.name,
        description: `Diet group: ${formValue.name}`,
        category: 'Custom',
        targetAudience: 'General',
        difficulty: 'Beginner',
        duration: 4,
        tags: [],
        diets: this.selectedDietIds,
        createdByDoctorId: this.data?.dietGroup?.createdByDoctorId || 'doctor-001',
        createdAt: this.data?.dietGroup?.createdAt || new Date(),
        isActive: true
      };

      if (this.mode === 'edit' && this.data?.dietGroup) {
        dietGroupData.groupId = this.data.dietGroup.groupId;
      } else {
        dietGroupData.groupId = this.generateDietGroupId();
      }

      console.log('Closing dialog with data:', dietGroupData);
      this.dialogRef.close(dietGroupData);
    } else {
      console.log('Form invalid or in view mode, marking fields as touched');
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onEdit() {
    this.mode = 'edit';
    this.dietGroupForm.enable();
    this.submitButtonText = this.getSubmitButtonText();
  }

  private generateDietGroupId(): string {
    return 'diet-group-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  private markFormGroupTouched() {
    Object.keys(this.dietGroupForm.controls).forEach(key => {
      const control = this.dietGroupForm.get(key);
      control?.markAsTouched();
    });
  }

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  get isViewMode(): boolean {
    return this.mode === 'view';
  }

  get isCreateMode(): boolean {
    return this.mode === 'create';
  }

  get dialogTitle(): string {
    switch (this.mode) {
      case 'create':
        return 'Create New Diet Group';
      case 'edit':
        return 'Edit Diet Group';
      case 'view':
        return 'Diet Group Details';
      default:
        return 'Diet Group';
    }
  }

  getSubmitButtonText(): string {
    switch (this.mode) {
      case 'create':
        return 'Create Diet Group';
      case 'edit':
        return 'Update Diet Group';
      case 'view':
        return 'Close';
      default:
        return 'Submit';
    }
  }

  get showEditButton(): boolean {
    return this.mode === 'view';
  }

  getErrorMessage(fieldName: string): string {
    const control = this.dietGroupForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      switch (fieldName) {
        case 'name':
          return 'Diet group name is required and must be at least 3 characters';
        default:
          return 'This field is required';
      }
    }
    return '';
  }
} 