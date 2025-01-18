import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,  
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isFullscreen = false; // Track fullscreen state

  toggleFullscreen() {
    if (this.isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) { // Safari
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) { // IE/Edge
        (document as any).msExitFullscreen();
      }
    } else {
      const elem = document.documentElement; 
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) { // Safari
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) { // IE/Edge
        (elem as any).msRequestFullscreen();
      }
    }
    this.isFullscreen = !this.isFullscreen;
  }
}
