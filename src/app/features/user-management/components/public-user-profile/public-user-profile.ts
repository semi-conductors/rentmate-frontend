import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicUserProfile } from '../../models/public.user.profile';

@Component({
  selector: 'app-public-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-user-profile.html',
})
export class PublicUserProfileComponent {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  user = signal<PublicUserProfile | null>(null);
  notFound = signal(false);
  loading = signal(true);

  constructor() {
    effect(() => {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (!id) return;

      this.loading.set(true);
      this.userService.getPublicProfile(id).subscribe({
        next: (res) => {
          this.user.set(res);
          this.loading.set(false);
        },
        error: () => {
          this.notFound.set(true);
          this.loading.set(false);
        },
      });
    });
  }

  // Helper for rendering full/half stars
  stars() {
    const rating = this.user()?.rating ?? 0;
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return { full, half, empty: 5 - full - (half ? 1 : 0) };
  }
}