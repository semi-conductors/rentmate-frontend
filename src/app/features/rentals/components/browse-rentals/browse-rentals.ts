import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { RentalRequest } from '../../models/rental-request';
import { RentalService } from '../../services/rental-service';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../services/item-service';

@Component({
  selector: 'app-browse-rentals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browse-rentals.html',
  styleUrl: './browse-rentals.css'
})

export class BrowseRentals implements OnInit {
  requests = signal<RentalRequest[]>([]);
  selectedRequest = signal<RentalRequest | null>(null);
  isModalOpen = signal(false);
  isLoading = signal(false);

  currentPage = signal(0);
  pageSize = signal(10);
  totalPages = signal(0);
  totalRequests = signal(0);

  pendingCount = signal(0);
  todayCount = signal(0);
  totalRevenue = signal(0);

  constructor(
    private rentalService: RentalService,
    private itemService: ItemService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPendingRequests();
  }

  loadPendingRequests(): void {
    this.isLoading.set(true);
    this.rentalService.getPendingRentalsByOwnerId(this.currentPage(), this.pageSize())
      .subscribe({
        next: (response) => {
          const list = response.content || [];
          this.requests.set(list);
          this.totalPages.set(response.totalPages || 0);
          this.totalRequests.set(response.totalElements || list.length);

          this.enrichRequestsWithItemDetails();
          this.calculateStats();

          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading requests:', error);
          this.isLoading.set(false);
        }
      });
  }

  enrichRequestsWithItemDetails(): void {
    this.requests().forEach(request => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      request.rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      this.rentalService.getItemDetails(request.itemId).subscribe({
        next: (item) => {
          request.itemName = item.title || 'Item #' + request.itemId;
          request.itemIcon = item.icon || '📦';
          this.requests.update(reqs => [...reqs]); // trigger UI update
        },
        error: (error) => {
          console.error('Error fetching item details:', error);
          request.itemName = 'Item #' + request.itemId;
          request.itemIcon = '📦';
          this.requests.update(reqs => [...reqs]);
        }
      });
    });
  }

  calculateStats(): void {
    this.pendingCount.set(this.totalRequests());

    const today = new Date().toDateString();
    const todayCount = this.requests().filter(r =>
      new Date(r.createdDate).toDateString() === today
    ).length;
    this.todayCount.set(todayCount);

    const totalRevenue = this.requests().reduce((sum, r) => sum + r.totalPrice, 0);
    this.totalRevenue.set(totalRevenue);
  }

  openModal(request: RentalRequest): void {
    this.selectedRequest.set(request);
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedRequest.set(null);
    this.isModalOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  approveRental(): void {
    const request = this.selectedRequest();
    if (!request) return;

    this.rentalService.approveRental(request.rentalId).subscribe({
      next: () => {
        alert('Rental approved successfully! ✅');

        this.requests.update(reqs =>
          reqs.filter(r => r.rentalId !== request.rentalId)
        );

        // Update counts
        this.pendingCount.update(count => count - 1);
        this.totalRevenue.update(revenue => revenue - request.totalPrice);
        this.closeModal();
        // this.loadPendingRequests();
      },
      error: (error) => {
        console.error('Error approving rental:', error);
        alert(error.error?.message || 'Failed to approve rental.');
      }
    });
  }

  rejectRental(): void {
    const request = this.selectedRequest();
    if (!request) return;

    if (!confirm('Are you sure you want to reject this rental request?')) return;

    this.rentalService.rejectRental(request.rentalId).subscribe({
      next: () => {
        alert('Rental rejected! ❌');
        // Remove from list immediately
        this.requests.update(reqs =>
          reqs.filter(r => r.rentalId !== request.rentalId)
        );

        // Update counts
        this.pendingCount.update(count => count - 1);
        this.totalRevenue.update(revenue => revenue - request.totalPrice);
        this.closeModal();
        //this.loadPendingRequests();
      },
      error: (error) => {
        console.error('Error rejecting rental:', error);
        alert(error.error?.message || 'Failed to reject rental.');
      }
    });
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(v => v + 1);
      this.loadPendingRequests();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(v => v - 1);
      this.loadPendingRequests();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

}
