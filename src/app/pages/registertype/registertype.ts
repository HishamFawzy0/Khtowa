import { RegisterService } from './../../core/services/auth/register/register-service';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registertype',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registertype.html',
  styleUrl: './registertype.css',
})
export class Registertype {
  selectedUserType = signal<'client' | 'freelancer' | null>(null);
  currentStep = signal<'selection' | 'form'>('selection');

  errorMessage: string | null = null;
  instructorErrorMessage: string | null = null;
  registerFormStudent!: FormGroup;
  registerFormInstructor!: FormGroup;

  isLoading = signal(false);

  _RegisterService = inject(RegisterService);

  constructor(private fb: FormBuilder) {
    // Student/Client form - simpler fields
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.registerFormStudent = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });

    // Instructor/Freelancer form - additional fields
    this.registerFormInstructor = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      specialization: ['', [Validators.required]],
    });
  }

  selectUserType(type: 'client' | 'freelancer') {
    this.selectedUserType.set(type);
    setTimeout(() => {
      this.currentStep.set('form');
    }, 300);
  }

  goBack() {
    this.currentStep.set('selection');
    this.selectedUserType.set(null);
  }

  // Get the current active form based on user type
  get currentForm(): FormGroup {
    return this.selectedUserType() === 'client'
      ? this.registerFormStudent
      : this.registerFormInstructor;
  }

  // Check if current form is valid
  get isFormValid(): boolean {
    return this.currentForm.valid;
  }

  async onSubmit() {
    if (!this.isFormValid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading.set(true);

    try {
      if (this.selectedUserType() === 'client') {
        const { confirmPassword, ...studentData } =
          this.registerFormStudent.value;

        this._RegisterService.registerStudent(studentData).subscribe({
          next: (response) => {
            console.log('Student registration successful:', response);
            this.isLoading.set(false);
          },
          error: (error) => {
            this.isLoading.set(false);

            const backendError = error?.error?.message || '';

            this.errorMessage = backendError.includes('email')
              ? 'This email is already registered.'
              : backendError || 'Registration failed.';
          },
        });
      } else {
        // Register as instructor/freelancer
        const { confirmPassword, ...instructorData } =
          this.registerFormInstructor.value;

        this._RegisterService.registerInstructor(instructorData).subscribe({
          next: (response) => {
            console.log('Instructor registration successful:', response);
            this.isLoading.set(false);
          },
          error: (error) => {
            this.isLoading.set(false);

            let friendlyMessage = 'An unexpected error occurred.';
            const backendMessage = error?.error?.message?.toLowerCase();

            if (backendMessage?.includes('email')) {
              friendlyMessage = 'This email is already registered.';
            } else if (backendMessage?.includes('failed to create user')) {
              friendlyMessage =
                'Unable to create user. Please try another email.';
            }

            this.instructorErrorMessage = friendlyMessage;
          },
        });
      }
    } catch (error) {
      // console.error('Registration error:', error);
      this.isLoading.set(false);
    }
  }

  private markFormGroupTouched() {
    const form = this.currentForm;
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      control?.markAsTouched();
    });
  }

  getUserTypeTitle(): string {
    return this.selectedUserType() === 'client'
      ? "I'm a client, hiring for a project"
      : "I'm a freelancer, looking for work";
  }

  getUserTypeIcon(): string {
    return this.selectedUserType() === 'client' ? 'briefcase' : 'user';
  }

  // Helper methods for form field validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.currentForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
 
  getFieldError(fieldName: string): string {
    const field = this.currentForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        const fieldLabels: { [key: string]: string } = {
          displayName: 'Full name',
          email: 'Email', 
          password: 'Password',
          confirmPassword: 'Confirm password',
          description: 'Professional description',
          specialization: 'Specialization',
          agreeToTerms: 'Terms agreement',
        };
        return `${fieldLabels[fieldName] || fieldName} is required`;
      }
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength'])
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      return `Must be at least ${field.errors['minlength'].requiredLength} characters`;

    }
    return '';
  }

  // Password confirmation validator

  // getFieldError(fieldName: string): string {
  //   const field = this.currentForm.get(fieldName);
  //   if (field?.errors) {
  //     const fieldLabels: { [key: string]: string } = {
  //       displayName: 'Full name',
  //       email: 'Email',
  //       password: 'Password',
  //       confirmPassword: 'Confirm password',
  //       description: 'Professional description',
  //       specialization: 'Specialization',
  //       agreeToTerms: 'Terms agreement',
  //     };

  //     if (field.errors['required']) {
  //       return `${fieldLabels[fieldName] || fieldName} is required`;
  //     }

  //     if (field.errors['email']) {
  //       return 'Please enter a valid email address';
  //     }

  //     if (field.errors['minlength']) {
  //       const minLength = field.errors['minlength']?.requiredLength;
  //       return `${fieldLabels[fieldName] || fieldName} must be at least ${
  //         minLength || '?'
  //       } characters`;
  //     }

  //     if (field.errors['passwordMismatch']) {
  //       return 'Passwords do not match';
  //     }
  //   }
  //   return '';
  // }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
  }

  // Check password match for current form
  get passwordsMatch(): boolean {
    const form = this.currentForm;
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  // Get password mismatch error
  get passwordMismatchError(): boolean {
    const confirmPassword = this.currentForm.get('confirmPassword');
    return !!(
      confirmPassword?.errors?.['passwordMismatch'] && confirmPassword?.touched
    );
  }
}
