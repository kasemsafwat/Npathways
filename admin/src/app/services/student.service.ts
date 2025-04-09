import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}

  createNewStudent(student: any): Observable<any> {
    return this.http.post(
      'http://localhost:5024/api/admin/create-NewStudent',
      student
    );
  }
  updateUserByAdmin(id: string, student: any): Observable<any> {
    {
      return this.http.put(
        `http://localhost:5024/api/admin/users/${id}`,
        student
      );
    }
  }
  deleteStudent(id: string): Observable<any> {
    return this.http.delete(`http://localhost:5024/api/student/${id}`, {});
  }
  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:5024/api/admin/getAllStudents`
    );
  }
}
