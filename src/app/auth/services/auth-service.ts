import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { LoginRequest, User } from '../models/user.model';
import { LoginResponse, LogoutResponse, MeResponse, RefreshResponse } from '../models/auth.model';

@Service()
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/auth`;
    private readonly ACCESS_TOKEN_KEY = 'access_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private readonly USER_KEY = 'current_user';
    currentUser = signal<User | null>(null);

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
            .pipe(
                tap(response => {
                    this.saveAuthData(
                        response.data.accessToken,
                        response.data.refreshToken,
                        response.data.user
                    );
                })
            );
    }
    fetchCurrentUser(): Observable<MeResponse> {
        return this.http.get<MeResponse>(`${this.apiUrl}/me`)
            .pipe(
                tap(response => {
                    this.saveUser(response.data.user);
                })
            );
    }
    refreshToken(): Observable<RefreshResponse> {
        return this.http.post<RefreshResponse>(`${this.apiUrl}/refresh`, {
            refreshToken: localStorage.getItem(this.REFRESH_TOKEN_KEY)
        });
    }
    getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    getStoredUser(): User | null {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    }
    isLoggedIn(): boolean {
        return !!this.getAccessToken();
    }
    logout() {
        return this.http.post<LogoutResponse>(`${this.apiUrl}/logout`, {})
            .pipe(
                tap(() => {
                    this.performLocalLogout();
                })
            );
    }
    forceLogout() {
        this.performLocalLogout();
    }
    private saveAuthData(
        accessToken: string,
        refreshToken: string,
        user: User
    ): void {
        localStorage.setItem(
            this.ACCESS_TOKEN_KEY,
            accessToken
        );

        localStorage.setItem(
            this.REFRESH_TOKEN_KEY,
            refreshToken
        );
        this.saveUser(user);

    }
    private saveUser(user: User) {
        localStorage.setItem(
            this.USER_KEY,
            JSON.stringify(user)
        );
        this.currentUser.set(user);
    }
    private clearAuthData() {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }
    private performLocalLogout() {
        this.clearAuthData();
        this.currentUser.set(null);
    }
}

