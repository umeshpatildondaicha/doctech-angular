import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


// Register all AG Grid community modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule
]);
