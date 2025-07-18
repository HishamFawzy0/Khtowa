import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorReview } from './instructor-review';

describe('InstructorReview', () => {
  let component: InstructorReview;
  let fixture: ComponentFixture<InstructorReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
