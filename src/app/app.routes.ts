import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login';
import { RegisterComponent } from './features/auth/components/register/register';
import { ForgotPasswordComponent } from './features/auth/components/forgot-password/forgot-password';
import { ResetPasswordComponent } from './features/auth/components/reset-password/reset-password';
import { MyProfileComponent } from './features/user-management/components/my-profile/my-profile';
import { PublicUserProfileComponent } from './features/user-management/components/public-user-profile/public-user-profile';
import { UserManagementComponent } from './features/user-management/components/user-management/user-management';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: 'browse', loadComponent: () => import('./pages/browse/browse').then(m => m.BrowseComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent) },
  { path: 'profile', component: MyProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'user/:id', component: PublicUserProfileComponent},
  {path: 'users', component: UserManagementComponent},
  {path: 'create-staff-account', loadComponent: () => import('./features/user-management/components/create-staff-account/create-staff-account').then(m => m.CreateStaffAccountComponent)},
  {path: 'admin/users/:id',loadComponent: () => import('./features/user-management/components/admin-user-detail/admin-user-detail').then(m => m.AdminUserDetailComponent)}
];
