import { Component, NgModule, OnInit } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isPinned$ = this.sidebarService.isPinned$;
  isHovered$ = this.sidebarService.isHovered$;
  isMessageVisible = false; // Track "Good Morning" visibility
  isHospitalVisible = false; // Track Hospital Name visibility
  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.showGoodMorningMessage();
  }

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

  showGoodMorningMessage() {
    // Show "Good Morning" message for 10 seconds
    this.isMessageVisible = true; // Show immediately

    // Hide "Good Morning" and show hospital name after 10 seconds
    setTimeout(() => {
        this.isMessageVisible = false; // Hide Good Morning
        this.isHospitalVisible = true;  // Show Hospital Name

        // Optional: Hide hospital name after another duration
        setTimeout(() => {
            this.isHospitalVisible = false; // Hide Hospital Name after some time
        }, 10000); // Adjust duration as needed

    }, 10000); // Hide Good Morning after 10 seconds
  }
}
