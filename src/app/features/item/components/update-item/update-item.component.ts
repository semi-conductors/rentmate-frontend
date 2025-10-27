import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { ItemRequestDTO } from '../../models/item.model';
import { CategoryDTO } from '../../../category/models/category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service'; 


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
  itemId: number | null = null;
  itemData: UpdateFormDTO | null = null;
  categories: CategoryDTO[] = [];
  
  selectedImageFile: File | null = null;
  selectedFileName: string = '';

  loading: boolean = true;
  errorMessage: string | null = null;
  error: string | null = null;
  
  

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private router: Router,
    private authService: AuthService 
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.itemId = +id;
      this.fetchCategories();
      this.fetchItemDetails(this.itemId);
    } else {
      this.error = 'Item ID is missing.';
      this.loading = false;
    }
  }

  fetchCategories(): void {
    
    this.itemService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  fetchItemDetails(id: number): void {
    this.loading = true;
    this.itemService.getItemById(id).subscribe({
      next: (data) => {
        // Map ItemResponseDTO to UpdateFormDTO
        this.itemData = {
          ownerId: data.ownerId,
          title: data.title,
          description: data.description,
          price: data.rentalPrice, 
          categoryId: data.categoryId,
          imageUrl: data.imageUrl,
          ownerAddress: data.ownerAddress,
          availability: data.availability
        };
        this.loading = false;
        
     
        const currentUserId = this.authService.currentUser()?.id;
        
        if (!currentUserId || this.itemData.ownerId !== currentUserId) {
            this.error = 'You do not have permission to edit this item, or you are not logged in.';
            this.itemData = null;
        }
      },
      error: (err) => {
        this.error = 'Could not load item details for update.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedImageFile = input.files[0];
      this.selectedFileName = this.selectedImageFile.name;
    } else {
      this.selectedImageFile = null;
      this.selectedFileName = '';
    }
  }
  
  onSubmit(): void {
    if (!this.itemData || !this.itemId) return;
    this.errorMessage = null;
    this.loading = true;

    const initialAvailability = this.itemData.availability;

    const requestDTO: ItemRequestDTO = {
        ownerId: this.itemData.ownerId,
        title: this.itemData.title,
        description: this.itemData.description,
        price: this.itemData.price,
        categoryId: this.itemData.categoryId,
        ownerAddress: this.itemData.ownerAddress,
        imageUrl: this.itemData.imageUrl // Sending the current/new URL string
    };

    this.itemService.updateItem(this.itemId, requestDTO).subscribe({
      next: (response) => {
        alert('Item details updated successfully!');
        this.loading = false;

        // Check if availability was changed and call the PATCH API
        if (this.itemData!.availability !== initialAvailability) {
            this.updateAvailabilityInSeparateCall(this.itemId!, this.itemData!.availability);
        } else {
             this.router.navigate(['/my-items']);
        }
      },
      error: (err) => {
        this.errorMessage = 'Update failed. Please check the form and try again.';
        console.error(err);
        this.loading = false;
      }
    });
  }
  
  private updateAvailabilityInSeparateCall(itemId: number, newAvailability: boolean): void {
      
      this.itemService.updateItemAvailability(itemId, newAvailability).subscribe({ 
          next: () => {
              alert('Availability also updated successfully.');
              this.router.navigate(['/my-items']);
          },
          error: (err) => {
              this.errorMessage = 'Item details updated, but failed to update availability.';
              console.error(err);
              this.router.navigate(['/my-items']); 
          }
      });
  }
}