import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-edit',
  imports: [CommonModule, FormsModule], 
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.css']
})
export class AppointmentEditComponent {
  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDays: string[] = [];
  selectAll: boolean = false;
  startTime: string = '';
  endTime: string = '';
  breaks: { name: string; start: string; end: string }[] = [];
  appointmentDuration: number = 20;
  availableSlots: string[] = [];
  selectedDayToShow: string = ''; 
  allSlots: { [key: string]: string[] } = {}; 

  toggleAllDays() {
    this.selectAll = !this.selectAll;
    this.selectedDays = this.selectAll ? [...this.weekDays] : [];
  }

  toggleDay(day: string) {
    const index = this.selectedDays.indexOf(day);
    index === -1 ? this.selectedDays.push(day) : this.selectedDays.splice(index, 1);
    this.selectAll = this.selectedDays.length === this.weekDays.length;
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
  
    if (this.selectedDays.length === 0) {
      alert('Please select at least one working day.');
      return;
    }
  
    const startMinutes = this.timeToMinutes(this.startTime);
    const endMinutes = this.timeToMinutes(this.endTime);
    const breakTimes = this.breaks.map(b => ({
      name: b.name,
      start: this.timeToMinutes(b.start),
      end: this.timeToMinutes(b.end),
    }));
  
    for (const day of this.selectedDays) {
      let current = startMinutes;
      this.allSlots[day] = [];
  
      while (current + this.appointmentDuration <= endMinutes) {
        const breakFound = breakTimes.find(b => current >= b.start && current < b.end);
  
        if (breakFound) {
          this.allSlots[day].push(`${this.minutesToTime(breakFound.start)} - ${this.minutesToTime(breakFound.end)} (${breakFound.name})`);
          current = breakFound.end; // Move current time to the end of the break
        } else {
          this.allSlots[day].push(`${this.minutesToTime(current)} - ${this.minutesToTime(current + this.appointmentDuration)}`);
          current += this.appointmentDuration;
        }
      }
    }
  
    this.selectedDayToShow = this.selectedDays[0];
    this.updateAvailableSlots();
  }
  

  updateAvailableSlots() {
    this.availableSlots = this.allSlots[this.selectedDayToShow] || [];
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
