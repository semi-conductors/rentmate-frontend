import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Delivery, DeliveryDetailsResponse } from '../models/delivery.model';
// ⛔️ تم حذف: import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private apiUrl = 'http://localhost:8282/api/deliveries';
  // ✅ استخدام inject لـ HttpClient بدلاً من constructor
  private http = inject(HttpClient);
  // private authService = inject(AuthService); // يمكن إزالتها إذا لم يتم استخدامها

  /**
   * GET /api/deliveries/my
   */
  getMyDeliveries(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(`${this.apiUrl}/my`);
  }

  /**
   * GET /api/deliveries/{id}
   */
  getDeliveryDetails(deliveryId: number): Observable<DeliveryDetailsResponse> {
    return this.http.get<DeliveryDetailsResponse>(`${this.apiUrl}/${deliveryId}`);
  }

  /**
   * POST /api/deliveries/{deliveryId}/complete
   */
  completeDelivery(deliveryId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${deliveryId}/complete`, {});
  }

  /**
   * GET /api/deliveries/rental/{rentalId}
   */
  getDeliveriesByRental(rentalId: number): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(`${this.apiUrl}/rental/${rentalId}`);
  }
}
