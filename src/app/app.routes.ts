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
  { path: 'profile', loadComponent: () => import('./features/user-management/components/my-profile/my-profile').then(m => m.MyProfileComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/components/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/components/register/register').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./features/auth/components/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./features/auth/components/reset-password/reset-password').then(m => m.ResetPasswordComponent) },
  { path: 'user/:id', loadComponent: () => import('./features/user-management/components/public-user-profile/public-user-profile').then(m => m.PublicUserProfileComponent) },
  { path: 'users', loadComponent: () => import('./features/user-management/components/user-management/user-management').then(m => m.UserManagementComponent) },
  { path: 'create-staff-account', loadComponent: () => import('./features/user-management/components/create-staff-account/create-staff-account').then(m => m.CreateStaffAccountComponent) },
  { path: 'admin/users/:id', loadComponent: () => import('./features/user-management/components/admin-user-detail/admin-user-detail').then(m => m.AdminUserDetailComponent) },
  { path: 'verification-request', loadComponent: () => import('./features/user-management/components/verification-request/verification-request').then(m => m.VerificationRequestComponent) },
  { path: 'verification-queue', loadComponent: () => import('./features/user-management/components/verification-queue/verification-queue').then(m => m.VerificationQueueComponent) },
  { path: 'verification/:id', loadComponent: () => import('./features/user-management/components/verification-management/verification-management').then(m => m.VerificationManagementComponent) },
  { path: 'admin/reports', loadComponent: () => import('./features/reporting/components/report-dashboard/report-dashboard').then(m => m.ReportDashboardComponent) },
  { path: 'admin/reports/:id', loadComponent: () => import('./features/reporting/components/report-management/report-management').then(m => m.ReportManagementComponent) },
  
// Item Service Routes
  { 
    path: 'rentals', 
    loadComponent: () => import('./features/item/components/rentals/rentals.component').then(m => m.RentalsComponent) 
  },

  { 
    path: 'items/:id', 
    loadComponent: () => import('./features/item/components/item-details/item-details.component').then(m => m.ItemDetailsComponent) 
  },
  
  { 
    path: 'my-items', 
    loadComponent: () => import('./features/item/components/my-items/my-items.component').then(m => m.MyItemsComponent) 
  },
  { 
    path: 'create-item', 
    loadComponent: () => import('./features/item/components/create-item/create-item.component').then(m => m.CreateItemComponent) 
  },
  { 
    path: 'update-item/:id', 
    loadComponent: () => import('./features/item/components/update-item/update-item.component').then(m => m.UpdateItemComponent) 
  },

  {
    path: 'admin/categories',
    loadComponent: () => import('./features/category/components/category-management/category-management.component').then(m => m.CategoryManagementComponent),
  },
];