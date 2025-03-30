import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Certificate {
  _id?: string;
  name: string;
  description: string;
  course: string;
  createdAt?: string;
}

export interface GrantCertificateRequest {
  userId: string;
  certificateId: string;
}

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private apiUrl = 'http://localhost:5024/api/certificate';

  constructor(private http: HttpClient) {}

  getCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(this.apiUrl);
  }

  getCertificateById(id: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/${id}`);
  }

  createCertificate(certificate: {
    name: string;
    description: string;
    course: string;
  }): Observable<Certificate> {
    return this.http.post<Certificate>(
      `${this.apiUrl}/createCertificate`,
      certificate
    );
  }

  updateCertificate(
    id: string,
    certificate: Certificate
  ): Observable<Certificate> {
    return this.http.put<Certificate>(
      `${this.apiUrl}/updateCertificate/${id}`,
      certificate
    );
  }

  deleteCertificate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteCertificate/${id}`);
  }

  grantCertificate(grantRequest: GrantCertificateRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/grantCertificate`, grantRequest);
  }
}
