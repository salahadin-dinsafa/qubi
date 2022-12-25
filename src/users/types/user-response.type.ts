import { QubiResponse } from "../../qubi/types/qubi-response.type";

export interface UserResponse {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    deposited_maney: number;
    left_maney: number;
    deposited_day: number;
    left_day: number;
    qubi: QubiResponse
}