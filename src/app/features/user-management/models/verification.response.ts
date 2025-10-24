export interface VerificationResponse {
  id: number;
  userId: number;
  idFrontImageUrl: string;
  idBackImageUrl: string;
  idNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}