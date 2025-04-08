import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    return isLoggedIn ? true : this.router.parseUrl('/admin-login');
  }
}
