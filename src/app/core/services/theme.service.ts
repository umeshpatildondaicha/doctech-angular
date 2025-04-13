import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    'text-secondary': string;
    border: string;
    accent: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'selected_theme';
  private currentThemeSubject = new BehaviorSubject<Theme>(this.getDefaultTheme());
  currentTheme$ = this.currentThemeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = this.getSavedTheme();
      if (savedTheme) {
        this.setTheme(savedTheme.name);
      }
    }
  }

  getAvailableThemes(): Theme[] {
    return [
      {
        name: 'light',
        colors: {
          primary: '#007bff',
          secondary: '#6c757d',
          background: '#ffffff',
          surface: '#f8f9fa',
          text: '#333333',
          'text-secondary': '#666666',
          border: '#dee2e6',
          accent: '#6200ea',
          success: '#4caf50',
          error: '#f44336',
          warning: '#ff9800',
          info: '#2196f3'
        }
      },
      {
        name: 'dark',
        colors: {
          primary: '#90caf9',
          secondary: '#b0bec5',
          background: '#121212',
          surface: '#1e1e1e',
          text: '#ffffff',
          'text-secondary': '#b0bec5',
          border: '#424242',
          accent: '#b388ff',
          success: '#81c784',
          error: '#e57373',
          warning: '#ffb74d',
          info: '#64b5f6'
        }
      }
    ];
  }

  getDefaultTheme(): Theme {
    return this.getAvailableThemes()[0];
  }

  private getSavedTheme(): Theme | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const savedThemeName = localStorage.getItem(this.THEME_KEY);
    if (savedThemeName) {
      return this.getAvailableThemes().find(theme => theme.name === savedThemeName) || null;
    }
    return null;
  }

  setTheme(themeName: string) {
    const theme = this.getAvailableThemes().find(t => t.name === themeName);
    if (theme) {
      this.currentThemeSubject.next(theme);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.THEME_KEY, themeName);
      }
      this.applyTheme(theme);
    }
  }

  private applyTheme(theme: Theme) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}-color`, value);
    });
  }
} 