import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.css']
})
export class MetricCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() increment: string = '';
  @Input() subtext: string = '';
  @Input() showDetails: boolean = true;

  /**
   * Determines if the increment is positive, negative, or neutral
   */
  isPositiveIncrement(): boolean {
    return typeof this.increment === 'string' && this.increment.startsWith('+');
  }

  isNegativeIncrement(): boolean {
    return typeof this.increment === 'string' && this.increment.startsWith('-');
  }

  /**
   * Handle the click event for the "See details" button
   */
  onSeeDetailsClick(): void {
    // This can be enhanced with an Output emitter if needed
    console.log(`See details clicked for ${this.title}`);
  }
} 