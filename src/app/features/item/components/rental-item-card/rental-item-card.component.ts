import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ItemResponseDTO } from '../../models/item.model';

@Component({
  selector: 'app-rental-item-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './rental-item-card.component.html',
  styleUrls: ['./rental-item-card.component.css']
})
export class RentalItemCardComponent {
  @Input({ required: true }) item!: ItemResponseDTO;
  
  constructor(private router: Router) {}

  rentNow(): void {
    this.router.navigate(['/booking', this.item.id]);
  }
}