import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="modal-content">
      <div class="modal-header p-2">
        <h5 class="modal-title">{{ data.title }}</h5>
        <button type="button" class="btn-close" (click)="dialogRef.close(false)"></button>
      </div>
      <div class="modal-body p-2">
        {{ data.message }}
      </div>
      <div class="modal-footer p-2">
        <button type="button" class="btn btn-secondary me-2" (click)="dialogRef.close(false)">Cancel</button>
        <button type="button" class="btn btn-primary" (click)="dialogRef.close(true)">Confirm</button>
      </div>
    </div>
  `,
  styles: [`
    .modal-content {
      background-color: #1e2229;
      color: #ffffff;
      border: 1px solid #3f4550;
    }
    .modal-header {
      border-bottom: 1px solid #3f4550;
    }
    .modal-footer {
      border-top: 1px solid #3f4550;
    }
    .btn-close {
      filter: invert(1) grayscale(100%) brightness(200%);
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}
}
