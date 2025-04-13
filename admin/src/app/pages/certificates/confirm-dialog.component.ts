import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header" [ngClass]="{'warning-header': data.title.toLowerCase().includes('delete')}">
        <h2 mat-dialog-title>
          <span class="header-icon" *ngIf="data.title.toLowerCase().includes('delete')">⚠️</span>
          <span class="header-icon" *ngIf="!data.title.toLowerCase().includes('delete')">❓</span>
          {{ data.title }}
        </h2>
      </div>

      <mat-dialog-content>
        <div class="message-container">
          <p class="message-text">{{ data.message }}</p>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button  (click)="onCancel()" class=" btn btn-danger me-2">
          {{ data.cancelText }}
        </button>
        <button (click)="onConfirm()" class=" btn btn-success">
          {{ data.confirmText }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f5f5f5;
      padding: 16px 24px;
      margin-bottom: 16px;
    }

    .warning-header {
      background-color: #fff3e0;
    }

    .header-icon {
      margin-right: 8px;
      font-size: 18px;
    }

    .close-button {
      color: #666;
    }

    .message-container {
      padding: 16px 0;
    }

    .message-text {
      font-size: 16px;
      line-height: 1.5;
      color: #333;
      margin: 0;
    }

    mat-dialog-content {
      min-width: 400px;
      padding: 0 24px;
    }

    mat-dialog-actions {
      padding: 16px 24px;
      margin: 0;
      background-color: #f5f5f5;
    }

    .cancel-button {
      margin-right: 8px;
    }

    .confirm-button {
      min-width: 120px;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string;
      confirmText: string;
      cancelText: string;
    }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
