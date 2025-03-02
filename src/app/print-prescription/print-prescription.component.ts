import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-print-prescription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './print-prescription.component.html',
  styleUrl: './print-prescription.component.css'
})
export class PrintPrescriptionComponent {
  today = new Date();
  title = '';
  patientInfo = {
    name: 'John Doe',
    age: '35',
    gender: 'Male', 
    weight: '75',
    bp: '120/80',
    temperature: '98.6',
    symptoms: '',
    diagnosis: ''
  };

  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }> = [{ name: '', dosage: '', frequency: '', duration: '' }];

  private isResizing = false;
  private isDragging = false;
  private resizeDirection = '';
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;
  private startLeft = 0;
  private startTop = 0;

  addMedication(): void {
    this.medications.push({ name: '', dosage: '', frequency: '', duration: '' });
  }

  removeMedication(index: number): void {
    this.medications.splice(index, 1);
  }

  startResize(event: MouseEvent, direction: string): void {
    event.preventDefault();
    this.isResizing = true;
    this.resizeDirection = direction;
    this.startX = event.clientX;
    this.startY = event.clientY;
    
    const contentDiv = document.querySelector('.prescription-content') as HTMLElement;
    if (contentDiv) {
      this.startWidth = contentDiv.offsetWidth;
      this.startHeight = contentDiv.offsetHeight;
      this.startLeft = contentDiv.offsetLeft;
      this.startTop = contentDiv.offsetTop;
    }

    document.addEventListener('mousemove', this.onDrag.bind(this));
    document.addEventListener('mouseup', this.stopDrag.bind(this));
  }

  startDrag(event: MouseEvent): void {
    // Only start dragging if clicking in the middle area (not on resize handles)
    const target = event.target as HTMLElement;
    if (target.classList.contains('prescription-content')) {
      event.preventDefault();
      this.isDragging = true;
      this.isResizing = false;
      this.startX = event.clientX;
      this.startY = event.clientY;

      const contentDiv = document.querySelector('.prescription-content') as HTMLElement;
      if (contentDiv) {
        this.startLeft = contentDiv.offsetLeft;
        this.startTop = contentDiv.offsetTop;
      }
    }
  }

  onDrag(event: MouseEvent): void {
    const contentDiv = document.querySelector('.prescription-content') as HTMLElement;
    if (!contentDiv) return;

    if (this.isResizing) {
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;

      switch (this.resizeDirection) {
        case 'right':
          const newWidth = Math.max(300, this.startWidth + deltaX);
          contentDiv.style.width = `${newWidth}px`;
          break;
        case 'bottom':
          const newHeight = Math.max(400, this.startHeight + deltaY);
          contentDiv.style.height = `${newHeight}px`;
          break;
        case 'left':
          const widthChange = -deltaX;
          const newLeftWidth = Math.max(300, this.startWidth + widthChange);
          contentDiv.style.width = `${newLeftWidth}px`;
          contentDiv.style.left = `${this.startLeft - (newLeftWidth - this.startWidth)}px`;
          break;
        case 'top':
          const heightChange = -deltaY;
          const newTopHeight = Math.max(400, this.startHeight + heightChange);
          contentDiv.style.height = `${newTopHeight}px`;
          contentDiv.style.top = `${this.startTop - (newTopHeight - this.startHeight)}px`;
          break;
      }
    } else if (this.isDragging) {
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;
      
      contentDiv.style.left = `${this.startLeft + deltaX}px`;
      contentDiv.style.top = `${this.startTop + deltaY}px`;
    }
  }

  stopDrag(): void {
    this.isResizing = false;
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onDrag.bind(this));
    document.removeEventListener('mouseup', this.stopDrag.bind(this));
  }

  printPage(): void {
    // Store original styles
    const contentDiv = document.querySelector('.prescription-content') as HTMLElement;
    const originalStyles = {
      width: contentDiv?.style.width,
      height: contentDiv?.style.height,
      left: contentDiv?.style.left,
      top: contentDiv?.style.top
    };

    // Set print styles
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        body * {
          visibility: hidden;
        }
        .card.shadow {
          visibility: visible;
          position: absolute;
          left: 0;
          top: 0;
          width: 210mm;
          box-shadow: none !important;
        }
        .card.shadow * {
          visibility: visible;
        }
        .table-borderless td {
          white-space: nowrap;
          display: table-cell !important;
        }
        .table-borderless tr {
          display: table-row !important;
        }
        .table-borderless tbody {
          display: table-row-group !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Print
    window.print();

    // Restore original styles
    document.head.removeChild(style);
    if (contentDiv) {
      contentDiv.style.width = originalStyles.width || '';
      contentDiv.style.height = originalStyles.height || '';
      contentDiv.style.left = originalStyles.left || '';
      contentDiv.style.top = originalStyles.top || '';
    }
  }
}
