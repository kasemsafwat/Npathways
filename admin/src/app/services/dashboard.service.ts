import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DashboardData {
  students: {
    total: number;
    active: number;
  };
  courses: {
    total: number;
    published: number;
  };
  instructors: {
    total: number;
    available: number;
  };
}

interface DashboardResponse {
  message: string;
  data: DashboardData;
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
