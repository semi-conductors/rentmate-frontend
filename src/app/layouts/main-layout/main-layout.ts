import { Component, HostListener, OnInit, signal, computed, inject, effect } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { SidebarComponent } from './components/sidebar/sidebar';
import { AuthService } from '../../features/auth/services/auth.service';
import { User } from '../../features/auth/models/user';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, CommonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})

export class MainLayoutComponent implements OnInit {
  sidebarOpen = signal(true);
  isMobile = signal(false);
  auth = inject(AuthService); 
  router = inject(Router);
  currentUser = signal<User | null>(null);

  /** computed signal: only admins/managers get a sidebar */
  showSidebar = computed(() => {
    const role = this.currentUser()?.role ?? '';
    return role === 'ADMIN' || role === 'MANAGER';
  });

  constructor(){
      // reactively watch user state
      effect(() => {
        this.currentUser.set(this.auth.currentUser());
      });
  }

  ngOnInit(): void {
    this.checkViewport();
  }

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  onLogout() {
    if (!this.auth.isAuthenticated) {
      this.router.navigate(['/']);
      return;
    }

    this.auth.logout().subscribe({
      next: () => {
        this.currentUser.set(null);
        this.router.navigate(['/']);
      },
      error: () => {
        this.currentUser.set(null);
        this.router.navigate(['/']);
      },
    });
  }


  @HostListener('window:resize')
  checkViewport() {
    const mobile = window.innerWidth < 768;
    this.isMobile.set(mobile);
    // On mobile, sidebar starts closed; on desktop, it starts open
    if (mobile) {
      this.sidebarOpen.set(false);
    } else {
      this.sidebarOpen.set(true);
    }
  }
}
