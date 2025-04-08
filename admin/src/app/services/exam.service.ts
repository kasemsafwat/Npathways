import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl);
  }

  getExamById(id: string): Observable<Exam> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Exam>(url);
  }

  createExam(examData: ExamPayload): Observable<Exam> {
    const url = `${this.apiUrl}/createExam`;
    return this.http.post<Exam>(url, examData);
  }

  updateExam(id: string, examData: ExamPayload): Observable<Exam> {
    const url = `${this.apiUrl}/updateExam/${id}`;
    return this.http.put<Exam>(url, examData);
  }

  deleteExam(id: string): Observable<void> {
    const url = `${this.apiUrl}/deleteExam/${id}`;
    return this.http.delete<void>(url);
  }

  uploadQuestionsSheet(file: File, examId: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(
      `${this.apiUrl}/uploadQuestionsSheet/${examId}`,
      formData
    );
  }
}
