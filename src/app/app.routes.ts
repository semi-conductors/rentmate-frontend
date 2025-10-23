import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login';
import { RegisterComponent } from './features/auth/components/register/register';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: 'browse', loadComponent: () => import('./pages/browse/browse').then(m => m.BrowseComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent) },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
