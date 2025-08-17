import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../core/services/review/reviewService';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../core/services/auth/login/login-service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review.html',
})
export class ReviewFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private route = inject(ActivatedRoute);
  private user = inject(LoginService);

  instructorId = this.route.snapshot.paramMap.get('id');
  studentId = this.user.userData.nameid;

  reviewForm: FormGroup = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: [''],
    instructorId: [this.instructorId],
    studentId: [this.studentId],
  });

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  // Helper for star UI
  stars = [1, 2, 3, 4, 5];

  ngOnInit() {
    // Initialize form with current user data if needed
  }

  setRating(value: number) {
    this.reviewForm.patchValue({ rating: value });
  }

  submitReview() {
    if (this.reviewForm.invalid) return;

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.reviewService.createReview(this.reviewForm.value).subscribe({
      next: () => {
        this.successMessage = 'Review submitted successfully!';
        this.isSubmitting = false;
        this.reviewForm.reset({ rating: 0 });
      },
      error: (err) => {
        this.errorMessage = 'Failed to submit review. Please try again.';
        console.error(err);
        this.isSubmitting = false;
      },
    });
  }
}
