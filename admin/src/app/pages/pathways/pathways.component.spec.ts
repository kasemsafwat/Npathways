import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwaysComponent } from './pathways.component';

describe('PathwaysComponent', () => {
  let component: PathwaysComponent;
  let fixture: ComponentFixture<PathwaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathwaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathwaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
