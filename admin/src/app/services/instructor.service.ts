import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeadersService } from './http-headers.service';

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

  constructor(
    private http: HttpClient,
    private headerService: HttpHeadersService
  ) {}

  getAllInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(`${this.BASE_URL}/AllInstructor`, {
      headers: this.headerService.getAuthHeaders(),
    });
  }

  getInstructorById(id: string): Observable<Instructor> {
    return this.http.get<Instructor>(`${this.BASE_URL}/instructors/${id}`, {
      headers: this.headerService.getAuthHeaders(),
    });
  }

  createInstructor(instructor: Instructor): Observable<any> {
    return this.http.post(`${this.BASE_URL}/createNewInstructor`, instructor, {
      headers: this.headerService.getAuthHeaders(),
    });
  }

  deleteInstructor(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`, {
      headers: this.headerService.getAuthHeaders(),
    });
  }

  updateInstructor(
    id: string,
    instructor: Partial<Instructor>
  ): Observable<any> {
    return this.http.put(`${this.BASE_URL}/instructors/${id}`, instructor, {
      headers: this.headerService.getAuthHeaders(),
    });
  }

  //changInstructorImage()
}
