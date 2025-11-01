import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RentalService } from '../../services/rental-service';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../services/item-service';

@Component({
  selector: 'app-rental-details',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './rental-details.html',
  styleUrl: './rental-details.css'
})
export class RentalDetails implements OnInit{
  rentalId!:number;
  rental: any = null;
  itemDetails: any = null;
  isLoading = true;
  rentalDays = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rentalService: RentalService,
    private itemService:ItemService,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Get rental ID from route params
    this.route.params.subscribe(params => {
      this.rentalId = +params['id'];
      this.loadRentalDetails();
    });
  }

  loadRentalDetails(): void {
    this.isLoading = true;

    this.rentalService.getRentalById(this.rentalId).subscribe({
      next: (rental) => {
        this.rental = rental;
        
        // Calculate rental days
        const start = new Date(rental.startDate);
        const end = new Date(rental.endDate);
        this.rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        
        // Load item details
        this.loadItemDetails(rental.itemId);
         this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading rental details:', error);
        alert('Failed to load rental details');
        this.isLoading = false;
      }
    });
  }

  loadItemDetails(itemId: number): void {
    this.rentalService.getItemDetails(itemId).subscribe({
      next: (item) => {
        this.itemDetails = item;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading item details:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'Pending': '#f59e0b',
      'Approved': '#10b981',
      'Rejected': '#ef4444',
      'Completed': '#6366f1'
    };
    return colors[status] || '#94a3b8';
  }

  getStatusIcon(status: string): string {
    const icons: any = {
      'Pending': '⏳',
      'Approved': '✅',
      'Rejected': '❌',
      'Completed': '🎉'
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
