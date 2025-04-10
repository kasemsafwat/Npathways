import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursesService, Course } from '../../../services/course.service';
import { InstructorService, Instructor } from '../../../services/instructor.service';

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
  imports: [CommonModule, FormsModule],
})
export class EditCourseDialogComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() courseUpdated = new EventEmitter<void>();

  course: Course = {
    name: '',
    description: '',
    requiredExams: [],
    instructors: [],
    lessons: [],
    status: 'unpublished',
    price: 0,
    discount: 0,
    category: ''
  };

  showDialog = false;
  isSubmitting = false;
  error: string | null = null;
  imagePreview: string | null = null;
  courseImage: File | null = null;
  instructors: Instructor[] = [];
  selectedInstructor: string = '';

  constructor(
    private coursesService: CoursesService,
    private instructorService: InstructorService
  ) {}

  ngOnInit() {
    this.loadInstructors();
  }

  loadInstructors() {
    this.instructorService.getAllInstructors().subscribe({
      next: (instructors) => {
        this.instructors = instructors;
      },
      error: (error) => {
        console.error('Error loading instructors:', error);
        this.error = 'Failed to load instructors. Please try again.';
      }
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.courseImage = input.files[0];
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.courseImage);
    }
  }

  addLesson() {
    this.course.lessons.push({
      name: '',
      duration: 30
    });
  }

  removeLesson(index: number) {
    this.course.lessons.splice(index, 1);
  }

  openDialog(course: Course) {
    this.course = { ...course };
    this.imagePreview = course.image || null;
    this.selectedInstructor = typeof course.instructors[0] === 'string' 
      ? course.instructors[0] 
      : course.instructors[0]?._id || '';
    this.showDialog = true;
    this.error = null;
  }

  async updateCourse() {
    if (!this.course._id) {
      this.error = 'Course ID is missing';
      return;
    }

    if (!this.selectedInstructor) {
      this.error = 'Please select an instructor';
      return;
    }

    try {
      this.isSubmitting = true;
      this.error = null;

      const formData = new FormData();
      formData.append('name', this.course.name.trim());
      formData.append('description', this.course.description.trim());
      formData.append('status', this.course.status || 'unpublished');

      if (this.courseImage) {
        formData.append('image', this.courseImage);
      }

      if (this.course.price !== undefined) {
        formData.append('price', this.course.price.toString());
      }

      if (this.course.discount !== undefined) {
        formData.append('discount', this.course.discount.toString());
      }

      if (this.course.category) {
        formData.append('category', this.course.category);
      }

      // Add instructor
      formData.append('instructors', JSON.stringify([this.selectedInstructor]));

      // Add lessons - only include name and duration
      const validLessons = this.course.lessons
        .filter(lesson => lesson.name.trim())
        .map(lesson => ({
          name: lesson.name.trim(),
          duration: lesson.duration
        }));
      formData.append('lessons', JSON.stringify(validLessons));

      await this.coursesService.updateCourse(this.course._id, formData).toPromise();
      this.courseUpdated.emit();
      this.closeDialog();
    } catch (error: any) {
      console.error('Error updating course:', error);
      this.error = error.error?.message || 'Failed to update course. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  closeDialog() {
    this.showDialog = false;
    this.close.emit();
    this.resetForm();
  }

  private resetForm() {
    this.course = {
      name: '',
      description: '',
      requiredExams: [],
      instructors: [],
      lessons: [],
      status: 'unpublished',
      price: 0,
      discount: 0,
      category: ''
    };
    this.selectedInstructor = '';
    this.courseImage = null;
    this.imagePreview = null;
    this.error = null;
    this.isSubmitting = false;
  }
}
