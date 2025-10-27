import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { ItemResponseDTO } from '../../models/item.model';
import { CategoryDTO } from '../../../category/models/category.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  item: ItemResponseDTO | null = null;
  categoryName: string = 'N/A';
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService
  ) { }

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.fetchItemDetails(+itemId);
    } else {
      this.error = 'Item ID is missing.';
      this.loading = false;
    }
  }

  fetchItemDetails(id: number): void {
    this.loading = true;
    this.itemService.getItemById(id).subscribe({
      next: (data) => {
        this.item = data;
        this.fetchCategoryName(data.categoryId);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Could not load item details.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  fetchCategoryName(categoryId: number): void {
    
    this.itemService.getAllCategories().subscribe({
      next: (categories: CategoryDTO[]) => {
        const category = categories.find(c => c.id === categoryId);
        this.categoryName = category ? category.name : 'Unknown Category';
      },
      error: (err) => {
        console.error('Error fetching category name:', err);
        this.categoryName = 'Category Error';
      }
    });
  }

  contactOwner(): void {
    alert(`Initiating contact for: ${this.item?.title}. (Feature not implemented yet)`);
  }
}