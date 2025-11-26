export interface CreateReportRequest {
  reportType: string | null;
  details: string;
  relatedRentalId: number | null;
  relatedDeliveryId: number | null;
  damagePercentage?: number | null;
}