import { Component } from '@angular/core';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common'; // For Angular common directives/pipes

@Component({
    selector: 'app-root',
    imports: [
        CommonModule, // For ngIf, ngFor, async pipe, etc.
        HeaderComponent, // Standalone HeaderComponent
        SidebarComponent // Standalone SidebarComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'doctech-angular';
}
