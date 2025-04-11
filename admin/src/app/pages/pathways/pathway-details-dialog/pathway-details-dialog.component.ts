import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PathwayService, Pathway } from '../../../services/pathway.service';
import { Course } from '../../../services/course.service';
import { EditPathwayDialogComponent } from '../edit-pathway-dialog/edit-pathway-dialog.component';
import { StudentService } from '../../../services/student.service';

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

interface StudentWithName {
  _id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-pathway-details-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, EditPathwayDialogComponent],
  template: `
    <div class="dialog-overlay" (click)="onClose()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>Pathway Details</h3>
          <button class="close-button" (click)="onClose()">×</button>
        </div>

        <div class="dialog-body">
          <div class="details-section">
            <h4>Basic Information</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Name:</span>
                <span class="info-value">{{ pathway.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Description:</span>
                <span class="info-value">{{
                  pathway.description || 'No description'
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Total Courses:</span>
                <span class="info-value">{{
                  pathway.courses?.length || 0
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Total Students:</span>
                <span class="info-value">{{
                  enrolledStudents.length || 0
                }}</span>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h4>Courses</h4>
            <div class="courses-list">
              <div class="course-item" *ngFor="let course of pathway.courses">
                {{ getCourseName(course._id) }}
              </div>
            </div>
          </div>

          <div class="details-section">
            <h4>Students</h4>
            <div class="students-management">
              <div class="students-list">
                <div
                  class="student-item"
                  *ngFor="let student of enrolledStudents"
                >
                  <span>{{
                    student.firstName + ' ' + student.lastName ||
                      'Unknown Student'
                  }}</span>
                  <button
                    class="btn btn-sm btn-danger"
                    (click)="removeStudent(student._id)"
                  >
                    <i class="fas fa-user-minus"></i>
                  </button>
                </div>
              </div>

              <div class="add-student-section">
                <h5>Add Student</h5>
                <div class="student-selector">
                  <select
                    class="form-select"
                    [(ngModel)]="selectedStudentId"
                    (change)="onStudentSelected()"
                  >
                    <option value="">Select a student</option>
                    <option
                      class="student-option text-black"
                      *ngFor="let StudentWithName of availableStudents"
                      [value]="StudentWithName._id"
                    >
                      {{ StudentWithName.name }}
                    </option>
                  </select>
                  <button
                    class="btn btn-primary"
                    (click)="addSelectedStudent()"
                    [disabled]="!selectedStudentId"
                  >
                    Add Student
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="dialog-actions">
            <button class="btn btn-primary" (click)="showEditDialog = true">
              <i class="fas fa-edit"></i>
              Edit Pathway
            </button>
            <button class="btn btn-secondary" (click)="onClose()">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Dialog -->
    <app-edit-pathway-dialog
      *ngIf="showEditDialog"
      [pathway]="pathway"
      [courses]="courses"
      (close)="showEditDialog = false"
      (save)="onSavePathway($event)"
    ></app-edit-pathway-dialog>
  `,
  styles: [
    `
      .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .dialog-content {
        background: white;
        border-radius: 8px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #eee;
      }

      .dialog-header h3 {
        margin: 0;
        color: #333;
      }

      .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
      }

      .dialog-body {
        padding: 1rem;
      }

      .details-section {
        margin-bottom: 2rem;
      }

      .details-section h4 {
        color: #333;
        margin-bottom: 1rem;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .info-item {
        display: flex;
        flex-direction: column;
      }

      .info-label {
        font-weight: 500;
        color: #666;
        margin-bottom: 0.25rem;
      }

      .info-value {
        color: #333;
      }

      .courses-list,
      .students-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .course-item,
      .student-item {
        padding: 0.5rem;
        background-color: #f5f5f5;
        border-radius: 4px;
        color: #333;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .add-student-section {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #eee;
      }

      .add-student-section h5 {
        margin-bottom: 0.5rem;
        color: #333;
      }

      .student-selector {
        display: flex;
        gap: 0.5rem;
      }

      .form-select {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #eee;
      }

      .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
      }

      .btn-primary {
        background-color: #2196f3;
        color: white;
      }

      .btn-secondary {
        background-color: #e0e0e0;
        color: #333;
      }

      .btn-danger {
        background-color: #f44336;
        color: white;
      }

      .btn:hover {
        opacity: 0.9;
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class PathwayDetailsDialogComponent implements OnInit {
  @Input() pathway!: Pathway;
  @Input() courses: Course[] = [];
  @Input() allStudents: import('../../../services/pathway.service').Student[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Pathway>();
  @Output() enrollStudent = new EventEmitter<{
    pathwayId: string;
    userId: string;
  }>();
  @Output() unenrollStudent = new EventEmitter<{
    pathwayId: string;
    userId: string;
  }>();

  showEditDialog = false;
  enrolledStudents: Student[] = [];
  availableStudents: StudentWithName[] = [];
  selectedStudentId = '';

  constructor(
    private pathwayService: PathwayService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.loadEnrolledStudents();
    this.loadAvailableStudents();
  }

  loadEnrolledStudents() {
    if (this.pathway._id) {
      this.pathwayService.getStudentsInPathway(this.pathway._id).subscribe({
        next: (response: any) => {
          // Ensure we're working with an array
          this.enrolledStudents = Array.isArray(response)
            ? response
            : response.data
            ? response.data
            : [];
        },
        error: (error: Error) => {
          console.error('Error loading enrolled students:', error);
          this.enrolledStudents = [];
        },
      });
    }
  }

  loadAvailableStudents() {
    this.studentService.getAllStudents().subscribe({
      next: (response: any) => {
        console.log('Raw student response:', response);
        // Ensure we're working with an array and get the students array from the response
        const allStudentsData = Array.isArray(response)
          ? response
          : response.students || [];
        console.log('Processed student data:', allStudentsData);

        // Map to Student interface
        const allStudentsMapped: Student[] = allStudentsData.map((s: any) => ({
          _id: s._id,
          firstName: s.firstName,
          lastName: s.lastName,
          email: s.email,
        }));
        console.log('Mapped students:', allStudentsMapped);

        // Filter out students who are already enrolled
        const enrolledIds = new Set(
          this.enrolledStudents.map((s: Student) => s._id)
        );
        this.availableStudents = allStudentsMapped
          .filter((s: Student) => !enrolledIds.has(s._id))
          .map((s: Student) => ({
            _id: s._id,
            name: `${s.firstName} ${s.lastName}`,
            email: s.email || '',
          }));
        console.log('Available students for dropdown:', this.availableStudents);
      },
      error: (error: Error) => {
        console.error('Error loading available students:', error);
        this.availableStudents = [];
      },
    });
  }

  // Called by parent after successful enrollment
  onEnrollmentSuccess() {
    this.loadEnrolledStudents();
    this.loadAvailableStudents();
    this.selectedStudentId = ''; // Reset selection
  }

  // Called by parent after successful unenrollment
  onUnenrollmentSuccess() {
    this.loadEnrolledStudents();
    this.loadAvailableStudents();
  }

  onStudentSelected() {
    // This method can be used for additional logic when a student is selected
  }

  addSelectedStudent() {
    if (!this.selectedStudentId || !this.pathway._id) return;

    // Emit the enroll event and wait for parent confirmation
    this.enrollStudent.emit({
      pathwayId: this.pathway._id,
      userId: this.selectedStudentId,
    });
  }

  removeStudent(studentId: string) {
    if (!this.pathway._id) return;

    // Emit the unenroll event and wait for parent confirmation
    this.unenrollStudent.emit({
      pathwayId: this.pathway._id,
      userId: studentId,
    });
  }

  getCourseName(courseId: string): string {
    const course = this.courses.find((c) => c._id === courseId);
    return course ? course.name : 'Unknown Course';
  }

  onClose(): void {
    this.close.emit();
  }

  onSavePathway(updatedPathway: Pathway): void {
    this.save.emit(updatedPathway);
    this.showEditDialog = false;
  }
}
