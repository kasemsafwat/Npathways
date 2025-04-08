import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Instructor } from './instructor.service';

interface Lesson {
  name: string;
  duration?: number;
  _id?: string;
}

export interface Course {
  _id?: string;
  name: string;
  description: string;
  requiredExams: string[];
  instructors: Instructor[];
  lessons: Lesson[];
  image?: string;
  status?: string;
  category?: string;
  price?: number;
  discount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private apiUrl = 'http://localhost:5024/api/course';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  createCourse(courseData: FormData): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/createCourse`, courseData);
  }

  updateCourse(id: string, courseData: FormData): Observable<Course> {
    return this.http.put<Course>(
      `${this.apiUrl}/updateCourse/${id}`,
      courseData
    );
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteCourse/${id}`);
  }
  // STILL IN UNDER DEVELOPMENT
  getUsersInCourse(id: string): Observable<any> {
    return this.http.get<any>(
      `http://localhost:5024/api/user/getUsersInCourse/${id}`
    );
  }
}
