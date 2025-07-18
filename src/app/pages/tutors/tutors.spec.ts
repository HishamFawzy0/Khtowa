import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tutors } from './tutors';

describe('Tutors', () => {
  let component: Tutors;
  let fixture: ComponentFixture<Tutors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tutors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tutors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
