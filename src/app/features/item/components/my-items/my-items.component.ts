import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { ItemResponseDTO } from '../../models/item.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-items',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit {
  items: ItemResponseDTO[] = [];
  loading: boolean = true;
  error: string | null = null;
  
  // Modal state
  isModalOpen: boolean = false;
  selectedItem: ItemResponseDTO | null = null;
  newAvailabilityStatus: boolean = true; 

 

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.fetchOwnerItems();
  }

  fetchOwnerItems(): void {
    this.loading = true;
    
    this.itemService.getItemsByOwner().subscribe({ 
      next: (data) => {
        this.items = data;
        this.loading = false;
        this.error = null; 
      },
      error: (err) => {
        console.error('Failed to load user items:', err);
        
        this.error = 'Failed to load your items. Please ensure you are logged in.';
        this.loading = false;
        this.items = []; 
      }
    });
  }

  deleteItem(itemId: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      
      this.itemService.deleteItem(itemId).subscribe({
        next: () => {
          alert('Item deleted successfully (soft delete).');
          this.fetchOwnerItems(); 
        },
        error: (err) => {
          alert('Failed to delete item. You may not be the owner.');
          console.error(err);
        }
      });
    }
  }

  // --- Update Availability Modal Methods ---

  openUpdateAvailabilityModal(item: ItemResponseDTO): void {
    this.selectedItem = item;
    this.newAvailabilityStatus = item.availability;
    this.isModalOpen = true;
  }

  closeUpdateAvailabilityModal(): void {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  saveAvailability(): void {
    if (!this.selectedItem) return;

    
    this.itemService.updateItemAvailability(
      this.selectedItem.id, 
      this.newAvailabilityStatus
    ).subscribe({
      next: (updatedItem) => {
        alert(`${updatedItem.title} availability updated.`);
        this.closeUpdateAvailabilityModal();
        this.fetchOwnerItems(); 
      },
      error: (err) => {
        alert('Failed to update availability. You may not be the owner.');
        console.error(err);
        this.closeUpdateAvailabilityModal();
      }
    });
  }
}