export interface RatingDto {
  id: number;
  rating: number; // 1..5
  raterUserId: number;
  raterUserName: string;
  feedback?: string;
  createdAt: string; // ISO date
}

export interface RatingListResponse {
  items: RatingDto[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}