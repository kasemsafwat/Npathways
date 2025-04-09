import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursesService, Course } from '../../services/course.service';
import { CertificatesService, Certificate as CertificateType } from '../../services/certificates.service';
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
  imports: [CommonModule, FormsModule],
  providers: [CertificatesService],
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
    private certificatesService: CertificatesService
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

  onCourseChange(): void {
    this.users = [];
    this.selectedUserIdForGranting = null; // Reset user selection for granting when course changes
    if (this.selectedCourseId) {
      this.isLoadingUsers = true;
      console.log('Loading users for Course ID:', this.selectedCourseId);
      this.courseService.getUsersInCourse(this.selectedCourseId).subscribe({
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
    } else {
      console.log('Course selection cleared, clearing users.');
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
    this.editingCertificate = certificate;
    this.editName = certificate.name;
    this.editDescription = certificate.description;
  }

  cancelEdit(): void {
    this.editingCertificate = null;
    this.editName = '';
    this.editDescription = '';
    this.isUpdating = null;
  }

  updateCertificate(): void {
    if (!this.editingCertificate || !this.editName || !this.editDescription) {
      console.error('Certificate, Name, and Description must be provided for update');
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
        // Add success feedback
      },
      error: (err) => {
        console.error('Error updating certificate:', err);
        this.isUpdating = null;
        // Add error feedback
      }
    });
  }

  // --- Certificate Granting ---
  grantCertificate(): void {
    if (!this.selectedCertificateIdForGranting || !this.selectedUserIdForGranting) {
      console.error('Certificate and User must be selected for granting');
      // Add user feedback
      return;
    }
    this.isGranting = true;
    const grantData = {
      certificateId: this.selectedCertificateIdForGranting,
      userId: this.selectedUserIdForGranting
    };
    console.log('Granting certificate with data:', grantData);

    this.certificatesService.grantCertificate(grantData.certificateId, grantData.userId).subscribe({
      next: (response) => { // Adjust based on actual response
        console.log('Certificate granted successfully:', response);
        // Reset selections
        this.selectedCertificateIdForGranting = null;
        this.selectedUserIdForGranting = null;
        this.isGranting = false;
        // Add success feedback
      },
      error: (err) => {
        console.error('Error granting certificate:', err);
        this.isGranting = false;
        // Add error feedback
      }
    });
  }

  // --- Certificate Deletion ---
  deleteCertificate(id: string): void {
    if (!confirm('Are you sure you want to delete this certificate? This might affect granted certificates.')) {
      return;
    }
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
        // Add success feedback
      },
      error: (err) => {
        console.error('Error deleting certificate:', err);
        this.isDeleting = null;
        // Add error feedback
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
