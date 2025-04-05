import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
      this.updateAuthState();
    });
  }

  private updateAuthState() {
    this.isLoggedIn = this.authService.hasToken();
    if (this.isLoggedIn) {
      const user = this.authService.getUserFromToken();
      this.userName = user?.name || '';
      this.userRole = user?.role || '';
    } else {
      this.userName = '';
      this.userRole = '';
    }
  }

  logout() {
    this.authService.logout();
  }
}
