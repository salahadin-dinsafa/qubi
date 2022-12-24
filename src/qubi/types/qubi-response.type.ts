export interface QubiResponse {
    id: number;
    slug: string;
    duration: number;
    amount: number;
    userCount: number;
    left_day: string;
    membership: boolean;
    isExpired: boolean;
}