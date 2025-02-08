import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, MatListModule, MatCardModule, MatIconModule]
})
export class RightSidebarComponent {
  isOpen = false;
  waitingPatients = [
    {
      queueNumber: 1,
      name: 'John Doe',
      problem: 'Fever',
      contactNumber: '123-456-7890',
      waitTime: '15 mins'
    },
    {
      queueNumber: 2, 
      name: 'Jane Smith',
      problem: 'Headache',
      contactNumber: '234-567-8901',
      waitTime: '25 mins'
    },
    {
      queueNumber: 3,
      name: 'Bob Wilson',
      problem: 'Back Pain', 
      contactNumber: '345-678-9012',
      waitTime: '35 mins'
    }
  ];

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
