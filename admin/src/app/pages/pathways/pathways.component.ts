import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import PathwayService, { Pathway } from '../../services/pathway.service';
import { CoursesService, Course } from '../../services/course.service';
import { EditPathwayDialogComponent } from './edit-pathway-dialog/edit-pathway-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

interface ApiResponse<T> {
  message: string;
  data: T[];
}

@Component({
  selector: 'app-pathways',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule,
    MatBadgeModule,
    EditPathwayDialogComponent
  ],
  templateUrl: './pathways.component.html',
  styleUrl: './pathways.component.css',
})
export class PathwaysComponent implements OnInit {
  pathways: any;
  courses: Course[] = [];
  formModel = {
    name: '',
    description: '',
    courses: [] as string[],
  };
  selectedCourseIds: string[] = [];
  notification = {
    message: '',
    type: '',
    show: false
  };
  showEditDialog = false;
  selectedPathway: Pathway | null = null;

  constructor(
    private pathwayService: PathwayService,
    private courseService: CoursesService
  ) {}

  ngOnInit(): void {
    this.loadPathways();
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (error) => {
        this.showNotification('Error loading courses', 'error');
        console.error('Error loading courses:', error);
      },
    });
  }

  loadPathways(): void {
    this.pathwayService.getAllPathways().subscribe({
      next: (response) => {
        this.pathways = response.data;
      },
      error: (error) => {
        this.showNotification('Error loading pathways', 'error');
        console.error('Error loading pathways:', error);
      },
    });
  }

  createPathway(): void {
    if (!this.formModel.name) {
      this.showNotification('Pathway name is required', 'error');
      return;
    }

    const pathway = {
      name: this.formModel.name,
      description: this.formModel.description,
      courses: this.selectedCourseIds,
    };

    this.pathwayService.createPathWay(pathway).subscribe({
      next: () => {
        this.showNotification('Pathway created successfully', 'success');
        this.loadPathways();
        this.resetForm();
      },
      error: (error) => {
        this.showNotification(error.error?.message || 'Error creating pathway', 'error');
        console.error('Error creating pathway:', error);
      },
    });
  }

  editPathway(pathway: Pathway): void {
    this.selectedPathway = { ...pathway };
    this.showEditDialog = true;
  }

  onSavePathway(updatedPathway: Pathway): void {
    if (!updatedPathway._id) {
      this.showNotification('Invalid pathway data', 'error');
      return;
    }

    this.pathwayService.updatePathway(updatedPathway._id, updatedPathway).subscribe({
      next: () => {
        this.showNotification('Pathway updated successfully', 'success');
        this.loadPathways();
        this.closeEditDialog();
      },
      error: (error) => {
        this.showNotification(error.error?.message || 'Error updating pathway', 'error');
        console.error('Error updating pathway:', error);
      },
    });
  }

  closeEditDialog(): void {
    this.showEditDialog = false;
    this.selectedPathway = null;
  }

  deletePathway(id: string): void {
    if (confirm('Are you sure you want to delete this pathway?')) {
      this.pathwayService.deletePathway(id).subscribe({
        next: () => {
          this.showNotification('Pathway deleted successfully', 'success');
          this.loadPathways();
        },
        error: (error) => {
          this.showNotification(error.error?.message || 'Error deleting pathway', 'error');
          console.error('Error deleting pathway:', error);
        },
      });
    }
  }

  addCourse(pathwayId: string): void {
    if (this.selectedCourseIds.length === 0) {
      this.showNotification('Please select at least one course', 'error');
      return;
    }

    this.pathwayService
      .addCourse(pathwayId, this.selectedCourseIds)
      .subscribe({
        next: () => {
          this.showNotification('Courses added successfully', 'success');
          this.loadPathways();
          this.selectedCourseIds = [];
        },
        error: (error) => {
          this.showNotification(error.error?.message || 'Error adding courses', 'error');
          console.error('Error adding courses:', error);
        },
      });
  }

  removeCourse(pathwayId: string, courseId: string): void {
    this.pathwayService.removeCourse(pathwayId, courseId).subscribe({
      next: () => {
        this.showNotification('Course removed successfully', 'success');
        this.loadPathways();
      },
      error: (error) => {
        this.showNotification(error.error?.message || 'Error removing course', 'error');
        console.error('Error removing course:', error);
      },
    });
  }

  toggleCourseSelection(courseId: string): void {
    const index = this.selectedCourseIds.indexOf(courseId);
    if (index === -1) {
      this.selectedCourseIds.push(courseId);
    } else {
      this.selectedCourseIds.splice(index, 1);
    }
  }

  isCourseSelected(courseId: string): boolean {
    return this.selectedCourseIds.includes(courseId);
  }

  resetForm(): void {
    this.formModel = {
      name: '',
      description: '',
      courses: [],
    };
    this.selectedCourseIds = [];
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.notification = {
      message,
      type,
      show: true
    };
    setTimeout(() => {
      this.notification.show = false;
    }, 3000);
  }

  getCourseName(courseId: string): string {
    const course = this.courses.find(c => c._id === courseId);
    return course ? course.name : 'Unknown Course';
  }
}
