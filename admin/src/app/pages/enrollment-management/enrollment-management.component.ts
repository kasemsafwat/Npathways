import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { EnrollmentService } from '../../services/enrollment.service';
import { EnrollmentDetailsComponent } from './enrollment-details/enrollment-details.component';

interface Enrollment {
  _id: string;
  userId: {
    _id: string;
    pathways: Array<{
      _id: string;
      name: string;
    }>;
  };
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  facultyName: string;
  GPA: number;
  motivationLetter: string;
  exam: Array<{
    question: string;
    answer: string;
  }>;
  createdAt: string;
  updatedAt: string;
  address: {
    country: string;
    city: string;
    street: string;
  };
}

@Component({
  selector: 'app-enrollment-management',
  standalone: true,
  imports: [CommonModule, FormsModule, EnrollmentDetailsComponent],
  templateUrl: './enrollment-management.component.html',
  styleUrl: './enrollment-management.component.css'
})
export class EnrollmentManagementComponent implements OnInit {
  searchTerm: string = '';
  currentTab: 'all' | 'pending' | 'approved' | 'rejected' = 'all';
  enrollments: Enrollment[] = [];
  selectedEnrollment: Enrollment | null = null;
  showDetailsModal: boolean = false;

  constructor(private enrollmentService: EnrollmentService) {}

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (data) => {
        this.enrollments = data;
      },
      error: (error) => {
        console.error('Error loading enrollments:', error);
      }
    });
  }

  getPendingCount(): number {
    return this.enrollments.filter(e => e.userId.pathways.length === 0).length;
  }

  get filteredEnrollments(): Enrollment[] {
    return this.enrollments.filter(enrollment => {
      if (this.currentTab !== 'all') {
        const hasPathways = enrollment.userId.pathways.length > 0;
        if (this.currentTab === 'pending' && hasPathways) return false;
        if (this.currentTab === 'approved' && !hasPathways) return false;
      }

      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return enrollment.firstName.toLowerCase().includes(searchLower) ||
               enrollment.lastName.toLowerCase().includes(searchLower) ||
               enrollment.email.toLowerCase().includes(searchLower);
      }

      return true;
    });
  }

  setTab(tab: 'all' | 'pending' | 'approved' | 'rejected'): void {
    this.currentTab = tab;
  }

  getPathwayStatus(enrollment: Enrollment): string {
    return enrollment.userId.pathways.length > 0 ? 'approved' : 'pending';
  }

  getPathwayName(enrollment: Enrollment): string {
    if (enrollment.userId.pathways.length === 0) {
      return 'Pending';
    }
    return enrollment.userId.pathways[enrollment.userId.pathways.length - 1].name;
  }

  viewEnrollmentDetails(enrollment: Enrollment): void {
    this.enrollmentService.getEnrollmentById(enrollment._id).subscribe({
      next: (data) => {
        this.selectedEnrollment = data;
        this.showDetailsModal = true;
      },
      error: (error) => {
        console.error('Error loading enrollment details:', error);
      }
    });
  }

  deleteEnrollment(enrollment: Enrollment): void {
    if (confirm('Are you sure you want to delete this enrollment?')) {
      this.enrollmentService.deleteEnrollment(enrollment._id).subscribe({
        next: () => {
          this.loadEnrollments();
        },
        error: (error) => {
          console.error('Error deleting enrollment:', error);
        }
      });
    }
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedEnrollment = null;
  }

  exportToPDF(): void {
    const doc = new jsPDF();

    const tableColumn = ["Student", "Email", "Faculty", "GPA", "Pathway"];
    const tableRows: any[] = [];

    this.filteredEnrollments.forEach(enrollment => {
      const enrollmentData = [
        `${enrollment.firstName} ${enrollment.lastName}`,
        enrollment.email,
        enrollment.facultyName,
        enrollment.GPA,
        this.getPathwayName(enrollment)
      ];
      tableRows.push(enrollmentData);
    });

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 12,
        cellPadding: 3,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [67, 24, 255],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      }
    });

    doc.save("enrollments.pdf");
  }
}
