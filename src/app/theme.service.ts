import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  // Function to switch theme
  switchTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
