import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-root',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatListModule,
    DragDropModule,
  ],
  providers: [MatDatepickerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild(RightSidebarComponent) rightSidebar!: RightSidebarComponent;

  title = 'doctech-angular';
  isSidebarPinned = false;
  isRightSidebarOpen = false;

  constructor(private sidebarService: SidebarService) {
  }

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
  toggleRightSidebar() {
    if (this.rightSidebar) {
      this.rightSidebar.toggleSidebar();
    }
  }
}
