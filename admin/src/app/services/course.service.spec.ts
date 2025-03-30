import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CoursesService, Course } from './course.service'; // Adjust the import path

describe('CoursesService', () => {
  let service: CoursesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });
    service = TestBed.inject(CoursesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve courses from the API', fakeAsync(() => {
    const mockCourses: Course[] = [
      {
        _id: '1',
        name: 'Course 1',
        description: 'Description 1',
        requiredExams: [],
        instructors: [],
        lessons: [{ name: 'Lesson 1' }],
      },
      {
        _id: '2',
        name: 'Course 2',
        description: 'Description 2',
        requiredExams: [],
        instructors: [],
        lessons: [{ name: 'Lesson 2' }],
      },
    ];

    service.getCourses().subscribe((courses) => {
      expect(courses).toEqual(mockCourses);
    });

    const req = httpMock.expectOne('http://localhost:5024/api/course');
    expect(req.request.method).toBe('GET');
    req.flush(mockCourses);
    tick();
  }));

  it('should retrieve a course by ID from the API', fakeAsync(() => {
    const mockCourse: Course = {
      _id: '1',
      name: 'Course 1',
      description: 'Description 1',
      requiredExams: [],
      instructors: [],
      lessons: [{ name: 'Lesson 1' }],
    };

    service.getCourseById('1').subscribe((course) => {
      expect(course).toEqual(mockCourse);
    });

    const req = httpMock.expectOne('http://localhost:5024/api/course/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockCourse);
    tick();
  }));

  it('should create a course via POST', fakeAsync(() => {
    const newCourse = {
      name: 'New Course',
      description: 'New Description',
      requiredExams: [],
      instructors: [],
      lessons: [{ name: 'Lesson 1' }],
    };
    const mockCreatedCourse: Course = {
      _id: '3',
      ...newCourse,
    };

    service.createCourse(newCourse).subscribe((course) => {
      expect(course).toEqual(mockCreatedCourse);
    });

    const req = httpMock.expectOne(
      'http://localhost:5024/api/course/createCourse'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCourse);
    req.flush(mockCreatedCourse);
    tick();
  }));

  it('should update a course via PUT', fakeAsync(() => {
    const updatedCourse: Course = {
      _id: '1',
      name: 'Updated Course',
      description: 'Updated Description',
      requiredExams: [],
      instructors: [],
      lessons: [{ name: 'Updated Lesson' }],
    };

    service.updateCourse('1', updatedCourse).subscribe((course) => {
      expect(course).toEqual(updatedCourse);
    });

    const req = httpMock.expectOne(
      'http://localhost:5024/api/course/updateCourse/1'
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedCourse);
    req.flush(updatedCourse);
    tick();
  }));

  it('should delete a course via DELETE', fakeAsync(() => {
    service.deleteCourse('1').subscribe(() => {
      // No response body expected, just check that the request was made
    });

    const req = httpMock.expectOne(
      'http://localhost:5024/api/course/deleteCourse/1'
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Respond with an empty object
    tick();
  }));
});
