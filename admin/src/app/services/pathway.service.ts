import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from './course.service';
import { Observable } from 'rxjs';

export interface Pathway {
  _id: string;
  name: string;
  description?: string;
  courses?: Course[];
}

@Injectable({
  providedIn: 'root',
})
export default class PathwayService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:5024/api/pathway/admin';

  getAllPathways(): Observable<Pathway[]> {
    return this.http.get<Pathway[]>(`${this.apiUrl}`);
  }
  createPathWay(pathway: Pathway): Observable<any> {
    return this.http.post<Pathway>(`${this.apiUrl}`, pathway);
  }
  getPathwayById(id: string): Observable<any> {
    return this.http.get<Pathway>(`${this.apiUrl}/${id}`);
  }
  getPathwayDetails(id: string): Observable<any> {
    return this.http.get<Pathway>(`${this.apiUrl}/${id}/courses`);
  }
  getStudentsInPathway(id: string): Observable<any> {
    return this.http.get<Pathway>(
      `http://localhost:5024/api/admin/getUsersInPathway/${id}`
    );
  }
  getUsersInPathway(id: string): Observable<any> {
    return this.http.get<Pathway>(`${this.apiUrl}/${id}/users`);
  }

  updatePathway(id: string, pathway: Pathway): Observable<any> {
    return this.http.put<Pathway>(`${this.apiUrl}/${id}`, pathway);
  }
  addCourse(id: string, courseIds: string[]): Observable<any> {
    return this.http.post<Pathway>(`${this.apiUrl}/${id}/addCourse`, {
      courses: [courseIds],
    });
  }
  removeCourse(id: string, courseIds: string[]): Observable<any> {
    return this.http.delete<Pathway>(`${this.apiUrl}/${id}/removeCourse`, {
      body: { courses: [courseIds] },
    });
  }
  enrollUserByAdmin(id: string, userId: string): Observable<any> {
    return this.http.post<Pathway>(`${this.apiUrl}/enroll-Student`, {
      userId: userId,
      pathwayId: id,
    });
  }
  unenrollUserByAdmin(id: string, userId: string): Observable<any> {
    return this.http.post<Pathway>(`${this.apiUrl}/unEnroll-Student`, {
      userId: userId,
      pathwayId: id,
    });
  }
  deletePathway(id: string): Observable<any> {
    return this.http.delete<Pathway>(`${this.apiUrl}/${id}`);
  }
}
