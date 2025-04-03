import { TestBed } from '@angular/core/testing';
// Import the necessary testing modules and controller
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ExamService } from './exam.service';
// Import the interfaces/models used by the service
import { Exam, ExamPayload, Question, Answer } from './exam.service'; // Adjust path if needed

describe('ExamService', () => {
  let service: ExamService;
  let httpMock: HttpTestingController; // Controller to mock HTTP requests
  let apiUrl: string; // Store the base API URL for convenience

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Import the testing module for HttpClient
      ],
      providers: [
        ExamService, // Provide the service to be tested
      ],
    });
    // Inject the service and the testing controller
    service = TestBed.inject(ExamService);
    httpMock = TestBed.inject(HttpTestingController);
    // Access the private apiUrl for checking requests (or redefine it here if needed)
    // Using 'as any' to access private member for testing purposes.
    apiUrl = (service as any).apiUrl;
  });

  // After each test, verify that there are no outstanding HTTP requests.
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test for getExams()
  it('should retrieve all exams via GET', () => {
    // Define mock data that matches the Exam interface
    const dummyExams: Exam[] = [
      {
        _id: '1',
        name: 'Exam 1',
        timeLimit: 60,
        questions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '2',
        name: 'Exam 2',
        timeLimit: 90,
        questions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Make the service call
    service.getExams().subscribe((exams) => {
      // Check that the data received matches the mock data
      expect(exams.length).toBe(2);
      expect(exams).toEqual(dummyExams);
    });

    // Expect a single request to the apiUrl
    const req = httpMock.expectOne(apiUrl);
    // Verify that the request method is GET
    expect(req.request.method).toBe('GET');
    // Respond with the mock data
    req.flush(dummyExams);
  });

  // Test for getExamById()
  it('should retrieve a single exam by ID via GET', () => {
    const testId = 'exam123';
    const dummyExam: Exam = {
      _id: testId,
      name: 'Specific Exam',
      timeLimit: 75,
      questions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const expectedUrl = `${apiUrl}/${testId}`;

    service.getExamById(testId).subscribe((exam) => {
      expect(exam).toEqual(dummyExam);
      expect(exam._id).toBe(testId);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyExam);
  });

  // Test for createExam()
  it('should create an exam via POST', () => {
    const newExamPayload: ExamPayload = {
      name: 'New Exam',
      timeLimit: 45,
      questions: [
        {
          question: 'Q1?',
          difficulty: 'easy',
          answers: [{ answer: 'A1', isCorrect: true }],
        },
      ],
    };
    // Mock the response from the server (usually includes the generated _id)
    const createdExamResponse: Exam = {
      _id: 'newGeneratedId',
      ...newExamPayload,
      // Add potentially missing required fields from Exam if needed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Ensure questions match the full Question interface if backend adds _id
      questions: newExamPayload.questions.map((q, i) => ({
        ...q,
        _id: `q${i}`,
        answers: q.answers.map((a, j) => ({ ...a, _id: `a${i}${j}` })),
      })) as Question[], // Cast needed if backend adds _ids
    };
    const expectedUrl = `${apiUrl}/createExam`;

    service.createExam(newExamPayload).subscribe((exam) => {
      expect(exam).toEqual(createdExamResponse);
      expect(exam._id).toBe('newGeneratedId');
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    // Verify that the request body matches the payload sent
    expect(req.request.body).toEqual(newExamPayload);
    req.flush(createdExamResponse); // Respond with the created exam mock
  });

  // Test for updateExam()
  it('should update an exam via PUT', () => {
    const testId = 'examToUpdate';
    const updatePayload: ExamPayload = {
      name: 'Updated Exam Name',
      timeLimit: 55,
      questions: [], // Keep it simple for the test
    };
    // Mock the response after update
    const updatedExamResponse: Exam = {
      _id: testId,
      ...updatePayload,
      createdAt: new Date().toISOString(), // Assuming these don't change or are returned
      updatedAt: new Date().toISOString(), // This should reflect update time
      questions: [],
    };
    const expectedUrl = `${apiUrl}/updateExam/${testId}`;

    service.updateExam(testId, updatePayload).subscribe((exam) => {
      expect(exam).toEqual(updatedExamResponse);
      expect(exam.name).toBe('Updated Exam Name');
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatePayload);
    req.flush(updatedExamResponse);
  });

  // Test for deleteExam()
  it('should delete an exam via DELETE', () => {
    const testId = 'examToDelete';
    const expectedUrl = `${apiUrl}/deleteExam/${testId}`;

    service.deleteExam(testId).subscribe((response) => {
      // Expecting void/null/undefined for successful delete with no content
      expect(response).toBeNull(); // or toBeUndefined() depending on actual observable emission
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');
    // Flush with null body and 204 No Content status for typical successful DELETE
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  // Example of testing an error scenario (e.g., for getExams)
  it('should handle HTTP errors for getExams', () => {
    const errorMessage = 'Internal Server Error';
    const errorStatus = 500;

    service.getExams().subscribe({
      next: () => fail('should have failed with an error'), // Fail if next() is called
      error: (error) => {
        // Check if the error is handled or propagated as expected
        // Note: HttpClient throws an HttpErrorResponse
        expect(error.status).toBe(errorStatus);
        expect(error.statusText).toBe(errorMessage);
        // Depending on how you handle errors (e.g., catchError in service),
        // you might expect a different error shape here.
      },
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    // Respond with an error status
    req.flush(null, { status: errorStatus, statusText: errorMessage });
  });
});
