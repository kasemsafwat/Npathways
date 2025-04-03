import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Interface for Instructor data
export interface Instructor {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private readonly BASE_URL = 'http://localhost:5024/api/admin';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Helper method to create HTTP headers with auth token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getAllInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(`${this.BASE_URL}/AllInstructor`, {
      headers: this.getAuthHeaders(),
    });
  }

  getInstructorById(id: string): Observable<Instructor> {
    return this.http.get<Instructor>(`${this.BASE_URL}/instructors/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }


  createInstructor(instructor: Instructor): Observable<any> {
    return this.http.post(`${this.BASE_URL}/createNewInstructor`, instructor, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteInstructor(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateInstructor(
    id: string,
    instructor: Partial<Instructor>
  ): Observable<any> {
    return this.http.put(`${this.BASE_URL}/instructors/${id}`, instructor, {
      headers: this.getAuthHeaders(),
    });
  }
}
