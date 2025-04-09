import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursesService, Course } from '../../services/course.service';
// --- Placeholder Import ---
// import { CertificatesService, Certificate } from '../../services/certificates.service';

// --- Placeholder Interface ---
// Replace with actual interface from CertificatesService
export interface Certificate {
  _id: string;
  name: string;
  description: string;
  courseId?: string; // Optional: might be useful for display
  // Add other relevant fields returned by the service
}

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  certificates: Certificate[] = []; // To store existing certificates

  // --- Granting Properties ---
  selectedCertificateIdForGranting: string | null = null;
  selectedUserIdForGranting: string | null = null;

  // --- UI State ---
  isLoadingCertificates: boolean = false;
  isLoadingUsers: boolean = false;
  isCreating: boolean = false;
  isGranting: boolean = false;
  isDeleting: string | null = null; // Store ID of certificate being deleted

  constructor(
    private courseService: CoursesService,
    // --- Placeholder Injection ---
    // private certificatesService: CertificatesService
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
    // --- Placeholder Service Call ---
    // Replace with actual service call
    // MOCK IMPLEMENTATION START
    setTimeout(() => {
        this.certificates = [
            { _id: 'cert1', name: 'Mock Cert A', description: 'Description A', courseId: this.courses[0]?._id },
            { _id: 'cert2', name: 'Mock Cert B', description: 'Description B', courseId: this.courses[1]?._id }
        ];
        console.log('Mock certificates loaded:', this.certificates);
        this.isLoadingCertificates = false;
    }, 1000);
    // MOCK IMPLEMENTATION END
    /*
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
    */
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
    const certificateTemplateData = {
      name: this.certificateName,
      description: this.certificateDescription,
      courseId: this.selectedCourseId,
    };
    console.log('Creating certificate template with data:', certificateTemplateData);

    // --- Placeholder Service Call ---
    // Replace with actual service call
    // MOCK IMPLEMENTATION START
     setTimeout(() => {
        console.log('Mock certificate template created successfully.');
        // Add the new cert to the list (or reload)
        const newCert: Certificate = { ...certificateTemplateData, _id: `newMock${Date.now()}` };
        this.certificates.push(newCert);
        // Reset form
        this.certificateName = '';
        this.certificateDescription = '';
        // Keep course selected maybe? Reset if needed: this.selectedCourseId = null;
        this.isCreating = false;
     }, 1000);
    // MOCK IMPLEMENTATION END
    /*
    this.certificatesService.createCertificate(certificateTemplateData).subscribe({
      next: (newCertificate) => {
        console.log('Certificate template created successfully:', newCertificate);
        this.loadCertificates(); // Reload the list
        // Reset form
        this.certificateName = '';
        this.certificateDescription = '';
        // Keep course selected maybe? Reset if needed: this.selectedCourseId = null;
        this.isCreating = false;
        // Add success feedback
      },
      error: (err) => {
        console.error('Error creating certificate template:', err);
        this.isCreating = false;
        // Add error feedback
      }
    });
    */
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

    // --- Placeholder Service Call ---
    // Replace with actual service call
    // MOCK IMPLEMENTATION START
    setTimeout(() => {
        console.log('Mock certificate granted successfully.');
        // Reset granting form selections
        this.selectedCertificateIdForGranting = null;
        this.selectedUserIdForGranting = null;
        // Maybe reset course/users too?
        // this.selectedCourseId = null; // This might be annoying if granting multiple from same course
        // this.users = [];
        this.isGranting = false;
        // Add success feedback
    }, 1000);
    // MOCK IMPLEMENTATION END
    /*
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
    */
  }

   // --- Certificate Deletion ---
  deleteCertificate(id: string): void {
    if (!confirm('Are you sure you want to delete this certificate template? This might affect granted certificates.')) {
        return;
    }
    this.isDeleting = id;
    console.log('Deleting certificate template ID:', id);

    // --- Placeholder Service Call ---
    // Replace with actual service call
    // MOCK IMPLEMENTATION START
    setTimeout(() => {
        console.log('Mock certificate deleted successfully.');
        this.certificates = this.certificates.filter(cert => cert._id !== id);
        this.isDeleting = null;
         // If the deleted certificate was selected for granting, reset selection
        if (this.selectedCertificateIdForGranting === id) {
            this.selectedCertificateIdForGranting = null;
        }
        // Add success feedback
    }, 1000);
    // MOCK IMPLEMENTATION END
    /*
    this.certificatesService.deleteCertificate(id).subscribe({
        next: () => {
            console.log('Certificate template deleted successfully.');
            this.loadCertificates(); // Reload list
            this.isDeleting = null;
             // If the deleted certificate was selected for granting, reset selection
            if (this.selectedCertificateIdForGranting === id) {
                this.selectedCertificateIdForGranting = null;
            }
            // Add success feedback
        },
        error: (err) => {
            console.error('Error deleting certificate template:', err);
            this.isDeleting = null;
            // Add error feedback
        }
    });
    */
  }

  // Helper to get course name - requires course data to be available
  getCourseName(courseId: string | undefined): string {
    if (!courseId) return 'N/A';
    const course = this.courses.find(c => c._id === courseId);
    return course ? course.name : 'Unknown Course';
  }
}
