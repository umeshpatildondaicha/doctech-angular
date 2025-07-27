import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { GridComponent } from '../../tools/grid/grid.component';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { DietCreateComponent } from '../diet-create/diet-create.component';
import { Diet } from '../../interfaces/diet.interface';
import { ColDef } from 'ag-grid-community';
import { Mode } from '../../types/mode.type';

@Component({
  selector: 'app-diet',
  standalone: true,
  imports: [CommonModule, GridComponent, AppButtonComponent, IconComponent],
  templateUrl: './diet.component.html',
  styleUrl: './diet.component.scss'
})
export class DietComponent implements OnInit {
  dietList: Diet[] = [];
  columnDefs: ColDef[] = [];
  gridOptions: any = {};

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.initializeColumnDefs();
    this.initializeGridOptions();
    this.loadDietData();
  }

  initializeGridOptions(){
    this.gridOptions.menuActions = [
      {
        "title":"View",
        "icon":"remove_red_eye",
        "click": (param:any)=> {this.onView(param)}
      },
      {
        "title":"Edit",
        "icon":"edit",
        "click": (param:any)=> {this.onEdit(param)}
      },
      {
        "title":"Delete",
        "icon":"delete",
        "click": (param:any)=> {this.onDelete(param)}
      },
    ]
  }
  onView(param: any) {
    console.log('View diet:', param);
    this.openDietDialog(param.data, 'view');
  }

  onEdit(param: any) {
    console.log('Edit diet:', param);
    this.openDietDialog(param.data, 'edit');
  }

  onDelete(param: any) {
    console.log('Delete diet:', param);
    // TODO: Implement delete functionality with confirmation dialog
  }

  private openDietDialog(diet: Diet | undefined, mode: Mode) {
    const dialogRef = this.dialog.open(DietCreateComponent, {
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: {
        diet: diet,
        mode: mode
      },
      disableClose: false,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: Diet | undefined) => {
      if (result) {
        console.log('Diet operation completed:', result);
        
        if (mode === 'create') {
          // Add the new diet to the list
          this.dietList = [...this.dietList, result];
        } else if (mode === 'edit') {
          // Update the existing diet in the list
          const index = this.dietList.findIndex(d => d.dietId === result.dietId);
          if (index !== -1) {
            this.dietList[index] = result;
            this.dietList = [...this.dietList]; // Trigger change detection
          }
        }
        // TODO: Send to backend API
      }
    });
  }

  private initializeColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Diet Name',
        field: 'name',
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150
      },
      {
        headerName: 'Type',
        field: 'dietType',
        sortable: true,
        filter: true,
        minWidth: 120,
        cellRenderer: (params: any) => {
          const dietType = params.value;
          const colorMap: { [key: string]: string } = {
            'Weight Loss': '#ff6b6b',
            'Weight Gain': '#4ecdc4',
            'Maintenance': '#45b7d1',
            'Diabetic': '#96ceb4',
            'Low Carb': '#feca57',
            'High Protein': '#ff9ff3'
          };
          const color = colorMap[dietType] || '#95a5a6';
          return `<span class="diet-type-badge" style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">${dietType}</span>`;
        }
      },
      {
        headerName: 'Calories',
        field: 'calories',
        sortable: true,
        filter: true,
        minWidth: 100,
        cellRenderer: (params: any) => {
          return `<span style="font-weight: 600; color: #2c3e50;">${params.value} kcal</span>`;
        }
      },
      {
        headerName: 'Protein',
        field: 'protein',
        sortable: true,
        filter: true,
        minWidth: 80,
        cellRenderer: (params: any) => {
          return `<span style="color: #e74c3c;">${params.value}g</span>`;
        }
      },
      {
        headerName: 'Carbs',
        field: 'carbs',
        sortable: true,
        filter: true,
        minWidth: 80,
        cellRenderer: (params: any) => {
          return `<span style="color: #f39c12;">${params.value}g</span>`;
        }
      },
      {
        headerName: 'Fat',
        field: 'fat',
        sortable: true,
        filter: true,
        minWidth: 80,
        cellRenderer: (params: any) => {
          return `<span style="color: #9b59b6;">${params.value}g</span>`;
        }
      },
      {
        headerName: 'Status',
        field: 'isActive',
        sortable: true,
        filter: true,
        minWidth: 100,
        cellRenderer: (params: any) => {
          const isActive = params.value;
          const color = isActive ? '#27ae60' : '#e74c3c';
          const text = isActive ? 'Active' : 'Inactive';
          return `<span style="color: ${color}; font-weight: 600;">${text}</span>`;
        }
      },
      {
        headerName: 'Created',
        field: 'createdAt',
        sortable: true,
        filter: true,
        minWidth: 120,
        cellRenderer: (params: any) => {
          const date = new Date(params.value);
          return date.toLocaleDateString();
        }
      }
      // Actions column will be automatically added by grid component when menuActions are present
    ];
  }

  private loadDietData() {
    // Mock data - replace with actual API call
    this.dietList = [
      {
        dietId: 'D001',
        name: 'Weight Loss Diet Plan',
        description: 'A balanced diet plan for healthy weight loss',
        dietType: 'Weight Loss',
        calories: 1500,
        protein: 120,
        carbs: 150,
        fat: 50,
        fiber: 25,
        createdByDoctorId: 'DOC001',
        createdAt: new Date('2024-01-15'),
        isActive: true
      },
      {
        dietId: 'D002',
        name: 'Muscle Building Diet',
        description: 'High protein diet for muscle growth',
        dietType: 'Weight Gain',
        calories: 2500,
        protein: 180,
        carbs: 200,
        fat: 80,
        fiber: 30,
        createdByDoctorId: 'DOC001',
        createdAt: new Date('2024-01-20'),
        isActive: true
      },
      {
        dietId: 'D003',
        name: 'Diabetic Friendly Diet',
        description: 'Low glycemic index diet for diabetes management',
        dietType: 'Diabetic',
        calories: 1800,
        protein: 100,
        carbs: 120,
        fat: 60,
        fiber: 35,
        createdByDoctorId: 'DOC002',
        createdAt: new Date('2024-01-25'),
        isActive: true
      },
      {
        dietId: 'D004',
        name: 'Low Carb Keto Diet',
        description: 'Ketogenic diet for rapid fat loss',
        dietType: 'Low Carb',
        calories: 1600,
        protein: 140,
        carbs: 30,
        fat: 120,
        fiber: 20,
        createdByDoctorId: 'DOC001',
        createdAt: new Date('2024-02-01'),
        isActive: false
      },
      {
        dietId: 'D005',
        name: 'Athlete Performance Diet',
        description: 'High energy diet for athletic performance',
        dietType: 'High Protein',
        calories: 3000,
        protein: 200,
        carbs: 300,
        fat: 100,
        fiber: 40,
        createdByDoctorId: 'DOC003',
        createdAt: new Date('2024-02-05'),
        isActive: true
      }
    ];
  }

  onCreateDiet() {
    this.openDietDialog(undefined, 'create');
  }

  onSearchChange(searchTerm: string) {
    console.log('Search term:', searchTerm);
    // TODO: Implement search functionality
  }
}
