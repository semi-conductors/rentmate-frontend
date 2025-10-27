import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryDTO } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // نقطة النهاية (من الكود الخلفي الذي قدمته)
  private categoryUrl = 'http://localhost:8081/categories';

  constructor(private http: HttpClient) { }

  /**
   * GET /categories: للحصول على جميع الفئات
   */
  getAllCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(this.categoryUrl);
  }

  /**
   * POST /categories: لإنشاء فئة جديدة
   */
  createCategory(categoryDTO: Omit<CategoryDTO, 'id'>): Observable<CategoryDTO> {
    return this.http.post<CategoryDTO>(this.categoryUrl, categoryDTO);
  }

  /**
   * PUT /categories/{id}: لتحديث فئة موجودة
   */
  updateCategory(id: number, categoryDTO: CategoryDTO): Observable<CategoryDTO> {
    return this.http.put<CategoryDTO>(`${this.categoryUrl}/${id}`, categoryDTO);
  }

  /**
   * DELETE /categories/{id}: لحذف فئة
   */
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoryUrl}/${id}`);
  }
}