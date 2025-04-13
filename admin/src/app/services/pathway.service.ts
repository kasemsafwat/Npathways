import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Course {
  _id: string;
  name: string;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
}

export interface Pathway {
  _id: string;
  name: string;
  description?: string;
  courses?: Course[];
  students?: Student[];
  studentCount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PathwayService {
  private apiUrl = 'http://localhost:5024/api/pathway/admin';

  constructor(private http: HttpClient) {}

  getAllPathways(): Observable<{ message: string; data: Pathway[] }> {
    return this.http.get<{ message: string; data: Pathway[] }>(`${this.apiUrl}`);
  }

  createPathWay(pathway: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, pathway);
  }

  getPathwayById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getPathwayDetailsPathwayCourses(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/courses`);
  }

  getStudentsInPathway(id: string): Observable<{ message: string; data: Student[] }> {
    return this.http.get<{ message: string; data: Student[] }>(`${this.apiUrl}/${id}/students`);
  }

  updatePathway(id: string, pathway: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, pathway);
  }

  addCourse(id: string, courseIds: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/addCourse`, { courses: courseIds });
  }

  removeCourse(id: string, courseId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/courses`, {
      body: { courses: [courseId] },
    });
  }

  enrollUserByAdmin(id: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/enroll-Student`, {
      userId: userId,
      pathwayId: id,
    });
  }

  unenrollUserByAdmin(id: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/unEnroll-Student`, {
      userId: userId,
      pathwayId: id,
    });
  }

  deletePathway(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
