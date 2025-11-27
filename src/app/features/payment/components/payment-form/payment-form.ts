import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RentalService } from '../../../rentals/services/rental-service';

@Component({
  selector: 'app-payment-form',
  imports: [],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.css'
})

export class PaymentComponent implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private rentalService = inject(RentalService);

  // UI Signals
  isLoading = signal(true);
  isProcessing = signal(false);

  // idle = show form | success = payment done | failed = payment failed
  paymentStatus = signal<'idle' | 'success' | 'failed'>('idle');

  // Rental data
  rentalId = signal<number | null>(null);
  rental = signal<any>(null);
  itemDetails = signal<any>(null);

  // Form Signals
  cardNumber = signal('');
  cardName = signal('');
  expiryDate = signal('');
  cvv = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.rentalId.set(id);

    this.loadRental(id);
  }

  private loadRental(id: number): void {
    this.isLoading.set(true);

    this.rentalService.getRentalById(id).subscribe({
      next: (data) => {
        this.rental.set(data);

        // لو الـ rental أصلاً مدفوع
        if (data.status === 'Paid') {
          this.paymentStatus.set('success');
          this.isLoading.set(false);
          return;
        }

        // حمّل item details
        this.loadItemDetails(data.itemId);
      },
      error: () => {
        alert('Could not load rental');
        this.router.navigate(['/my-rentals']);
      }
    });
  }

  private loadItemDetails(itemId: number): void {
    this.rentalService.getItemDetails(itemId).subscribe({
      next: (item) => {
        this.itemDetails.set(item);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  // ---------------- PAYMENT PROCESS ----------------

  processPayment(): void {
    const rental = this.rental();
    if (!rental) return;

    this.isProcessing.set(true);


    this.rentalService.getRentalById(rental.rentalId).subscribe({
      next: (updatedRental) => {
        this.isProcessing.set(false);

       
        if (updatedRental.status === 'Paid') {
          this.paymentStatus.set('success');
        } else {
          this.paymentStatus.set('failed');
        }
      },
      error: () => {
        this.isProcessing.set(false);
        this.paymentStatus.set('failed');
      }
    });
   }

  closeSuccessMessage(): void {
    this.router.navigate(['/my-rentals']);
  }

  retryPayment(): void {
    this.paymentStatus.set('idle');
  }

  goBack(): void {
    this.router.navigate(['/rental-details', this.rentalId()]);
  }

  // Format helpers
  onCardNumberChange(value: string): void {
    const num = value.replace(/\D/g, '');
    const formatted = num.match(/.{1,4}/g)?.join(' ') || '';
    this.cardNumber.set(formatted);
  }

  onExpiryChange(value: string): void {
    let v = value.replace(/\D/g, '');
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
    this.expiryDate.set(v.slice(0, 5));
  }
}