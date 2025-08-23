import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, TopbarComponent, RightSidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Shree Clinic Management System';
  sidebarCollapsed = false;
  rightSidebarOpened = false;
  isAuthenticated = false;
  userType: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.userType = user?.userType || null;
    });
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  openPatientQueue(event: any) {
    this.rightSidebarOpened = true;
  }

  closeRightSidebar() {
    this.rightSidebarOpened = false;
  }
}
