export interface User {
    id?: number;
    username?: string;
    email?: string;
    role?: 'ADMIN' | 'MANAGER' | 'USER' | 'DELIVERY_GUY';
    isVerified?: boolean;
    phoneNumber?: string;
    accoutnActivity?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED_BY_ADMIN' | 'PENDING_REPORT_REVIEW';
  }