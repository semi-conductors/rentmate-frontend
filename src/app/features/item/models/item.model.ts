export interface ItemResponseDTO {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  rentalPrice: number; 
  categoryId: number;
  imageUrl: string;
  availability: boolean; 
  ownerAddress: string;
}

export interface ItemRequestDTO {
  ownerId: number;
  title: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl?: string;
  ownerAddress: string;
}

export interface PageableResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // Current page number (0-indexed)
  size: number; // Page size
  
}