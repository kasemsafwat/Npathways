import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface for Instructor data
export interface Instructor {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  courses?: string[];
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private readonly BASE_URL = 'http://localhost:5024/api';

  constructor(private http: HttpClient) {}

  getAllInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(`${this.BASE_URL}/admin/AllInstructor`);
  }

  getInstructorById(id: string): Observable<Instructor> {
    return this.http.get<Instructor>(
      `${this.BASE_URL}/admin/instructors/${id}`
    );
  }

  createInstructor(instructor: Instructor): Observable<any> {
    return this.http.post(
      `${this.BASE_URL}/admin/createNewInstructor`,
      instructor
    );
  }

  deleteInstructor(id: string): Observable<any> {
    return this.http.delete(
      `${this.BASE_URL}/instructor/deleteInstructor/${id}`
    );
  }

  updateInstructor(
    id: string,
    instructor: Partial<Instructor>
  ): Observable<any> {
    return this.http.put(
      `${this.BASE_URL}/admin/instructors/${id}`,
      instructor
    );
  }

  //changInstructorImage()
}
