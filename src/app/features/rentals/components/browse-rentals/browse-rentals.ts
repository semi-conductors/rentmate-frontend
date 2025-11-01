import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  requests: RentalRequest[] = [];
  selectedRequest: RentalRequest | null = null;
  isModalOpen = false;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalRequests = 0;

  // Stats
  pendingCount = 0;
  todayCount = 0;
  totalRevenue = 0;

  isLoading = false;

  constructor(
    private rentalService: RentalService,
    private itemService:ItemService,
    private cdr:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPendingRequests();
  }

  loadPendingRequests(): void {
    this.isLoading = true;
    this.rentalService.getPendingRentalsByOwnerId( this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.requests = response.content || [];
          this.totalPages = response.totalPages || 0;
          this.totalRequests = response.totalElements || 0;

          // Enrich each request with item details
          this.enrichRequestsWithItemDetails();

          // Calculate stats
          this.calculateStats();

          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading requests:', error);
          this.isLoading = false;
        }
      });
  }

  enrichRequestsWithItemDetails(): void {
    this.requests.forEach(request => {
      // Calculate rental days
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      request.rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      // Fetch item details
      this.rentalService.getItemDetails(request.itemId).subscribe({
        next: (item) => {
          request.itemName = item.title || 'Item #' + request.itemId;
          request.itemIcon = item.icon || '📦';
          this.cdr.detectChanges();
        },
      //  this.itemService.getItemById(request.itemId).subscribe({
      //   next: (item) => {
      //     request.itemName = item.title || 'Item #' + request.itemId;
      //     request.itemIcon = item.imageUrl || '📦';
      //     this.cdr.detectChanges();
      //   },
        error: (error) => {
          console.error('Error fetching item details:', error);
          request.itemName = 'Item #' + request.itemId;
          request.itemIcon = '📦';
        }
      });
    });
  }

  calculateStats(): void {
    this.pendingCount = this.totalRequests;

    // Calculate today's requests
    const today = new Date().toDateString();
    this.todayCount = this.requests.filter(r =>
      new Date(r.createdDate).toDateString() === today
    ).length;

    // Calculate total revenue
    this.totalRevenue = this.requests.reduce((sum, r) => sum + r.totalPrice, 0);
  }

  openModal(request: RentalRequest): void {
    this.selectedRequest = request;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedRequest = null;
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  approveRental(): void {
    if (!this.selectedRequest) return;

    const rentalId = this.selectedRequest.rentalId;

    this.rentalService.approveRental(rentalId).subscribe({
      next: (response) => {
        alert('Rental approved successfully! ✅');
        this.closeModal();
        this.loadPendingRequests(); // Reload the list
      },
      error: (error) => {
        console.error('Error approving rental:', error);
        alert(error.error?.message || 'Failed to approve rental.');
      }
    });
  }

  rejectRental(): void {
    if (!this.selectedRequest) return;

    if (!confirm('Are you sure you want to reject this rental request?')) {
      return;
    }

    const rentalId = this.selectedRequest.rentalId;

    this.rentalService.rejectRental(rentalId).subscribe({
      next: (response) => {
        alert('Rental rejected! ❌');
        this.closeModal();
        this.loadPendingRequests(); // Reload the list
      },
      error: (error) => {
        console.error('Error rejecting rental:', error);
        alert(error.error?.message || 'Failed to reject rental.');
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadPendingRequests();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPendingRequests();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  


}
