import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { SidebarMenuItem } from '../../interfaces/sidebarmenu.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();

  iconSizeOnCollapsed = 18;
  iconSizeOnExpanded = 20;

  menuList: SidebarMenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', section: 'main' },
    { label: 'Appointment', icon: 'event', route: '/appointment', section: 'main' },
    { label: 'Doctor', icon: 'local_hospital', route: '/doctor', section: 'main' },
    { label: 'Patient', icon: 'groups', route: '/patient', section: 'main' },
    { label: 'Exercises', icon: 'fitness_center', route: '/exercises', section: 'main' },
    { label: 'Diet', icon: 'track_changes', route: '/diet', section: 'main' },
    { label: 'Billing', icon: 'credit_card', route: '/billing', section: 'main' },
    { label: 'Setting', icon: 'settings', route: '/settings', section: 'tools' },
    { label: 'Help & Support', icon: 'help_center', route: '/help', section: 'tools' },
    { label: 'Logout', icon: 'exit_to_app', section: 'tools' },
  ];

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
