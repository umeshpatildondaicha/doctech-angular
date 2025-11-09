import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';
import { Invoice, PaymentRecord } from '../interfaces/billing.interface';

@Injectable({ providedIn: 'root' })
export class BillingService {
  private readonly apiBase = environment.apiUrl;
  private readonly endpoints = environment.endpoints.billing;
  private readonly mock = !!environment.features?.enableMockBilling;

  // In-memory store for mock mode
  private mockInvoices: Invoice[] = [
    {
      id: 'INV-1001',
      invoiceNo: 'INV-1001',
      doctorId: 'DOC-1',
      patientId: 'PAT-1',
      patientName: 'Rahul Sharma',
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7*24*3600*1000).toISOString(),
      status: 'ISSUED',
      items: [
        { description: 'Consultation', quantity: 1, unitPrice: 500 },
        { description: 'X-Ray', quantity: 1, unitPrice: 800, taxRate: 18 }
      ],
      subTotal: 1300,
      discountTotal: 0,
      taxTotal: 144,
      total: 1444,
      amountPaid: 0,
      balanceDue: 1444,
      notes: 'Follow-up in 1 week'
    },
    {
      id: 'INV-1002',
      invoiceNo: 'INV-1002',
      doctorId: 'DOC-1',
      patientId: 'PAT-2',
      patientName: 'Aditi Verma',
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() - 2*24*3600*1000).toISOString(),
      status: 'PARTIALLY_PAID',
      items: [ { description: 'Physiotherapy Session', quantity: 3, unitPrice: 700 } ],
      subTotal: 2100,
      discountTotal: 100,
      taxTotal: 360,
      total: 2360,
      amountPaid: 1000,
      balanceDue: 1360
    }
  ];

  constructor(private readonly http: HttpService) {}

  listInvoices(params?: Record<string, any>): Observable<Invoice[]> {
    if (this.mock) {
      return of(this.applyFilters(this.mockInvoices.slice(), params)).pipe(delay(150));
    }
    const url = this.apiBase + this.endpoints.invoices;
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.http.sendGETRequest(url + query);
  }

  getInvoice(id: string): Observable<Invoice> {
    if (this.mock) {
      const found = this.mockInvoices.find(i => i.id === id) || this.mockInvoices[0];
      return of(found).pipe(delay(100));
    }
    const url = `${this.apiBase + this.endpoints.invoices}/${id}`;
    return this.http.sendGETRequest(url);
  }

  createInvoice(payload: Invoice): Observable<Invoice> {
    if (this.mock) {
      const id = payload.invoiceNo || `INV-${Math.floor(Math.random()*9000+1000)}`;
      const inv: Invoice = { ...payload, id, invoiceNo: id };
      inv.amountPaid = inv.amountPaid ?? 0;
      const paid = inv.amountPaid || 0;
      inv.balanceDue = (inv.total || 0) - paid;
      this.mockInvoices.unshift(inv);
      return of(inv).pipe(delay(150));
    }
    const url = this.apiBase + this.endpoints.invoices;
    return this.http.sendPOSTRequest(url, JSON.stringify(payload));
  }

  updateInvoice(id: string, payload: Partial<Invoice>): Observable<Invoice> {
    if (this.mock) {
      const idx = this.mockInvoices.findIndex(i => i.id === id);
      if (idx >= 0) {
        const merged: Invoice = { ...this.mockInvoices[idx], ...payload } as Invoice;
        merged.amountPaid = merged.amountPaid ?? 0;
        merged.balanceDue = (merged.total || 0) - (merged.amountPaid || 0);
        this.mockInvoices[idx] = merged;
        return of(merged).pipe(delay(120));
      }
      return of(this.mockInvoices[0]).pipe(delay(120));
    }
    const url = `${this.apiBase + this.endpoints.invoices}/${id}`;
    return this.http.sendPUTRequest(url, JSON.stringify(payload));
  }

  deleteInvoice(id: string): Observable<void> {
    if (this.mock) {
      this.mockInvoices = this.mockInvoices.filter(i => i.id !== id);
      return of(void 0).pipe(delay(100));
    }
    const url = `${this.apiBase + this.endpoints.invoices}/${id}`;
    return this.http.sendDELETERequest(url);
  }

  recordPayment(invoiceId: string, payment: PaymentRecord): Observable<Invoice> {
    if (this.mock) {
      const idx = this.mockInvoices.findIndex(i => i.id === invoiceId);
      if (idx >= 0) {
        const inv = { ...this.mockInvoices[idx] } as Invoice;
        inv.amountPaid = (inv.amountPaid || 0) + payment.amount;
        inv.balanceDue = (inv.total || 0) - (inv.amountPaid || 0);
        if (inv.balanceDue <= 0) {
          inv.status = 'PAID';
        } else if (inv.amountPaid) {
          inv.status = 'PARTIALLY_PAID';
        }
        this.mockInvoices[idx] = inv;
        return of(inv).pipe(delay(120));
      }
      return of(this.mockInvoices[0]).pipe(delay(120));
    }
    const url = this.apiBase + this.endpoints.payments;
    return this.http.sendPOSTRequest(url, JSON.stringify({ ...payment, invoiceId }));
  }

  downloadInvoicePdf(id: string): Observable<any> {
    if (this.mock) {
      // In mock mode, just simulate success
      return of({ ok: true }).pipe(delay(80));
    }
    const url = `${this.apiBase + this.endpoints.pdf}/${id}`;
    return this.http.downloadFile(url, `invoice-${id}.pdf`);
  }

  private applyFilters(rows: Invoice[], params?: Record<string, any>): Invoice[] {
    if (!params) return rows;
    const q = (params['q'] || '').toString().toLowerCase();
    const status = (params['status'] || '').toString();
    const from = params['from'] ? new Date(params['from']) : null;
    const to = params['to'] ? new Date(params['to']) : null;
    return rows.filter(r => {
      const matchesQ = !q || r.invoiceNo.toLowerCase().includes(q) || r.patientName.toLowerCase().includes(q);
      const matchesStatus = !status || r.status === status;
      const d = new Date(r.date);
      const matchesFrom = !from || d >= from;
      const matchesTo = !to || d <= to;
      return matchesQ && matchesStatus && matchesFrom && matchesTo;
    });
  }
}


