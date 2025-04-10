import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import PathwayService, { Pathway } from '../../services/pathway.service';
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
    MatBadgeModule
  ],
  templateUrl: './pathways.component.html',
  styleUrl: './pathways.component.css'
})
export class PathwaysComponent implements OnInit {
  pathways: Pathway[] = [];
  formModel = {
    name: '',
    description: '',
    courses: [] as string[]
  };
  isEditing = false;
  selectedPathway: Pathway | null = null;
  selectedCourseId = '';

  constructor(
    private pathwayService: PathwayService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPathways();
  }

  loadPathways(): void {
    this.pathwayService.getAllPathways().subscribe({
      next: (response) => {
        this.pathways = response.data;
      },
      error: (error) => {
        this.showMessage('Error loading pathways');
        console.error('Error loading pathways:', error);
      }
    });
  }

  createPathway(): void {
    if (!this.formModel.name) {
      this.showMessage('Pathway name is required');
      return;
    }

    const pathway = {
      name: this.formModel.name,
      description: this.formModel.description,
      courses: this.formModel.courses
    };

    this.pathwayService.createPathWay(pathway).subscribe({
      next: () => {
        this.showMessage('Pathway created successfully');
        this.loadPathways();
        this.resetForm();
      },
      error: (error) => {
        this.showMessage('Error creating pathway');
        console.error('Error creating pathway:', error);
      }
    });
  }

  editPathway(pathway: Pathway): void {
    this.isEditing = true;
    this.selectedPathway = { ...pathway };
    this.formModel = {
      name: pathway.name,
      description: pathway.description || '',
      courses: pathway.courses?.map(course =>
        typeof course === 'string' ? course : course._id
      ).filter((id): id is string => id !== undefined) || []
    };
  }

  updatePathway(): void {
    if (!this.selectedPathway || !this.selectedPathway._id) {
      this.showMessage('No pathway selected for update');
      return;
    }

    const updatedPathway = {
      name: this.formModel.name,
      description: this.formModel.description,
      courses: this.formModel.courses
    };

    this.pathwayService.updatePathway(this.selectedPathway._id, updatedPathway).subscribe({
      next: () => {
        this.showMessage('Pathway updated successfully');
        this.loadPathways();
        this.resetForm();
      },
      error: (error) => {
        this.showMessage('Error updating pathway');
        console.error('Error updating pathway:', error);
      }
    });
  }

  deletePathway(id: string): void {
    if (confirm('Are you sure you want to delete this pathway?')) {
      this.pathwayService.deletePathway(id).subscribe({
        next: () => {
          this.showMessage('Pathway deleted successfully');
          this.loadPathways();
        },
        error: (error) => {
          this.showMessage('Error deleting pathway');
          console.error('Error deleting pathway:', error);
        }
      });
    }
  }

  addCourse(pathwayId: string): void {
    if (!this.selectedCourseId) {
      this.showMessage('Please select a course');
      return;
    }

    this.pathwayService.addCourse(pathwayId, [this.selectedCourseId]).subscribe({
      next: () => {
        this.showMessage('Course added successfully');
        this.loadPathways();
        this.selectedCourseId = '';
      },
      error: (error) => {
        this.showMessage('Error adding course');
        console.error('Error adding course:', error);
      }
    });
  }

  removeCourse(pathwayId: string, courseId: string): void {
    this.pathwayService.removeCourse(pathwayId, [courseId]).subscribe({
      next: () => {
        this.showMessage('Course removed successfully');
        this.loadPathways();
      },
      error: (error) => {
        this.showMessage('Error removing course');
        console.error('Error removing course:', error);
      }
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedPathway = null;
    this.formModel = {
      name: '',
      description: '',
      courses: []
    };
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
