import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing';
import { DashboardComponent } from './dashboard/dashboard';
import { AdminPanelComponent } from './admin-panel/admin-panel';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: '', component: LandingComponent },
];