import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursesService, Course } from '../../../services/course.service';
import { InstructorService, Instructor } from '../../../services/instructor.service';

interface Lesson {
  name: string;
  duration: number;
}

interface CreateCourse {
  name: string;
  description: string;
  requiredExams: string[];
  instructors: string[];
  lessons: Lesson[];
  image?: string;
  status?: string;
  price?: number;
  discount?: number;
  category?: string;
}

@Component({
  selector: 'app-create-course-dialog',
  templateUrl: './create-course-dialog.component.html',
  styleUrls: ['./create-course-dialog.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CreateCourseDialogComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() courseCreated = new EventEmitter<void>();

  course: CreateCourse = {
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
  success: string | null = null;
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

  async saveCourse() {
    if (!this.selectedInstructor) {
      this.error = 'Please select an instructor';
      return;
    }

    try {
      this.isSubmitting = true;
      this.error = null;
      this.success = null;

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

      // Add lessons - create new objects without any _id fields
      const validLessons = this.course.lessons
        .filter(lesson => lesson.name.trim())
        .map(lesson => ({
          name: lesson.name.trim(),
          duration: lesson.duration
        }));
      
      formData.append('lessons', JSON.stringify(validLessons));

      const response = await this.coursesService.createCourse(formData).toPromise();
      this.success = 'Course created successfully!';
      this.courseCreated.emit();
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        this.closeDialog();
      }, 2000);
    } catch (error: any) {
      console.error('Error creating course:', error);
      this.error = error.error?.message || 'Failed to create course. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  openDialog() {
    this.showDialog = true;
    this.resetForm();
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
    this.success = null;
    this.isSubmitting = false;
  }
}
