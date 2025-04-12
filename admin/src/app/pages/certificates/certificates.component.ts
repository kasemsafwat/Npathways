import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursesService, Course } from '../../services/course.service';
import { CertificatesService, Certificate as CertificateType } from '../../services/certificates.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EditCertificateDialogComponent } from './edit-certificate-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { CertificateService } from '../../services/certificate.service';
// import { UserService } from '../../services/user.service';
// --- Placeholder Import ---
// import { CertificatesService, Certificate } from '../../services/certificates.service';

// Updated interface to match actual API response
export interface Certificate {
  _id: string;
  name: string;
  description: string;
  course: string; // This is the course ID
  createdAt: string;
  __v: number;
}

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [CertificatesService, CertificateService],
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificateComponent implements OnInit {
  // --- Form Properties ---
  courses: Course[] = [];
  users: any[] = [];
  selectedCourseId: string | null = null; // For creation AND for filtering users for granting
  certificateName: string = '';
  certificateDescription: string = '';

  // --- Certificate List Properties ---
  certificates: CertificateType[] = []; // To store existing certificates

  // --- Granting Properties ---
  selectedCertificateIdForGranting: string | null = null;
  selectedUserIdForGranting: string | null = null;

  // --- UI State ---
  isLoadingCertificates: boolean = false;
  isLoadingUsers: boolean = false;
  isCreating: boolean = false;
  isGranting: boolean = false;
  isDeleting: string | null = null; // Store ID of certificate being deleted
  isUpdating: string | null = null; // Store ID of certificate being updated

  // --- Update Properties ---
  editingCertificate: CertificateType | null = null;
  editName: string = '';
  editDescription: string = '';

  constructor(
    private courseService: CoursesService,
    private certificatesService: CertificatesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private certificateService: CertificateService,
    // private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadCertificates();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => { this.courses = data; },
      error: (err) => console.error('Error loading courses:', err)
    });
  }

  loadCertificates(): void {
    this.isLoadingCertificates = true;
    console.log('Loading certificates...');

    this.certificatesService.getCertificates().subscribe({
      next: (data) => {
        this.certificates = data;
        console.log('Certificates loaded:', this.certificates);
        this.isLoadingCertificates = false;
      },
      error: (err) => {
        console.error('Error loading certificates:', err);
        this.isLoadingCertificates = false;
        // Add user feedback
      }
    });
  }

  // loadUsers(courseId: string): void {
  //   this.isLoadingUsers = true;
  //   this.userService.getUsersByCourse(courseId).subscribe({
  //     next: (data) => {
  //       this.users = data;
  //       this.isLoadingUsers = false;
  //     },
  //     error: (error) => {
  //       console.error('Error loading students:', error);
  //       this.isLoadingUsers = false;
  //       // Add user feedback
  //     }
  //   });
  // }

  onCertificateSelectForGranting(certificateId: string): void {
    this.selectedCertificateIdForGranting = certificateId;
    this.selectedUserIdForGranting = null; // Reset user selection
    this.users = []; // Clear previous users

    // Find the selected certificate
    const selectedCertificate = this.certificates.find(cert => cert._id === certificateId);
    if (selectedCertificate) {
      this.isLoadingUsers = true;
      console.log('Loading users for Course ID:', selectedCertificate.course);
      this.courseService.getUsersInCourse(selectedCertificate.course).subscribe({
        next: (data) => {
          this.users = data.users || data || [];
          console.log('Users loaded:', this.users);
          this.isLoadingUsers = false;
          if (this.users.length === 0) {
            console.warn('No users found for this course.');
          }
        },
        error: (err) => {
          console.error('Error loading users for course:', err);
          this.isLoadingUsers = false;
          // Add user feedback
        }
      });
    }
  }

  // --- Certificate Creation ---
  createCertificate(): void {
    if (!this.selectedCourseId || !this.certificateName || !this.certificateDescription) {
      console.error('Name, Description, and Course must be provided');
      // Add user feedback
      return;
    }
    this.isCreating = true;
    const certificateData = {
      name: this.certificateName,
      description: this.certificateDescription,
      course: this.selectedCourseId, // Note: API expects 'course' not 'courseId'
    };
    console.log('Creating certificate with data:', certificateData);

    this.certificatesService.createCertificate(certificateData).subscribe({
      next: (newCertificate) => {
        console.log('Certificate created successfully:', newCertificate);
        this.loadCertificates(); // Reload the list
        // Reset form
        this.certificateName = '';
        this.certificateDescription = '';
        // Keep course selected maybe? Reset if needed: this.selectedCourseId = null;
        this.isCreating = false;
        // Add success feedback
      },
      error: (err) => {
        console.error('Error creating certificate:', err);
        this.isCreating = false;
        // Add error feedback
      }
    });
  }

  // --- Certificate Update ---
  startEdit(certificate: CertificateType): void {
    const dialogRef = this.dialog.open(EditCertificateDialogComponent, {
      width: '500px',
      data: {
        certificate: { ...certificate },
        editName: certificate.name,
        editDescription: certificate.description
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editingCertificate = certificate;
        this.editName = result.editName;
        this.editDescription = result.editDescription;
        this.updateCertificate();
      }
    });
  }

  cancelEdit(): void {
    this.editingCertificate = null;
    this.editName = '';
    this.editDescription = '';
    this.isUpdating = null;
  }

  updateCertificate(): void {
    if (!this.editingCertificate || !this.editName || !this.editDescription) {
      this.snackBar.open('Certificate, Name, and Description must be provided for update', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      return;
    }

    this.isUpdating = this.editingCertificate._id;
    const updateData = {
      name: this.editName,
      description: this.editDescription
    };
    console.log('Updating certificate with data:', updateData);

    this.certificatesService.updateCertificate(this.editingCertificate._id, updateData).subscribe({
      next: (updatedCertificate) => {
        console.log('Certificate updated successfully:', updatedCertificate);
        this.loadCertificates(); // Reload the list
        this.cancelEdit(); // Reset edit state
        this.isUpdating = null;
        this.snackBar.open('Certificate updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      },
      error: (err) => {
        console.error('Error updating certificate:', err);
        this.isUpdating = null;
        this.snackBar.open(err.error?.message || 'Error updating certificate', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }

  // --- Certificate Granting ---
  grantCertificate(): void {
    if (!this.selectedCertificateIdForGranting || !this.selectedUserIdForGranting) {
      this.snackBar.open('Please select both certificate and student', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      return;
    }
    this.isGranting = true;
    const grantData = {
      certificateId: this.selectedCertificateIdForGranting,
      userId: this.selectedUserIdForGranting
    };
    console.log('Granting certificate with data:', grantData);

    this.certificatesService.grantCertificate(grantData.certificateId, grantData.userId).subscribe({
      next: (response) => {
        console.log('Certificate granted successfully:', response);
        // Reset selections
        this.selectedCertificateIdForGranting = null;
        this.selectedUserIdForGranting = null;
        this.isGranting = false;
        // Show success notification
        this.snackBar.open('Certificate granted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      },
      error: (err) => {
        console.error('Error granting certificate:', err);
        this.isGranting = false;
        // Show error notification
        this.snackBar.open(err.error?.message || 'Error granting certificate', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }

  // --- Certificate Deletion ---
  deleteCertificate(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Certificate',
        message: 'Are you sure you want to delete this certificate? This might affect granted certificates.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isDeleting = id;
        console.log('Deleting certificate ID:', id);

        this.certificatesService.deleteCertificate(id).subscribe({
          next: () => {
            console.log('Certificate deleted successfully.');
            this.loadCertificates(); // Reload list
            this.isDeleting = null;
            // If the deleted certificate was selected for granting, reset selection
            if (this.selectedCertificateIdForGranting === id) {
              this.selectedCertificateIdForGranting = null;
            }
            this.snackBar.open('Certificate deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          },
          error: (err) => {
            console.error('Error deleting certificate:', err);
            this.isDeleting = null;
            this.snackBar.open(err.error?.message || 'Error deleting certificate', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          }
        });
      }
    });
  }

  // Helper to get course name - requires course data to be available
  getCourseName(courseId: string | undefined): string {
    if (!courseId) return 'N/A';
    const course = this.courses.find(c => c._id === courseId);
    return course ? course.name : 'Unknown Course';
  }
}
