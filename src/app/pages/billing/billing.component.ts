import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ColDef } from 'ag-grid-community';
import { ExtendedGridOptions, GridComponent } from '../../tools/grid/grid.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { BillingService } from '../../services/billing.service';
import { Invoice, PaymentRecord } from '../../interfaces/billing.interface';
import { InvoiceFormComponent } from './invoice-form.component';
import { PaymentDialogComponent } from './payment-dialog.component';
import { InvoicePreviewDialogComponent } from './invoice-preview-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { BillingActionsRendererComponent } from './billing-actions-renderer.component';
import { BillingStatusRendererComponent } from './billing-status-renderer.component';
import { BillingPatientRendererComponent } from './billing-patient-renderer.component';
import { PatientSearchDialogComponent } from '../patient-search-dialog/patient-search-dialog.component';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    GridComponent,
    BillingActionsRendererComponent,
    BillingStatusRendererComponent,
    BillingPatientRendererComponent
  ],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent implements OnInit, AfterViewInit {
  displayedColumns = ['invoiceNo', 'patientName', 'date', 'total', 'balance', 'status', 'actions'];
  dataSource = new MatTableDataSource<Invoice>([]);
  loading = false;
  summary = { billed: 0, paid: 0, outstanding: 0, overdue: 0 };
  today = new Date();

  rowData: Invoice[] = [];
  columnDefs: ColDef[] = [
    { headerName: 'Invoice #', field: 'invoiceNo', filter: 'agTextColumnFilter', sortable: true, minWidth: 140, maxWidth: 160 },
    { headerName: 'Patient', field: 'patientName', filter: 'agTextColumnFilter', sortable: true, minWidth: 200, flex: 1, cellRenderer: BillingPatientRendererComponent },
    { headerName: 'Date', field: 'date', filter: 'agDateColumnFilter', sortable: true, valueFormatter: p => new Date(p.value).toLocaleDateString(), minWidth: 120 },
    { headerName: 'Total', field: 'total', filter: 'agNumberColumnFilter', sortable: true, valueFormatter: p => this.currencyFmt(p.value), minWidth: 120 },
    { 
      headerName: 'Paid', 
      field: 'amountPaid', 
      filter: 'agNumberColumnFilter', 
      sortable: true,
      valueFormatter: p => this.currencyFmt(p.value || 0),
      minWidth: 120,
      cellRenderer: (params: any) => {
        const paid = params.value || 0;
        const total = params.data.total || 0;
        const percentage = total > 0 ? (paid / total * 100).toFixed(0) : 0;
        return `
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span>${this.currencyFmt(paid)}</span>
            <div style="width: 100%; height: 4px; background: #e0e0e0; border-radius: 2px; overflow: hidden;">
              <div style="width: ${percentage}%; height: 100%; background: #4caf50; transition: width 0.3s;"></div>
            </div>
          </div>
        `;
      }
    },
    { 
      headerName: 'Balance', 
      valueGetter: p => (p.data.balanceDue || ((p.data.total || 0) - (p.data.amountPaid || 0))), 
      filter: 'agNumberColumnFilter', 
      sortable: true, 
      valueFormatter: p => this.currencyFmt(p.value), 
      minWidth: 120,
      cellRenderer: (params: any) => {
        const balance = params.value || 0;
        const color = balance > 0 ? '#d32f2f' : '#4caf50';
        return `<span style="color: ${color}; font-weight: 600;">${this.currencyFmt(balance)}</span>`;
      }
    },
    { headerName: 'Status', field: 'status', filter: 'agTextColumnFilter', sortable: true, minWidth: 140, cellRenderer: BillingStatusRendererComponent },
    { headerName: '', field: 'actions', maxWidth: 72, pinned: 'right', sortable: false, filter: false,
      cellRenderer: BillingActionsRendererComponent,
      cellRendererParams: () => ({
        onEdit: (row: Invoice) => this.openEdit(row),
        onPayment: (row: Invoice) => this.openPayment(row),
        onPreview: (row: Invoice) => this.preview(row),
        onDownload: (row: Invoice) => this.downloadPdf(row),
        onDelete: (row: Invoice) => this.delete(row)
      })
    }
  ];
  gridOptions: ExtendedGridOptions = { 
    rowHeight: 48, 
    headerHeight: 40, 
    animateRows: true,
    pagination: true,
    paginationPageSize: 25,
    paginationPageSizeSelector: [10, 25, 50, 100]
    // Note: menuActions removed to avoid duplicate action buttons
    // Using BillingActionsRendererComponent in columnDefs instead
  };

  private currencyFmt(val: any): string {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(num);
  }

  filters = this.fb.group({
    search: [''],
    status: [''],
    from: [null as Date | null],
    to: [null as Date | null]
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly billing: BillingService,
    private readonly dialog: MatDialog,
    private readonly snack: MatSnackBar,
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  refresh(): void {
    this.loading = true;
    const params: Record<string, string> = {};
    const f = this.filters.getRawValue();
    if (f.search) params['q'] = f.search;
    if (f.status) params['status'] = f.status;
    if (f.from instanceof Date) params['from'] = f.from.toISOString();
    if (f.to instanceof Date) params['to'] = f.to.toISOString();

    this.billing.listInvoices(params).subscribe({
      next: (res) => {
        const rows = (res || []).map(r => ({
          ...r,
          amountPaid: r.amountPaid ?? 0,
          balanceDue: r.balanceDue ?? Math.max((r.total || 0) - (r.amountPaid || 0), 0)
        }));
        this.dataSource.data = rows as Invoice[];
        this.rowData = rows as Invoice[];
        this.computeSummary(rows);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Failed to load invoices', 'Dismiss', { duration: 3000 });
      }
    });
  }

  private computeSummary(rows: Invoice[]): void {
    const today = new Date();
    const billed = rows.reduce((s, r) => s + (r.total || 0), 0);
    const paid = rows.reduce((s, r) => s + (r.amountPaid || 0), 0);
    const outstanding = rows.reduce((s, r) => s + (Math.max((r.total || 0) - (r.amountPaid || 0), 0)), 0);
    const overdue = rows.filter(r => r.status !== 'PAID' && r.dueDate && new Date(r.dueDate) < today)
                        .reduce((s, r) => s + (Math.max((r.total || 0) - (r.amountPaid || 0), 0)), 0);
    this.summary = { billed, paid, outstanding, overdue };
  }

  openCreate(): void {
    // Open patient search dialog - navigate to patient billing dashboard
    const patientSearchRef = this.dialog.open(PatientSearchDialogComponent, {
      width: '90%',
      maxWidth: '1000px',
      height: '90%',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: false
    });

    patientSearchRef.afterClosed().subscribe((result) => {
      if (result?.action === 'select' && result?.patient) {
        // Navigate to patient billing dashboard
        const patient = result.patient;
        this.router.navigate(['/billing/patient', patient.id], {
          queryParams: { patientName: patient.fullName || `${patient.firstName} ${patient.lastName}` }
        });
      }
    });
  }

  openEdit(inv: Invoice): void {
    const ref = this.dialog.open(InvoiceFormComponent, { width: '900px', maxWidth: '95vw', maxHeight: '90vh', autoFocus: false, data: { invoice: inv } });
    ref.afterClosed().subscribe((invoice: Invoice | undefined) => {
      if (!invoice || !inv.id) { return; }
      this.billing.updateInvoice(inv.id, invoice).subscribe({
        next: () => {
          this.snack.open('Invoice updated', 'OK', { duration: 2000 });
          this.refresh();
        },
        error: () => this.snack.open('Failed to update invoice', 'Dismiss', { duration: 3000 })
      });
    });
  }

  openPayment(inv: Invoice): void {
    if (!inv?.id) { return; }
    const ref = this.dialog.open(PaymentDialogComponent, { width: '600px', data: { invoiceId: inv.id, balanceDue: inv.balanceDue } });
    ref.afterClosed().subscribe((payment: PaymentRecord | undefined) => {
      if (!payment) { return; }
      this.billing.recordPayment(inv.id as string, payment).subscribe({
        next: () => {
          this.snack.open('Payment recorded', 'OK', { duration: 2000 });
          this.refresh();
        },
        error: () => this.snack.open('Failed to record payment', 'Dismiss', { duration: 3000 })
      });
    });
  }

  downloadPdf(inv: Invoice): void {
    if (!inv?.id) { return; }
    this.billing.downloadInvoicePdf(inv.id).subscribe({
      next: () => this.snack.open('Download started', 'OK', { duration: 2000 }),
      error: () => this.snack.open('Failed to download PDF', 'Dismiss', { duration: 3000 })
    });
  }

  preview(inv: Invoice): void {
    this.dialog.open(InvoicePreviewDialogComponent, { width: '900px', maxWidth: '95vw', data: { invoice: inv } });
  }

  delete(inv: Invoice): void {
    if (!inv?.id) { return; }
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { message: `Delete invoice ${inv.invoiceNo}?`, confirmText: 'Delete', cancelText: 'Cancel' }});
    ref.afterClosed().subscribe((yes: boolean) => {
      if (!yes) return;
      this.billing.deleteInvoice(inv.id as string).subscribe({
        next: () => {
          this.snack.open('Invoice deleted', 'OK', { duration: 2000 });
          this.refresh();
        },
        error: () => this.snack.open('Failed to delete invoice', 'Dismiss', { duration: 3000 })
      });
    });
  }

  clearFilters(): void {
    this.filters.reset({ search: '', status: '', from: null, to: null });
    this.refresh();
  }

  isOverdue(inv: Invoice): boolean {
    if (!inv.dueDate) return false;
    if (inv.status === 'PAID') return false;
    const balance = inv.balanceDue ?? Math.max((inv.total || 0) - (inv.amountPaid || 0), 0);
    if (balance <= 0) return false;
    return new Date(inv.dueDate) < this.today;
  }

  onRowClick(row: Invoice): void {
    // Navigate to invoice detail or patient billing dashboard
    this.router.navigate(['/billing/invoice', row.id]);
  }
}
