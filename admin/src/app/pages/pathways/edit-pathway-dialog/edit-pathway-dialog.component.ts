import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../../../services/course.service';
import { Pathway } from '../../../services/pathway.service';

@Component({
  selector: 'app-edit-pathway-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dialog-overlay" (click)="onClose()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>Edit Pathway</h3>
          <button class="close-button" (click)="onClose()">×</button>
        </div>

        <div class="dialog-body">
          <form (ngSubmit)="onSubmit()" class="pathway-form">
            <div class="form-group">
              <label for="name">Name:</label>
              <input
                type="text"
                id="name"
                [(ngModel)]="pathway.name"
                name="name"
                required
                placeholder="Enter pathway name"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="description">Description:</label>
              <textarea
                id="description"
                [(ngModel)]="pathway.description"
                name="description"
                placeholder="Enter pathway description"
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-group">
              <label>Select Courses:</label>
              <div class="courses-selection">
                <div
                  *ngFor="let course of courses"
                  class="course-option"
                  [class.selected]="course._id && isCourseSelected(course._id)"
                  (click)="course._id && toggleCourseSelection(course._id)"
                >
                  <input
                    type="checkbox"
                    [checked]="course._id && isCourseSelected(course._id)"
                    (change)="course._id && toggleCourseSelection(course._id)"
                    class="course-checkbox"
                  />
                  <span class="course-name text-black">{{ course.name }}</span>
                </div>
              </div>
            </div>

            <div class="dialog-actions">
              <button type="submit" class="btn btn-primary">Update Pathway</button>
              <button type="button" class="btn btn-secondary" (click)="onClose()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .dialog-content {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .dialog-header h3 {
      margin: 0;
      color: #333;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
    }

    .dialog-body {
      padding: 1rem;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .form-textarea {
      min-height: 100px;
      resize: vertical;
    }

    .courses-selection {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.5rem;
      max-height: 300px;
      overflow-y: auto;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .course-option {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }

    .course-option.selected {
      background-color: #e3f2fd;
      border-color: #2196f3;
    }

    .course-checkbox {
      margin-right: 0.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-primary {
      background-color: #2196f3;
      color: white;
    }

    .btn-secondary {
      background-color: #e0e0e0;
      color: #333;
    }

    .btn:hover {
      opacity: 0.9;
    }
  `]
})
export class EditPathwayDialogComponent {
  @Input() pathway!: Pathway;
  @Input() courses: Course[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Pathway>();

  selectedCourseIds: string[] = [];

  ngOnInit() {
    // Initialize selected courses from the pathway
    this.selectedCourseIds = this.pathway.courses?.map(course => {
      if (typeof course === 'string') {
        return course;
      } else if (course && course._id) {
        return course._id;
      }
      return '';
    }).filter(id => id !== '') || [];
  }

  isCourseSelected(courseId: string): boolean {
    return this.selectedCourseIds.includes(courseId);
  }

  toggleCourseSelection(courseId: string): void {
    const index = this.selectedCourseIds.indexOf(courseId);
    if (index === -1) {
      this.selectedCourseIds.push(courseId);
    } else {
      this.selectedCourseIds.splice(index, 1);
    }
  }

  onSubmit(): void {
    const updatedPathway = {
      ...this.pathway,
      courses: this.selectedCourseIds as any[] // Type assertion to match the API expectation
    };
    this.save.emit(updatedPathway);
  }

  onClose(): void {
    this.close.emit();
  }
}
