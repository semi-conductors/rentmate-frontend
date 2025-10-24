import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/user.profile';
import { RatingDto, RatingListResponse } from '../../../rating/models/rating.model';
import { UserStatusModalComponent } from '../user-status-modal/user-status-modal';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, UserStatusModalComponent],
  templateUrl: './admin-user-detail.html',
})
export class AdminUserDetailComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private router = inject(Router);

  user = signal<UserProfile | null>(null);
  loadingUser = signal(true);
  notFound = signal(false);

  // Ratings list signals
  ratings = signal<RatingDto[]>([]);
  ratingsLoading = signal(false);
  ratingsPage = signal(1);
  ratingsLimit = signal(6);
  ratingsTotalPages = signal(1);
  ratingsTotalItems = signal(0);

  // Modal
  showStatusModal = signal(false);

  // constructor() {
  //   // load user when route param changes
  //   effect(() => {
  //     const id = Number(this.route.snapshot.paramMap.get('id'));
  //     if (!id) return;
  //     this.loadUser(id);
  //     this.loadRatings(id, this.ratingsPage(), this.ratingsLimit());
  //   });

  //   // reload ratings when page changes
  //   effect(() => {
  //     const id = Number(this.route.snapshot.paramMap.get('id'));
  //     if (!id) return;
  //     // subscribe when page signal changes
  //     this.loadRatings(id, this.ratingsPage(), this.ratingsLimit());
  //   });
  // }
  
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.loadUser(id);
    this.loadRatings(id, this.ratingsPage(), this.ratingsLimit());
  }

  loadUser(userId: number) {
    this.loadingUser.set(true);
    this.userService.getUserById(userId).subscribe({
      next: (u) => {
        this.user.set(u);
        this.loadingUser.set(false);
      },
      error: (err) => {
        this.notFound.set(true);
        this.loadingUser.set(false);
      },
    });
  }

  loadRatings(userId: number, page = 1, limit = 6) {
    this.ratingsLoading.set(true);
    this.userService.getUserRatings(userId, page, limit).subscribe({
      next: (res: RatingListResponse) => {
        this.ratings.set(res.items);
        this.ratingsPage.set(res.currentPage);
        this.ratingsTotalPages.set(res.totalPages);
        this.ratingsTotalItems.set(res.totalItems);
        this.ratingsLoading.set(false);
      },
      error: () => {
        this.ratingsLoading.set(false);
      },
    });
  }

  // pagination
  nextRatings() {
    if (this.ratingsPage() < this.ratingsTotalPages()) this.ratingsPage.update(p => p + 1);
  }
  prevRatings() {
    if (this.ratingsPage() > 1) this.ratingsPage.update(p => p - 1);
  }

  // navigate to rater's admin page
  openRaterAdmin(raterId: number) {
    this.router.navigate(['/admin/users', raterId]);
  }

  openStatusModal() {
    this.showStatusModal.set(true);
  }
  closeStatusModal() {
    this.showStatusModal.set(false);
  }

  // Save status/role (parent orchestrates)
  onSaveStatus(payload: { role: string; status: string; reason?: string }) {
    console.log('save method called');
    
    const u = this.user();
    if (!u) return;
    console.log('user is ' + JSON.stringify(u));
    console.log('payload is ' + JSON.stringify(payload));

    if (u.role !== payload.role) {
      this.userService.changeUserRole(u.id, payload.role).subscribe({
        next: (res) => {
          this.user.set(res);
        }, error: (err) => {
          console.error('Failed to change role:', err);
        }
      });
    }

    if (u.accountActivity !== payload.status) {
      this.userService.changeUserStatus(u.id, payload.status, payload.reason).subscribe({
        next: (res: UserProfile) => {
          this.user.set(res);
        }, error: (err) => {
          console.error('Failed to change status:', err);
        }
      });
    }

    this.showStatusModal.set(false);  
  }

  formatDate(iso?: string) {
    if (!iso) return '';
    return formatDate(iso, 'yyyy-MM-dd', 'en-US');
  }

  onRatingRefreshClick(){
    this.loadRatings(Number(this.route.snapshot.paramMap.get('id')), 1, this.ratingsLimit())
  }

  get roundedRating() {
    return Math.round(this.user()?.rating ?? 0);
  }

}