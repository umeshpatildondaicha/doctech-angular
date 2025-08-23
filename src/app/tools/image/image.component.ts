import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ImageConfig {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  class?: string;
  style?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  crossorigin?: 'anonymous' | 'use-credentials';
}

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {
  @Input() src: string | undefined = undefined;
  @Input() alt: string = '';
  @Input() width: string | number = '';
  @Input() height: string | number = '';
  @Input() class: string = '';
  @Input() style: string = '';
  @Input() loading: 'lazy' | 'eager' = 'lazy';
  @Input() decoding: 'async' | 'sync' | 'auto' = 'async';
  @Input() crossorigin: 'anonymous' | 'use-credentials' | undefined = undefined;
  @Input() config: ImageConfig | undefined = undefined;
  @Input() clickable: boolean = false;

  @Output() imageLoad = new EventEmitter<Event>();
  @Output() imageError = new EventEmitter<Event>();
  @Output() imageClick = new EventEmitter<Event>();

  ngOnInit() {
    // If config is provided, override individual inputs
    if (this.config) {
      this.src = this.config.src || this.src;
      this.alt = this.config.alt || this.alt;
      this.width = this.config.width || this.width;
      this.height = this.config.height || this.height;
      this.class = this.config.class || this.class;
      this.style = this.config.style || this.style;
      this.loading = this.config.loading || this.loading;
      this.decoding = this.config.decoding || this.decoding;
      this.crossorigin = this.config.crossorigin || this.crossorigin;
    }
  }

  getImageStyle(): string {
    let style = this.style;
    
    if (this.width) {
      style += `width: ${typeof this.width === 'number' ? this.width + 'px' : this.width}; `;
    }
    
    if (this.height) {
      style += `height: ${typeof this.height === 'number' ? this.height + 'px' : this.height}; `;
    }
    
    return style.trim();
  }

  onImageLoad(event: Event): void {
    this.imageLoad.emit(event);
  }

  onImageError(event: Event): void {
    this.imageError.emit(event);
  }

  onImageClick(event: Event): void {
    if (this.clickable) {
      this.imageClick.emit(event);
    }
  }
} 