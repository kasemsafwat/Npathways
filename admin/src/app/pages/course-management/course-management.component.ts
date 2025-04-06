import { Component, OnInit, ViewChild } from '@angular/core';
import { CoursesService, Course } from '../../services/course.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateCourseDialogComponent } from './create-course-dialog/create-course-dialog.component';
import { EditCourseDialogComponent } from './edit-course-dialog/edit-course-dialog.component';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CreateCourseDialogComponent, EditCourseDialogComponent]
})
export class CourseManagementComponent implements OnInit {
  @ViewChild(CreateCourseDialogComponent) createDialog!: CreateCourseDialogComponent;
  @ViewChild(EditCourseDialogComponent) editDialog!: EditCourseDialogComponent;
  
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  activeTab: 'all' | 'active' | 'drafts' | 'inactive' = 'all';
  searchQuery: string = '';
  showDeleteConfirm = false;
  courseToDelete: Course | null = null;

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

  openCreateDialog(): void {
    this.createDialog.openDialog();
  }

  onCourseCreated(): void {
    this.loadCourses();
  }

  openDeleteConfirm(course: Course, event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    this.courseToDelete = course;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.courseToDelete = null;
  }

  async deleteCourse(): Promise<void> {
    if (!this.courseToDelete?._id) return;

    try {
      await this.coursesService.deleteCourse(this.courseToDelete._id).toPromise();
      this.loadCourses(); // Refresh the course list
      this.closeDeleteConfirm();
    } catch (error) {
      console.error('Error deleting course:', error);
      // You might want to show an error message to the user here
    }
  }

  openEditDialog(course: Course, event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    this.editDialog.openDialog(course);
  }
}
