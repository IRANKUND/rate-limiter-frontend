import { Routes } from '@angular/router';
import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'clients', component: ClientListComponent },
    { path: 'clients/new', component: ClientFormComponent },
    { path: 'clients/:id', component: ClientFormComponent }
];
