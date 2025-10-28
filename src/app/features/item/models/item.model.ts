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

export interface Page<T> {
  content: T[];              
  totalElements: number;    
  totalPages: number;       
  size: number;             
  number: number;           
  numberOfElements: number;  
  first: boolean;            
  last: boolean;             
  empty: boolean;           
}