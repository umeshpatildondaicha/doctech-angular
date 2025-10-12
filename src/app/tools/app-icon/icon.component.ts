import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { CommonUtils } from '../../utils/CommonUtils';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [MatIconModule, NgClass],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  @Input() fontSet: string = '';
  @Input() fontIcon: string = '';
  @Input() iconType: 'material' | 'icomoon' = 'material'; // Type of icon to use
  @Input() icomoonClass: string = ''; // Icomoon icon class (e.g., 'icon-home')
  @Input() size: number = 24;
  @Input() isBlink: boolean = false;
  @Input() fontBold: boolean = false;
  @Input() color: string = '#888';
  @Input() class = '';
  @Input() counter: number | null | string = null;
  @Input() isCovered: boolean = false;
  @Output() iconClick = new EventEmitter<Event>();

  onClick(event: Event) {
    this.iconClick.emit(event);
  }

  ngOnInit() {
    if(!this.fontIcon){
      this.counter = CommonUtils.getCounter(this.counter as number);
    }

  }
} 