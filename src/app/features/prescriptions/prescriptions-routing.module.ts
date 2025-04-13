import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrescriptionsListComponent } from './components/prescription-list/prescription-list.component';

const routes: Routes = [
  {
    path: '',
    component: PrescriptionsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrescriptionsRoutingModule { }
