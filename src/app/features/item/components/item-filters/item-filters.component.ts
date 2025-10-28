import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryDTO } from '../../../category/models/category.model';

export interface ItemFilters {
  keyword: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  categoryId: number | null;
}

@Component({
  selector: 'app-rental-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-filters.component.html',
  styleUrls: ['./item-filters.component.css']
})
export class RentalFiltersComponent {

  @Input({ required: true }) categories: CategoryDTO[] = [];
  
  @Output() filterApplied = new EventEmitter<ItemFilters>();

  filters = signal<ItemFilters>({
    keyword: null,
    minPrice: null,
    maxPrice: null,
    categoryId: null
  });

  constructor() { }

  applyFilters(): void {
    this.filterApplied.emit(this.filters());
  }

  clearFilters(): void {
    this.filters.set({
      keyword: null,
      minPrice: 0,
      maxPrice: 1000,
      categoryId: null
    });
    this.filterApplied.emit(this.filters());
  }
}