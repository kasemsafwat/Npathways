import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  CertificateService,
  Certificate,
  GrantCertificateRequest,
} from './certificate.service';

describe('CertificateService', () => {
  let service: CertificateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CertificateService],
    });
    service = TestBed.inject(CertificateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve certificates from the API', fakeAsync(() => {
    const mockCertificates: Certificate[] = [
      {
        _id: '1',
        name: 'Certificate 1',
        description: 'Description 1',
        course: 'course1',
      },
      {
        _id: '2',
        name: 'Certificate 2',
        description: 'Description 2',
        course: 'course2',
      },
    ];

    service.getCertificates().subscribe((certificates) => {
      expect(certificates).toEqual(mockCertificates);
    });

    const req = httpMock.expectOne('http://localhost:5024/api/certificate');
    expect(req.request.method).toBe('GET');
    req.flush(mockCertificates);
    tick();
  }));

  it('should retrieve a certificate by ID from the API', fakeAsync(() => {
    const mockCertificate: Certificate = {
      _id: '1',
      name: 'Certificate 1',
      description: 'Description 1',
      course: 'course1',
    };

    service.getCertificateById('1').subscribe((certificate) => {
      expect(certificate).toEqual(mockCertificate);
    });

    const req = httpMock.expectOne('http://localhost:5024/api/certificate/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockCertificate);
    tick();
  }));

  it('should create a certificate via POST', fakeAsync(() => {
    const newCertificate = {
      name: 'New Certificate',
      description: 'New Description',
      course: 'newCourse',
    };
    const mockCreatedCertificate: Certificate = {
      _id: '3',
      ...newCertificate,
    };

    service.createCertificate(newCertificate).subscribe((certificate) => {
      expect(certificate).toEqual(mockCreatedCertificate);
    });

    const req = httpMock.expectOne(
      'http://localhost:5024/api/certificate/createCertificate'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCertificate);
    req.flush(mockCreatedCertificate);
    tick();
  }));

  it('should update a certificate via PUT', fakeAsync(() => {
    const updatedCertificate: Certificate = {
      _id: '1',
      name: 'Updated Certificate',
      description: 'Updated Description',
      course: 'updatedCourse',
    };

    service
      .updateCertificate('1', updatedCertificate)
      .subscribe((certificate) => {
        expect(certificate).toEqual(updatedCertificate);
      });

    const req = httpMock.expectOne(
      'http://localhost:5024/api/certificate/updateCertificate/1'
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedCertificate);
    req.flush(updatedCertificate);
    tick();
  }));

  it('should delete a certificate via DELETE', fakeAsync(() => {
    service.deleteCertificate('1').subscribe(() => {
      // No response body expected, just check that the request was made
    });

    const req = httpMock.expectOne(
      'http://localhost:5024/api/certificate/deleteCertificate/1'
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    tick();
  }));

  it('should grant a certificate via POST', fakeAsync(() => {
    const grantRequest: GrantCertificateRequest = {
      userId: 'user123',
      certificateId: 'cert456',
    };

    service.grantCertificate(grantRequest).subscribe(() => {
      // No response body expected, just check that the request was made
    });

    const req = httpMock.expectOne(
      'http://localhost:5024/api/certificate/grantCertificate'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(grantRequest);
    req.flush({});
    tick();
  }));
});
