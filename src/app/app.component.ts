import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { SidebarService } from './layout/services/sidebar.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule, 
    CommonModule, 
    HighchartsChartModule,
    HeaderComponent, 
    FormsModule,
    SidebarComponent,
    AppointmentCalendarComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,        
    MatNativeDateModule,       
    MatMomentDateModule 
  ],
  providers: [
    MatDatepickerModule, // Add this provider for datepicker functionality
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'doctech-angular';
  isSidebarPinned = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarService.isPinned$.subscribe((isPinned) => {
      this.isSidebarPinned = isPinned;
    });
  }

  onSidebarHoverStart() {
    this.sidebarService.setHoverState(true);
  }

  onSidebarHoverEnd() {
    this.sidebarService.setHoverState(false);
  }
}
