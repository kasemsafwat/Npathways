import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}
  private readonly BASE_URL = 'http://localhost:5024/api/payment';
  getAllPayments() {
    return this.http.get(`${this.BASE_URL}/getAllPayments`);
  }
}
