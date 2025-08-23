import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { GridComponent } from '../../tools/grid/grid.component';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { DietGroupComponent, DialogData } from '../diet-group/diet-group.component';
import { DietGroup } from '../../interfaces/diet-group.interface';
import { ColDef, GridOptions } from 'ag-grid-community';

interface ExtendedGridOptions extends GridOptions {
  menuActions?: Array<{
    title: string;
    icon: string;
    click: (param: any) => void;
  }>;
}

@Component({
  selector: 'app-diet-group-management',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    GridComponent,
    AppButtonComponent
  ],
  templateUrl: './diet-group-management.component.html',
  styleUrls: ['./diet-group-management.component.scss']
})
export class DietGroupManagementComponent implements OnInit {
  selectedTabIndex = 0;
  dietGroups: DietGroup[] = [];
  columnDefs: ColDef[] = [];
  gridOptions: ExtendedGridOptions = {};

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.initializeGrid();
    this.loadDietGroups();
  }

  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
  }

  initializeGrid() {
    this.columnDefs = [
      { 
        headerName: 'Group Name', 
        field: 'name', 
        sortable: true, 
        filter: true,
        flex: 1
      },
      { 
        headerName: 'Category', 
        field: 'category', 
        sortable: true, 
        filter: true,
        width: 150
      },
      { 
        headerName: 'Target Audience', 
        field: 'targetAudience', 
        sortable: true, 
        filter: true,
        width: 150
      },
      { 
        headerName: 'Difficulty', 
        field: 'difficulty', 
        sortable: true, 
        filter: true,
        width: 120
      },
      { 
        headerName: 'Duration (weeks)', 
        field: 'duration', 
        sortable: true, 
        filter: true,
        width: 130,
        type: 'numericColumn'
      },
      { 
        headerName: 'Diets Count', 
        field: 'diets', 
        sortable: true, 
        filter: true,
        width: 120,
        valueGetter: (params: any) => params.data.diets?.length || 0
      },
      { 
        headerName: 'Status', 
        field: 'isActive', 
        sortable: true, 
        filter: true,
        width: 100,
        cellRenderer: (params: any) => {
          return params.value ? 'Active' : 'Inactive';
        }
      },
      { 
        headerName: 'Created', 
        field: 'createdAt', 
        sortable: true, 
        filter: true,
        width: 120,
        valueFormatter: (params: any) => {
          return new Date(params.value).toLocaleDateString();
        }
      }
    ];

    this.gridOptions = {
      columnDefs: this.columnDefs,
      rowData: this.dietGroups,
      domLayout: 'autoHeight',
      animateRows: true,
      rowSelection: 'single',
      menuActions: [
        {
          title: 'View',
          icon: 'visibility',
          click: (params: any) => this.onView(params.data)
        },
        {
          title: 'Edit',
          icon: 'edit',
          click: (params: any) => this.onEdit(params.data)
        },
        {
          title: 'Delete',
          icon: 'delete',
          click: (params: any) => this.onDelete(params.data)
        }
      ]
    };
  }

  loadDietGroups() {
    // Mock data - replace with actual API call
    this.dietGroups = [
      {
        id: 'group-1',
        groupId: 'group-1',
        name: 'Weight Loss Program',
        description: 'Comprehensive weight loss program for adults',
        category: 'Weight Management',
        createdBy: 'doctor-001',
        targetAudience: 'Adults',
        difficulty: 'Beginner',
        duration: 12,
        diets: ['diet-1', 'diet-2', 'diet-3'],
        createdByDoctorId: 'doctor-001',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        isActive: true,
        tags: ['weight loss', 'low calorie', 'balanced']
      },
      {
        id: 'group-2',
        groupId: 'group-2',
        name: 'Athlete Performance',
        description: 'High-performance nutrition for athletes',
        category: 'Sports & Fitness',
        createdBy: 'doctor-001',
        targetAudience: 'Athletes',
        difficulty: 'Advanced',
        duration: 8,
        diets: ['diet-4', 'diet-5'],
        createdByDoctorId: 'doctor-001',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
        isActive: true,
        tags: ['high protein', 'performance', 'recovery']
      },
      {
        id: 'group-3',
        groupId: 'group-3',
        name: 'Senior Wellness',
        description: 'Nutrition program for senior citizens',
        category: 'Age Specific',
        createdBy: 'doctor-001',
        targetAudience: 'Seniors',
        difficulty: 'Beginner',
        duration: 16,
        diets: ['diet-6', 'diet-7', 'diet-8'],
        createdByDoctorId: 'doctor-001',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        isActive: true,
        tags: ['senior', 'wellness', 'health']
      }
    ];

    this.gridOptions.rowData = this.dietGroups;
  }

  onCreateDietGroup() {
    console.log('Opening diet group create dialog...');
    
    try {
      const dialogRef = this.dialog.open(DietGroupComponent, {
        width: '80%',
        maxWidth: '120vw',
        maxHeight: '85%',
        height: '85%',
        data: { mode: 'create' } as DialogData,
        disableClose: true,
        panelClass: 'diet-group-dialog-panel'
      });

      dialogRef.afterClosed().subscribe((result: DietGroup) => {
        console.log('Dialog closed with result:', result);
        if (result) {
          this.dietGroups.push(result);
          this.gridOptions.rowData = [...this.dietGroups];
          console.log('Diet group created:', result);
        }
      }, (error) => {
        console.error('Error opening dialog:', error);
      });
    } catch (error) {
      console.error('Error creating dialog:', error);
    }
  }

  onView(dietGroup: DietGroup) {
    const dialogRef = this.dialog.open(DietGroupComponent, {
      width: '80%',
      maxWidth: '120vw',
      maxHeight: '85%',
      height: '85%',
      data: { dietGroup, mode: 'view' } as DialogData,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('View dialog closed');
    });
  }

  onEdit(dietGroup: DietGroup) {
    const dialogRef = this.dialog.open(DietGroupComponent, {
      width: '80%',
      maxWidth: '120vw',
      maxHeight: '85%',
      height: '85%',
      data: { dietGroup, mode: 'edit' } as DialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: DietGroup) => {
      if (result) {
        const index = this.dietGroups.findIndex(g => g.groupId === result.groupId);
        if (index !== -1) {
          this.dietGroups[index] = result;
          this.gridOptions.rowData = [...this.dietGroups];
        }
        console.log('Diet group updated:', result);
      }
    });
  }

  onDelete(dietGroup: DietGroup) {
    if (confirm(`Are you sure you want to delete "${dietGroup.name}"?`)) {
      const index = this.dietGroups.findIndex(g => g.groupId === dietGroup.groupId);
      if (index !== -1) {
        this.dietGroups.splice(index, 1);
        this.gridOptions.rowData = [...this.dietGroups];
        console.log('Diet group deleted:', dietGroup.name);
      }
    }
  }

  onRefresh() {
    this.loadDietGroups();
  }

  // Test method for quick dialog testing
  testDialog() {
    console.log('Testing dialog functionality...');
    
    // Test create mode
    this.onCreateDietGroup();
    
    // Test edit mode after a short delay
    setTimeout(() => {
      if (this.dietGroups.length > 0) {
        console.log('Testing edit mode...');
        this.onEdit(this.dietGroups[0]);
      }
    }, 2000);
  }

  // Statistics methods
  getActiveGroupsCount(): number {
    return this.dietGroups.filter(group => group.isActive).length;
  }

  getTotalDietsCount(): number {
    return this.dietGroups.reduce((total, group) => total + (group.diets?.length || 0), 0);
  }

  getAverageDuration(): number {
    if (this.dietGroups.length === 0) return 0;
    const totalDuration = this.dietGroups.reduce((total, group) => total + group.duration, 0);
    return Math.round(totalDuration / this.dietGroups.length);
  }

  // Categories methods
  getCategories(): Array<{name: string, count: number}> {
    const categoryCounts = new Map<string, number>();
    
    this.dietGroups.forEach(group => {
      const count = categoryCounts.get(group.category) || 0;
      categoryCounts.set(group.category, count + 1);
    });

    return Array.from(categoryCounts.entries()).map(([name, count]) => ({ name, count }));
  }

  getCategoryDescription(categoryName: string): string {
    const descriptions: { [key: string]: string } = {
      'Weight Management': 'Programs focused on weight loss, gain, or maintenance',
      'Health & Wellness': 'General health improvement and wellness programs',
      'Sports & Fitness': 'Performance and athletic nutrition programs',
      'Medical Conditions': 'Specialized diets for medical conditions',
      'Age Specific': 'Programs tailored for specific age groups',
      'Lifestyle': 'Lifestyle-based nutrition programs'
    };

    return descriptions[categoryName] || 'Nutrition programs for various needs';
  }
} 