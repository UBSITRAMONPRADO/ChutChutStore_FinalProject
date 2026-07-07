import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing';
import { DashboardComponent } from './dashboard/dashboard';
<<<<<<< HEAD
import { ManagerPanelComponent } from './manager-panel/manager-panel';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'manager-panel', component: ManagerPanelComponent },
=======
import { AdminPanelComponent } from './admin-panel/admin-panel';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin-panel', component: AdminPanelComponent },
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
  { path: '', component: LandingComponent },
];