import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererParams } from 'ag-grid-community';
import { CHIP_COLORS } from '../../constants/chip.constant';

@Component({
  selector: 'app-chip-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chip-cell-renderer.component.html',
  styleUrl: './chip-cell-renderer.component.scss'
})
export class ChipCellRendererComponent {
  params: ICellRendererParams = {} as ICellRendererParams;
  status: string = '';
  color: string = '';
  chipColors:any = CHIP_COLORS;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.status = params.value;
    this.color = this.chipColors[this.status] ?? 'gray';
  }

} 