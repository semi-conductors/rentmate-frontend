import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ItemRequestDTO } from '../../models/item.model';
import { CategoryDTO } from '../../../category/models/category.model';

@Component({
  selector: 'app-create-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css']
})
export class CreateItemComponent implements OnInit {
  private readonly itemService = inject(ItemService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signals for state
  readonly itemData = signal<ItemRequestDTO>({
    ownerId: 0,
    title: '',
    description: '',
    price: 0,
    categoryId: null as any,
    ownerAddress: ''
  });
  readonly categories = signal<CategoryDTO[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly imageFile = signal<File | null>(null);
  readonly selectedFileName = computed(() => this.imageFile()?.name ?? '');

  ngOnInit(): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser?.id) {
      this.router.navigate(['/login']);
      return;
    }
    this.itemData.update(d => ({ ...d, ownerId: currentUser.id??-1 }));
    this.fetchCategories();
  }

  private fetchCategories(): void {
    this.itemService.getAllCategories().subscribe({
      next: data => this.categories.set(data),
      error: err => console.error('Error fetching categories:', err)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.imageFile.set(input.files[0]);
    } else {
      this.imageFile.set(null);
    }
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    const item = this.itemData();
    const image = this.imageFile();

    if (!image) {
      this.errorMessage.set('Please select an image file.');
      return;
    }
    if (!item.ownerId) {
      this.errorMessage.set('User not authorized. Please refresh or log in.');
      return;
    }

    this.loading.set(true);
    this.itemService.createItem(item, image).subscribe({
      next: (response) => {
        alert(`Item created successfully! ID: ${response.id}`);
        this.loading.set(false);
        this.router.navigate(['/my-items']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Creation failed. Please check the form and try again.');
        this.loading.set(false);
      }
    });
  }
}