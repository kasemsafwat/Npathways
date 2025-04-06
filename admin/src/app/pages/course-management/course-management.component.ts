import { Component, OnInit } from '@angular/core';
import { CoursesService, Course } from '../../services/course.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CourseManagementComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  activeTab: 'all' | 'active' | 'drafts' | 'inactive' = 'all';
  searchQuery: string = '';

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.filterCourses();
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  filterCourses(): void {
    let filtered = [...this.courses];
    
    // Apply status filter
    if (this.activeTab !== 'all') {
      filtered = filtered.filter(course => 
        course.status?.toLowerCase() === this.activeTab
      );
    }

    // Apply search filter
    if (this.searchQuery) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.filteredCourses = filtered;
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.filterCourses();
  }

  setActiveTab(tab: 'all' | 'active' | 'drafts' | 'inactive'): void {
    this.activeTab = tab;
    this.filterCourses();
  }

  getInstructorName(course: Course): string {
    const instructor = course.instructors[0];
    return instructor ? `${instructor.firstName} ${instructor.lastName}` : 'No instructor assigned';
  }

  getStudentCount(course: Course): number {
    return 0; // Placeholder
  }

  getStatusCount(status: string): number {
    return this.courses.filter(course => course.status?.toLowerCase() === status.toLowerCase()).length;
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
