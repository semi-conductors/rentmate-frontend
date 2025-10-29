import { Injectable } from '@angular/core';
import {  Observable} from 'rxjs';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:8585/items'; 
  
  constructor(private http: HttpClient) {}
   getItemById(id: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
  
}
