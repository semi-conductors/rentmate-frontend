import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RentalService } from '../../services/rental-service';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../services/item-service';

@Component({
  selector: 'app-rental-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rental-details.html',
  styleUrl: './rental-details.css'
})
export class RentalDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private rentalService = inject(RentalService);

  rentalId = signal<number | null>(null);
  rental = signal<any | null>(null);
  itemDetails = signal<any | null>(null);
  isLoading = signal(true);
  isCancelling = signal(false);

  rentalDays = computed(() => {
    const rentalValue = this.rental();
    if (!rentalValue) return 0;
    const start = new Date(rentalValue.startDate);
    const end = new Date(rentalValue.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.rentalId.set(id);
      this.loadRentalDetails(id);
    });
  }

  private loadRentalDetails(id: number): void {
    this.isLoading.set(true);

    this.rentalService.getRentalById(id).subscribe({
      next: (rental) => {
        this.rental.set(rental);
        this.loadItemDetails(rental.itemId);
      },
      error: (error) => {
        console.error('Error loading rental details:', error);
        alert('Failed to load rental details');
        this.isLoading.set(false);
      }
    });
  }

  private loadItemDetails(itemId: number): void {
    this.rentalService.getItemDetails(itemId).subscribe({
      next: (item) => {
        this.itemDetails.set(item);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading item details:', error);
        this.isLoading.set(false);
      }
    });
  }
  cancelRental(): void {
    const rental = this.rental();
    if (!rental || rental.status !== 'Pending') return;

    if (!confirm('Are you sure you want to cancel this rental request? This action cannot be undone.')) {
      return;
    }

    this.isCancelling.set(true);

    this.rentalService.cancelRental(rental.rentalId).subscribe({
      next: () => {
        alert('Rental request cancelled successfully! 🚫');
        this.router.navigate(['/my-rentals']);
      },
      error: (error) => {
        console.error('Error cancelling rental:', error);
        alert(error.error?.message || 'Failed to cancel rental request.');
        this.isCancelling.set(false);
      }
    });
  }


  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      Pending: '#f59e0b',
      Approved: '#10b981',
      Rejected: '#ef4444',
      Completed: '#6366f1'
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

  goBack(): void {
    this.router.navigate(['/my-rentals']);
  }
}