import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TableModifierComponent } from '../table-modifier/table-modifier.component';

export interface TableColumn {
    field: string;
    headerName: string;
    sortable?: boolean;
    filter?: boolean;
    type?: 'text' | 'number' | 'date' | 'boolean';
    width?: string;
    cellRenderer?: (value: any, row: any) => string;
}

@Component({
    selector: 'app-table-view',
    templateUrl: './table-view.component.html',
    styleUrls: ['./table-view.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DecimalPipe,
        MatDialogModule
    ]
})
export class TableViewComponent implements OnInit {
    @Input() columns: TableColumn[] = [];
    @Input() data: any[] = [];
    @Input() title: string = '';
    @Input() showSearch: boolean = true;
    @Input() showRefresh: boolean = true;
    @Input() showExport: boolean = true;
    @Input() showPagination: boolean = true;
    @Input() showCheckbox: boolean = false;
    @Input() itemsPerPage: number = 10;
    @Input() viewMode: 'list' | 'grid' = 'list';

    @Output() onRowClick = new EventEmitter<any>();
    @Output() onSelectionChange = new EventEmitter<any[]>();
    @Output() onRefresh = new EventEmitter<void>();
    @Output() onExport = new EventEmitter<void>();

    searchText: string = '';
    currentPage: number = 1;
    selectedItems: any[] = [];
    lastUpdated: string = new Date().toLocaleString();

    constructor(private dialog: MatDialog) {}

    ngOnInit(): void {
        // Initialize any necessary setup
    }

    get filteredData(): any[] {
        return this.data.filter(item => {
            if (!this.searchText) return true;
            return Object.values(item).some(value => 
                String(value).toLowerCase().includes(this.searchText.toLowerCase())
            );
        });
    }

    get paginatedData(): any[] {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredData.slice(start, end);
    }

    get totalPages(): number {
        return Math.ceil(this.filteredData.length / this.itemsPerPage);
    }

    onPageChange(page: number): void {
        this.currentPage = page;
    }

    onSearch(): void {
        this.currentPage = 1; // Reset to first page on search
    }

    refreshData(): void {
        this.lastUpdated = new Date().toLocaleString();
        this.onRefresh.emit();
    }

    exportData(): void {
        this.onExport.emit();
    }

    toggleView(mode: 'grid' | 'list'): void {
        this.viewMode = mode;
    }

    openTableModifier(): void {
        const dialogRef = this.dialog.open(TableModifierComponent, {
            width: '800px',
            data: {
                columns: this.columns
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.columns = result;
            }
        });
    }

    handleRowClick(row: any): void {
        this.onRowClick.emit(row);
    }

    handleSelectionChange(selected: any[]): void {
        this.selectedItems = selected;
        this.onSelectionChange.emit(selected);
    }

    handleSelectAll(checked: boolean): void {
        this.handleSelectionChange(checked ? this.paginatedData : []);
    }

    handleSelectRow(row: any, checked: boolean): void {
        if (checked) {
            this.handleSelectionChange([...this.selectedItems, row]);
        } else {
            this.handleSelectionChange(this.selectedItems.filter(item => item !== row));
        }
    }

    getCellValue(row: any, column: TableColumn): any {
        if (column.cellRenderer) {
            return column.cellRenderer(row[column.field], row);
        }
        return row[column.field];
    }
} 