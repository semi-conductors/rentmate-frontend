import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OwnerRental } from '../../models/owner-rental';
import { RentalService } from '../../services/rental-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner-dashboard',
  imports: [CommonModule],
  templateUrl: './owner-dashboard.html',
  styleUrl: './owner-dashboard.css'
})
export class OwnerDashboard implements OnInit {
  rentals = signal<OwnerRental[]>([]);
  isLoading = signal(false);
  selectedStatus = signal<string | null>(null);

  currentPage = signal(0);
  pageSize = signal(10);
  totalPages = signal(0);
  totalRentals = signal(0);

  // Stats
  totalRevenue = signal(0);
  constructor(
    private router: Router,
    private rentalService: RentalService
  ) { }

  ngOnInit(): void {
    this.loadRentals(null);
  }

  loadRentals(status: string | null): void {
    this.isLoading.set(true);
    this.selectedStatus.set(status);

    this.rentalService.getAllRentalsByOwner(this.currentPage(), this.pageSize(), status)
      .subscribe({
        next: (response) => {
          const list = response.content || [];
          this.rentals.set(list);
          this.totalPages.set(response.totalPages || 0);
          this.totalRentals.set(response.totalElements || list.length);

          this.enrichRentalsWithDetails();
          this.calculateStats();

          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading rentals:', error);
          this.rentals.set([]); 
          this.totalPages.set(0);
          this.totalRentals.set(0);
          this.isLoading.set(false);

        }
      });
  }

  enrichRentalsWithDetails(): void {
    this.rentals().forEach(rental => {
      // Calculate rental days
      const start = new Date(rental.startDate);
      const end = new Date(rental.endDate);
      rental.rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      rental.isExpanded = false;

      // Fetch item details
      this.rentalService.getItemDetails(rental.itemId).subscribe({
        next: (item) => {
          rental.itemName = item.title || 'Item #' + rental.itemId;
          rental.itemIcon = item.icon || '📦';
          this.rentals.update(reqs => [...reqs]);
        },
        error: (error) => {
          console.error('Error fetching item details:', error);
          rental.itemName = 'Item #' + rental.itemId;
          rental.itemIcon = '📦';
          this.rentals.update(reqs => [...reqs]);
        }
      });
    });
  }

  calculateStats(): void {
    const rentals = this.rentals();
    this.totalRevenue.set(rentals.reduce((sum, r) => sum + r.totalPrice, 0));
  }

  filterByStatus(status: string | null): void {
    this.currentPage.set(0);
    this.loadRentals(status);
  }

  toggleDetails(rentalId: number): void {
    this.rentals.update(rentals =>
      rentals.map(rental =>
        rental.rentalId === rentalId
          ? { ...rental, isExpanded: !rental.isExpanded }
          : rental
      )
    );
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

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      Pending: '#fbbf24',
      Approved: '#34d399',
      Rejected: '#f87171',
      Completed: '#818cf8'
    };
    return colors[status] || '#94a3b8';
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      Pending: '⏳',
      Approved: '✅',
      Rejected: '❌',
      Completed: '🎉'
    };
    return icons[status] || '📋';
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(v => v + 1);
      this.loadRentals(this.selectedStatus());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(v => v - 1);
      this.loadRentals(this.selectedStatus());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }


}
