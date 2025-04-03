import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { InstructorService, Instructor } from './instructor.service';
import { AuthService } from './auth.service';

describe('InstructorService', () => {
  let service: InstructorService;
  let httpMock: HttpTestingController;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  const mockInstructors: Instructor[] = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
    },
  ];

  const mockNewInstructor: Instructor = {
    firstName: 'sonados',
    lastName: 'ali',
    email: 'Nadaali@example.com',
    password: 'Test@123',
  };

  beforeEach(() => {
    // Create a mock AuthService
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authSpy.getToken.and.returnValue('test-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        InstructorService,
        { provide: AuthService, useValue: authSpy },
      ],
    });

    service = TestBed.inject(InstructorService);
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

  it('should get all instructors', () => {
    service.getAllInstructors().subscribe((instructors) => {
      expect(instructors).toEqual(mockInstructors);
    });

    const req = httpMock.expectOne(
      'http://localhost:5024/api/admin/AllInstructor'
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');

    req.flush(mockInstructors);
  });

  it('should get instructor by id', () => {
    const instructorId = '1';

    service.getInstructorById(instructorId).subscribe((instructor) => {
      expect(instructor).toEqual(mockInstructors[0]);
    });

    const req = httpMock.expectOne(
      `http://localhost:5024/api/admin/instructors/${instructorId}`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');

    req.flush(mockInstructors[0]);
  });

  it('should create a new instructor', () => {
    const mockResponse = {
      success: true,
      message: 'Instructor created successfully',
      instructorId: '3',
    };

    service.createInstructor(mockNewInstructor).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      'http://localhost:5024/api/admin/createNewInstructor'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.body).toEqual(mockNewInstructor);

    req.flush(mockResponse);
  });

  it('should delete an instructor', () => {
    const instructorId = '1';
    const mockResponse = {
      success: true,
      message: 'Instructor deleted successfully',
    };

    service.deleteInstructor(instructorId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `http://localhost:5024/api/admin/${instructorId}`
    );
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');

    req.flush(mockResponse);
  });

  it('should update an instructor', () => {
    const instructorId = '1';
    const updateData: Partial<Instructor> = {
      firstName: 'Johnny',
      lastName: 'Updated',
    };

    const mockResponse = {
      success: true,
      message: 'Instructor updated successfully',
    };

    service.updateInstructor(instructorId, updateData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `http://localhost:5024/api/admin/instructors/${instructorId}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.body).toEqual(updateData);

    req.flush(mockResponse);
  });
});
