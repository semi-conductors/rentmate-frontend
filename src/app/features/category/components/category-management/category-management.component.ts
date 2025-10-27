import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CategoryDTO } from '../../models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  categories: CategoryDTO[] = [];
  
  currentCategory: CategoryDTO = { id: 0, name: '' }; 
  isEditMode: boolean = false;

  loading: boolean = false; 
  listLoading: boolean = true; 
  listError: string | null = null;
  
  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.listLoading = true;
    this.listError = null;
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.listLoading = false;
      },
      error: (err) => {
        this.listError = 'Failed to load categories.';
        this.listLoading = false;
        console.error('Error fetching categories:', err);
      }
    });
  }

  editCategory(category: CategoryDTO): void {
    this.currentCategory = { ...category }; 
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.currentCategory = { id: 0, name: '' };
    this.isEditMode = false;
  }

  saveCategory(): void {
    this.loading = true;
    
    if (this.isEditMode) {
      
      if (!this.currentCategory.id) {
          alert('Error: Cannot update category without a valid ID.');
          this.loading = false;
          return;
      }
      
      this.categoryService.updateCategory(this.currentCategory.id, this.currentCategory).subscribe({
        next: (updatedCategory) => {
          alert(`Category "${updatedCategory.name}" updated successfully.`);
          this.loading = false;
          this.cancelEdit();
          this.fetchCategories();
        },
        error: (err) => {
          alert('Failed to update category.');
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      const newCategoryData: Omit<CategoryDTO, 'id'> = { name: this.currentCategory.name };
      this.categoryService.createCategory(newCategoryData).subscribe({
        next: (createdCategory) => {
          alert(`Category "${createdCategory.name}" added successfully.`);
          this.loading = false;
          this.cancelEdit();
          this.fetchCategories();
        },
        error: (err) => {
          alert('Failed to add new category.');
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  deleteCategory(id: number | undefined): void {
    
    if (typeof id !== 'number' || id <= 0) {
        alert('Error: Invalid category ID for deletion.');
        return;
    }
    
    if (confirm('Are you sure you want to delete this category? This action is irreversible.')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          alert('Category deleted successfully.');
          this.fetchCategories();
        },
        error: (err) => {
          alert('Failed to delete category. It might be in use.');
          console.error(err);
        }
      });
    }
  }
}