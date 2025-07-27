import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ICellRendererParams } from 'ag-grid-community';
import { IconComponent } from '../app-icon/icon.component';

// Extend GridOptions to include menuActions
interface ExtendedGridOptions {
  menuActions?: Array<{
    title: string;
    icon: string;
    click: (param: any) => void;
  }>;
}

@Component({
  selector: 'app-grid-menu-renderer',
  templateUrl:'./grid-menu-renderer.component.html',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule, IconComponent],
  styleUrl: './grid-menu-renderer.component.scss'
})
export class GridMenuRendererComponent {
  params: any;
  menuActions: any[] = [];

  agInit(params: ICellRendererParams): void {
    this.params = params;
    // Get menuActions from gridOptions
    if (params.context?.gridOptions?.menuActions) {
      this.menuActions = (params.context.gridOptions as ExtendedGridOptions).menuActions || [];
    }
  }

  onActionClick(action: any, rowData: any): void {
    if (action.click && typeof action.click === 'function') {
      action.click({ data: rowData, action: action });
    }
  }
} 