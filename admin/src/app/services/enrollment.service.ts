import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  constructor(private http: HttpClient) {}
  private readonly BASE_URL = 'http://localhost:5024/api/enrollment';
  getAllEnrollments(): Observable<any> {
    return this.http.get(`${this.BASE_URL}`);
  }
  getEnrollmentById(id: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/${id}`);
  }
  deleteEnrollment(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/deleteEnrollment/${id}`);
  }
}
