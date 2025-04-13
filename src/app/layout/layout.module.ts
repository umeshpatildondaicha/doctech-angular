import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { SharedModule } from '../shared/shared.module';
import { SidebarService } from './services/sidebar.service';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    RightSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    RightSidebarComponent
  ],
  providers: [SidebarService]
})
export class LayoutModule { } 