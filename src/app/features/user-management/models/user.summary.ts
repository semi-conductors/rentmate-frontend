export interface UserSummary {
  id: number;
  email: string;
  username: string;
  role: 'USER' | 'DELIVERY_GUY' | 'ADMIN' | 'MANAGER';
  accountActivity: 'ACTIVE' | 'INACTIVE' | 'PENDING_REPORT_REVIEW' | 'SUSPENDED_BY_ADMIN';
  isVerified: boolean;
}