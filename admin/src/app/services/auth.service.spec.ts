import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send login request with correct credentials', () => {
      const mockCredentials = {
        email: 'Hazem@gmail.com',
        password: 'Hazem@1234',
      };

      const mockResponse = {
        message: 'Login successfully',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTkxNDQ0OWY2MGMyNGFkOGIwNzI4YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MzMyODgxNH0.1sm1O3Z6CSWYw7O-C15GmXQWqA8ac1Gv9mEalCme3Jg',
      };

      // Subscribe to the login method
      service
        .login(mockCredentials.email, mockCredentials.password)
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
        });

      // Expect a request to the login endpoint
      const req = httpMock.expectOne('http://localhost:5024/api/admin/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCredentials);

      // Provide mock response
      req.flush(mockResponse);
    });

    it('should store token in localStorage after successful login', () => {
      const mockResponse = {
        message: 'Login successfully',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTkxNDQ0OWY2MGMyNGFkOGIwNzI4YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MzMyODgxNH0.1sm1O3Z6CSWYw7O-C15GmXQWqA8ac1Gv9mEalCme3Jg',
      };

      service.login('Hazem@gmail.com', 'Hazem@1234').subscribe();

      const req = httpMock.expectOne('http://localhost:5024/api/admin/login');
      req.flush(mockResponse);

      // Check if token was stored correctly
      expect(localStorage.getItem('admin_auth_token')).toBe(mockResponse.token);
    });

    it('should update isAuthenticated$ observable after successful login', (done) => {
      const mockResponse = {
        message: 'Login successfully',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTkxNDQ0OWY2MGMyNGFkOGIwNzI4YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MzMyODgxNH0.1sm1O3Z6CSWYw7O-C15GmXQWqA8ac1Gv9mEalCme3Jg',
      };

      // First check initial state (should be false since no token)
      service.isAuthenticated$.pipe(take(1)).subscribe((isAuthenticated) => {
        expect(isAuthenticated).toBeFalsy();

        // Now login
        service.login('Hazem@gmail.com', 'Hazem@1234').subscribe(() => {
          // Then check final state
          service.isAuthenticated$.pipe(take(1)).subscribe((newValue) => {
            expect(newValue).toBeTruthy();
            done();
          });
        });

        // Simulate server response
        const req = httpMock.expectOne('http://localhost:5024/api/admin/login');
        req.flush(mockResponse);
      });
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage and update isAuthenticated$', (done) => {
      // Setup: add token to localStorage
      localStorage.setItem('admin_auth_token', 'test-token');

      // Force service to re-check authentication status
      service = TestBed.inject(AuthService);

      // First check initial state (should be true since token exists)
      service.isAuthenticated$.pipe(take(1)).subscribe((isAuthenticated) => {
        expect(isAuthenticated).toBeTruthy();

        // Call logout
        service.logout();

        // Verify token is removed
        expect(localStorage.getItem('admin_auth_token')).toBeNull();

        // Check final state after logout
        service.isAuthenticated$.pipe(take(1)).subscribe((newValue) => {
          expect(newValue).toBeFalsy();
          done();
        });
      });
    });
  });

  describe('token handling', () => {
    it('getToken should return token from localStorage', () => {
      const mockToken = 'test-token';
      localStorage.setItem('admin_auth_token', mockToken);

      expect(service.getToken()).toBe(mockToken);
    });

    it('hasToken should return true when token exists', () => {
      localStorage.setItem('admin_auth_token', 'test-token');

      expect(service.hasToken()).toBeTruthy();
    });

    it('hasToken should return false when token does not exist', () => {
      expect(service.hasToken()).toBeFalsy();
    });
  });

  describe('JWT token decoding', () => {
    const validToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTkxNDQ0OWY2MGMyNGFkOGIwNzI4YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MzMyODgxNH0.1sm1O3Z6CSWYw7O-C15GmXQWqA8ac1Gv9mEalCme3Jg';

    beforeEach(() => {
      localStorage.setItem('admin_auth_token', validToken);
      service = TestBed.inject(AuthService);
    });

    it('getUserFromToken should decode token correctly', () => {
      const decodedUser = service.getUserFromToken();

      expect(decodedUser).toBeTruthy();
      expect(decodedUser.id).toBe('67e914449f60c24ad8b0728c');
      expect(decodedUser.role).toBe('admin');
    });

    it('getUserRole should return role from token', () => {
      expect(service.getUserRole()).toBe('admin');
    });

    it('isAdmin should return true for admin role', () => {
      expect(service.isAdmin()).toBeTruthy();
    });

    it('getUserFromToken should return null for invalid token', () => {
      localStorage.setItem('admin_auth_token', 'invalid-token');
      service = TestBed.inject(AuthService);

      // We use a try-catch to prevent test from failing if there's an error
      try {
        const result = service.getUserFromToken();
        expect(result).toBeNull();
      } catch (e) {
        fail('getUserFromToken should handle invalid tokens gracefully');
      }
    });

    it('getUserRole should return null when no token exists', () => {
      localStorage.clear();
      service = TestBed.inject(AuthService);

      expect(service.getUserRole()).toBeNull();
    });

    it('isAdmin should return false when no token exists', () => {
      localStorage.clear();
      service = TestBed.inject(AuthService);

      expect(service.isAdmin()).toBeFalsy();
    });
  });
});
