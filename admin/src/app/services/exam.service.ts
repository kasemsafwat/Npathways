import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeadersService } from './http-headers.service';
export interface ExamPayload {
  name: string;
  timeLimit: number;
  questions: {
    question: string;
    answers: {
      answer: string;
      isCorrect: boolean;
    }[];
    difficulty: 'easy' | 'medium' | 'hard';
  }[];
}

export interface Answer {
  answer: string;
  isCorrect: boolean;
}

export interface Question {
  question: string;
  answers: Answer[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Exam {
  _id: string;
  name: string;
  timeLimit: number;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private apiUrl = 'http://localhost:5024/api/exam';

  constructor(
    private http: HttpClient,
    private headerService: HttpHeadersService
  ) {}

  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl, {
      headers: this.headerService.getAuthHeaders(),
    });
  }

  getExamById(id: string): Observable<Exam> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Exam>(url, {
      headers: this.headerService.getAuthHeaders(),
    });
  }

  createExam(examData: ExamPayload): Observable<Exam> {
    const url = `${this.apiUrl}/createExam`;
    return this.http.post<Exam>(url, examData, {
      headers: this.headerService.getAuthHeaders(),
    });
  }

  updateExam(id: string, examData: ExamPayload): Observable<Exam> {
    const url = `${this.apiUrl}/updateExam/${id}`;
    return this.http.put<Exam>(url, examData, {
      headers: this.headerService.getAuthHeaders(),
    });
  }

  deleteExam(id: string): Observable<void> {
    const url = `${this.apiUrl}/deleteExam/${id}`;
    return this.http.delete<void>(url, {
      headers: this.headerService.getAuthHeaders(),
    });
  }

  uploadQuestionsSheet(file: File, examId: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const headers = this.headerService.getAuthHeaders();
    const uploadHeaders = headers;

    return this.http.post(
      `${this.apiUrl}/uploadQuestionsSheet/${examId}`,
      formData,
      {
        headers: uploadHeaders,
      }
    );
  }
}
