import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursesService, Course } from '../../../services/course.service';

interface Lesson {
  name: string;
  duration: number;
  _id?: string;
}

@Component({
  selector: 'app-edit-course-dialog',
  templateUrl: './edit-course-dialog.component.html',
  styleUrls: ['./edit-course-dialog.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditCourseDialogComponent {
  @Output() close = new EventEmitter<void>();
  @Output() courseUpdated = new EventEmitter<void>();

  course: Course = {
    name: '',
    description: '',
    requiredExams: [],
    instructors: [],
    lessons: []
  };

  showDialog = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(private coursesService: CoursesService) {}

  openDialog(course: Course): void {
    this.course = {
      ...course,
      lessons: course.lessons?.map(lesson => ({
        name: lesson.name || '',
        duration: Number(lesson.duration) || 30,
        _id: lesson._id
      })) || []
    };
    this.showDialog = true;
    this.errorMessage = '';
  }

  closeDialog(): void {
    this.showDialog = false;
    this.close.emit();
    this.errorMessage = '';
  }

  addLesson(): void {
    this.course.lessons.push({
      name: '',
      duration: 30
    });
  }

  removeLesson(index: number): void {
    this.course.lessons.splice(index, 1);
  }

  async updateCourse(): Promise<void> {
    if (!this.course._id) {
      this.errorMessage = 'Course ID is missing';
      return;
    }

    try {
      this.isSubmitting = true;
      this.errorMessage = '';

      const courseData: Course = {
        _id: this.course._id,
        name: this.course.name.trim(),
        description: this.course.description.trim(),
        requiredExams: this.course.requiredExams || [],
        instructors: this.course.instructors || [],
        lessons: this.course.lessons.map(lesson => ({
          name: lesson.name.trim(),
          duration: Number(lesson.duration),
          _id: lesson._id
        })),
        status: this.course.status,
        image: this.course.image,
        category: this.course.category,
        price: this.course.price
      };

      this.coursesService.updateCourse(this.course._id, courseData).subscribe({
        next: () => {
          this.courseUpdated.emit();
          this.closeDialog();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error updating course:', error);
          this.errorMessage = error.error?.message || 'Failed to update course. Please try again.';
          this.isSubmitting = false;
        }
      });
    } catch (error: any) {
      console.error('Error updating course:', error);
      this.errorMessage = error.error?.message || 'Failed to update course. Please try again.';
      this.isSubmitting = false;
    }
  }
} 