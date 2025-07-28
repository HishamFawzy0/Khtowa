import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TutorRequestService } from '../../core/services/tutorRequest/tutor-request-service';
import { CategoryService } from '../../core/services/category/category-service';
import { LoginService } from '../../core/services/auth/login/login-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-req',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-req.html',
  styleUrl: './student-req.css',
})
export class StudentReq implements OnInit {
  studentReqService = inject(TutorRequestService);
  categories = inject(CategoryService);
  auth = inject(LoginService);
  router = inject(Router);
  fb = inject(FormBuilder);
  categoriesList: any = [];
  form!: FormGroup;

  // Get today's date in YYYY-MM-DDTHH:MM format for datetime-local input
  get todayDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Get minimum date for "to" field based on "from" field value
  get minToDate(): string {
    const fromDate = this.form?.get('fromDate')?.value;
    if (fromDate) {
      return fromDate;
    }
    return this.todayDateTime;
  }

  // Character count getters
  get titleCharCount(): number {
    return this.form.get('title')?.value?.length || 0;
  }

  get descriptionCharCount(): number {
    return this.form.get('description')?.value?.length || 0;
  }

  // Validation helper methods
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.form.get(fieldName);
    return !!(
      field &&
      field.hasError(errorType) &&
      (field.dirty || field.touched)
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors || (!field.dirty && !field.touched)) {
      return '';
    }

    const errors = field.errors;

    switch (fieldName) {
      case 'title':
        if (errors['required']) return 'Title is required';
        if (errors['minlength'])
          return `Title must be at least ${errors['minlength'].requiredLength} characters`;
        if (errors['maxlength'])
          return `Title cannot exceed ${errors['maxlength'].requiredLength} characters`;
        break;
      case 'categoryId':
        if (errors['required']) return 'Please select a category';
        break;
      case 'description':
        if (errors['required']) return 'Description is required';
        if (errors['maxlength'])
          return `Description cannot exceed ${errors['maxlength'].requiredLength} characters`;
        break;
      case 'minBudget':
        if (errors['required']) return 'Minimum budget is required';
        if (errors['min']) return 'Minimum budget must be at least $0';
        break;
      case 'maxBudget':
        if (errors['required']) return 'Maximum budget is required';
        if (errors['min']) return 'Maximum budget must be at least $1';
        break;
      case 'fromDate':
        if (errors['required']) return 'Start date is required';
        break;
      case 'toDate':
        if (errors['required']) return 'End date is required';
        break;
    }

    return '';
  }

  // Combined validator for budget and dates
  combinedValidator(group: AbstractControl): ValidationErrors | null {
    const min = group.get('minBudget')?.value;
    const max = group.get('maxBudget')?.value;
    const from = group.get('fromDate')?.value;
    const to = group.get('toDate')?.value;

    const errors: any = {};

    if (min != null && max != null && min > max) {
      errors.minGreaterThanMax = true;
    }

    if (from && to && new Date(to) <= new Date(from)) {
      errors.endBeforeStart = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        title: [
          '',
          [
            Validators.required,
            Validators.minLength(20),
            Validators.maxLength(50),
          ],
        ],
        categoryId: ['', Validators.required],
        description: ['', [Validators.required, Validators.maxLength(150)]],
        minBudget: [0, [Validators.required, Validators.min(0)]],
        maxBudget: [0, [Validators.required, Validators.min(1)]],
        fromDate: ['', Validators.required],
        toDate: ['', Validators.required],
      },
      {
        validators: this.combinedValidator,
      }
    );

    this.categories.getCategories().subscribe({
      next: (data) => (this.categoriesList = data),
      error: (err) => console.error('Error loading categories:', err),
    });
  }

  onSubmit(): void {
    // Mark all fields as touched to trigger validation display
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key)?.markAsTouched();
    });

    if (this.form.invalid) {
      // Scroll to first invalid field
      const firstInvalidField = document.querySelector('.border-red-300');
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      return;
    }

    const userData = this.auth.userData;

    const request = {
      customerId: userData?.nameid,
      title: this.form.value.title,
      categoryId: Number(this.form.value.categoryId),
      description: this.form.value.description,
      minBudget: this.form.value.minBudget,
      maxBudget: this.form.value.maxBudget,
      startDateTime: new Date(this.form.value.fromDate).toISOString(),
      endDateTime: new Date(this.form.value.toDate).toISOString(),
    };

    this.studentReqService.CreateTutorRequest(request).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Request submitted successfully ✅',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.router.navigate(['/tutors']);
        });
      },
      error: (err) => {
        console.error('Submission error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed ❌',
          text: 'Something went wrong. Please check your inputs and try again.',
          confirmButtonText: 'Got it',
        });
      },
    });
  }
}
