import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private apiUrl = 'http://localhost:8282/rentals';

  constructor(private http: HttpClient) { }

  createRental(rentalRequest: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, rentalRequest, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getItemDetails(itemId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8282/rentals/items/${itemId}`);
  }
  getPendingRentalsByOwnerId(pageNum: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('pageNum', pageNum.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.apiUrl}/owner`, { params });
  }

  getRentalById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  getRentalsByRenterIdAndStatus(status: string, pageNum = 0, pageSize = 10): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/renter/${status}?pageNum=${pageNum}&pageSize=${pageSize}`
    );
  }
  getAllRentalsByRenter(pageNum: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('pageNum', pageNum.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.apiUrl}/renter`, { params });
  }
  cancelRental(rentalId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${rentalId}`);
  }
  approveRental(rentalId: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${rentalId}/approve`, {});
  }

  rejectRental(rentalId: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${rentalId}/reject`, {});
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong'
    if (error.error?.message) {
      errorMessage = error.error.message;
    }
    if (error.status === 0) {
      errorMessage = 'Cannot connect to server. Please try again later.';
    }
    return throwError(() => new Error(errorMessage));
  }



}
