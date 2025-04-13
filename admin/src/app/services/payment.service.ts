import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}
  private readonly BASE_URL = 'http://localhost:5024/api/payment';
  getAllPayments(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/getAllPayments`);
  }
}
