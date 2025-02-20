// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-appointment-edit',
//   imports: [CommonModule, FormsModule], 
//   templateUrl: './appointment-edit.component.html',
//   styleUrls: ['./appointment-edit.component.css']
// })
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AppointmentEditComponent {

  constructor(
    public dialogRef: MatDialogRef<AppointmentEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {}

  closeDialog(): void {
    this.dialogRef.close(); 
  }

  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDays: string[] = [];
  selectedDates: string[] = [];
  selectDateMode: boolean = false;
  selectAll: boolean = false;
  selectedToShow: string = '';
  allSlots: { [key: string]: string[] } = {};
  availableSlots: string[] = [];
  startTime: string = '';
  endTime: string = '';
  breaks: { name: string; start: string; end: string }[] = [];
  appointmentDuration: number = 20;

  toggleMode() {
    this.selectDateMode = !this.selectDateMode;
    this.selectedDays = [];
    this.selectedDates = [];
  }
  
  toggleAllDays() {
    this.selectAll = !this.selectAll;
    this.selectedDays = this.selectAll ? [...this.weekDays] : [];
  }

  toggleDay(day: string) {
    if (this.selectedDays.includes(day)) {
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    } else {
      this.selectedDays.push(day);
    }
    this.selectAll = this.selectedDays.length === this.weekDays.length;
  }

  toggleDate(event: Event) {
    const inputElement = event.target as HTMLInputElement | null;
    if (inputElement && inputElement.value) {
      const date = inputElement.value;
      if (!this.selectedDates.includes(date)) {
        this.selectedDates.push(date);
      }
    }
  }

  addBreak() {
    this.breaks.push({ name: '', start: '', end: '' });
  }

  removeBreak(index: number) {
    this.breaks.splice(index, 1);
  }

  generateSlots() {
    this.allSlots = {};
    this.availableSlots = [];

    if (!this.startTime || !this.endTime || !this.appointmentDuration) {
      alert('Please fill in all details correctly.');
      return;
    }

    const selectedItems = this.selectDateMode ? this.selectedDates : this.selectedDays;
    if (selectedItems.length === 0) {
      alert(`Please select at least one ${this.selectDateMode ? 'date' : 'working day'}.`);
      return;
    }

    const startMinutes = this.timeToMinutes(this.startTime);
    const endMinutes = this.timeToMinutes(this.endTime);
    const breakTimes = this.breaks.map(b => ({
      name: b.name,
      start: this.timeToMinutes(b.start),
      end: this.timeToMinutes(b.end),
    }));

    for (const item of selectedItems) {
      let current = startMinutes;
      this.allSlots[item] = [];

      while (current + this.appointmentDuration <= endMinutes) {
        const breakFound = breakTimes.find(b => current >= b.start && current < b.end);

        if (breakFound) {
          this.allSlots[item].push(`${this.minutesToTime(breakFound.start)} - ${this.minutesToTime(breakFound.end)} (${breakFound.name})`);
          current = breakFound.end; // Move current time to the end of the break
        } else {
          const slotEnd = current + this.appointmentDuration;
          this.allSlots[item].push(`${this.minutesToTime(current)} - ${this.minutesToTime(slotEnd)}`);
          current += this.appointmentDuration;
        }
      }
    }

    this.selectedToShow = selectedItems[0];
    this.updateAvailableSlots();
  }
  
  updateAvailableSlots() {
    this.availableSlots = this.allSlots[this.selectedToShow] || [];
  }

  isInBreak(time: number, breakTimes: { start: number; end: number }[]): boolean {
    return breakTimes.some(b => time >= b.start && time < b.end);
  }

  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  minutesToTime(minutes: number): string {
    return `${this.padZero(Math.floor(minutes / 60))}:${this.padZero(minutes % 60)}`;
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
