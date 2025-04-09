import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  constructor(private http: HttpClient) {}
  private readonly BASE_URL = 'http://localhost:5024/api/enrollment';
  getAllEnrollments() {
    return this.http.get(`${this.BASE_URL}`);
  }
  getEnrollmentById(id: string) {
    return this.http.get(`${this.BASE_URL}/${id}`);
  }
  deleteEnrollment(id: string) {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
}
