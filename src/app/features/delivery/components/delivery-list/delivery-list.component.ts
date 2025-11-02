import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DeliveryService } from '../../services/delivery.service';
import { Delivery, DeliveryStatus } from '../../models/delivery.model';
import { DeliveryCardComponent } from '../delivery-card/delivery-card.component';
import { toSignal } from '@angular/core/rxjs-interop'; // لإدارة الـ Observables

@Component({
  selector: 'app-delivery-list',
  standalone: true,
  // ⛔️ تمت إزالة ChangeDetectionStrategy.OnPush حيث أن Signals تجعله افتراضياً
  imports: [CommonModule, DeliveryCardComponent],
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css'],
})
export class DeliveryListComponent implements OnInit {
  // ✅ تحويل حالة المكون إلى Signals
  private allDeliveries = signal<Delivery[]>([]);
  public loading = signal(false);
  public error = signal<string | null>(null);

  // ✅ استخدام الـ computed signals لفلترة البيانات
  public activeDeliveries = computed(() =>
    this.allDeliveries().filter(
      (d) =>
        d.status === DeliveryStatus.SCHEDULED ||
        d.status === DeliveryStatus.IN_PROGRESS ||
        d.status === DeliveryStatus.IN_RETURNING
    )
  );

  public completedDeliveries = computed(() =>
    this.allDeliveries().filter(
      (d) =>
        d.status === DeliveryStatus.DELIVERED || d.status === DeliveryStatus.RETURNED
    )
  );

  // ✅ استخدام inject بدلاً من constructor injection
  private deliveryService = inject(DeliveryService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadDeliveries();
  }

  loadDeliveries(): void {
    this.loading.set(true);
    this.error.set(null);

    // ✅ تحديث الـ Signal مباشرة بعد النجاح
    this.deliveryService.getMyDeliveries().subscribe({
      next: (deliveries) => {
        this.allDeliveries.set(deliveries);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading deliveries:', err);
        this.error.set('Failed to load deliveries.');
        this.loading.set(false);
      },
    });
  }

  onDeliveryComplete(deliveryId: number): void {
    this.deliveryService.completeDelivery(deliveryId).subscribe({
      next: () => {
        // ✅ تحديث الـ Signal بطريقة صحيحة (mutate)
        this.allDeliveries.update((deliveries) => {
          const updatedDeliveries = [...deliveries];
          const deliveryIndex = updatedDeliveries.findIndex(
            (d) => d.id === deliveryId
          );

          if (deliveryIndex !== -1) {
            const delivery = updatedDeliveries[deliveryIndex];
            // تحديد الحالة الجديدة
            const newStatus =
              delivery.type === 'FORWARD'
                ? DeliveryStatus.DELIVERED
                : DeliveryStatus.RETURNED;

            // تحديث حالة التوصيلة
            updatedDeliveries[deliveryIndex] = {
              ...delivery,
              status: newStatus,
            };
          }
          return updatedDeliveries;
        });
      },
      error: (err) => {
        console.error('Error completing delivery:', err);
        alert('Failed to complete delivery. Please try again.');
      },
    });
  }

  onViewDetails(deliveryId: number): void {
    if (!deliveryId || isNaN(deliveryId)) {
      console.error('Invalid deliveryId:', deliveryId);
      alert('Invalid delivery ID.');
      return;
    }
    this.router.navigate(['/deliveries', deliveryId]);
  }

  onRefresh(): void {
    this.loadDeliveries();
  }
}
