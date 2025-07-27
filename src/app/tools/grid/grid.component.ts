import { Component, Input, Output, EventEmitter, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, DomLayoutType } from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppInputComponent, IconComponent, DialogboxService, FilterComponent, GridMenuRendererComponent } from '../index';
import { themeBalham } from 'ag-grid-community';

// Extend GridOptions to include menuActions
interface ExtendedGridOptions extends GridOptions {
  menuActions?: Array<{
    title: string;
    icon: string;
    click: (param: any) => void;
  }>;
}

/**
 * Grid Component with Menu Support
 * 
 * This component extends the standard ag-grid with menu functionality.
 * 
 * Menu Configuration:
 * 1. Set menuActions in gridOptions to automatically add a menu column
 * 2. Or manually add a column with cellRenderer: 'gridMenu'
 * 
 * Example usage:
 * ```typescript
 * this.gridOptions = {
 *   menuActions: [
 *     {
 *       title: 'View',
 *       icon: 'visibility',
 *       click: (param) => this.onView(param.data)
 *     },
 *     {
 *       title: 'Edit',
 *       icon: 'edit',
 *       click: (param) => this.onEdit(param.data)
 *     },
 *     {
 *       title: 'Delete',
 *       icon: 'delete',
 *       click: (param) => this.onDelete(param.data)
 *     }
 *   ]
 * };
 * ```
 */
@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, AgGridModule, AppInputComponent, IconComponent, MatMenuModule, MatIconModule, MatButtonModule, GridMenuRendererComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent {
  @Input() rowData: any[] = [];
  @Input() columnDefs: ColDef[] = [];
  @Input() gridOptions: ExtendedGridOptions = {};
  @Input() domLayout: DomLayoutType = 'autoHeight';
  @Input() animateRows: boolean = true;
  @Input() class: string = 'ag-theme-alpine';
  @Input() height: string = '400px';
  @Input() width: string = '100%';
  @Input() showHeader: boolean = true;
  @Input() searchPlaceholder: string = 'Search...';
  @Input() rightTooltemplateRef: TemplateRef<any> | null = null;

  @Output() searchChange = new EventEmitter<string>();

  searchText: string = '';
  filteredRowData: any[] = [];
  isBrowser: boolean;
  processedColumnDefs: ColDef[] = [];

  constructor(
    private dialogbox: DialogboxService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.gridOptions.theme = themeBalham;
    this.gridOptions.rowHeight = 50;
    this.gridOptions.headerHeight = 50;
    this.gridOptions.context = { gridOptions: this.gridOptions as ExtendedGridOptions };
    this.filteredRowData = [...this.rowData];
    this.processColumnDefs();
  }

  ngOnChanges() {
    this.filteredRowData = [...this.rowData];
    this.applySearch();
    this.processColumnDefs();
  }

  /**
   * Process column definitions to add menu column if needed
   * 
   * This method:
   * 1. Checks if any column has cellRenderer: 'gridMenu'
   * 2. If menuActions exist in gridOptions but no menu column is configured, adds one automatically
   * 3. If a menu column exists, updates it with the proper cell renderer
   */
  private processColumnDefs() {
    this.processedColumnDefs = [...this.columnDefs];
    
    // Check if any column has cellRenderer: 'gridMenu'
    const hasMenuColumn = this.processedColumnDefs.some(col => col.cellRenderer === 'gridMenu');
    
    const extendedGridOptions = this.gridOptions as ExtendedGridOptions;
    
    if (!hasMenuColumn && extendedGridOptions.menuActions && extendedGridOptions.menuActions.length > 0) {
      // Add menu column if menuActions exist but no menu column is configured
      this.processedColumnDefs.push({
        headerName: '',
        field: 'actions',
        sortable: false,
        filter: false,
        minWidth: 80,
        maxWidth: 80,
        pinned: 'right',
        cellRenderer: GridMenuRendererComponent,
        cellRendererParams: {
          menuActions: extendedGridOptions.menuActions
        }
      });
    } else if (hasMenuColumn) {
      // Update existing menu column with cellRenderer
      this.processedColumnDefs = this.processedColumnDefs.map(col => {
        if (col.cellRenderer === 'gridMenu') {
          return {
            ...col,
            cellRenderer: GridMenuRendererComponent,
            cellRendererParams: {
              menuActions: extendedGridOptions.menuActions
            }
          };
        }
        return col;
      });
    }
  }

  onSearchChange(value: string) {
    this.searchText = value;
    this.applySearch();
    this.searchChange.emit(value);
  }

  private applySearch() {
    if (!this.searchText.trim()) {
      this.filteredRowData = [...this.rowData];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredRowData = this.rowData.filter(row => {
      return Object.values(row).some(value => 
        value?.toString().toLowerCase().includes(searchTerm)
      );
    });
  }

  onFilterClick() {
    this.dialogbox.openDialog(FilterComponent, { title: 'Filter Grid' });
  }
}
