import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { ItemResponseDTO } from '../../models/item.model';
import { CategoryDTO } from '../../../category/models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rentals',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.css']
})
export class RentalsComponent implements OnInit {
  items: ItemResponseDTO[] = [];
  categories: CategoryDTO[] = [];
  loading: boolean = true;

  keyword: string | null = null;
  minPrice: number | null = 0;
  maxPrice: number | null = 1000;
  selectedCategory: number | null = null;

  
  currentPage: number = 0;
  pageSize: number = 12; 
  totalPages: number = 0;

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchItems();
  }

  fetchCategories(): void {
    this.itemService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  fetchItems(): void {
    this.loading = true;
    this.itemService.searchItems(
      this.keyword,
      this.minPrice,
      this.maxPrice,
      this.selectedCategory,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (page) => {
        this.items = page.content;
        this.totalPages = page.totalPages;
        this.currentPage = page.number;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching items:', err);
        this.loading = false;
        this.items = [];
        this.totalPages = 0;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0; // Reset page on filter application
    this.fetchItems();
  }

  clearFilters(): void {
    this.keyword = null;
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.selectedCategory = null;
    this.currentPage = 0;
    this.fetchItems();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.fetchItems();
    }
  }
}