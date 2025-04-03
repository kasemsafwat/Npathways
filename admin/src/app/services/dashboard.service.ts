import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface DashboardResponse {
  totalUsers?: number;
  totalOrders?: number;
  recentActivity?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly API_URL = 'http://localhost:5024/api/admin/dashboard';

  constructor(private http: HttpClient, private authService: AuthService) {}
  // get dashboard data from the API
  getDashboardData(): Observable<DashboardResponse> {
    // and include the auth token in the headers
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<DashboardResponse>(this.API_URL, { headers });
  }
}
