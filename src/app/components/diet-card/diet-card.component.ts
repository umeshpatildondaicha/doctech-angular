import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Diet } from '../../interfaces/diet.interface';

@Component({
  selector: 'app-diet-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './diet-card.component.html',
  styleUrl: './diet-card.component.scss'
})
export class DietCardComponent {
  @Input() diet!: Diet;
  @Input() showActions: boolean = true;
  @Input() clickable: boolean = true;

  @Output() cardClick = new EventEmitter<Diet>();
  @Output() viewClick = new EventEmitter<Diet>();
  @Output() editClick = new EventEmitter<Diet>();
  @Output() deleteClick = new EventEmitter<Diet>();
  @Output() videoClick = new EventEmitter<string>();
  @Output() pdfClick = new EventEmitter<string>();

  onCardClick(): void {
    if (this.clickable) {
      this.cardClick.emit(this.diet);
    }
  }

  onView(event: Event): void {
    event.stopPropagation();
    this.viewClick.emit(this.diet);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.editClick.emit(this.diet);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.deleteClick.emit(this.diet);
  }

  onVideoClick(event: Event, url: string): void {
    event.stopPropagation();
    this.videoClick.emit(url);
  }

  onPdfClick(event: Event, url: string): void {
    event.stopPropagation();
    this.pdfClick.emit(url);
  }
}


