import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AgGridModule } from 'ag-grid-angular';
import { 
  ColDef, 
  GridApi, 
  GridOptions, 
  GridReadyEvent,
  RowClickedEvent,
  SelectionChangedEvent,
  CheckboxSelectionCallback,
  HeaderCheckboxSelectionCallback,
  ICellRendererParams
} from 'ag-grid-community';

// Import our AG Grid modules config
import { AgGridModules } from '../../grid-config';

export interface ActionButton {
  label?: string;
  icon?: string;
  primary?: boolean;
  disabled?: boolean;
  action: (params?: any) => void;
}

export interface RowAction {
  label: string;
  icon?: string;
  action: (data: any) => void;
  disabled?: (data: any) => boolean;
}

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    AgGridModule
  ],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() title: string = '';
  @Input() showItemCount: boolean = true;
  @Input() columnDefs: any[] = [];
  @Input() rowData: any[] = [];
  @Input() defaultColDef: any = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    resizable: true,
    filter: true
  };
  @Input() rowSelection: 'single' | 'multiple' = 'multiple';
  @Input() suppressRowClickSelection = false;
  @Input() showPagination = true;
  @Input() paginationPageSize = 10;
  @Input() paginationPageSizeSelector = [10, 25, 50, 100];
  @Input() rowMultiSelectWithClick = true;
  @Input() showSearch = true;
  @Input() showRefresh = true;
  @Input() showExport = true;
  @Input() refreshButtonLabel: string = '';
  @Input() exportButtonLabel: string = '';
  @Input() actionButtons: ActionButton[] = [];
  @Input() rowActions: RowAction[] = [];
  @Input() showCheckbox: boolean = true;
  
  // Use our imported modules
  modules = AgGridModules;

  @Output() rowClick = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() refresh = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();

  searchText = '';
  filteredRowData: any[] = [];
  private gridApi!: GridApi;
  public gridTheme = 'ag-theme-alpine';

  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
    console.log('DataGrid initialized with data:', this.rowData?.length);
    console.log('Column definitions:', this.columnDefs?.length);
    this.filteredRowData = [...(this.rowData || [])];
    this.setupColumnDefs();
  }

  ngAfterViewInit(): void {
    console.log('DataGrid view initialized');
    // Give the grid some time to render
    setTimeout(() => {
      if (this.gridApi) {
        this.gridApi.sizeColumnsToFit();
        console.log('Grid API available, columns sized to fit');
      } else {
        console.warn('Grid API not available in afterViewInit');
      }
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rowData'] && changes['rowData'].currentValue) {
      console.log('Row data changed:', changes['rowData'].currentValue.length);
      this.filteredRowData = [...changes['rowData'].currentValue];
      this.applyFilter();
    }

    if (changes['columnDefs'] || changes['showCheckbox'] || changes['rowActions']) {
      console.log('Column definitions changed');
      this.setupColumnDefs();
    }
  }

  private setupColumnDefs(): void {
    if (!this.columnDefs || this.columnDefs.length === 0) {
      console.warn('No column definitions available');
      return;
    }

    const updatedColumnDefs = [...this.columnDefs];

    // Add checkbox selection column if enabled
    if (this.showCheckbox && updatedColumnDefs.length > 0) {
      const firstCol = { ...updatedColumnDefs[0] };
      
      // Check if first column already has checkbox selection
      if (!firstCol.checkboxSelection) {
        firstCol.headerCheckboxSelection = true;
        firstCol.checkboxSelection = true;
        updatedColumnDefs[0] = firstCol;
      }
    }

    // Add actions column if row actions are provided
    if (this.rowActions && this.rowActions.length > 0) {
      const actionCol: ColDef = {
        headerName: '',
        field: 'actions',
        cellClass: 'row-action-cell',
        cellRenderer: this.actionsRenderer.bind(this),
        minWidth: 60,
        maxWidth: 60,
        resizable: false,
        sortable: false,
        filter: false,
        pinned: 'right'
      };

      // Check if actions column already exists
      const actionColIndex = updatedColumnDefs.findIndex(col => col.field === 'actions');
      if (actionColIndex >= 0) {
        updatedColumnDefs[actionColIndex] = actionCol;
      } else {
        updatedColumnDefs.push(actionCol);
      }
    }

    this.columnDefs = updatedColumnDefs;
    console.log('Column setup complete:', this.columnDefs.length);
  }

  actionsRenderer(params: ICellRendererParams) {
    const eDiv = document.createElement('div');
    eDiv.classList.add('row-action-cell');
    eDiv.innerHTML = `
      <button class="row-action-menu-btn">
        <span style="font-size: 18px; line-height: 1; display: flex;">⋮</span>
      </button>
    `;
    
    const button = eDiv.querySelector('.row-action-menu-btn');
    if (button) {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        
        // Create a dropdown menu dynamically
        const menu = document.createElement('div');
        menu.classList.add('row-action-dropdown');
        
        this.rowActions.forEach(action => {
          const menuItem = document.createElement('div');
          menuItem.classList.add('row-action-item');
          
          if (action.disabled && action.disabled(params.data)) {
            menuItem.classList.add('disabled');
          } else {
            menuItem.addEventListener('click', () => {
              this.ngZone.run(() => {
                action.action(params.data);
              });
              document.body.removeChild(menu);
            });
          }
          
          let iconHtml = '';
          if (action.icon) {
            iconHtml = `<span class="action-icon">${action.icon}</span>`;
          }
          
          menuItem.innerHTML = `${iconHtml}<span>${action.label}</span>`;
          menu.appendChild(menuItem);
        });
        
        // Position the menu near the button
        const rect = button.getBoundingClientRect();
        menu.style.top = `${rect.bottom}px`;
        menu.style.left = `${rect.left - 120}px`; // Align right side of menu with button
        
        // Add to document body
        document.body.appendChild(menu);
        
        // Close menu when clicking outside
        const closeMenu = (e: MouseEvent) => {
          if (!menu.contains(e.target as Node) && e.target !== button) {
            document.body.removeChild(menu);
            document.removeEventListener('click', closeMenu);
          }
        };
        
        // Delay adding the event listener to prevent immediate closure
        setTimeout(() => {
          document.addEventListener('click', closeMenu);
        }, 0);
      });
    }
    
    return eDiv;
  }

  openActionsMenu(rowData: any, event: Event): void {
    // Now handled directly in actionsRenderer
    event.stopPropagation();
  }

  onGridReady(params: GridReadyEvent): void {
    console.log('Grid ready event fired');
    this.gridApi = params.api;
    
    // Allow some time for the grid to render
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
      console.log('Grid columns sized to fit');
    }, 100);
  }

  onRowClicked(event: RowClickedEvent): void {
    this.rowClick.emit(event.data);
  }

  onSelectionChanged(event: SelectionChangedEvent): void {
    const selectedRows = this.gridApi.getSelectedRows();
    this.selectionChange.emit(selectedRows);
  }

  onRefresh(): void {
    this.refresh.emit();
  }

  onExport(): void {
    this.export.emit();
  }

  onActionButtonClick(button: ActionButton): void {
    if (button.action && !button.disabled) {
      button.action();
    }
  }

  onRowActionClick(action: RowAction, data: any): void {
    if (action.action && (!action.disabled || !action.disabled(data))) {
      action.action(data);
    }
  }

  isRowActionDisabled(action: RowAction, data: any): boolean {
    return action.disabled ? action.disabled(data) : false;
  }

  applyFilter(): void {
    if (!this.searchText.trim()) {
      this.filteredRowData = [...(this.rowData || [])];
      
      if (this.gridApi) {
        this.gridApi.setGridOption('rowData', this.filteredRowData);
      }
      return;
    }

    const searchTerm = this.searchText.toLowerCase().trim();
    this.filteredRowData = (this.rowData || []).filter(item => {
      return Object.keys(item).some(key => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchTerm);
      });
    });

    if (this.gridApi) {
      this.gridApi.setGridOption('rowData', this.filteredRowData);
    }
  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilter();
  }
} 