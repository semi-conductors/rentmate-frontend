import { UserProfile } from "../../user-management/models/user.profile";

export interface ReportDetailsResponse {
  id: number;
  reportType: 'FRAUD' | 'DAMAGE' | 'OVERDUE' | 'FAKE_USER' | 'THIEVING';
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  details: string;
  relatedRentalId: number | null;
  relatedDeliveryId: number | null;
  damagePercentage: number | null;
  submittedAt: string;
  resolvedAt: string | null;
  claimedAt: string | null;
  lockExpiresAt: string | null;
  reporter: UserProfile;
  reported: UserProfile;
}