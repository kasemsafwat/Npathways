import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { AuthService } from './auth.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Create a mock AuthService
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authSpy.getToken.and.returnValue('test-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DashboardService,
        { provide: AuthService, useValue: authSpy },
      ],
    });

    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceMock = TestBed.inject(
      AuthService
    ) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get dashboard data with auth token in header', () => {
    // Mock response data
    const mockDashboardData = {
      totalUsers: 100,
      totalOrders: 250,
      recentActivity: [
        { id: 1, action: 'User Login', timestamp: '2025-03-30T10:00:00Z' },
      ],
    };

    // Call the service method
    service.getDashboardData().subscribe((data) => {
      expect(data).toEqual(mockDashboardData);
    });

    // Expect a GET request to the dashboard endpoint
    const req = httpMock.expectOne('http://localhost:5024/api/admin/dashboard');

    // Check that the request is a GET
    expect(req.request.method).toBe('GET');

    // Check that the Authorization header was set correctly
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');

    // Provide mock response
    req.flush(mockDashboardData);

    // Verify that getToken was called
    expect(authServiceMock.getToken).toHaveBeenCalled();
  });

  it('should handle error when API request fails', () => {
    // Call the service method
    service.getDashboardData().subscribe({
      next: () => fail('Expected an error, not successful response'),
      error: (error) => {
        expect(error.status).toBe(401);
        expect(error.statusText).toBe('Unauthorized');
      },
    });

    // Expect a GET request to the dashboard endpoint
    const req = httpMock.expectOne('http://localhost:5024/api/admin/dashboard');

    // Return an error response
    req.flush('Unauthorized access', {
      status: 401,
      statusText: 'Unauthorized',
    });
  });
});
