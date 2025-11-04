export interface CreateReportRequest {
  reportedUserId: number | null;
  reporterUserId: number;
  reportType: string | null;
  details: string;
  relatedRentalId: number | null;
  relatedDeliveryId: number | null;
  damagePercentage?: number | null;
}