import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isLoggedIn = false;
  userName = '';
  userRole = '';

  constructor(private authService: AuthService) {
    // Initialize from current auth state
    this.updateAuthState();
    
    // Subscribe to auth state changes
    this.authService.isAuthenticated$.subscribe(() => {
      console.log('auth state changed');
      this.updateAuthState();
    });
  }

  private updateAuthState() {
    this.isLoggedIn = this.authService.hasToken();

    console.log('updateAuthState called');
    if (this.isLoggedIn) {
      this.authService.getProfile().subscribe({
        next: (profile) => {
          console.log('Profile:', profile);
          this.userName = `${profile.firstName} ${profile.lastName}`;
          this.userRole = profile?.role || '';
        },
        error: (err) => {
          console.error('Error loading profile:', err);
          this.userName = '';
          this.userRole = '';
        },
      });
      console.log('updateAuthState called');
    } else {
      this.userName = '';
      this.userRole = '';
    }
  }

  logout() {
    this.authService.logout();
  }
}
