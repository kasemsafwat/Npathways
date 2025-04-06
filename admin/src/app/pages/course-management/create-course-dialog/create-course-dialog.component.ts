import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '../../../services/course.service';

interface Lesson {
  name: string;
  duration: number;
}

@Component({
  selector: 'app-create-course-dialog',
  templateUrl: './create-course-dialog.component.html',
  styleUrls: ['./create-course-dialog.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CreateCourseDialogComponent {
  @Output() close = new EventEmitter<void>();
  @Output() courseCreated = new EventEmitter<void>();

  course = {
    name: '',
    description: '',
    requiredExams: [] as string[],
    instructors: [] as string[],
    lessons: [] as Lesson[]
  };

  showDialog = false;

  constructor(private coursesService: CoursesService) {}

  addLesson() {
    this.course.lessons.push({ name: '', duration: 30 });
  }

  removeLesson(index: number) {
    this.course.lessons.splice(index, 1);
  }

  async saveCourse() {
    try {
      await this.coursesService.createCourse(this.course).toPromise();
      this.courseCreated.emit();
      this.closeDialog();
    } catch (error) {
      console.error('Error creating course:', error);
    }
  }

  openDialog() {
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.close.emit();
    // Reset form
    this.course = {
      name: '',
      description: '',
      requiredExams: [],
      instructors: [],
      lessons: []
    };
  }
} 