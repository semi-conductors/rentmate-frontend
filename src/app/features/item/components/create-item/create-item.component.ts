import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { ItemRequestDTO } from '../../models/item.model';
import { CategoryDTO } from '../../../category/models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service'; 

@Component({
  selector: 'app-create-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css']
})
export class CreateItemComponent implements OnInit {
  itemData: ItemRequestDTO = {
    ownerId: 0, 
    title: '',
    description: '',
    price: 0,
    categoryId: null as any,
    ownerAddress: ''
  };
  
  imageFile: File | null = null;
  selectedFileName: string = '';
  categories: CategoryDTO[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    
    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.id) {
        this.itemData.ownerId = currentUser.id;
        this.fetchCategories();
    } else {
        
        this.router.navigate(['/login']);
    }
  }

  fetchCategories(): void {
    this.itemService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.imageFile = input.files[0];
      this.selectedFileName = this.imageFile.name;
    } else {
      this.imageFile = null;
      this.selectedFileName = '';
    }
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (!this.imageFile) {
      this.errorMessage = 'Please select an image file.';
      return;
    }
    if (this.itemData.ownerId === 0) {
        this.errorMessage = 'User not authorized. Please refresh or log in.';
        return;
    }
    
    this.loading = true;
    
    
    this.itemService.createItem(this.itemData, this.imageFile).subscribe({
      next: (response) => {
        alert('Item created successfully! ID: ' + response.id);
        this.loading = false;
        this.router.navigate(['/my-items']); 
      },
      error: (err) => {
        this.errorMessage = 'Creation failed. Please check the form and try again.';
        console.error(err);
        this.loading = false;
      }
    });
  }
}