import { User } from '../models/user.model';

export interface LoginResponse {
    message: string;
    success: boolean;
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    }
}
export interface MeResponse {
    message: string;
    success: boolean;
    data: {
        user: User;
    }
}
export interface LogoutResponse {
    message: string;
    success: boolean;
}
export interface RefreshResponse {
    message: string;
    success: boolean;
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        role: string;
    }
}
