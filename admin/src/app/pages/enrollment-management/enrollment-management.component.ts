import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface Enrollment {
  student: {
    name: string;
    email: string;
    avatar?: string;
  };
  course: string;
  date: string;
  status: 'Active' | 'Pending' | 'Rejected';
  testScore: number;
  motivation: boolean;
  pathway: 'approved' | 'pending' | 'rejected';
}

@Component({
  selector: 'app-enrollment-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enrollment-management.component.html',
  styleUrl: './enrollment-management.component.css'
})
export class EnrollmentManagementComponent implements OnInit {
  searchTerm: string = '';
  currentTab: 'all' | 'pending' | 'approved' | 'rejected' = 'all';

  enrollments: Enrollment[] = [
    {
      student: {
        name: 'John Doe',
        email: 'john.doe@example.com'
      },
      course: 'Advanced Web Development',
      date: 'May 10, 2023',
      status: 'Active',
      testScore: 85,
      motivation: true,
      pathway: 'approved'
    },
    {
      student: {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com'
      },
      course: 'UX Design Fundamentals',
      date: 'May 12, 2023',
      status: 'Active',
      testScore: 92,
      motivation: true,
      pathway: 'approved'
    },
    {
      student: {
        name: 'Michael Brown',
        email: 'm.brown@example.com'
      },
      course: 'Data Science Bootcamp',
      date: 'May 15, 2023',
      status: 'Pending',
      testScore: 78,
      motivation: true,
      pathway: 'pending'
    },
    {
      student: {
        name: 'Emily Wilson',
        email: 'emily.w@example.com'
      },
      course: 'Mobile App Development',
      date: 'May 18, 2023',
      status: 'Active',
      testScore: 88,
      motivation: true,
      pathway: 'approved'
    },
    {
      student: {
        name: 'David Lee',
        email: 'david.lee@example.com'
      },
      course: 'AI & Machine Learning',
      date: 'May 20, 2023',
      status: 'Pending',
      testScore: 65,
      motivation: false,
      pathway: 'pending'
    },
    {
      student: {
        name: 'Jennifer Taylor',
        email: 'jen.taylor@example.com'
      },
      course: 'Graphic Design Masterclass',
      date: 'May 22, 2023',
      status: 'Rejected',
      testScore: 45,
      motivation: true,
      pathway: 'rejected'
    }
  ];

  get filteredEnrollments(): Enrollment[] {
    return this.enrollments.filter(enrollment => {
      // First apply tab filter
      if (this.currentTab !== 'all' && enrollment.pathway !== this.currentTab) {
        return false;
      }

      // Then apply search filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return enrollment.student.name.toLowerCase().includes(searchLower) ||
               enrollment.student.email.toLowerCase().includes(searchLower) ||
               enrollment.course.toLowerCase().includes(searchLower);
      }

      return true;
    });
  }

  constructor() {}

  ngOnInit(): void {}

  setTab(tab: 'all' | 'pending' | 'approved' | 'rejected'): void {
    this.currentTab = tab;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }

  getPathwayClass(pathway: string): string {
    return `pathway-${pathway}`;
  }

  exportToPDF(): void {
    const doc = new jsPDF();

    const tableColumn = ["Student", "Course", "Date", "Status", "Test Score", "Pathway"];
    const tableRows: any[] = [];

    this.filteredEnrollments.forEach(enrollment => {
      const enrollmentData = [
        enrollment.student.name,
        enrollment.course,
        enrollment.date,
        enrollment.status,
        `${enrollment.testScore}%`,
        enrollment.pathway
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
