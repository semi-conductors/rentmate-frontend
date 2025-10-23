import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/user.profile';
import { EditProfileComponent } from "../edit-profile/edit-profile"; 
import { AuthService } from '../../../auth/services/auth.service';


@Component({
  standalone: true,
  selector: 'app-my-profile',
  imports: [CommonModule, EditProfileComponent],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css'
})
export class MyProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  showEditModal = signal(false);
  profile = signal<UserProfile | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: res => {
        this.profile.set(res);
        this.isLoading.set(false);
      },
      error: err => {
        this.errorMessage.set(err.message || 'Error loading profile');
        this.isLoading.set(false);
      },
    });
  }

  onProfileUpdated(updated: UserProfile) {
    this.profile.set(updated);
    this.authService.updateLocalStorageUser(updated.username, updated.phoneNumber);
  }
}
