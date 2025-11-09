import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-billing-actions-renderer',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Invoice actions">
      <mat-icon>more_vert</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="onEdit()"><mat-icon>edit</mat-icon><span>Edit</span></button>
      <button mat-menu-item (click)="onPayment()"><mat-icon>payments</mat-icon><span>Record Payment</span></button>
      <button mat-menu-item (click)="onPreview()"><mat-icon>visibility</mat-icon><span>Preview</span></button>
      <button mat-menu-item (click)="onDownload()"><mat-icon>picture_as_pdf</mat-icon><span>Download PDF</span></button>
      <button mat-menu-item (click)="onDelete()" class="warn"><mat-icon color="warn">delete</mat-icon><span>Delete</span></button>
    </mat-menu>
  `
})
export class BillingActionsRendererComponent {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  onEdit() { this.params?.onEdit?.(this.params.data); }
  onPayment() { this.params?.onPayment?.(this.params.data); }
  onPreview() { this.params?.onPreview?.(this.params.data); }
  onDownload() { this.params?.onDownload?.(this.params.data); }
  onDelete() { this.params?.onDelete?.(this.params.data); }
}





