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
  filterConfig?: {
    fields?: Array<{ label: string; value: string; inputType: 'select' | 'input' | 'number' | 'date' | 'boolean' }>;
    valuesMap?: { [key: string]: any[] };
    operatorsMap?: { [key: string]: Array<{ label: string; value: string }> };
    initialFilters?: Array<{ field: string; operator: string; value: any; valueTo?: any; inputType: any }>;
    logic?: 'AND' | 'OR';
  };
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
  @Input() cardTemplate: TemplateRef<any> | null = null;
  @Input() defaultViewMode: 'list' | 'card' = 'list';

  @Output() searchChange = new EventEmitter<string>();
  @Output() rowClicked = new EventEmitter<any>();

  searchText: string = '';
  filteredRowData: any[] = [];
  isBrowser: boolean;
  processedColumnDefs: ColDef[] = [];
  activeFiltersCount: number = 0;
  viewMode: 'list' | 'card' = 'list';

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
    this.viewMode = this.defaultViewMode;
    this.processColumnDefs();
  }

  ngOnChanges() {
    this.filteredRowData = this.applySearchTo([...this.rowData]);
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
      // Add compact hover-only menu column if menuActions exist but no menu column is configured
      this.processedColumnDefs.push({
        headerName: '',
        field: 'actions',
        sortable: false,
        filter: false,
        width: 36,
        minWidth: 36,
        maxWidth: 36,
        suppressSizeToFit: true,
        resizable: false,
        pinned: 'right',
        cellClass: 'actions-cell',
        headerClass: 'actions-header-cell',
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
    // Re-apply search on top of active advanced filters
    const base = this._activeFilters && this._activeFilters.length
      ? (this.rowData || []).filter(r => this._activeFilters!.map(f => this.evaluateFilter(r, f)).reduce((acc, cur) => this._activeLogic === 'AND' ? acc && cur : acc || cur, this._activeLogic === 'AND'))
      : [...(this.rowData || [])];
    this.filteredRowData = this.applySearchTo(base);
    this.searchChange.emit(value);
  }

  private applySearchTo(data: any[]): any[] {
    if (!this.searchText || !this.searchText.trim()) return data;
    const searchTerm = this.searchText.toLowerCase();
    return (data || []).filter(row => Object.values(row).some(value => value?.toString().toLowerCase().includes(searchTerm)));
  }

  onFilterClick() {
    const data = this.buildFilterDialogData();
    const ref = this.dialogbox.openDialog(FilterComponent, { 
      title: 'Filter Grid', 
      data, 
      width: '900px' 
    });
    ref.afterClosed().subscribe((result: any) => {
      if (result && result.filters) {
        this.applyAdvancedFilters(result.filters, result.logic || 'AND');
        this.activeFiltersCount = result.filters.length;
      } else if (result === null) {
        // Dialog was cancelled or cleared
        this.activeFiltersCount = 0;
      }
    });
  }

  private buildFilterDialogData() {
    const extendedGridOptions = this.gridOptions as ExtendedGridOptions;
    const provided = extendedGridOptions.filterConfig || {};

    const fields = (provided.fields && provided.fields.length ? provided.fields : this.columnDefs
      .filter(col => !!col.field)
      .map(col => {
        return {
          label: col.headerName || (col.field as string),
          value: col.field as string,
          inputType: this.detectInputType(col.field as string)
        };
      }));

    const valuesMap: { [key: string]: any[] } = { ...(provided.valuesMap || {}) };
    const operatorsMap: { [key: string]: Array<{ label: string; value: string }>} = { ...(provided.operatorsMap || {}) };

    for (const fieldDef of fields) {
      if (fieldDef.inputType === 'select') {
        if (!valuesMap[fieldDef.value]) {
          valuesMap[fieldDef.value] = this.getUniqueValues(fieldDef.value, 200);
        }
      }
      if (!operatorsMap[fieldDef.value]) {
        operatorsMap[fieldDef.value] = this.defaultOperatorsByType(fieldDef.inputType);
      }
    }

    const initialFilters = provided.initialFilters || this._activeFilters || [];
    const logic = provided.logic || this._activeLogic || 'AND';

    return { fields, valuesMap, operatorsMap, filters: initialFilters, logic };
  }

  private detectInputType(field: string): 'select' | 'input' | 'number' | 'date' | 'boolean' {
    // Prefer select when unique values are small
    const uniques = this.getUniqueValues(field, 51);
    if (uniques.length > 0 && uniques.length <= 50) {
      return 'select';
    }
    const sample = this.rowData && this.rowData.length ? this.rowData[0][field] : undefined;
    if (typeof sample === 'number') return 'number';
    if (typeof sample === 'boolean') return 'boolean';
    if (this.looksLikeDate(sample)) return 'date';
    return 'input';
  }

  private looksLikeDate(value: any): boolean {
    if (!value) return false;
    if (value instanceof Date) return true;
    const dt = new Date(value);
    return !isNaN(dt.getTime());
  }

  private getUniqueValues(field: string, limit: number): any[] {
    const set = new Set<any>();
    for (const row of this.rowData || []) {
      set.add(row[field]);
      if (set.size >= limit) break;
    }
    return Array.from(set);
  }

  private defaultOperatorsByType(type: 'select' | 'input' | 'number' | 'date' | 'boolean') {
    switch (type) {
      case 'number':
        return [
          { label: 'Equals', value: 'eq' },
          { label: 'Not Equals', value: 'neq' },
          { label: 'Greater Than', value: 'gt' },
          { label: 'Greater Or Equal', value: 'gte' },
          { label: 'Less Than', value: 'lt' },
          { label: 'Less Or Equal', value: 'lte' },
          { label: 'Between', value: 'between' }
        ];
      case 'date':
        return [
          { label: 'On', value: 'eq' },
          { label: 'Before', value: 'lt' },
          { label: 'After', value: 'gt' },
          { label: 'Between', value: 'between' }
        ];
      case 'boolean':
        return [
          { label: 'Is', value: 'eq' },
          { label: 'Is Not', value: 'neq' }
        ];
      case 'select':
      case 'input':
      default:
        return [
          { label: 'Contains', value: 'contains' },
          { label: 'Equals', value: 'eq' },
          { label: 'Not Equals', value: 'neq' },
          { label: 'Starts With', value: 'startsWith' },
          { label: 'Ends With', value: 'endsWith' },
          { label: 'Is Empty', value: 'empty' },
          { label: 'Is Not Empty', value: 'notEmpty' }
        ];
    }
  }

  private _activeFilters: Array<{ field: string; operator: string; value: any; valueTo?: any; inputType: any }> = [];
  private _activeLogic: 'AND' | 'OR' = 'AND';

  private applyAdvancedFilters(filters: any[], logic: 'AND' | 'OR') {
    this._activeFilters = filters;
    this._activeLogic = logic;

    if (!filters || filters.length === 0) {
      this.filteredRowData = this.applySearchTo([...(this.rowData || [])]);
      return;
    }

    const evaluator = (row: any) => {
      const results = filters.map(f => this.evaluateFilter(row, f));
      return logic === 'AND' ? results.every(Boolean) : results.some(Boolean);
    };

    const base = (this.rowData || []).filter(evaluator);
    this.filteredRowData = this.applySearchTo(base);
  }

  private evaluateFilter(row: any, f: { field: string; operator: string; value: any; valueTo?: any; inputType: any }): boolean {
    const raw = row[f.field];
    const op = (f.operator || '').toLowerCase();
    const type = f.inputType;

    // Handle empty/notEmpty without touching values
    if (op === 'empty') return raw === undefined || raw === null || String(raw).trim() === '';
    if (op === 'notempty') return !(raw === undefined || raw === null || String(raw).trim() === '');

    if (type === 'number') {
      const a = Number(raw);
      const b = Number(f.value);
      const c = f.valueTo !== undefined ? Number(f.valueTo) : undefined;
      if (isNaN(a) || isNaN(b)) return false;
      switch (op) {
        case 'eq': return a === b;
        case 'neq': return a !== b;
        case 'gt': return a > b;
        case 'gte': return a >= b;
        case 'lt': return a < b;
        case 'lte': return a <= b;
        case 'between': return c !== undefined && !isNaN(c) ? a >= Math.min(b, c) && a <= Math.max(b, c) : false;
        default: return false;
      }
    }

    if (type === 'date') {
      const a = this.toDate(raw);
      const b = this.toDate(f.value);
      const c = f.valueTo ? this.toDate(f.valueTo) : null;
      if (!a || !b) return false;
      switch (op) {
        case 'eq': return this.sameDay(a, b);
        case 'lt': return a.getTime() < b.getTime();
        case 'gt': return a.getTime() > b.getTime();
        case 'between': return !!c && a.getTime() >= Math.min(b.getTime(), c.getTime()) && a.getTime() <= Math.max(b.getTime(), c.getTime());
        default: return false;
      }
    }

    if (type === 'boolean') {
      const a = Boolean(raw);
      const b = f.value === true || f.value === 'true';
      switch (op) {
        case 'eq': return a === b;
        case 'neq': return a !== b;
        default: return false;
      }
    }

    // string/select
    const a = (raw ?? '').toString().toLowerCase();
    const b = (f.value ?? '').toString().toLowerCase();
    switch (op) {
      case 'eq': return a === b;
      case 'neq': return a !== b;
      case 'contains': return a.includes(b);
      case 'startswith': return a.startsWith(b);
      case 'endswith': return a.endsWith(b);
      default: return false;
    }
  }

  private toDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  private sameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  // New grid methods for enhanced functionality
  onRefresh(): void {
    // Emit refresh event or reload data
    this.filteredRowData = [...this.rowData];
    console.log('Grid refreshed');
  }

  onExport(): void {
    // Export grid data to CSV
    const csvContent = this.exportToCSV();
    this.downloadCSV(csvContent, 'grid-data.csv');
  }

  private exportToCSV(): string {
    if (!this.filteredRowData || this.filteredRowData.length === 0) {
      return '';
    }

    // Get column headers
    const headers = this.processedColumnDefs
      .filter(col => col.field && col.field !== 'actions')
      .map(col => col.headerName || col.field);

    // Get data rows
    const rows = this.filteredRowData.map(item => 
      this.processedColumnDefs
        .filter(col => col.field && col.field !== 'actions')
        .map(col => {
          const value = item[col.field!];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        })
    );

    // Combine headers and rows
    const csvArray = [headers, ...rows];
    return csvArray.map(row => row.join(',')).join('\n');
  }

  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // View mode switching
  switchToListView(): void {
    this.viewMode = 'list';
  }

  switchToCardView(): void {
    this.viewMode = 'card';
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'card' : 'list';
  }

  onRowClicked(event: any) {
    if (!event || !event.data) return;
    this.rowClicked.emit(event.data);
  }
}
