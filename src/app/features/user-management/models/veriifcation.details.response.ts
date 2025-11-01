import { UserProfile } from "./user.profile";
import { VerificationResponse } from "./verification.response";

export interface VerificationDetailResponse extends VerificationResponse{
    submittedBy: UserProfile,
    reviewedBy: UserProfile | null
}