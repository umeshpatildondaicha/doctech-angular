import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { IconComponent } from '../app-icon/icon.component';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule, NgClass, IconComponent],
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.scss'
})
export class AppButtonComponent {
  @Input() color: 'primary' | 'accent' | 'warn' | undefined = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() appearance: 'raised' | 'flat' | 'stroked' | 'icon' | 'fab' | 'mini-fab' | 'basic' | undefined = 'raised';
  @Input() class = '';
  @Input() text: string = '';
  @Input() fontIcon: string ='';
  @Output() btnClick = new EventEmitter<Event>();

  onClick(event: Event) {
    this.btnClick.emit(event);
  }
}
