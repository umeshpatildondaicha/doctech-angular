import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Exercise } from '../../interfaces/exercise.interface';

@Component({
  selector: 'app-exercise-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './exercise-card.component.html',
  styleUrl: './exercise-card.component.scss'
})
export class ExerciseCardComponent {
  @Input() exercise!: Exercise;
  @Input() showActions: boolean = true;
  @Input() clickable: boolean = true;
  @Input() allowSelection: boolean = false;
  @Input() isSelected: boolean = false;
  @Input() variant: 'default' | 'compact' = 'default';

  @Output() cardClick = new EventEmitter<Exercise>();
  @Output() viewClick = new EventEmitter<Exercise>();
  @Output() editClick = new EventEmitter<Exercise>();
  @Output() deleteClick = new EventEmitter<Exercise>();
  @Output() selectClick = new EventEmitter<Exercise>();

  onCardClick(): void {
    if (this.clickable && !this.allowSelection) {
      this.cardClick.emit(this.exercise);
    }
  }

  onView(event: Event): void {
    event.stopPropagation();
    this.viewClick.emit(this.exercise);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.editClick.emit(this.exercise);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.deleteClick.emit(this.exercise);
  }

  onSelect(event: Event): void {
    event.stopPropagation();
    this.selectClick.emit(this.exercise);
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Strength': '#ff6b6b',
      'Cardio': '#4ecdc4',
      'Flexibility': '#95e1d3',
      'Balance': '#f38181'
    };
    return colors[category] || '#95a5a6';
  }

  getSetsDisplay(): string {
    if (!this.exercise.sets || this.exercise.sets.length === 0) {
      return 'No sets defined';
    }
    const setCount = this.exercise.sets.length;
    const totalReps = this.exercise.sets.reduce((sum, set) => sum + set.reps, 0);
    return `${setCount} set${setCount > 1 ? 's' : ''}, ${totalReps} reps total`;
  }

  getTargetMusclesDisplay(): string {
    if (!this.exercise.targetMuscles || this.exercise.targetMuscles.length === 0) {
      return 'No target muscles specified';
    }
    return this.exercise.targetMuscles.join(', ');
  }

  getEquipmentDisplay(): string {
    if (!this.exercise.equipment || this.exercise.equipment.length === 0) {
      return 'No equipment needed';
    }
    return this.exercise.equipment.join(', ');
  }
}

