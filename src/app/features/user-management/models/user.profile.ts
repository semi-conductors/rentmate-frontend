export interface UserProfile {
    id: number;
    email: string;
    username: string;
    isVerified: boolean;
    role: string;
    phoneNumber: string;
    accountActivity: string;
    rating: number;
    totalRatings: number;
    memberSince: string;
}  