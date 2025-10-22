import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { TransactionsComponent } from './components/transactions/transactions.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

export class AppRoutes { }

