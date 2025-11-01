import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RentalService } from '../../services/rental-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-form',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css'
})
export class BookingForm implements OnInit{
  bookingForm!: FormGroup;
  itemId!: number;
  itemDetails: any = {};
  
  rentalDays: number = 0;
  subtotal: number = 0;
  deposit: number = 0;
  totalAmount: number = 0;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private rentalService: RentalService
  ) {}

 
  ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    this.itemId = +params.get('itemId')!;
    this.loadItemDetails(this.itemId);
  });

  this.initForm();
}

  initForm(): void {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    this.bookingForm = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      renterAddress: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Listen to date changes
    this.bookingForm.get('startDate')?.valueChanges.subscribe(() => {
      this.calculatePrice();
    });
    
    this.bookingForm.get('endDate')?.valueChanges.subscribe(() => {
      this.calculatePrice();
    });
  }
  loadItemDetails(itemId: number): void {
  this.rentalService.getItemDetails(itemId).subscribe({
    next: (data) => {
      this.itemDetails = {
        name: data.title,         
        id: itemId,
        dailyRate: data.rentalPrice
      };
      this.calculatePrice();
    },
    error: (error) => {
      console.error('Failed to load item details', error);
      alert('Failed to load item details. Please try again.');
    }
  });
}

  calculatePrice(): void {
    const startDate = this.bookingForm.get('startDate')?.value;
    const endDate = this.bookingForm.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        this.rentalDays = diffDays;
        this.subtotal = diffDays * this.itemDetails.dailyRate;
        this.deposit = this.subtotal * 0.15;
        this.totalAmount = this.subtotal + this.deposit;
      }
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const rentalRequest = {
        itemId: this.itemId,
        startDate: this.bookingForm.get('startDate')?.value,
        endDate: this.bookingForm.get('endDate')?.value,
        renterAddress: this.bookingForm.get('renterAddress')?.value
      };

      this.rentalService.createRental(rentalRequest).subscribe({
        next: (response) => {
          alert('Booking confirmed successfully! 🎉');
          // Navigate to confirmation page or rentals list
          const rentalId=response.rentalId;
          this.router.navigate(['/rental-details',rentalId]);
        },
        error: (error) => {
          console.error('Booking failed:', error);
          const backendMessage = error.error?.message || error.message || 'Booking failed. Please try again.';
          alert(`❌ ${backendMessage}`);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
    }
  }

}
