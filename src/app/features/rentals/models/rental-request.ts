export interface RentalRequest {
rentalId: number;
  itemId: number;
  itemName?: string;
  itemIcon?: string;
  rentalPrice: number;
  depositAmount: number;
  totalPrice: number;
  status: string;
  startDate: string;
  endDate: string;
  renterAddress: string;
  createdDate: string;
  rentalDays?: number;
}
