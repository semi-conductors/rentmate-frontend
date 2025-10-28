import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { ItemResponseDTO } from '../../models/item.model';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent {
  private route = inject(ActivatedRoute);
  private itemService = inject(ItemService);

  item = signal<ItemResponseDTO | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadItem(+id);
    }
  }

  private loadItem(id: number): void {
    this.itemService.getItemById(id).subscribe({
      next: (data) => {
        this.item.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load item details.');
        this.loading.set(false);
      }
    });
  }
}