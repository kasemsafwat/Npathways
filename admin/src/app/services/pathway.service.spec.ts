import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import PathwayService, { Pathway } from './pathway.service';

describe('PathwayService', () => {
  let service: PathwayService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5024/api/pathway/admin';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PathwayService],
    });

    service = TestBed.inject(PathwayService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllPathways', () => {
    it('should return all pathways', () => {
      const mockPathways: Pathway[] = [
        { _id: '1', name: 'Pathway 1' },
        { _id: '2', name: 'Pathway 2' },
      ];

      service.getAllPathways().subscribe((pathways) => {
        expect(pathways).toEqual(mockPathways);
      });

      const req = httpMock.expectOne(`${apiUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPathways);
    });
  });

  describe('createPathWay', () => {
    it('should create a new pathway', () => {
      const mockPathway: Pathway = { _id: '1', name: 'New Pathway' };

      service.createPathWay(mockPathway).subscribe((pathway) => {
        expect(pathway).toEqual(mockPathway);
      });

      const req = httpMock.expectOne(`${apiUrl}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPathway);
      req.flush(mockPathway);
    });
  });

  describe('getPathwayById', () => {
    it('should return a pathway by id', () => {
      const mockPathway: Pathway = { _id: '1', name: 'Pathway 1' };

      service.getPathwayById('1').subscribe((pathway) => {
        expect(pathway).toEqual(mockPathway);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPathway);
    });
  });

  describe('getPathwayDetails', () => {
    it('should return pathway details with courses', () => {
      const mockPathway: Pathway = {
        _id: '1',
        name: 'Pathway 1',
        courses: [{ _id: 'c1', name: 'Course 1' } as any],
      };

      service.getPathwayDetails('1').subscribe((pathway) => {
        expect(pathway).toEqual(mockPathway);
      });

      const req = httpMock.expectOne(`${apiUrl}/1/courses`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPathway);
    });
  });

  describe('getStudentsInPathway', () => {
    it('should return students in a pathway', () => {
      const mockResponse: any = {
        _id: '1',
        name: 'Pathway 1',
        students: [{ _id: 's1', name: 'Student 1' }],
      };

      service.getStudentsInPathway('1').subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/1/students`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('updatePathway', () => {
    it('should update an existing pathway', () => {
      const mockPathway: Pathway = { _id: '1', name: 'Updated Pathway' };

      service.updatePathway('1', mockPathway).subscribe((pathway) => {
        expect(pathway).toEqual(mockPathway);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockPathway);
      req.flush(mockPathway);
    });
  });

  describe('addCourse', () => {
    it('should add courses to a pathway', () => {
      const mockPathway: Pathway = {
        _id: '1',
        name: 'Pathway 1',
        courses: [{ _id: 'c1', name: 'Course 1' } as any],
      };
      const courseIds = ['c1'];

      service.addCourse('1', courseIds).subscribe((pathway) => {
        expect(pathway).toEqual(mockPathway);
      });

      const req = httpMock.expectOne(`${apiUrl}/1/addCourse`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ courses: [courseIds] });
      req.flush(mockPathway);
    });
  });

  describe('removeCourse', () => {
    it('should remove courses from a pathway', () => {
      const mockPathway: Pathway = {
        _id: '1',
        name: 'Pathway 1',
        courses: [],
      };
      const courseIds = ['c1'];

      service.removeCourse('1', courseIds).subscribe((pathway) => {
        expect(pathway).toEqual(mockPathway);
      });

      const req = httpMock.expectOne(`${apiUrl}/1/removeCourse`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual({ courses: [courseIds] });
      req.flush(mockPathway);
    });
  });

  describe('enrollUserByAdmin', () => {
    it('should enroll a user in a pathway', () => {
      const mockResponse: any = { success: true };
      const pathwayId = '1';
      const userId = 'user1';

      service.enrollUserByAdmin(pathwayId, userId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/enroll-Student`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        userId: userId,
        pathwayId: pathwayId,
      });
      req.flush(mockResponse);
    });
  });

  describe('unenrollUserByAdmin', () => {
    it('should unenroll a user from a pathway', () => {
      const mockResponse: any = { success: true };
      const pathwayId = '1';
      const userId = 'user1';

      service.unenrollUserByAdmin(pathwayId, userId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/unEnroll-Student`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        userId: userId,
        pathwayId: pathwayId,
      });
      req.flush(mockResponse);
    });
  });
});
