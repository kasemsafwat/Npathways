import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Certificate {
  _id: string;
  name: string;
  description: string;
  course: string;
  createdAt: string;
  __v: number;
}

@Injectable({
  providedIn: 'root'
})
export class CertificatesService {
  private apiUrl = `http://localhost:5024/api/certificate`;

  constructor(private http: HttpClient) {}

  getCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(this.apiUrl);
  }

  getCertificateById(id: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/${id}`);
  }

  createCertificate(data: { name: string; description: string; course: string }): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.apiUrl}/createCertificate`, data);
  }

  updateCertificate(id: string, data: { name: string; description: string }): Observable<Certificate> {
    return this.http.put<Certificate>(`${this.apiUrl}/updateCertificate/${id}`, data);
  }

  deleteCertificate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteCertificate/${id}`);
  }

  grantCertificate(certificateId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/grantCertificate`, { userId ,certificateId});
  }
}
