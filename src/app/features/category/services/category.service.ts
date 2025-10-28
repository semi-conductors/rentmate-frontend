import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryDTO } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoryUrl = 'http://localhost:8081/categories';

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(this.categoryUrl);
  }

  createCategory(categoryDTO: Omit<CategoryDTO, 'id'>): Observable<CategoryDTO> {
    return this.http.post<CategoryDTO>(this.categoryUrl, categoryDTO);
  }

  updateCategory(id: number, categoryDTO: CategoryDTO): Observable<CategoryDTO> {
    return this.http.put<CategoryDTO>(`${this.categoryUrl}/${id}`, categoryDTO);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoryUrl}/${id}`);
  }
}