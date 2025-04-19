import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Import AG Grid configuration before bootstrapping the app
import './app/shared/grid-config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
