import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpHeadersService {
  constructor(private authService: AuthService) {}

  /**
   * Creates HTTP headers with authentication token
   * @returns HttpHeaders with Authorization and Content-Type
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });
  }
}
