export interface ReportResponse {
  id: number;
  reportType: 'FRAUD' | 'DAMAGE' | 'OVERDUE' | 'FAKE_USER' | 'THIEVING';
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  reporterId: number;
  reporterName: string;
  reportedUserId: number;
  reportedUserName: string;
  details: string;
  relatedRentalId?: number;
  relatedDeliveryId?: number;
  damagePercentage?: number;
  submittedAt: string;
  resolvedAt?: string;
}