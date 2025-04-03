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

  createCourse(course: {
    name: string;
    description: string;
    requiredExams: string[];
    instructors: string[];
    lessons: { name: string }[];
  }): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/createCourse`, course);
  }

  updateCourse(id: string, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/updateCourse/${id}`, course);
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteCourse/${id}`);
  }
}
