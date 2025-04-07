import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeadersService } from './http-headers.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(
    private http: HttpClient,
    private headerService: HttpHeadersService
  ) {}

  createNewStudent(student: any): Observable<any> {
    return this.http.post(
      'http://localhost:5024/api/admin/create-NewStudent',
      student,
      {
        headers: this.headerService.getAuthHeaders(),
      }
    );
  }
  updateUserByAdmin(id: string, student: any): Observable<any> {
    {
      return this.http.put(
        `http://localhost:5024/api/admin/users/${id}`,
        student,
        {
          headers: this.headerService.getAuthHeaders(),
        }
      );
    }
  }
  deleteStudent(id: string): Observable<any> {
    return this.http.delete(`http://localhost:5024/api/student/${id}`, {
      headers: this.headerService.getAuthHeaders(),
    });
  }
  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5024/api/user/all`, {
      headers: this.headerService.getAuthHeaders(),
    });
  }
}
