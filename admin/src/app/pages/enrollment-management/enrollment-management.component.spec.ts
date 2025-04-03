import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentManagementComponent } from './enrollment-management.component';

describe('EnrollmentManagementComponent', () => {
  let component: EnrollmentManagementComponent;
  let fixture: ComponentFixture<EnrollmentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
