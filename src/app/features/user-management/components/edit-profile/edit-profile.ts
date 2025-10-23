import {Component,effect,inject,input,output,signal} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/user.profile';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.html',
})
export class EditProfileComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  userProfile = input.required<UserProfile | null>();
  close = output<void>();
  updated = output<UserProfile>();
  loading = signal(false);

  profileForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    email: [{ value: '', disabled: true }],
  });

  constructor() {
    // Reactively update form when input signal changes
    effect(() => {
      const user = this.userProfile();
      if (user) {
        const [firstName, lastName] = user.username.split(' ');
        this.profileForm.patchValue({
          firstName: firstName || '',
          lastName: lastName || '',
          phoneNumber: user.phoneNumber,
          email: user.email,
        });
      }
    });
  }

  onSave() {
    if (this.profileForm.invalid) return;
    this.loading.set(true);

    const { firstName, lastName, phoneNumber } = this.profileForm.getRawValue();

    this.userService.updateProfile({ firstName, lastName, phoneNumber }).subscribe({
      next: (updatedProfile) => {
        this.updated.emit(updatedProfile);
        this.loading.set(false);
        this.close.emit();
      },
      error: () => this.loading.set(false),
    });
  }

  onCancel() {
    this.close.emit();
  }
}