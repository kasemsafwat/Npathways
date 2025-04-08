import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(this.API_URL);
  }
}
