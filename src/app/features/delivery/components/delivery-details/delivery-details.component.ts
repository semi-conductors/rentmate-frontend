import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeliveryService } from '../../services/delivery.service';
import { DeliveryDetailsResponse } from '../../models/delivery.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-delivery-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.css'],
  // ⛔️ تمت إزالة ChangeDetectionStrategy.OnPush
})
export class DeliveryDetailsComponent implements OnInit {
  // ✅ استخدام inject بدلاً من constructor injection
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private deliveryService = inject(DeliveryService);

  // ✅ استخدام Signal لتخزين الـ Delivery ID
  public deliveryId = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => of(+(params.get('id') || 0)))
    ),
    { initialValue: 0 }
  );

  // ✅ Signal لحالة الـ Loading، Error، و Delivery
  public loading = signal(false);
  public error = signal<string | null>(null);
  public delivery = signal<DeliveryDetailsResponse | null>(null);

  // ✅ Computed Signal لتحديد حالة الاكتمال
  public isCompleted = computed(() => {
    const status = this.delivery()?.status;
    return status === 'DELIVERED' || status === 'RETURNED';
  });

  // ✅ Computed Signal لـ ID الطلب (للعرض في الهيدر)
  public displayId = computed(() => this.delivery()?.id ?? 'Not specified');

  ngOnInit(): void {
    // ⛔️ تم حذف الاشتراك في route.params
    this.loadDeliveryDetails();
  }

  loadDeliveryDetails(): void {
    const currentId = this.deliveryId();
    if (currentId <= 0) return; // تحقق احتياطي

    this.loading.set(true);
    this.error.set(null);

    this.deliveryService.getDeliveryDetails(currentId).subscribe({
      next: (data) => {
        this.delivery.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading delivery details:', err);
        this.error.set('Failed to load details. Please try again.');
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/deliveries']);
  }

  onComplete(): void {
    const currentId = this.deliveryId();
    if (!this.delivery() || currentId <= 0) return;

    this.deliveryService.completeDelivery(currentId).subscribe({
      next: () => {
        // ✅ تحديث حالة الـ Delivery Signal للانتقال للحالة المكتملة
        this.delivery.update(d => {
            if (d) {
                return { ...d, status: d.type === 'FORWARD' ? 'DELIVERED' : 'RETURNED' };
            }
            return d;
        });
        // لا نحتاج للعودة للقائمة مباشرة، بل يمكننا تحديث الحالة محلياً
        // this.router.navigate(['/deliveries']);
      },
      error: (err) => {
        console.error('Error completing delivery:', err);
        alert('Failed to complete delivery. Please try again.');
      },
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
