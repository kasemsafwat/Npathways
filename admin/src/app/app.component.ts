import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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

  constructor(private authService: AuthService, private router: Router) {

    this.updateAuthState();


    this.authService.isAuthenticated$.subscribe(() => {
      this.updateAuthState();
    });
  }

  private updateAuthState() {
    this.isLoggedIn = this.authService.hasToken();

    if (this.isLoggedIn) {
      this.authService.getProfile().subscribe({
        next: (profile) => {
          this.userName = `${profile.firstName} ${profile.lastName}`;
          this.userRole = profile?.role || '';
        },
        error: (err) => {
          console.error('Error loading profile:', err);
          this.userName = '';
          this.userRole = '';
        },
      });
    } else {
      this.userName = '';
      this.userRole = '';
      this.router.navigate(['/admin-login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin-login']);
  }
}
