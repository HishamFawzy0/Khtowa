import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentReq } from './student-req';

describe('StudentReq', () => {
  let component: StudentReq;
  let fixture: ComponentFixture<StudentReq>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentReq]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentReq);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
