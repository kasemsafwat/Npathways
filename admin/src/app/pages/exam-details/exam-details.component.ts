import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ExamService, Exam } from '../../services/exam.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'app-exam-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './exam-details.component.html',
  styleUrl: './exam-details.component.css'
})
export class ExamDetailsComponent implements OnInit {
  examId: string = '';
  exam: Exam | null = null;
  examForm: FormGroup;
  isEditing: boolean = false;
  difficulties = ['easy', 'medium', 'hard'];
  readonly MIN_ANSWERS = 2;
  readonly MAX_ANSWERS = 4;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.examForm = this.createExamForm();
  }

  ngOnInit(): void {
    this.examId = this.route.snapshot.params['id'];
    this.loadExamDetails();
  }

  private createExamForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      timeLimit: ['', [Validators.required, Validators.min(1)]],
      questions: this.fb.array([])
    });
  }

  private createQuestionForm(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      difficulty: ['medium', Validators.required],
      answers: this.fb.array([])
    });
  }

  private createAnswerForm(): FormGroup {
    return this.fb.group({
      answer: ['', Validators.required],
      isCorrect: [false]
    });
  }

  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  getAnswers(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('answers') as FormArray;
  }

  loadExamDetails(): void {
    this.examService.getExamById(this.examId).subscribe({
      next: (exam) => {
        this.exam = exam;
        this.patchFormWithExamData(exam);
      },
      error: (error) => {
        console.error('Error loading exam details:', error);
        this.showErrorNotification('Error loading exam details. Please try again.');
      }
    });
  }

  patchFormWithExamData(exam: Exam): void {
    this.examForm.patchValue({
      name: exam.name,
      timeLimit: exam.timeLimit
    });

    const questionsFormArray = this.examForm.get('questions') as FormArray;
    questionsFormArray.clear();

    exam.questions.forEach(question => {
      const questionForm = this.createQuestionForm();
      questionForm.patchValue({
        question: question.question,
        difficulty: question.difficulty
      });

      const answersFormArray = questionForm.get('answers') as FormArray;
      question.answers.forEach(answer => {
        answersFormArray.push(this.fb.group({
          answer: answer.answer,
          isCorrect: answer.isCorrect
        }));
      });

      questionsFormArray.push(questionForm);
    });
  }

  addQuestion(): void {
    const questionForm = this.createQuestionForm();
    const answersArray = questionForm.get('answers') as FormArray;
    // Add 3 default answer fields
    for (let i = 0; i < 3; i++) {
      answersArray.push(this.createAnswerForm());
    }
    this.questions.push(questionForm);
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  addAnswer(questionIndex: number): void {
    const answers = this.getAnswers(questionIndex);
    if (answers.length < this.MAX_ANSWERS) {
      answers.push(this.createAnswerForm());
    } else {
      alert(`Maximum ${this.MAX_ANSWERS} answers allowed per question.`);
    }
  }

  removeAnswer(questionIndex: number, answerIndex: number): void {
    const answers = this.getAnswers(questionIndex);
    if (answers.length > this.MIN_ANSWERS) {
      answers.removeAt(answerIndex);
    } else {
      alert(`Minimum ${this.MIN_ANSWERS} answers required per question.`);
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.patchFormWithExamData(this.exam!);
    }
  }

  validateAnswers(): boolean {
    let isValid = true;
    const questions = this.examForm.get('questions') as FormArray;

    for (let i = 0; i < questions.length; i++) {
      const answers = this.getAnswers(i);
      if (answers.length < this.MIN_ANSWERS || answers.length > this.MAX_ANSWERS) {
        alert(`Question ${i + 1} must have between ${this.MIN_ANSWERS} and ${this.MAX_ANSWERS} answers.`);
        isValid = false;
        break;
      }
    }
    return isValid;
  }

  saveExam(): void {
    if (this.examForm.valid && this.validateAnswers()) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Confirm Save',
          message: 'Are you sure you want to save these changes to the exam?'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.examService.updateExam(this.examId, this.examForm.value).subscribe({
            next: (updatedExam) => {
              this.exam = updatedExam;
              this.isEditing = false;
              this.showSuccessNotification('Exam updated successfully!');
            },
            error: (error) => {
              console.error('Error updating exam:', error);
              this.showErrorNotification(error.error?.message || 'Error updating exam. Please try again.');
            }
          });
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.examId) {
      this.examService.uploadQuestionsSheet(file, this.examId).subscribe({
        next: (response: any) => {
          console.log('File uploaded successfully:', response);
          this.showSuccessNotification('Questions sheet uploaded successfully!');
          this.loadExamDetails();
        },
        error: (error: any) => {
          console.error('Error uploading file:', error);
          this.showErrorNotification(error.error?.message || 'Error uploading questions sheet. Please try again.');
        }
      });
    }
  }

  private showErrorNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

  private showSuccessNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}

