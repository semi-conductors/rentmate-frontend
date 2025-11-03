import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../../services/item-service';
import { RentalService } from '../../services/rental-service';
import { RentalRequest } from '../../models/rental-request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-rentals',
  imports: [CommonModule],
  templateUrl: './my-rentals.html',
  styleUrl: './my-rentals.css'
})
export class MyRentals implements OnInit {
  rentals = signal<RentalRequest[]>([]);
  isLoading = signal(false);
  
  currentPage = signal(0);
  pageSize = signal(10);
  totalPages = signal(0);
  totalRentals = signal(0);


  pendingCount = signal(0);
  completedCount = signal(0);
  rejectedCount = signal(0);

  constructor(
    private router: Router,
    private rentalService: RentalService
  ) {}

  ngOnInit(): void {
    this.loadAllRentals();
  }

  loadAllRentals(): void {
    this.isLoading.set(true);

    this.rentalService.getAllRentalsByRenter(this.currentPage(), this.pageSize())
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
          this.isLoading.set(false);
        }
      });
  }

  enrichRentalsWithDetails(): void {
    this.rentals().forEach(rental => {
      const start = new Date(rental.startDate);
      const end = new Date(rental.endDate);
      rental.rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
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
    
    this.pendingCount.set(rentals.filter(r => r.status === 'Pending').length);
    this.completedCount.set(rentals.filter(r => r.status === 'Completed' ).length);
    this.rejectedCount.set(rentals.filter(r => r.status === 'Rejected').length);
  }

  viewDetails(rentalId: number): void {
    this.router.navigate(['/rental-details', rentalId]);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      Pending: '#f59e0b',
      Approved: '#10b981',
      Rejected: '#ef4444',
      Completed: '#6366f1',
      Cancelled:'#ef4444',
    };
    return colors[status] || '#3b82f6';
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      Pending: '⏳',
      Approved: '✅',
      Rejected: '❌',
      Cancelled:'🚫',
      Completed: '🎉'
    };
    return icons[status] || '📋';
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(v => v + 1);
      this.loadAllRentals();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(v => v - 1);
      this.loadAllRentals();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}


