import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
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

interface ValidationErrors {
  name?: string;
  description?: string;
  price?: string;
  discount?: string;
  image?: string;
  instructors?: string;
  lessons?: { [key: number]: { name?: string; duration?: string } };
}

@Component({
  selector: 'app-create-course-dialog',
  templateUrl: './create-course-dialog.component.html',
  styleUrls: ['./create-course-dialog.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class CreateCourseDialogComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() courseCreated = new EventEmitter<void>();

  courseForm: FormGroup;
  showDialog = false;
  isSubmitting = false;
  error: string | null = null;
  success: string | null = null;
  imagePreview: string | null = null;
  courseImage: File | null = null;
  instructors: Instructor[] = [];
  selectedInstructors: string[] = [];
  newInstructor: string = '';

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private instructorService: InstructorService
  ) {
    this.courseForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]],
      price: [0, [
        Validators.min(0)
      ]],
      discount: [0, [
        Validators.min(0),
        Validators.max(100)
      ]],
      status: ['unpublished'],
      image: [null],
      instructors: [[], Validators.required],
      lessons: this.fb.array([], Validators.required)
    });

    // Add initial lesson
    this.addLesson();
  }

  ngOnInit() {
    this.loadInstructors();
  }

  // Getter methods for form controls
  get name() { return this.courseForm.get('name'); }
  get description() { return this.courseForm.get('description'); }
  get price() { return this.courseForm.get('price'); }
  get discount() { return this.courseForm.get('discount'); }
  get image() { return this.courseForm.get('image'); }
  get instructorsControl() { return this.courseForm.get('instructors'); }
  get lessons() { return this.courseForm.get('lessons') as FormArray; }

  // Helper method to create a lesson form group
  private createLessonGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      duration: [30, [Validators.required, Validators.min(1)]]
    });
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

  getInstructorName(instructorId: string): string {
    const instructor = this.instructors.find(i => i._id === instructorId);
    return instructor ? `${instructor.firstName} ${instructor.lastName}` : '';
  }

  getAvailableInstructors(): Instructor[] {
    return this.instructors.filter(instructor => instructor._id && !this.selectedInstructors.includes(instructor._id));
  }

  addInstructor() {
    if (this.newInstructor && !this.selectedInstructors.includes(this.newInstructor)) {
      this.selectedInstructors.push(this.newInstructor);
      this.instructorsControl?.setValue(this.selectedInstructors);
      this.newInstructor = '';
    }
  }

  removeInstructor(instructorId: string) {
    this.selectedInstructors = this.selectedInstructors.filter(id => id !== instructorId);
    this.instructorsControl?.setValue(this.selectedInstructors);
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.image?.setErrors({ invalidType: true });
        input.value = '';
        this.imagePreview = null;
        this.courseImage = null;
        return;
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.image?.setErrors({ maxSize: true });
        input.value = '';
        this.imagePreview = null;
        this.courseImage = null;
        return;
      }

      this.courseImage = file;
      this.image?.setValue(file);
      this.image?.setErrors(null);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.courseImage);
    }
  }

  addLesson() {
    const lessonGroup = this.createLessonGroup();
    this.lessons.push(lessonGroup);
  }

  removeLesson(index: number) {
    this.lessons.removeAt(index);
    // Ensure there's always at least one lesson
    if (this.lessons.length === 0) {
      this.addLesson();
    }
  }

  async saveCourse() {
    if (this.courseForm.invalid) {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.courseForm.controls).forEach(key => {
        const control = this.courseForm.get(key);
        control?.markAsTouched();
        control?.markAsDirty();
      });
      return;
    }

    try {
      this.isSubmitting = true;
      this.error = null;
      this.success = null;

      const formData = new FormData();
      formData.append('name', this.courseForm.get('name')?.value.trim());
      formData.append('description', this.courseForm.get('description')?.value.trim());
      formData.append('status', this.courseForm.get('status')?.value);
      
      if (this.courseImage) {
        formData.append('image', this.courseImage);
      }

      if (this.courseForm.get('price')?.value !== undefined) {
        formData.append('price', this.courseForm.get('price')?.value.toString());
      }

      if (this.courseForm.get('discount')?.value !== undefined) {
        formData.append('discount', this.courseForm.get('discount')?.value.toString());
      }

      // Add instructors
      formData.append('instructors', JSON.stringify(this.selectedInstructors));

      // Add lessons
      const lessons = this.lessons.value;
      formData.append('lessons', JSON.stringify(lessons));

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
    this.courseForm.reset({
      name: '',
      description: '',
      price: 0,
      discount: 0,
      status: 'unpublished'
    });
    this.selectedInstructors = [];
    this.courseImage = null;
    this.imagePreview = null;
    this.error = null;
    this.success = null;
    
    // Clear and reinitialize lessons
    while (this.lessons.length !== 0) {
      this.lessons.removeAt(0);
    }
    this.addLesson(); // Add initial lesson
  }
}
