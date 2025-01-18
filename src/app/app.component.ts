import { Component } from '@angular/core';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true, // Mark as standalone
  imports: [HeaderComponent, SidebarComponent], // Import other standalone components
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'doctech-angular'; // Define the title property
}
