import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { SidebarService } from './layout/services/sidebar.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CalendarModule } from './calendar/calendar.module';
import { CalendarComponent } from './calendar/calendar.component';
import { PatientsComponent } from './patients/patients.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { SettingsComponent } from './settings/settings.component';
import { HelpComponent } from './help/help.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HighchartsChartModule,
    HeaderComponent,
    FormsModule,
    SidebarComponent,
    RightSidebarComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    DragDropModule,
    CalendarModule
  ] as const,
  providers: [MatDatepickerModule, ThemeService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './shared/styles.css'],
})
export class AppComponent implements OnInit {
  @ViewChild(RightSidebarComponent) rightSidebar!: RightSidebarComponent;

  title = 'doctech-angular';
  isSidebarPinned = false;
  isRightSidebarOpen = false;
  waitingPatientsCount: number = 0;
  isSidebarOpen = true;

  constructor(
    private sidebarService: SidebarService,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.currentTheme$.subscribe(theme => {
      document.documentElement.setAttribute('data-theme', theme.name);
    });

    // Then handle sidebar state
    this.sidebarService.isPinned$.subscribe((isPinned) => {
      this.isSidebarPinned = isPinned;
    });
  }

  ngAfterViewInit() {
    // Use setTimeout to push the update to the next change detection cycle
    setTimeout(() => {
      if (this.rightSidebar) {
        this.waitingPatientsCount = this.rightSidebar.waitingPatients.length;
        this.cdr.detectChanges();
      }
    });
  }

  onSidebarHoverStart() {
    this.sidebarService.setHoverState(true);
  }

  onSidebarHoverEnd() {
    this.sidebarService.setHoverState(false);
  }

  toggleRightSidebar() {
    if (this.rightSidebar) {
      this.rightSidebar.toggleSidebar();
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
