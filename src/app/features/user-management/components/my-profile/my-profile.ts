import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/user.profile';
import { EditProfileComponent } from "../edit-profile/edit-profile"; 
import { AuthService } from '../../../auth/services/auth.service';
import { DeactivateAccountModalComponent } from "../deactivate-account-modal/deactivate-account-modal";
import { Router } from '@angular/router';
import { VerificationResponse } from '../../models/verification.response';
import { VerificationService } from '../../services/verification.service';
import { VerificationSummaryTableComponent } from "../verification-summary-table/verification-summary-table";


@Component({
  standalone: true,
  selector: 'app-my-profile',
  imports: [CommonModule, EditProfileComponent, DeactivateAccountModalComponent, VerificationSummaryTableComponent],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css'
})
export class MyProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private verificationService = inject(VerificationService);

  private router = inject(Router); 

  showEditModal = signal(false);
  profile = signal<UserProfile | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');
  showDeactivateModal = signal(false);
  deactivating = signal(false);
  userVerifications = signal<VerificationResponse[]>([]);
  canSubmitVerification = signal(true);

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

    this.verificationService.getMyVerifications().subscribe({
      next: res => {
        this.userVerifications.set(res);
      },
      error: err => {
        console.error('Error loading verifications:', err);
      }
    });

    this.verificationService.canSubmitVerification().subscribe({
      next: res => {
        this.canSubmitVerification.set(res.canSubmit);  
      },
      error: err => {
        console.error('Error checking verification submission eligibility:', err);
      }
    });
  }

  onProfileUpdated(updated: UserProfile) {
    this.profile.set(updated);
    this.authService.updateLocalStorageUser(updated.username, updated.phoneNumber);
  }

  openDeactivateModal() {
    this.showDeactivateModal.set(true);
  }

  closeDeactivateModal() {
    this.showDeactivateModal.set(false);
  }

  deactivateAccount() {
    this.deactivating.set(true);
    this.userService.deactivateProfile().subscribe({
      next: () => {
        this.deactivating.set(false);
        this.showDeactivateModal.set(false);
        this.authService.localLogout();
        this.router.navigate(['/']);
      },
      error: () => {
        this.deactivating.set(false);
      },
    });
  }

  onRequestVerificationClick(){
    if(!this.canSubmitVerification) 
      return;
    this.router.navigate(['/verification-request']);
  }

  stars() {
    const rating = this.profile()?.rating ?? 0;
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return { full, half, empty: 5 - full - (half ? 1 : 0) };
  }
}
