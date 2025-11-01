import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ItemResponseDTO, ItemRequestDTO, Page } from '../models/item.model';
import { CategoryDTO } from '../../category/models/category.model';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:8081/items';
  private categoryUrl = 'http://localhost:8081/categories';
  
  
  constructor(
    private http: HttpClient, 
    private authService: AuthService 
  ) { }

  
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    if (!token) {
     
      console.warn('Authorization token is missing.');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(this.categoryUrl);
  }

  
  searchItems(
    keyword: string | null,
    minPrice: number | null,
    maxPrice: number | null,
    categoryId: number | null,
    page: number = 0,
    size: number = 12
  ): Observable<Page<ItemResponseDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (keyword) params = params.set('keyword', keyword);
    if (minPrice !== null) params = params.set('minPrice', minPrice.toString());
    if (maxPrice !== null) params = params.set('maxPrice', maxPrice.toString());
    if (categoryId) params = params.set('categoryId', categoryId.toString());

    return this.http.get<Page<ItemResponseDTO>>(`${this.apiUrl}/search`, { params });
  }
  
 
  getItemById(id: number): Observable<ItemResponseDTO> {
    return this.http.get<ItemResponseDTO>(`${this.apiUrl}/${id}`);
  }

  
  getItemsByOwner(ownerId: number): Observable<ItemResponseDTO[]> {
    return this.http.get<ItemResponseDTO[]>(`${this.apiUrl}/owner/${ownerId}`);
  }

  
  createItem(itemData: ItemRequestDTO, imageFile: File): Observable<ItemResponseDTO> {
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    formData.append('itemData', new Blob([JSON.stringify(itemData)], { type: 'application/json' }));

    return this.http.post<ItemResponseDTO>(this.apiUrl, formData, {
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error('Create Item Failed:', err);
        return throwError(() => err);
      })
    );
  }

  
  updateItem(id: number, itemRequestDTO: ItemRequestDTO): Observable<ItemResponseDTO> {
    return this.http.put<ItemResponseDTO>(`${this.apiUrl}/${id}`, itemRequestDTO);
  }

  
  deleteItem(id: number): Observable<void> {
    const user = this.authService.currentUser();
    if (!user || !user.id) {
      return throwError(() => new Error('User not logged in or missing ID.'));
    }
    let params = new HttpParams()
      .set('ownerId', user.id.toString())
      .set('isActive', 'false'); 
      
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { params });
  }

  
  updateItemAvailability(id: number, availability: boolean): Observable<ItemResponseDTO> {
    const user = this.authService.currentUser();
    if (!user || !user.id) {
      return throwError(() => new Error('User not logged in or missing ID.'));
    }

    let params = new HttpParams()
      .set('ownerId', user.id.toString())
      .set('availability', availability.toString());
    
    return this.http.patch<ItemResponseDTO>(`${this.apiUrl}/${id}/availability`, null, { params });
  }

  updateItemWithImage(id: number, formData: FormData) {
    const user = this.authService.currentUser();
    if (!user || !user.id) {
      return throwError(() => new Error('User not logged in or missing ID.'));
    }

    return this.http.put<ItemResponseDTO>(`${this.apiUrl}/${id}/with-image`,formData);
  }
}