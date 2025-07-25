import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../core/services/auth/login/login-service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private loginService = inject(LoginService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  errorMessage = '';
  isLoading = false;
  isPasswordVisible = false;

  loginform: FormGroup = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupPasswordToggle();
      this.setupFormSubmission();
    }
  }

  private setupPasswordToggle(): void {
    setTimeout(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const toggleButton = document.getElementById('togglePassword');
      const passwordInput = document.getElementById(
        'password'
      ) as HTMLInputElement;
      const eyeOpen = document.getElementById('eyeOpen');
      const eyeClosed = document.getElementById('eyeClosed');

      if (toggleButton && passwordInput && eyeOpen && eyeClosed) {
        toggleButton.addEventListener('click', () => {
          this.togglePasswordVisibility(passwordInput, eyeOpen, eyeClosed);
        });
      }
    }, 0);
  }

  private setupFormSubmission(): void {
    setTimeout(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const form = document.getElementById('loginForm');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.onSubmit();
        });
      }
    }, 0);
  }

  private togglePasswordVisibility(
    passwordInput: HTMLInputElement,
    eyeOpen: HTMLElement,
    eyeClosed: HTMLElement
  ): void {
    this.isPasswordVisible = !this.isPasswordVisible;
    passwordInput.type = this.isPasswordVisible ? 'text' : 'password';

    if (this.isPasswordVisible) {
      eyeOpen.classList.add('hidden');
      eyeClosed.classList.remove('hidden');
    } else {
      eyeOpen.classList.remove('hidden');
      eyeClosed.classList.add('hidden');
    }
  }

  onSubmit(): void {
    if (this.loginform.valid && !this.isLoading) {
      this.performLogin();
    } else {
      this.markFormGroupTouched();
      this.showValidationErrors();
    }
  }

  private performLogin(): void {
    this.setLoadingState(true);
    this.clearMessages();
    this.clearValidationErrors();

    const loginData = {
      Email: this.loginform.get('Email')?.value,
      Password: this.loginform.get('Password')?.value,
    };

    this.loginService.login(loginData).subscribe({
      next: (response: any) => {
        this.handleLoginSuccess(response);
        this.loginService.refreshUserData(); // Refresh user data after login
      },
      error: (error) => {
        this.handleLoginError(error);
      },
      complete: () => {
        this.setLoadingState(false);
      },
    });
  }

  private handleLoginSuccess(response: any): void {
    if (isPlatformBrowser(this.platformId)) {
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }

      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      if (response.user) {
        localStorage.setItem('userData', JSON.stringify(response.user));
      }

      localStorage.setItem('loginTime', new Date().toISOString());
    }

    this.showSuccessMessage('Login successful! Redirecting...');
    this.loginform.reset();

    setTimeout(() => {
      this.router.navigate(['/tutors']);
    }, 0);
  }

  private handleLoginError(error: any): void {
    let errorMsg = 'Login failed. Please try again.';

    if (error.error?.message) {
      errorMsg = error.error.message;
    } else if (error.status === 401) {
      errorMsg = 'Invalid email or password.';
    } else if (error.status === 403) {
      errorMsg = 'Account is locked or suspended.';
    } else if (error.status === 404) {
      errorMsg = 'Account not found.';
    } else if (error.status === 0) {
      errorMsg = 'Unable to connect to server. Please check your connection.';
    } else if (error.status >= 500) {
      errorMsg = 'Server error. Please try again later.';
    }

    this.errorMessage = errorMsg;
    this.showErrorMessage(errorMsg);
  }

  private setLoadingState(loading: boolean): void {
    this.isLoading = loading;

    if (!isPlatformBrowser(this.platformId)) return;

    const submitButton = document.getElementById('submitButton');
    const buttonText = document.getElementById('buttonText');
    const buttonIcon = document.getElementById('buttonIcon');
    const loadingIcon = document.getElementById('loadingIcon');

    if (submitButton && buttonText && buttonIcon && loadingIcon) {
      if (loading) {
        submitButton.setAttribute('disabled', 'true');
        buttonText.textContent = 'Signing In...';
        buttonIcon.classList.add('hidden');
        loadingIcon.classList.remove('hidden');
      } else {
        submitButton.removeAttribute('disabled');
        buttonText.textContent = 'Sign In';
        buttonIcon.classList.remove('hidden');
        loadingIcon.classList.add('hidden');
      }
    }
  }

  private showSuccessMessage(message: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const messageContainer = document.getElementById('messageContainer');
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');

    if (messageContainer && successMessage && successText) {
      successText.textContent = message;
      messageContainer.classList.remove('hidden');
      successMessage.classList.remove('hidden');

      const errorMessage = document.getElementById('errorMessage');
      if (errorMessage) {
        errorMessage.classList.add('hidden');
      }
    }
  }

  private showErrorMessage(message: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const messageContainer = document.getElementById('messageContainer');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    if (messageContainer && errorMessage && errorText) {
      errorText.textContent = message;
      messageContainer.classList.remove('hidden');
      errorMessage.classList.remove('hidden');

      const successMessage = document.getElementById('successMessage');
      if (successMessage) {
        successMessage.classList.add('hidden');
      }
    }
  }

  private clearMessages(): void {
    this.errorMessage = '';
    if (!isPlatformBrowser(this.platformId)) return;

    const messageContainer = document.getElementById('messageContainer');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (messageContainer && successMessage && errorMessage) {
      messageContainer.classList.add('hidden');
      successMessage.classList.add('hidden');
      errorMessage.classList.add('hidden');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginform.controls).forEach((key) => {
      const control = this.loginform.get(key);
      control?.markAsTouched();
    });
  }

  private showValidationErrors(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const emailControl = this.loginform.get('Email');
    const passwordControl = this.loginform.get('Password');

    if (emailControl?.invalid && emailControl?.touched) {
      const emailError = document.getElementById('emailError');
      if (emailError) {
        emailError.classList.remove('hidden');
        if (emailControl.errors?.['required']) {
          emailError.textContent = 'Email is required.';
        } else if (emailControl.errors?.['email']) {
          emailError.textContent = 'Please enter a valid email address.';
        }
      }
    }

    if (passwordControl?.invalid && passwordControl?.touched) {
      const passwordError = document.getElementById('passwordError');
      if (passwordError) {
        passwordError.classList.remove('hidden');
        if (passwordControl.errors?.['required']) {
          passwordError.textContent = 'Password is required.';
        } else if (passwordControl.errors?.['minlength']) {
          passwordError.textContent =
            'Password must be at least 6 characters long.';
        }
      }
    }
  }

  private clearValidationErrors(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    if (emailError) {
      emailError.classList.add('hidden');
    }
    if (passwordError) {
      passwordError.classList.add('hidden');
    }
  }

  get emailControl() {
    return this.loginform.get('Email');
  }

  get passwordControl() {
    return this.loginform.get('Password');
  }

  get isEmailInvalid(): boolean {
    const control = this.emailControl;
    return !!(control && control.invalid && control.touched);
  }

  get isPasswordInvalid(): boolean {
    const control = this.passwordControl;
    return !!(control && control.invalid && control.touched);
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('authToken')
      : null;
  }

  isLoggedIn(): boolean {
    return (
      isPlatformBrowser(this.platformId) && !!localStorage.getItem('authToken')
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('loginTime');
    }
  }
}
