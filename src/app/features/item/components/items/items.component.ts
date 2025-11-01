import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../services/item.service';
import { CategoryService } from '../../../category/services/category.service'; // خدمة الفئات
import { ItemResponseDTO } from '../../models/item.model';
import { RentalItemCardComponent } from '../rental-item-card/rental-item-card.component';
import { ItemFilters, RentalFiltersComponent } from '../item-filters/item-filters.component';
import { CategoryDTO } from '../../../category/models/category.model';
import { Page } from '../../models/item.model'; 

@Component({
  selector: 'app-rentals',
  standalone: true,

  imports: [
    CommonModule, 
    RentalItemCardComponent, 
    RentalFiltersComponent
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class RentalsComponent implements OnInit {

  private readonly itemService = inject(ItemService);
  private readonly categoryService = inject(CategoryService);

 itemsPage = signal<Page<ItemResponseDTO>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    numberOfElements: 0, 
    number: 0,
    size: 10,
    first: true,        
    last: true,        
    empty: true
  });

  
  categories = signal<CategoryDTO[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  currentFilters = signal<ItemFilters>({
    keyword: null,
    minPrice: null,
    maxPrice: null,
    categoryId: null
  });

  hasItems = computed(() => this.itemsPage().content.length > 0);
  
  ngOnInit(): void {
    this.fetchCategories();
  
    this.searchItems();
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  handleFilterApplied(filters: ItemFilters): void {
    this.currentFilters.set(filters);
    this.searchItems(0); 
  }

  searchItems(page: number = 0): void {
    this.loading.set(true);
    const filters = this.currentFilters();
    
    this.itemService.searchItems(
      filters.keyword,
      filters.minPrice,
      filters.maxPrice,
      filters.categoryId,
      page
    ).subscribe({
      next: (pageData) => {
        this.itemsPage.set(pageData);
        this.error.set(null);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.error.set('Failed to load items. Check your filters.');
        this.loading.set(false);
      }
    });
  }

  onPageChange(pageNumber: number): void {
    if (pageNumber >= 0 && pageNumber < this.itemsPage().totalPages) {
      this.searchItems(pageNumber);
    }
  }
}