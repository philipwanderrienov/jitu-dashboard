import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JituLayoutComponent } from './dashboard/jitu-layout.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home.component';
import { SettingsComponent } from './dashboard/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: JituLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardHomeComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
