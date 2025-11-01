import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { CategoryDTO } from '../../models/category.model';
import { EMPTY, catchError, finalize } from 'rxjs';

interface CategoryManagementState {
  categories: CategoryDTO[];
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  
  private readonly categoryService = inject(CategoryService);

  categoryState = signal<CategoryManagementState>({
    categories: [],
    loading: false,
    error: null
  });

  newCategoryName = signal('');
  editingCategory = signal<CategoryDTO | null>(null);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryState.update(state => ({ ...state, loading: true, error: null }));
    
    this.categoryService.getAllCategories().pipe(
      catchError(err => {
        console.error('Failed to load categories', err);
        this.categoryState.set({ categories: [], loading: false, error: 'Failed to load categories. Please try again.' });
        return EMPTY;
      }),
      finalize(() => this.categoryState.update(state => ({ ...state, loading: false })))
    ).subscribe(categories => {
      this.categoryState.update(state => ({ ...state, categories }));
    });
  }

  addCategory(): void {
    const name = this.newCategoryName().trim();
    if (!name) return;

    this.categoryService.createCategory({ name }).pipe(
      catchError(err => {
        this.categoryState.update(state => ({ ...state, error: 'Category already exists!' }));
        return EMPTY;
      })
    ).subscribe(newCat => {
      this.categoryState.update(state => ({ 
        ...state, 
        categories: [...state.categories, newCat],
        error: null 
      }));
      this.newCategoryName.set(''); 
    });
  }
  startEdit(category: CategoryDTO): void {
    this.editingCategory.set({ ...category }); 
  }
  cancelEdit(): void {
    this.editingCategory.set(null);
  }

  saveEdit(): void {
    const categoryToUpdate = this.editingCategory();
    if (!categoryToUpdate || !categoryToUpdate.id || !categoryToUpdate.name.trim()) return;

    this.categoryService.updateCategory(categoryToUpdate.id, categoryToUpdate).pipe(
      catchError(err => {
        this.categoryState.update(state => ({ ...state, error: 'Failed to update category, this name already exists.' }));
        return EMPTY;
      })
    ).subscribe(updatedCat => {
      this.categoryState.update(state => ({
        ...state,
        categories: state.categories.map(cat => 
          cat.id === updatedCat.id ? updatedCat : cat
        ),
        error: null
      }));
      this.cancelEdit();
    });
  }
  
  deleteCategory(id: number): void {
    if (!confirm('Are you sure you want to delete this category?')) return;

    this.categoryService.deleteCategory(id).pipe(
      catchError(err => {
        this.categoryState.update(state => ({ ...state, error: 'Failed to delete category. This category is linked to existing items.' }));
        return EMPTY;
      })
    ).subscribe(() => {
      this.categoryState.update(state => ({
        ...state,
        categories: state.categories.filter(cat => cat.id !== id),
        error: null
      }));
    });
  }
  updateEditingName(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.editingCategory.update(cat => cat ? { ...cat, name: input.value } : null);
  }
}
