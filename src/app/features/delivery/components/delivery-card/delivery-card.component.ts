import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Delivery } from '../../models/delivery.model';

@Component({
  selector: 'app-delivery-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-card.component.html',
  styleUrls: ['./delivery-card.component.css'],
})
export class DeliveryCardComponent {
  // ✅ استخدام Input Signals
  @Input({ required: true }) delivery!: Delivery;
  @Input() isCompleted: boolean = false; // لا يمكن أن تكون Signal Input إذا تم استخدامها مباشرة في الـ template

  // الـ Outputs تبقى كما هي
  @Output() complete = new EventEmitter<number>();
  @Output() viewDetails = new EventEmitter<number>();

  // ✅ استخدام Computed Signals للمنطق المشتق
  public pickupName = computed(() => {
    return this.delivery.type === 'FORWARD'
      ? this.delivery.ownerName
      : this.delivery.renterName;
  });

  public pickupAddress = computed(() => {
    return this.delivery.type === 'FORWARD'
      ? this.delivery.ownerAddress
      : this.delivery.renterAddress;
  });

  public formattedTime = computed(() => {
    const scheduledStartTime = this.delivery.scheduledStartTime;
    if (scheduledStartTime) {
      const date = new Date(scheduledStartTime);
      return date.toLocaleTimeString('en', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return 'Not specified';
  });

  // ⛔️ تم حذف الدوال القديمة (getPickupName, getPickupAddress, getFormattedTime)

  onCompleteClick(event: Event): void {
    event.stopPropagation();
    this.complete.emit(this.delivery.id);
  }

  onCardClick(): void {
    this.viewDetails.emit(this.delivery.id);
  }
}
