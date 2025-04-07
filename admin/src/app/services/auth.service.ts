import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5024/api/admin/login';
  private tokenKey = 'admin_auth_token';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = { email, password };

    return this.http.post<LoginResponse>(this.API_URL, loginData).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  // This helper method can decode the JWT token to extract user information
  getUserFromToken(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      // Token format: header.payload.signature
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  // Get the user's role from the token
  getUserRole(): string | null {
    const user = this.getUserFromToken();
    return user ? user.role : null;
  }

  // Get the user's name from the token
  getUserName(): string | null {
    const user = this.getUserFromToken();
    return user ? user.name : null;
  }

  // Check if the user has admin role
  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  getProfile(): Observable<any> {
    const url = 'http://localhost:5024/api/admin/';
    return this.http.get<any>(url, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      }, */
      headers: {
        token: `${this.getToken()}`,
      },
    });
  }
  

  updateProfile(profileData: any): Observable<any> {
    const url = 'http://localhost:5024/api/admin/';
    return this.http.patch<any>(url, profileData, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }
  updatePassword(passwordData: any): Observable<any> {
    const url = 'http://localhost:5024/api/admin/update/password';
    return this.http.put<any>(url, passwordData, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }
  updateAdminData(id: string, adminData: any): Observable<any> {
    const url = `http://localhost:5024/api/admin/updateData/${id}`;
    return this.http.put<any>(url, adminData, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }
}
