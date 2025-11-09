import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { BillingService } from '../../services/billing.service';
import { Invoice, InvoiceItem, PaymentRecord } from '../../interfaces/billing.interface';
import { PaymentDialogComponent } from './payment-dialog.component';
import { InvoiceFormComponent } from './invoice-form.component';
import { InvoicePreviewDialogComponent } from './invoice-preview-dialog.component';
import { BillingStatusRendererComponent } from './billing-status-renderer.component';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    BillingStatusRendererComponent
  ],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss'
})
export class InvoiceDetailComponent implements OnInit {
  invoiceId: string = '';
  invoice: Invoice | null = null;
  loading = false;
  selectedTab = 'items';
  
  payments: PaymentRecord[] = [];
  displayedPaymentColumns = ['date', 'amount', 'method', 'reference', 'notes'];

  constructor(
    private readonly route: ActivatedRoute,
    public router: Router,
    private readonly billingService: BillingService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.invoiceId = params['id'];
      this.loadInvoice();
    });
  }

  private loadInvoice(): void {
    this.loading = true;
    // TODO: Replace with actual API call
    // this.billingService.getInvoice(this.invoiceId).subscribe({
    //   next: (invoice) => {
    //     this.invoice = invoice;
    //     this.loadPayments();
    //     this.loading = false;
    //   },
    //   error: () => {
    //     this.loading = false;
    //     this.snackBar.open('Failed to load invoice', 'Dismiss', { duration: 3000 });
    //   }
    // });
    
    // Mock data for now
    this.invoice = {
      id: this.invoiceId,
      invoiceNo: 'INV-2024-00123',
      patientId: 'PAT001',
      patientName: 'Amelia Burrow',
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PARTIALLY_PAID',
      items: [
        { description: 'Initial Consultation', quantity: 1, unitPrice: 350, taxRate: 18, discount: 0 },
        { description: 'Standard Blood Panel', quantity: 1, unitPrice: 250, taxRate: 18, discount: 0 },
        { description: 'Specialist Referral', quantity: 1, unitPrice: 100, taxRate: 18, discount: 0 }
      ],
      subTotal: 700,
      taxTotal: 126,
      discountTotal: 0,
      total: 1000,
      amountPaid: 600,
      balanceDue: 400,
      notes: ''
    };
    
    this.loadPayments();
    this.loading = false;
  }

  private loadPayments(): void {
    if (!this.invoice?.id) return;
    // TODO: Replace with actual API call
    // this.billingService.getInvoicePayments(this.invoice.id).subscribe({
    //   next: (payments) => {
    //     this.payments = payments || [];
    //   }
    // });
    
    // Mock payments
    this.payments = [
      {
        id: '1',
        invoiceId: this.invoice.id,
        amount: 600,
        method: 'CARD',
        reference: 'TXN123456',
        date: new Date().toISOString(),
        notes: 'Partial payment'
      }
    ];
  }

  recordPayment(): void {
    if (!this.invoice?.id) return;
    const ref = this.dialog.open(PaymentDialogComponent, {
      width: '600px',
      data: { invoiceId: this.invoice.id, balanceDue: this.invoice.balanceDue }
    });

    ref.afterClosed().subscribe((payment: PaymentRecord | undefined) => {
      if (payment) {
        this.billingService.recordPayment(this.invoice!.id as string, payment).subscribe({
          next: () => {
            this.snackBar.open('Payment recorded', 'OK', { duration: 2000 });
            this.loadInvoice();
          },
          error: () => this.snackBar.open('Failed to record payment', 'Dismiss', { duration: 3000 })
        });
      }
    });
  }

  recordItemPayment(item: InvoiceItem): void {
    if (!this.invoice?.id || !item.id) return;
    
    const itemTotal = (item.quantity * item.unitPrice - (item.discount || 0)) * (1 + (item.taxRate || 0) / 100);
    const balance = itemTotal - (item.amountPaid || 0);
    
    const ref = this.dialog.open(PaymentDialogComponent, {
      width: '600px',
      data: { 
        invoiceId: this.invoice.id, 
        itemId: item.id,
        balanceDue: balance,
        itemDescription: item.description
      }
    });

    ref.afterClosed().subscribe((payment: PaymentRecord | undefined) => {
      if (payment) {
        // Update item payment
        payment.itemId = item.id;
        this.billingService.recordPayment(this.invoice!.id as string, payment).subscribe({
          next: () => {
            this.snackBar.open('Payment recorded for item', 'OK', { duration: 2000 });
            this.loadInvoice();
          },
          error: () => this.snackBar.open('Failed to record payment', 'Dismiss', { duration: 3000 })
        });
      }
    });
  }

  editInvoice(): void {
    if (!this.invoice) return;
    const ref = this.dialog.open(InvoiceFormComponent, {
      width: '95%',
      maxWidth: '1400px',
      maxHeight: '95vh',
      autoFocus: false,
      data: { invoice: this.invoice }
    });

    ref.afterClosed().subscribe((invoice: Invoice | undefined) => {
      if (invoice && this.invoice?.id) {
        this.billingService.updateInvoice(this.invoice.id, invoice).subscribe({
          next: () => {
            this.snackBar.open('Invoice updated', 'OK', { duration: 2000 });
            this.loadInvoice();
          },
          error: () => this.snackBar.open('Failed to update invoice', 'Dismiss', { duration: 3000 })
        });
      }
    });
  }

  getItemTotal(item: InvoiceItem): number {
    const subtotal = item.quantity * item.unitPrice - (item.discount || 0);
    return subtotal * (1 + (item.taxRate || 0) / 100);
  }

  getItemBalance(item: InvoiceItem): number {
    const total = this.getItemTotal(item);
    return total - (item.amountPaid || 0);
  }

  getPaymentProgress(): number {
    if (!this.invoice || this.invoice.total === 0) return 0;
    return ((this.invoice.amountPaid || 0) / this.invoice.total) * 100;
  }

  currencyFmt(val: any): string {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(num);
  }

  isOverdue(): boolean {
    if (!this.invoice?.dueDate) return false;
    if (this.invoice.status === 'PAID') return false;
    return new Date(this.invoice.dueDate) < new Date();
  }

  getDaysOverdue(): number {
    if (!this.invoice?.dueDate) return 0;
    const today = new Date();
    const dueDate = new Date(this.invoice.dueDate);
    return Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  printInvoice(): void {
    if (!this.invoice) return;
    this.dialog.open(InvoicePreviewDialogComponent, {
      width: '90%',
      maxWidth: '900px',
      maxHeight: '95vh',
      data: { invoice: this.invoice },
      panelClass: 'invoice-preview-dialog'
    });
  }

  downloadPdf(): void {
    if (!this.invoice?.id) return;
    this.billingService.downloadInvoicePdf(this.invoice.id).subscribe({
      next: () => {
        this.snackBar.open('Invoice PDF downloaded', 'OK', { duration: 2000 });
      },
      error: () => {
        // Fallback to print if download fails
        this.printInvoice();
      }
    });
  }
}
