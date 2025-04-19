import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// Define the interface for care schedule items
export interface CareTimetableItem {
  id: number;
  type: string;
  title: string;
  description: string;
  assignee: string;
  startTime: Date;
  endTime: Date;
  status: string;
}

@Component({
  selector: 'app-care-schedule-timeline',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './care-schedule-timeline.component.html',
  styleUrls: ['./care-schedule-timeline.component.css']
})
export class CareScheduleTimelineComponent implements OnInit {
  @Input() careScheduleItems: CareTimetableItem[] = [];
  
  today = new Date();
  
  ngOnInit(): void {
    // No need for column assignment in the grid layout
  }
  
  /**
   * Calculate hour markers for the timeline
   */
  getHourMarkers() {
    const markers = [];
    for (let hour = 6; hour <= 22; hour++) {
      // Add marker for the hour
      markers.push({
        hour: hour,
        label: hour > 12 ? `${hour-12} PM` : hour === 12 ? '12 PM' : `${hour} AM`
      });
      
      // Add marker for the half hour (except for the last hour)
      if (hour < 22) {
        markers.push({
          hour: hour + 0.5,
          label: hour >= 12 ? `${hour === 12 ? 12 : hour-12}:30 PM` : `${hour}:30 AM`
        });
      }
    }
    return markers;
  }
  
  /**
   * Get items that belong to a specific time slot
   */
  getItemsForTimeSlot(slotHour: number): CareTimetableItem[] {
    if (!this.careScheduleItems || this.careScheduleItems.length === 0) {
      return [];
    }
    
    // Get the slot start and end times
    const slotStart = Math.floor(slotHour);
    const slotEnd = slotHour === Math.floor(slotHour) ? slotHour + 0.5 : Math.ceil(slotHour);
    
    // Filter items that belong to this slot
    return this.careScheduleItems.filter(item => {
      const itemStartHour = item.startTime.getHours() + (item.startTime.getMinutes() / 60);
      const itemEndHour = item.endTime.getHours() + (item.endTime.getMinutes() / 60);
      
      // Check if the item starts in this slot or spans across it
      return (itemStartHour >= slotStart && itemStartHour < slotEnd) || 
             (itemStartHour < slotStart && itemEndHour > slotStart);
    });
  }
  
  /**
   * Check if current time is in a specific time slot
   */
  isCurrentTimeInSlot(slotHour: number): boolean {
    const now = new Date();
    const currentHour = now.getHours() + (now.getMinutes() / 60);
    
    // Get the slot start and end times
    const slotStart = Math.floor(slotHour);
    const slotEnd = slotHour === Math.floor(slotHour) ? slotHour + 0.5 : Math.ceil(slotHour);
    
    // Check if current time is in this slot
    return currentHour >= slotStart && currentHour < slotEnd;
  }
  
  /**
   * Get appropriate icon for schedule item based on type
   */
  getScheduleItemIcon(item: CareTimetableItem): string {
    const icons: {[key: string]: string} = {
      'medication': 'bi bi-capsule me-1',
      'doctor-visit': 'bi bi-person-badge me-1',
      'nursing': 'bi bi-heart-pulse me-1',
      'procedure': 'bi bi-tools me-1',
      'test': 'bi bi-flask me-1'
    };
    return icons[item.type] || 'bi bi-calendar-event me-1';
  }
  
  /**
   * Handle click on a schedule item
   */
  onScheduleItemClick(item: CareTimetableItem): void {
    console.log('Schedule item clicked:', item);
    // In a real app, this might open a dialog with details and actions
  }
} 