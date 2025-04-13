import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService, Theme } from '../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSlideToggleModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  availableThemes: Theme[] = [];
  selectedTheme: string = 'light';
  currentTheme: Theme;

  // Settings state
  emailNotifications = true;
  pushNotifications = true;
  showOnlineStatus = true;
  shareAnalytics = false;

  constructor(private themeService: ThemeService) {
    this.currentTheme = this.themeService.getAvailableThemes()[0];
  }

  ngOnInit() {
    this.availableThemes = this.themeService.getAvailableThemes();
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
      this.selectedTheme = theme.name;
    });
  }

  onThemeChange(theme: string) {
    this.themeService.setTheme(theme);
  }

  saveSettings() {
    // Here you would typically save the settings to a backend
    console.log('Saving settings:', {
      emailNotifications: this.emailNotifications,
      pushNotifications: this.pushNotifications,
      showOnlineStatus: this.showOnlineStatus,
      shareAnalytics: this.shareAnalytics
    });
  }

  resetSettings() {
    this.emailNotifications = true;
    this.pushNotifications = true;
    this.showOnlineStatus = true;
    this.shareAnalytics = false;
    this.themeService.setTheme('default');
  }
}
