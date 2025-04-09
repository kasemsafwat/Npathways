import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from './course.service';

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

  getAllPathways() {
    return this.http.get<Pathway[]>(`${this.apiUrl}`);
  }
  createPathWay(pathway: Pathway) {
    return this.http.post<Pathway>(`${this.apiUrl}`, pathway);
  }
  getPathwayById(id: string) {
    return this.http.get<Pathway>(`${this.apiUrl}/${id}`);
  }
  getPathwayDetails(id: string) {
    return this.http.get<Pathway>(`${this.apiUrl}/${id}/courses`);
  }
  getStudentsInPathway(id: string) {
    return this.http.get<Pathway>(
      `http://localhost:5024/api/admin/getUsersInPathway/${id}`
    );
  }
  getUsersInPathway(id: string) {
    return this.http.get<Pathway>(`${this.apiUrl}/${id}/users`);
  }

  updatePathway(id: string, pathway: Pathway) {
    return this.http.put<Pathway>(`${this.apiUrl}/${id}`, pathway);
  }
  addCourse(id: string, courseIds: string[]) {
    return this.http.post<Pathway>(`${this.apiUrl}/${id}/addCourse`, {
      courses: [courseIds],
    });
  }
  removeCourse(id: string, courseIds: string[]) {
    return this.http.delete<Pathway>(`${this.apiUrl}/${id}/removeCourse`, {
      body: { courses: [courseIds] },
    });
  }
  enrollUserByAdmin(id: string, userId: string) {
    return this.http.post<Pathway>(`${this.apiUrl}/enroll-Student`, {
      userId: userId,
      pathwayId: id,
    });
  }
  unenrollUserByAdmin(id: string, userId: string) {
    return this.http.post<Pathway>(`${this.apiUrl}/unEnroll-Student`, {
      userId: userId,
      pathwayId: id,
    });
  }
}
