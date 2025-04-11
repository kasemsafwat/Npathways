import { Component, OnInit, ViewChild } from '@angular/core';
import { CoursesService, Course } from '../../services/course.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateCourseDialogComponent } from './create-course-dialog/create-course-dialog.component';
import { EditCourseDialogComponent } from './edit-course-dialog/edit-course-dialog.component';
import { InstructorService, Instructor } from '../../services/instructor.service';
import { forkJoin, Observable, of } from 'rxjs';

interface CourseWithDetails extends Course {
  instructorDetails?: Instructor;
  studentCount?: number;
}

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CreateCourseDialogComponent,
    EditCourseDialogComponent,
  ],
})
export class CourseManagementComponent implements OnInit {
  @ViewChild(CreateCourseDialogComponent)
  createDialog!: CreateCourseDialogComponent;
  @ViewChild(EditCourseDialogComponent) editDialog!: EditCourseDialogComponent;

  courses: CourseWithDetails[] = [];
  filteredCourses: CourseWithDetails[] = [];
  activeTab: 'all' | 'active' | 'unpublished' | 'inactive' = 'all';
  searchQuery: string = '';
  showDeleteConfirm = false;
  courseToDelete: CourseWithDetails | null = null;
  isLoading = true;
  error: string | null = null;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 9; // 3 courses per row * 3 rows

  constructor(
    private coursesService: CoursesService,
    private instructorService: InstructorService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.error = null;
    console.log('Loading courses...');

    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        console.log('Received courses:', courses);
        if (!courses || courses.length === 0) {
          this.isLoading = false;
          this.courses = [];
          this.filteredCourses = [];
          return;
        }

        const instructorObservables = courses.map((course) => {
          if (course.instructors && course.instructors.length > 0) {
            const instructorId =
              typeof course.instructors[0] === 'string'
                ? course.instructors[0]
                : course.instructors[0]._id;
            console.log('Fetching instructor:', instructorId);
            return instructorId ? this.instructorService.getInstructorById(instructorId) : of(null);
          }
          return of(null);
        });

        const studentCountObservables = courses.map((course) => {
          if (course._id) {
            console.log('Fetching student count for course:', course._id);
            return this.coursesService.getUsersInCourse(course._id);
          }
          return of([]);
        });

        forkJoin({
          instructors: forkJoin(instructorObservables),
          studentCounts: forkJoin(studentCountObservables),
        }).subscribe({
          next: (results) => {
            console.log('Received instructor details:', results.instructors);
            console.log('Received student counts:', results.studentCounts);

            this.courses = courses.map((course, index) => ({
              ...course,
              instructorDetails: results.instructors[index] || undefined,
              studentCount: results.studentCounts[index]?.length || 0,
            }));

            console.log('Processed courses:', this.courses);
            this.filterCourses();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading course details:', error);
            this.error = 'Failed to load course details. Please try again.';
            this.isLoading = false;
          },
        });
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.error = 'Failed to load courses. Please try again.';
        this.isLoading = false;
      },
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCourses.length / this.itemsPerPage);
  }

  get paginatedCourses(): CourseWithDetails[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCourses.slice(startIndex, endIndex);
  }

  goToPage(page: number, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  filterCourses(): void {
    let filtered = [...this.courses];

    if (this.activeTab !== 'all') {
      filtered = filtered.filter(
        (course) => course.status?.toLowerCase() === this.activeTab
      );
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.instructorDetails?.firstName?.toLowerCase().includes(query) ||
          course.instructorDetails?.lastName?.toLowerCase().includes(query)
      );
    }

    console.log('Filtered courses:', filtered);
    this.filteredCourses = filtered;
    // Reset to first page when filtering
    this.currentPage = 1;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/images/course.jpg';
    }
  }

  handleAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/images/avuser.jpg';
    }
  }

  getInstructorName(course: CourseWithDetails): string {
    if (course.instructorDetails) {
      return `${course.instructorDetails.firstName} ${course.instructorDetails.lastName}`;
    }
    return 'No instructor assigned';
  }

  getStudentCount(course: CourseWithDetails): number {
    return course.studentCount || 0;
  }

  getStatusCount(status: string): number {
    return this.courses.filter(
      (course) => course.status?.toLowerCase() === status.toLowerCase()
    ).length;
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.filterCourses();
  }

  setActiveTab(tab: 'all' | 'active' | 'unpublished' | 'inactive'): void {
    this.activeTab = tab;
    this.filterCourses();
  }

  openCreateDialog(): void {
    this.createDialog.openDialog();
  }

  openEditDialog(course: CourseWithDetails, event: Event): void {
    event.stopPropagation();
    this.editDialog.openDialog(course);
  }

  openDeleteConfirm(course: CourseWithDetails, event: Event): void {
    event.stopPropagation();
    this.courseToDelete = course;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.courseToDelete = null;
  }

  onCourseCreated(): void {
    this.loadCourses();
  }

  async deleteCourse(): Promise<void> {
    if (!this.courseToDelete?._id) return;

    try {
      await this.coursesService
        .deleteCourse(this.courseToDelete._id)
        .toPromise();
      this.loadCourses();
      this.closeDeleteConfirm();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  }
}

