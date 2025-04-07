import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExamService, Exam, ExamPayload } from '../../services/exam.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './exam-management.component.html',
  styleUrl: './exam-management.component.css'
})
export class ExamManagementComponent implements OnInit {
  exams: Exam[] = [];
  displayedColumns: string[] = ['name', 'timeLimit', 'questions', 'actions'];
  examForm: FormGroup;
  isEditing = false;
  currentExamId: string | null = null;
  isUploading: boolean = false;

  constructor(
    private examService: ExamService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      name: ['', Validators.required],
      timeLimit: ['', [Validators.required, Validators.min(1)]],
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.examService.getExams().subscribe({
      next: (data) => {
        this.exams = data;
      },
      error: (error) => {
        console.error('Error loading exams:', error);
      }
    });
  }

  createExam(): void {
    if (this.examForm.valid) {
      const examData: ExamPayload = this.examForm.value;
      this.examService.createExam(examData).subscribe({
        next: () => {
          this.loadExams();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating exam:', error);
        }
      });
    }
  }

  editExam(exam: Exam): void {
    this.isEditing = true;
    this.currentExamId = exam._id;
    this.examForm.patchValue({
      name: exam.name,
      timeLimit: exam.timeLimit,
      questions: exam.questions
    });
  }

  updateExam(): void {
    if (this.examForm.valid && this.currentExamId) {
      const examData: ExamPayload = this.examForm.value;
      this.examService.updateExam(this.currentExamId, examData).subscribe({
        next: () => {
          this.loadExams();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating exam:', error);
        }
      });
    }
  }

  deleteExam(id: string): void {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.examService.deleteExam(id).subscribe({
        next: () => {
          this.loadExams();
        },
        error: (error) => {
          console.error('Error deleting exam:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.examForm.reset();
    this.isEditing = false;
    this.currentExamId = null;
  }

  getQuestionCount(exam: Exam): number {
    return exam.questions.length;
  }

  onFileSelected(event: Event, examId: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      const fileType = file.name.split('.').pop()?.toLowerCase();

      // Check if file is an Excel file
      if (fileType !== 'xlsx' && fileType !== 'xls') {
        alert('Please upload only Excel files (.xlsx or .xls)');
        return;
      }

      this.isUploading = true;
      this.examService.uploadQuestionsSheet(file, examId).subscribe({
        next: (response) => {
          alert('Questions uploaded successfully!');
          this.loadExams(); // Refresh the exams list
        },
        error: (error) => {
          console.error('Error uploading questions:', error);
          alert('Error uploading questions. Please try again.');
        },
        complete: () => {
          this.isUploading = false;
          // Reset the file input
          input.value = '';
        }
      });
    }
  }

  viewExamDetails(examId: string): void {
    this.router.navigate(['/exam-details', examId]);
  }
}
