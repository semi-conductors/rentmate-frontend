import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ItemRequestDTO } from '../../models/item.model';
import { CategoryDTO } from '../../../category/models/category.model';

interface UpdateFormDTO extends Omit<ItemRequestDTO, 'price' | 'categoryId' | 'imageUrl'> {
  price: number;
  categoryId: number;
  imageUrl?: string;
  availability: boolean;
}

@Component({
  selector: 'app-update-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.css']
})
export class UpdateItemComponent implements OnInit {
  // Inject services
  private readonly route = inject(ActivatedRoute);
  private readonly itemService = inject(ItemService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // Reactive state
  readonly itemId = signal<number | null>(null);
  readonly itemData = signal<UpdateFormDTO | null>(null);
  readonly categories = signal<CategoryDTO[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly selectedImageFile = signal<File | null>(null);
  readonly selectedFileName = computed(() => this.selectedImageFile()?.name ?? '');

  readonly canEdit = computed(() => {
    const userId = this.authService.currentUser()?.id;
    const item = this.itemData();
    return userId && item && item.ownerId === userId;
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error.set('Item ID is missing.');
      this.loading.set(false);
      return;
    }

    const id = +idParam;
    this.itemId.set(id);
    this.fetchCategories();
    this.fetchItemDetails(id);
  }

  private fetchCategories(): void {
    this.itemService.getAllCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  private fetchItemDetails(id: number): void {
    this.loading.set(true);
    this.itemService.getItemById(id).subscribe({
      next: (data) => {
        const mapped: UpdateFormDTO = {
          ownerId: data.ownerId,
          title: data.title,
          description: data.description,
          price: data.rentalPrice,
          categoryId: data.categoryId,
          imageUrl: data.imageUrl,
          ownerAddress: data.ownerAddress,
          availability: data.availability
        };
        this.itemData.set(mapped);
        this.loading.set(false);

        if (!this.canEdit()) {
          this.error.set('You do not have permission to edit this item, or you are not logged in.');
          this.itemData.set(null);
        }
      },
      error: (err) => {
        console.error(err);
        this.error.set('Could not load item details for update.');
        this.loading.set(false);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImageFile.set(input.files[0]);
    } else {
      this.selectedImageFile.set(null);
    }
  }

  onSubmit(): void {
    const item = this.itemData();
    const id = this.itemId();
    if (!item || !id) return;

    this.errorMessage.set(null);
    this.loading.set(true);

    const initialAvailability = item.availability;
    const hasNewImage = !!this.selectedImageFile();

    // --- CASE 1: Image changed → send multipart/form-data ---
    if (hasNewImage) {
      const formData = new FormData();
      formData.append('imageFile', this.selectedImageFile()!);
      formData.append('itemData', new Blob([JSON.stringify({
        ownerId: item.ownerId,
        title: item.title.trim(),
        description: item.description.trim(),
        price: +item.price,
        categoryId: item.categoryId,
        ownerAddress: item.ownerAddress.trim(),
        imageUrl: item.imageUrl // may be ignored by backend
      })], { type: 'application/json' }));

      this.itemService.updateItemWithImage(id, formData).subscribe({
        next: () => {
          this.afterSuccessfulUpdate(id, initialAvailability);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Update failed while uploading new image.');
          this.loading.set(false);
        }
      });
    }
    // --- CASE 2: Image unchanged → normal PUT ---
    else {
      const requestDTO: ItemRequestDTO = {
        ownerId: item.ownerId,
        title: item.title.trim(),
        description: item.description.trim(),
        price: +item.price,
        categoryId: item.categoryId,
        ownerAddress: item.ownerAddress.trim(),
        imageUrl: item.imageUrl
      };

      this.itemService.updateItem(id, requestDTO).subscribe({
        next: () => this.afterSuccessfulUpdate(id, initialAvailability),
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Update failed. Please check the form and try again.');
          this.loading.set(false);
        }
      });
    }
  }

  private afterSuccessfulUpdate(id: number, initialAvailability: boolean): void {
    const item = this.itemData();
    if (!item) return;

    const availabilityChanged = item.availability !== initialAvailability;
    if (availabilityChanged) {
      this.itemService.updateItemAvailability(id, item.availability).subscribe({
        next: () => {
          alert('Item and availability updated successfully!');
          this.router.navigate(['/my-items']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Item updated, but failed to update availability.');
          this.router.navigate(['/my-items']);
        }
      });
    } else {
      alert('Item updated successfully!');
      this.router.navigate(['/my-items']);
    }
  }
}