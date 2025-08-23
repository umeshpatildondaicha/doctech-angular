import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { GridComponent } from '../../tools/grid/grid.component';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { DietCreateComponent } from '../diet-create/diet-create.component';
import { Diet } from '../../interfaces/diet.interface';
import { ColDef } from 'ag-grid-community';
import { Mode } from '../../types/mode.type';
import { DietGroupComponent } from '../diet-group/diet-group.component';
import { DietGroup } from '../../interfaces/diet-group.interface';

@Component({
  selector: 'app-diet',
  standalone: true,
  imports: [CommonModule, MatTabsModule, GridComponent, AppButtonComponent, IconComponent],
  templateUrl: './diet.component.html',
  styleUrl: './diet.component.scss'
})
export class DietComponent implements OnInit {
  selectedTabIndex = 0;
  
  // Diet Groups Tab
  dietGroupList: any[] = [];
  dietGroupColumns: ColDef[] = [];
  dietGroupGridOptions: any = {};
  
  // Diets Tab
  dietList: Diet[] = [];
  columnDefs: ColDef[] = [];
  gridOptions: any = {};

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.initializeDietGroupData();
    this.initializeDietData();
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }

  // Diet Groups Tab Methods
  initializeDietGroupData() {
    this.initializeDietGroupColumnDefs();
    this.initializeDietGroupGridOptions();
    this.loadDietGroupData();
  }

  initializeDietGroupGridOptions() {
    this.dietGroupGridOptions.menuActions = [
      {
        "title": "View",
        "icon": "remove_red_eye",
        "click": (param: any) => { this.onViewDietGroup(param?.data) }
      },
      {
        "title": "Edit",
        "icon": "edit",
        "click": (param: any) => { this.onEditDietGroup(param?.data) }
      },
      {
        "title": "Delete",
        "icon": "delete",
        "click": (param: any) => { this.onDeleteDietGroup(param?.data) }
      },
    ];
  }

  onDeleteDietGroup(param: any) {
    console.log('Delete diet group:', param);
    // TODO: Implement delete diet group functionality
  }

  onCreateDietGroup() {
    const dialogRef = this.dialog.open(DietGroupComponent, {
      width: '90%',
      data: { mode: 'create' },
      disableClose: true,
      panelClass: 'diet-group-dialog-panel'
    });
  }
  
  // Edit Mode
  onEditDietGroup(dietGroup: DietGroup) {
    const dialogRef = this.dialog.open(DietGroupComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { dietGroup, mode: 'edit' } ,
      disableClose: true
    });
  }
  
  // View Mode
  onViewDietGroup(dietGroup: DietGroup) {
    const dialogRef = this.dialog.open(DietGroupComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { dietGroup, mode: 'view' },
      disableClose: false
    });
  }

  onDietGroupRowClick(event: any) {
    console.log('Diet group row clicked:', event);
  }

  onSearchDietGroup(searchTerm: string) {
    console.log('Search diet group term:', searchTerm);
    // TODO: Implement search functionality
  }

  private initializeDietGroupColumnDefs() {
    this.dietGroupColumns = [
      {
        headerName: 'Group Name',
        field: 'name',
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150
      },
      {
        headerName: 'Description',
        field: 'description',
        sortable: true,
        filter: true,
        minWidth: 200
      },
      {
        headerName: 'Diet Count',
        field: 'dietCount',
        sortable: true,
        filter: true,
        minWidth: 100,
        cellRenderer: (params: any) => {
          return `<span style="font-weight: 600; color: #2c3e50;">${params.value} diets</span>`;
        }
      },
      {
        headerName: 'Created By',
        field: 'createdBy',
        sortable: true,
        filter: true,
        minWidth: 120
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
    ];
  }

  private loadDietGroupData() {
    // Mock data for diet groups
    this.dietGroupList = [
      {
        groupId: 'DG001',
        name: 'Weight Management',
        description: 'Diet groups focused on weight loss and maintenance',
        dietCount: 3,
        createdBy: 'Dr. Chetan',
        createdAt: new Date('2024-01-10'),
        isActive: true
      },
      {
        groupId: 'DG002',
        name: 'Medical Conditions',
        description: 'Specialized diets for medical conditions',
        dietCount: 2,
        createdBy: 'Dr. Sarah',
        createdAt: new Date('2024-01-15'),
        isActive: true
      },
      {
        groupId: 'DG003',
        name: 'Athletic Performance',
        description: 'High-performance diets for athletes',
        dietCount: 1,
        createdBy: 'Dr. Michael',
        createdAt: new Date('2024-01-20'),
        isActive: true
      },
      {
        groupId: 'DG004',
        name: 'Experimental Diets',
        description: 'New and experimental diet plans',
        dietCount: 1,
        createdBy: 'Dr. Chetan',
        createdAt: new Date('2024-02-01'),
        isActive: false
      }
    ];
  }

  // Diets Tab Methods (existing code)
  initializeDietData() {
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

  onDietRowClick(event: any) {
    console.log('Diet row clicked:', event);
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
