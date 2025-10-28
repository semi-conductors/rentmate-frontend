import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { ItemResponseDTO } from '../../models/item.model';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-my-items',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit {
  private readonly itemService = inject(ItemService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signals for state
  readonly items = signal<ItemResponseDTO[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  // Modal state
  readonly isModalOpen = signal(false);
  readonly selectedItem = signal<ItemResponseDTO | null>(null);
  readonly newAvailabilityStatus = signal<boolean>(true);

  // Derived/computed signals
  readonly hasItems = computed(() => this.items().length > 0);

  ngOnInit(): void {
    this.fetchOwnerItems();
  }

  fetchOwnerItems(): void {
    const user = this.authService.currentUser();
    if (!user || !user.id) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading.set(true);
    this.itemService.getItemsByOwner(user.id).subscribe({
      next: (data) => {
        this.items.set(data);
        this.error.set(null);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load user items:', err);
        this.error.set('Failed to load your items. Please ensure you are logged in.');
        this.items.set([]);
        this.loading.set(false);
      }
    });
  }

  deleteItem(itemId: number): void {
    if (!confirm('Are you sure you want to delete this item?')) return;

    this.itemService.deleteItem(itemId).subscribe({
      next: () => {
        alert('Item deleted successfully (soft delete).');
        this.fetchOwnerItems();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete item. You may not be the owner.');
      }
    });
  }

  // --- Update Availability Modal ---
  openUpdateAvailabilityModal(item: ItemResponseDTO): void {
    this.selectedItem.set(item);
    this.newAvailabilityStatus.set(item.availability);
    this.isModalOpen.set(true);
  }

  closeUpdateAvailabilityModal(): void {
    this.isModalOpen.set(false);
    this.selectedItem.set(null);
  }

  saveAvailability(): void {
    const item = this.selectedItem();
    if (!item) return;

    this.itemService.updateItemAvailability(item.id, this.newAvailabilityStatus()).subscribe({
      next: (updatedItem) => {
        alert(`${updatedItem.title} availability updated.`);
        this.closeUpdateAvailabilityModal();
        this.fetchOwnerItems();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update availability. You may not be the owner.');
        this.closeUpdateAvailabilityModal();
      }
    });
  }
}